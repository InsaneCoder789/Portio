"use client";

import { useEffect, useRef } from "react";

/*
 * The one moving thing on the site: a field of parallel rails with packets travelling along them.
 * A pointer moving through it sends out a disturbance, and the rails settle back to where they were.
 * It sits fixed behind the page and only renders while the hero or the closing section is on screen.
 */

const BLUEPRINT = [0, 0, 0]; // the ground: black
const SIGNAL = [1, 0xb8 / 255, 0x1c / 255];
const RIPPLES = 8;

const TERRAIN = /* glsl */ `
uniform float uTime;
uniform vec4 uRipples[${RIPPLES}];
uniform vec3 uPointer;

vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float terrain(vec2 p){
  float far = smoothstep(3.0, -24.0, p.y);
  float h = snoise(vec2(p.x * 0.10 + uTime * 0.025, p.y * 0.12 - uTime * 0.04)) * (0.28 + 1.9 * far * far);
  h += snoise(vec2(p.x * 0.30 - uTime * 0.03, p.y * 0.28 + uTime * 0.05)) * 0.12;
  for (int i = 0; i < ${RIPPLES}; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (r.w > 0.0 && age > 0.0 && age < 7.0) {
      float d = distance(p, r.xy);
      float x = d - age * 3.4;
      h += r.w * sin(x * 2.6) * exp(-x * x * 0.7) * exp(-age * 0.65) / (1.0 + d * 0.12);
    }
  }
  float dp = distance(p, uPointer.xy);
  h -= uPointer.z * 0.5 * exp(-dp * dp * 0.55);
  return h;
}
`;

const SURFACE_VERT = /* glsl */ `
${TERRAIN}
attribute float aRow;
varying float vDepth;
varying float vEdge;
varying float vRow;
void main(){
  vRow = aRow;
  vec3 p = position;
  p.y = terrain(p.xz);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  vEdge = abs(position.x);
  gl_Position = projectionMatrix * mv;
}
`;

// The rails are drawn on the surface itself, one per grid row, so they keep an even width and hide behind ridges.
const SURFACE_FRAG = /* glsl */ `
uniform vec3 uBg;
uniform float uDpr;
varying float vDepth;
varying float vEdge;
varying float vRow;
void main(){
  float w = fwidth(vRow);
  float d = abs(fract(vRow - 0.5) - 0.5) / max(w, 1e-5);
  float halfWidth = 0.7 * uDpr;
  float line = 1.0 - smoothstep(halfWidth - 0.6, halfWidth + 0.6, d);
  line *= 1.0 - smoothstep(0.22, 0.5, w);
  float fog = 1.0 - smoothstep(12.0, 34.0, vDepth);
  float edge = 1.0 - smoothstep(15.0, 20.0, vEdge);
  float a = line * (0.2 + 0.65 * fog) * fog * edge;
  gl_FragColor = vec4(mix(uBg, vec3(1.0), a), 1.0);
}
`;

const PACKET_VERT = /* glsl */ `
${TERRAIN}
attribute vec3 aPacket; // row z, start offset, speed
uniform float uDpr;
varying float vDepth;
void main(){
  float x = mix(-20.0, 20.0, fract(aPacket.y + uTime * aPacket.z));
  vec3 p = vec3(x, 0.0, aPacket.x);
  p.y = terrain(p.xz) + 0.03;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  gl_PointSize = uDpr * clamp(34.0 / vDepth, 1.6, 7.0);
  gl_Position = projectionMatrix * mv;
}
`;

const PACKET_FRAG = /* glsl */ `
uniform vec3 uBg;
uniform vec3 uSignal;
varying float vDepth;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float fog = 1.0 - smoothstep(12.0, 34.0, vDepth);
  gl_FragColor = vec4(mix(uBg, uSignal, fog), 1.0);
}
`;

export default function RailField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    let cleanupWait = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;
      // building the renderer and compiling the shaders is a long task: wait until the opening film has handed over the page
      if (document.documentElement.dataset.boot === "running") {
        await new Promise<void>((resolve) => {
          const watch = new MutationObserver(() => { if (document.documentElement.dataset.boot !== "running") { watch.disconnect(); resolve(); } });
          watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-boot"] });
          cleanupWait = () => { watch.disconnect(); resolve(); };
        });
        if (disposed) return;
      }

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the page keeps its plain black ground
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const small = window.innerWidth < 720;
      const cols = small ? 110 : 200;
      const rows = small ? 44 : 64;
      const X = 20, zNear = 5, zFar = -27;

      const positions = new Float32Array(cols * rows * 3);
      const rowAttr = new Float32Array(cols * rows);
      const index: number[] = [];
      for (let r = 0; r < rows; r++) {
        const z = zNear + (zFar - zNear) * (r / (rows - 1));
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          positions[i * 3] = -X + (2 * X * c) / (cols - 1);
          positions[i * 3 + 2] = z;
          rowAttr[i] = r;
          if (c < cols - 1 && r < rows - 1) index.push(i, i + cols, i + 1, i + 1, i + cols, i + cols + 1);
        }
      }
      const surfaceGeo = new THREE.BufferGeometry()
        .setAttribute("position", new THREE.BufferAttribute(positions, 3))
        .setAttribute("aRow", new THREE.BufferAttribute(rowAttr, 1))
        .setIndex(index);

      const packetCount = small ? 44 : 96;
      const packets = new Float32Array(packetCount * 3);
      for (let i = 0; i < packetCount; i++) {
        const row = Math.floor(Math.random() * rows);
        packets[i * 3] = zNear + (zFar - zNear) * (row / (rows - 1));
        packets[i * 3 + 1] = Math.random();
        packets[i * 3 + 2] = (0.008 + Math.random() * 0.022) * (Math.random() < 0.5 ? -1 : 1);
      }
      const packetGeo = new THREE.BufferGeometry()
        .setAttribute("position", new THREE.BufferAttribute(new Float32Array(packetCount * 3), 3))
        .setAttribute("aPacket", new THREE.BufferAttribute(packets, 3));

      const uniforms = {
        uTime: { value: 20 }, // start mid-flow, so reduced motion gets a settled frame too
        uRipples: { value: Array.from({ length: RIPPLES }, () => new THREE.Vector4(0, 0, -100, 0)) },
        uPointer: { value: new THREE.Vector3(0, 0, 0) },
        uBg: { value: new THREE.Vector3(...BLUEPRINT) },
        uSignal: { value: new THREE.Vector3(...SIGNAL) },
        uDpr: { value: 1 },
      };
      const surfaceMat = new THREE.ShaderMaterial({
        uniforms, vertexShader: SURFACE_VERT, fragmentShader: SURFACE_FRAG,
        polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2, side: THREE.DoubleSide,
      });
      const packetMat = new THREE.ShaderMaterial({ uniforms, vertexShader: PACKET_VERT, fragmentShader: PACKET_FRAG });

      const scene = new THREE.Scene();
      for (const object of [new THREE.Mesh(surfaceGeo, surfaceMat), new THREE.Points(packetGeo, packetMat)]) {
        object.frustumCulled = false;
        scene.add(object);
      }
      renderer.setClearColor(new THREE.Color().setRGB(BLUEPRINT[0], BLUEPRINT[1], BLUEPRINT[2], THREE.SRGBColorSpace));
      const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 80);
      const lookAt = new THREE.Vector3();

      // Scroll decides the camera: across the rails in the hero, lifting as it leaves, and from above in the closing section.
      let heroOut = 0, closing = 0;
      const closingEl = document.getElementById("contact");
      const readScroll = () => {
        const h = window.innerHeight || 1;
        heroOut = Math.min(1, Math.max(0, window.scrollY / h));
        const top = closingEl ? closingEl.getBoundingClientRect().top : h * 2;
        closing = Math.min(1, Math.max(0, 1.6 - top / h));
        closing = closing * closing * (3 - 2 * closing);
      };
      const draw = () => {
        if (lost) return;
        const cy = 4.2 + heroOut * 3, cz = 7, ly = -1.2 - heroOut * 2, lz = -4;
        camera.position.set(0, cy + (7.5 - cy) * closing, cz + (4 - cz) * closing);
        lookAt.set(0, ly + (-0.5 - ly) * closing, lz + (-6.5 - lz) * closing);
        camera.lookAt(lookAt);
        renderer.render(scene, camera);
      };
      let sizedW = 0, sizedH = 0, lost = false, dprCap = 2, avgMs = 16.7, slowRun = 0;
      const resize = (force = false) => {
        const w = window.innerWidth, h = window.innerHeight;
        // phone toolbars growing and shrinking resize the window by a few dozen pixels: reallocating the canvas for that clears it
        if (!force && sizedW === w && Math.abs(sizedH - h) < 160) return;
        sizedW = w; sizedH = h;
        const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.75, dprCap, Math.sqrt(2.6e6 / (w * h))));
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        uniforms.uDpr.value = dpr;
        camera.aspect = w / h;
        camera.fov = w < h ? 64 : 46;
        camera.updateProjectionMatrix();
      };

      // Pointer position on the ground plane, and a ripple each time it has travelled far enough.
      const ray = new THREE.Raycaster();
      const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const ndc = new THREE.Vector2();
      const hit = new THREE.Vector3();
      const last = new THREE.Vector2(999, 999);
      const here = new THREE.Vector2();
      let slot = 0, heat = 0, lastMove = -10, running = false, frame = 0, previous = 0;
      const onPointer = (e: PointerEvent) => {
        if (!running || reduced.matches) return;
        ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        if (!ray.ray.intersectPlane(ground, hit) || hit.z < zFar || hit.z > zNear + 2) return;
        uniforms.uPointer.value.x = hit.x;
        uniforms.uPointer.value.y = hit.z;
        lastMove = uniforms.uTime.value;
        if (last.distanceTo(here.set(hit.x, hit.z)) > 1.6) {
          last.copy(here);
          uniforms.uRipples.value[slot].set(hit.x, hit.z, uniforms.uTime.value, 0.2);
          slot = (slot + 1) % RIPPLES;
        }
      };

      const tick = (now: number) => {
        frame = 0;
        if (!running || lost) return;
        const raw = now - previous;
        const dt = Math.min(0.05, raw / 1000);
        previous = now;
        // a device that cannot hold the frame rate gets fewer pixels, in steps, rather than a stutter
        avgMs = avgMs * 0.9 + Math.min(raw, 80) * 0.1;
        if (avgMs > 22 && dprCap > 1) { if (++slowRun > 20) { dprCap = Math.max(1, dprCap - 0.25); slowRun = 0; avgMs = 16.7; resize(true); } } else slowRun = 0;
        uniforms.uTime.value += dt;
        const target = uniforms.uTime.value - lastMove < 0.25 ? 1 : 0;
        heat += (target - heat) * Math.min(1, dt * (target ? 8 : 2.2));
        uniforms.uPointer.value.z = heat;
        draw();
        frame = requestAnimationFrame(tick);
      };
      const seen = new Map<Element, boolean>();
      const sync = () => {
        running = !document.hidden && !lost && document.documentElement.dataset.boot !== "running" && [...seen.values()].some(Boolean);
        if (!running || frame) return;
        if (reduced.matches) { draw(); return; }
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      };
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) seen.set(entry.target, entry.isIntersecting);
        sync();
      });
      document.querySelectorAll("[data-field]").forEach((el) => observer.observe(el));

      const onScroll = () => { readScroll(); if (reduced.matches && running) draw(); };
      const onResize = () => { resize(); readScroll(); if (running) draw(); };
      // if the browser takes the graphics context away (memory pressure, a sleeping GPU), stop cleanly and redraw when it returns
      const onLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; };
      const onRestored = () => { lost = false; resize(true); readScroll(); draw(); sync(); };
      canvas.addEventListener("webglcontextlost", onLost);
      canvas.addEventListener("webglcontextrestored", onRestored);
      // the opening film covers the page: nothing underneath should be drawing while it plays
      const bootWatch = new MutationObserver(sync);
      bootWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-boot"] });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      document.addEventListener("visibilitychange", sync);
      reduced.addEventListener("change", sync);

      resize(true);
      readScroll();
      draw();
      canvas.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        bootWatch.disconnect();
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.removeEventListener("webglcontextrestored", onRestored);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerdown", onPointer);
        document.removeEventListener("visibilitychange", sync);
        reduced.removeEventListener("change", sync);
        surfaceGeo.dispose(); packetGeo.dispose(); surfaceMat.dispose(); packetMat.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanupWait();
      cleanup();
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
