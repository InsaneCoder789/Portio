"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { subscribeScrollActivity } from "@/lib/scroll-activity";

export function SystemsSculpture({ prewarm = false, onPrepared }: { prewarm?: boolean; onPrepared?: () => void }) {
  const prepareRef = useRef<() => void>(() => {});
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let visible = false;
    let started = false;
    let cleanupScene = () => {};
    let wake = () => {};
    let scrolling = false;
    let pendingInitialize: (() => void) | undefined;
    const stopScroll = subscribeScrollActivity(value => {
      scrolling = value;
      if (!value) { pendingInitialize?.(); pendingInitialize = undefined; wake(); }
    });
    let idleTask: number | undefined;
    let fallbackTask: number | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const initialize = async () => {
      const [THREE, { buildSystemsCore }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("@/lib/systems-core-model"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);
      if (disposed) return;
      const compact = innerWidth <= 720;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      cleanupScene = () => { renderer.dispose(); renderer.domElement.remove(); };
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth <= 720 ? 1 : 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .85;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 30);
      camera.position.set(0, .12, 5.6);
      const { core, disposeMaterials } = buildSystemsCore({ compact });
      core.rotation.set(.28, -.55, -.06);
      scene.add(core);
      const environment = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environmentTarget = pmrem.fromScene(environment, .04, .1, 100, { size: compact ? 64 : 128 });
      scene.environment = environmentTarget.texture;
      environment.dispose();
      pmrem.dispose();
      scene.environmentIntensity = .8;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x29262c, .8));
      const key = new THREE.DirectionalLight(0xffffff, 2.5);
      key.position.set(-3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xdcb490, 2);
      rim.position.set(3, 1, -2);
      scene.add(rim);
      host.appendChild(renderer.domElement);
      let frame: number | null = null;
      let last = performance.now();
      let dragging = false;
      let compiled = false;
      let pointer: number | null = null;
      let previousX = 0;
      let previousY = 0;
      const render = (now: number) => {
        frame = null;
        if (disposed || !compiled || !visible || document.hidden) return;
        const interval = dragging ? 1000 / 60 : 1000 / 30;
        if (now - last >= interval - 1 || reduced.matches) {
          const delta = Math.min((now - last) / 1000, .05);
          if (!dragging && !reduced.matches) core.rotation.y += delta * .13;
          renderer.render(scene, camera);
          last = now;
        }
        if (!reduced.matches || dragging) frame = requestAnimationFrame(render);
      };
      wake = () => {
        host.dataset.motion = compiled && visible && !document.hidden && !reduced.matches ? "running" : "idle";
        if (!visible || document.hidden) {
          if (frame !== null) cancelAnimationFrame(frame);
          frame = null;
          return;
        }
        if (compiled && frame === null) { last = performance.now() - 40; frame = requestAnimationFrame(render); }
      };
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(Math.max(1, width), Math.max(1, height), false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
        wake();
      };
      const down = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0) return;
        pointer = event.pointerId;
        dragging = true;
        previousX = event.clientX;
        previousY = event.clientY;
        host.setPointerCapture(pointer);
        host.dataset.dragging = "true";
        wake();
      };
      const move = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointer) return;
        core.rotation.y += (event.clientX - previousX) * .009;
        core.rotation.x += (event.clientY - previousY) * .009;
        previousX = event.clientX;
        previousY = event.clientY;
        wake();
      };
      const up = () => { dragging = false; pointer = null; delete host.dataset.dragging; };
      const keyboard = (event: KeyboardEvent) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Home") core.rotation.set(.28, -.55, -.06);
        else if (event.key === "ArrowLeft") core.rotation.y -= .18;
        else if (event.key === "ArrowRight") core.rotation.y += .18;
        else if (event.key === "ArrowUp") core.rotation.x -= .18;
        else core.rotation.x += .18;
        wake();
      };
      const resizer = new ResizeObserver(resize);
      resizer.observe(host);
      host.addEventListener("pointerdown", down);
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerup", up);
      host.addEventListener("pointercancel", up);
      host.addEventListener("lostpointercapture", up);
      host.addEventListener("keydown", keyboard);
      reduced.addEventListener("change", wake);
      cleanupScene = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        resizer.disconnect();
        host.removeEventListener("pointerdown", down);
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerup", up);
        host.removeEventListener("pointercancel", up);
        host.removeEventListener("lostpointercapture", up);
        host.removeEventListener("keydown", keyboard);
        reduced.removeEventListener("change", wake);
        const geometries = new Set<import("three").BufferGeometry>();
        scene.traverse(object => { if (object instanceof THREE.Mesh) geometries.add(object.geometry); });
        geometries.forEach(geometry => geometry.dispose());
        disposeMaterials();
        environmentTarget.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
      resize();
      // Compile/upload once behind the boot screen, not on the first About scroll.
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      compiled = true;
      renderer.render(scene, camera);
      setReady(true);
      onPrepared?.();
      wake();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !started) {
        started = true;
        const build = () => { if (!disposed) void initialize().catch(() => { cleanupScene(); if (!disposed) onPrepared?.(); /* Reserved fallback remains on WebGL failure. */ }); };
        const start = () => { if (scrolling) pendingInitialize = build; else build(); };
        // Model assembly and environment baking must not run inside the scroll callback.
        if (typeof window.requestIdleCallback === "function") idleTask = window.requestIdleCallback(start);
        else fallbackTask = window.setTimeout(start, 250);
      }
      wake();
    });
    // Prepare resources during boot, but play only when the About chapter enters view.
    observer.observe(host.closest("#about") ?? host);
    prepareRef.current = () => {
      if (started || disposed) return;
      started = true;
      void initialize().catch(() => { cleanupScene(); if (!disposed) onPrepared?.(); });
    };
    document.addEventListener("visibilitychange", wake);
    return () => { disposed = true; prepareRef.current = () => {}; stopScroll(); if (idleTask !== undefined) window.cancelIdleCallback(idleTask); if (fallbackTask !== undefined) window.clearTimeout(fallbackTask); observer.disconnect(); document.removeEventListener("visibilitychange", wake); cleanupScene(); };
  }, [onPrepared]);

  useEffect(() => { if (prewarm) prepareRef.current(); }, [prewarm]);

  return <figure className="systems-sculpture">
    <div className="systems-product">
      <div className="systems-product-plinth" />
      {!ready && <Image src="/objects/systems-core.webp" width={640} height={640} sizes="(max-width: 720px) 70vw, 320px" alt="Machined metallic systems core" />}
      <div ref={hostRef} className="systems-model" data-motion="idle" tabIndex={0} role="img" aria-label="Interactive systems core. Drag or use arrow keys to rotate; Home resets the view." />
    </div>
    <figcaption><span>THE SYSTEMS CORE</span><strong>Clear interfaces. Reliable foundations.</strong><small>A visual metaphor for how I build—not a technical simulation.</small></figcaption>
    {ready && <p className="systems-interaction-hint">Drag to rotate · Arrow keys to explore</p>}
  </figure>;
}
