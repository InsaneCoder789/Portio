"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeScrollActivity } from "@/lib/scroll-activity";
import * as THREE from "three";
import { gsap } from "gsap";
import { beamPalette } from "@/lib/beam-palette";

type FiringState = "ready" | "charging" | "firing";
type BeamMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
type SceneRefs = {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  stationGroup: THREE.Group | null;
  tributaryBeams: BeamMesh[];
  mainBeam: BeamMesh | null;
  mainBeamGlow: BeamMesh | null;
  mainBeamCorona: BeamMesh | null;
  focalBlast: BeamMesh | null;
  shockwave: BeamMesh | null;
  dishGlow: BeamMesh | null;
  dishLocalLight: THREE.PointLight | null;
  hullClipPlane: THREE.Plane | null;
  sceneVisible: boolean;
  pageVisible: boolean;
  starTweens: gsap.core.Tween[];
  isPointerDown: boolean;
  pointerId: number | null;
  lastPointerX: number;
  lastPointerY: number;
  shakeStrength: number;
  frameId: number | null;
  isAnimatingRotation: boolean;
};

type DeathStarSceneProps = {
  className?: string;
  theme?: "dark" | "light";
};

const playSound = (type: "charge" | "fire") => {
  try {
    const AudioContextCtor =
      window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    const ctx = new AudioContextCtor();

    if (type === "charge") {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 4.0);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 4.0);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3.8);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4.1);

      osc.start();
      osc.stop(ctx.currentTime + 4.1);
    } else {
      const bufferSize = ctx.sampleRate * 3.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(600, ctx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 2.5);

      const oscLow = ctx.createOscillator();
      oscLow.type = "sawtooth";
      oscLow.frequency.setValueAtTime(110, ctx.currentTime);
      oscLow.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 2.8);

      const oscSub = ctx.createOscillator();
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(60, ctx.currentTime);
      oscSub.frequency.linearRampToValueAtTime(10, ctx.currentTime + 3.0);

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.4, ctx.currentTime);
      mainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

      noise.connect(noiseFilter);
      noiseFilter.connect(mainGain);
      oscLow.connect(mainGain);
      oscSub.connect(mainGain);
      mainGain.connect(ctx.destination);

      noise.start();
      oscLow.start();
      oscSub.start();

      noise.stop(ctx.currentTime + 3.0);
      oscLow.stop(ctx.currentTime + 3.0);
      oscSub.stop(ctx.currentTime + 3.0);
    }
  } catch (error) {
    console.warn("Web Audio Context blocked or not supported by client.", error);
  }
};

const generateDetailedDeathStarTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 3072;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");

  if (!ctx) return canvas;

  ctx.fillStyle = "#14161a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gridCols = 90;
  const gridRows = 45;
  const cellW = canvas.width / gridCols;
  const cellH = canvas.height / gridRows;

  for (let r = 0; r < gridRows; r += 1) {
    if (r >= 21 && r <= 23) continue;

    for (let c = 0; c < gridCols; c += 1) {
      const x = c * cellW;
      const y = r * cellH;

      const baseColorValue = Math.floor(14 + Math.random() * 8);
      ctx.fillStyle = `rgb(${baseColorValue}, ${baseColorValue + 1}, ${baseColorValue + 2})`;
      ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

      const totalSubPlates = 4 + Math.floor(Math.random() * 5);
      for (let s = 0; s < totalSubPlates; s += 1) {
        const spW = (cellW - 4) * (0.12 + Math.random() * 0.25);
        const spH = (cellH - 4) * (0.12 + Math.random() * 0.25);
        const spX = x + 2 + Math.random() * (cellW - spW - 4);
        const spY = y + 2 + Math.random() * (cellH - spH - 4);

        const shadowVal = baseColorValue - (2 + Math.floor(Math.random() * 4));
        ctx.fillStyle = `rgb(${shadowVal}, ${shadowVal + 1}, ${shadowVal + 1})`;
        ctx.fillRect(spX, spY, spW, spH);

        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(spX, spY, spW, spH);
      }

      if (Math.random() > 0.3) {
        const numLights = 1 + Math.floor(Math.random() * 8);
        ctx.fillStyle = Math.random() > 0.2 ? "#d0f5ff" : "#ffdca3";
        for (let l = 0; l < numLights; l += 1) {
          const lx = x + Math.random() * (cellW - 2);
          const ly = y + Math.random() * (cellH - 2);
          ctx.fillRect(lx, ly, 1.5, 1.5);
        }
      }
    }
  }

  ctx.fillStyle = "#030405";
  ctx.fillRect(0, cellH * 21.4, canvas.width, cellH * 1.2);

  ctx.strokeStyle = "#0e1013";
  ctx.lineWidth = 1.0;
  for (let tx = 0; tx < canvas.width; tx += 6) {
    if (Math.random() > 0.15) {
      ctx.beginPath();
      ctx.moveTo(tx, cellH * 21.4);
      ctx.lineTo(tx, cellH * 22.6);
      ctx.stroke();
    }
  }

  ctx.fillStyle = "#06131a";
  ctx.fillRect(0, cellH * 22 - 1.2, canvas.width, 2.4);

  return canvas;
};

export default function DeathStarScene({ className = "", theme = "dark" }: DeathStarSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [firingState, setFiringState] = useState<FiringState>("ready");
  const [loadingMsg, setLoadingMsg] = useState("Reconstructing Planetary Model...");
  const [isLoaded, setIsLoaded] = useState(false);
  const [coreIntegrity, setCoreIntegrity] = useState(100);
  const firingStateRef = useRef<FiringState>("ready");
  const shotTimeline = useRef<gsap.core.Timeline | null>(null);
  const coreIntegrityRef = useRef(100);

  const threeRefs = useRef<SceneRefs>({
    renderer: null,
    scene: null,
    camera: null,
    stationGroup: null,
    tributaryBeams: [],
    mainBeam: null,
    mainBeamGlow: null,
    mainBeamCorona: null,
    focalBlast: null,
    shockwave: null,
    dishGlow: null,
    dishLocalLight: null,
    hullClipPlane: null,
    sceneVisible: true,
    pageVisible: true,
    starTweens: [],
    isPointerDown: false,
    pointerId: null,
    lastPointerX: 0,
    lastPointerY: 0,
    shakeStrength: 0,
    frameId: null,
    isAnimatingRotation: false,
  });

  useEffect(() => {
    firingStateRef.current = firingState;
  }, [firingState]);

  useEffect(() => {
    coreIntegrityRef.current = coreIntegrity;
  }, [coreIntegrity]);

  useEffect(() => {
    let active = true;
    const mountedNode = mountRef.current;
    const starsNode = starfieldRef.current;
    const engineRefs = threeRefs.current;
    let cleanupCanvasEvents: (() => void) | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let cleanupVisibility: (() => void) | null = null;
    let wakeScene = () => {};
    let scrolling = false;
    const stopScroll = subscribeScrollActivity(value => { scrolling = value; if (!value) wakeScene(); });

    const setupGraphicsEngine = () => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      const scene = new THREE.Scene();
      threeRefs.current.scene = scene;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 9);
      const restingCameraPosition = camera.position.clone();
      threeRefs.current.camera = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      renderer.shadowMap.enabled = false;
      renderer.localClippingEnabled = true;

      container.appendChild(renderer.domElement);
      threeRefs.current.renderer = renderer;

      const ambientLight = new THREE.AmbientLight("#121622", 0.45);
      scene.add(ambientLight);

      const starLight = new THREE.DirectionalLight("#fffaed", 4.0);
      starLight.position.set(12, 6, 8);
      scene.add(starLight);

      const nebulaLight = new THREE.DirectionalLight("#3b1a6b", 1.1);
      nebulaLight.position.set(-15, -5, -10);
      scene.add(nebulaLight);

      const dishLocalLight = new THREE.PointLight("#5bbcff", 0, 10);
      scene.add(dishLocalLight);
      threeRefs.current.dishLocalLight = dishLocalLight;

      const stationGroup = new THREE.Group();
      stationGroup.position.set(2.2, -0.3, 0);
      stationGroup.rotation.y = -0.55;
      stationGroup.scale.setScalar(0.85);
      scene.add(stationGroup);
      threeRefs.current.stationGroup = stationGroup;

      const textureCanvas = generateDetailedDeathStarTexture();
      const hullTexture = new THREE.CanvasTexture(textureCanvas);
      hullTexture.wrapS = THREE.RepeatWrapping;
      hullTexture.wrapT = THREE.RepeatWrapping;

      const hullClipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
      threeRefs.current.hullClipPlane = hullClipPlane;

      const baseRadius = 3.2;
      const hullGeo = new THREE.SphereGeometry(baseRadius, 72, 72);
      const hullMat = new THREE.MeshStandardMaterial({
        map: hullTexture,
        roughness: 0.85,
        metalness: 0.65,
        bumpMap: hullTexture,
        bumpScale: 0.03,
        clippingPlanes: [hullClipPlane],
        clipShadows: true,
      });
      const mainHull = new THREE.Mesh(hullGeo, hullMat);
      mainHull.castShadow = true;
      mainHull.receiveShadow = true;
      stationGroup.add(mainHull);

      const trenchTorusGeo = new THREE.TorusGeometry(baseRadius + 0.005, 0.012, 12, 120);
      const trenchTorusMat = new THREE.MeshStandardMaterial({
        color: "#0a0d11",
        roughness: 0.95,
      });
      const trenchUpper = new THREE.Mesh(trenchTorusGeo, trenchTorusMat);
      trenchUpper.rotation.x = Math.PI / 2;
      trenchUpper.position.y = 0.015;
      const trenchLower = trenchUpper.clone();
      trenchLower.position.y = -0.015;
      stationGroup.add(trenchUpper);
      stationGroup.add(trenchLower);

      const dishGroup = new THREE.Group();
      const rimRadius = 1.0;
      const dishDistance = Math.sqrt(baseRadius * baseRadius - rimRadius * rimRadius);
      const dishY = baseRadius * 0.48;
      const dishZSurface = Math.sqrt(baseRadius * baseRadius - dishY * dishY);
      const radialDir = new THREE.Vector3(0, dishY, dishZSurface).normalize();

      dishGroup.position.copy(radialDir).multiplyScalar(dishDistance);
      dishGroup.rotation.x = -Math.asin(dishY / baseRadius);
      stationGroup.add(dishGroup);

      const rimTorusGeo = new THREE.TorusGeometry(rimRadius + 0.005, 0.045, 16, 100);
      const rimTorusMat = new THREE.MeshStandardMaterial({ color: "#0f1115", roughness: 0.9 });
      const rimTorus = new THREE.Mesh(rimTorusGeo, rimTorusMat);
      dishGroup.add(rimTorus);

      const bowlRadius = 1.25;
      const bowlH = Math.sqrt(bowlRadius * bowlRadius - rimRadius * rimRadius);
      const thetaMax = Math.acos(bowlH / bowlRadius);

      const concaveBowlGeo = new THREE.SphereGeometry(bowlRadius, 48, 48, 0, Math.PI * 2, 0, thetaMax);
      const concaveBowlMat = new THREE.MeshStandardMaterial({
        color: "#0b0c0f",
        roughness: 0.82,
        metalness: 0.85,
        side: THREE.DoubleSide,
        bumpMap: hullTexture,
        bumpScale: 0.01,
      });
      const concaveBowl = new THREE.Mesh(concaveBowlGeo, concaveBowlMat);
      concaveBowl.rotation.x = -Math.PI / 2;
      concaveBowl.position.z = bowlH;
      dishGroup.add(concaveBowl);

      const numStruts = 24;
      const craterDepth = bowlRadius - bowlH;

      for (let i = 0; i < numStruts; i += 1) {
        const angle = (i * Math.PI * 2) / numStruts;
        const strutGroup = new THREE.Group();
        strutGroup.rotation.z = angle;

        const innerR = 0.06;
        const innerZ = -craterDepth + (innerR / rimRadius) * craterDepth;
        const deltaR = rimRadius - innerR;
        const deltaZ = -innerZ;
        const length = Math.sqrt(deltaR * deltaR + deltaZ * deltaZ);
        const slope = Math.atan2(deltaZ, deltaR);

        const strutGeo = new THREE.BoxGeometry(length, 0.012, 0.018);
        strutGeo.translate(length / 2, 0, 0);
        const strutMat = new THREE.MeshStandardMaterial({ color: "#07080a", metalness: 0.9, roughness: 0.4 });
        const strut = new THREE.Mesh(strutGeo, strutMat);

        strut.rotation.y = slope;
        strut.position.set(innerR, 0, innerZ);
        strutGroup.add(strut);
        dishGroup.add(strutGroup);
      }

      const ringMat = new THREE.MeshStandardMaterial({ color: "#050608", roughness: 0.85, metalness: 0.95 });

      const ringGeo1 = new THREE.TorusGeometry(0.7, 0.008, 8, 64);
      const ring1 = new THREE.Mesh(ringGeo1, ringMat);
      ring1.position.z = -craterDepth + (0.7 / rimRadius) * craterDepth;
      dishGroup.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(0.35, 0.006, 8, 48);
      const ring2 = new THREE.Mesh(ringGeo2, ringMat);
      ring2.position.z = -craterDepth + (0.35 / rimRadius) * craterDepth;
      dishGroup.add(ring2);

      const nozzleGeo = new THREE.CylinderGeometry(0.02, 0.06, 0.15, 16);
      nozzleGeo.rotateX(Math.PI / 2);
      nozzleGeo.translate(0, 0, -craterDepth + 0.05);
      const nozzleMat = new THREE.MeshStandardMaterial({ color: "#121418", metalness: 0.95, roughness: 0.35 });
      const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
      dishGroup.add(nozzle);

      const glowSphereGeo = new THREE.SphereGeometry(0.1, 24, 24);
      const glowSphereMat = new THREE.MeshBasicMaterial({
        color: "#5bbcff",
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const dishGlow = new THREE.Mesh(glowSphereGeo, glowSphereMat);
      dishGlow.position.z = -craterDepth + 0.1;
      dishGroup.add(dishGlow);
      threeRefs.current.dishGlow = dishGlow;

      dishLocalLight.position.copy(dishGroup.position);

      const beamMat = new THREE.MeshBasicMaterial({
        color: "#79c8ff",
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const tributaryBeams: BeamMesh[] = [];
      const focalZ = 1.5;
      const emitterR = 0.8;
      const emitterZ = -craterDepth + (emitterR / rimRadius) * craterDepth;

      for (let i = 0; i < 8; i += 1) {
        const theta = (i * Math.PI * 2) / 8;

        const emitterGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);
        const emitter = new THREE.Mesh(emitterGeo, new THREE.MeshStandardMaterial({ color: "#222" }));
        emitter.position.set(Math.cos(theta) * emitterR, Math.sin(theta) * emitterR, emitterZ);
        emitter.lookAt(new THREE.Vector3(0, 0, focalZ));
        dishGroup.add(emitter);

        const sx = Math.cos(theta) * emitterR;
        const sy = Math.sin(theta) * emitterR;
        const sz = emitterZ;
        const dx = -sx;
        const dy = -sy;
        const dz = focalZ - sz;
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const cylGeo = new THREE.CylinderGeometry(0.015, 0.015, length, 8);
        cylGeo.translate(0, length / 2, 0);
        cylGeo.rotateX(Math.PI / 2);

        const beamMesh = new THREE.Mesh(cylGeo, beamMat);
        beamMesh.position.set(sx, sy, sz);
        beamMesh.lookAt(new THREE.Vector3(0, 0, focalZ));
        dishGroup.add(beamMesh);
        tributaryBeams.push(beamMesh);
      }
      threeRefs.current.tributaryBeams = tributaryBeams;

      const flashGeo = new THREE.SphereGeometry(0.2, 24, 24);
      const flashMat = new THREE.MeshBasicMaterial({
        color: "#d4ecff",
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const focalBlast = new THREE.Mesh(flashGeo, flashMat);
      focalBlast.position.set(0, 0, focalZ);
      dishGroup.add(focalBlast);
      threeRefs.current.focalBlast = focalBlast;

      const shockGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 64);
      const shockMat = new THREE.MeshBasicMaterial({
        color: "#66bfff",
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const shockwave = new THREE.Mesh(shockGeo, shockMat);
      shockwave.position.set(0, 0, focalZ);
      dishGroup.add(shockwave);
      threeRefs.current.shockwave = shockwave;

      const mainBeamGroup = new THREE.Group();
      mainBeamGroup.position.set(0, 0, focalZ);

      const coreBeamGeo = new THREE.CylinderGeometry(0.12, 0.12, 120, 24, 1, true);
      coreBeamGeo.translate(0, 60, 0);
      coreBeamGeo.rotateX(Math.PI / 2);
      const coreBeamMat = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mainBeam = new THREE.Mesh(coreBeamGeo, coreBeamMat);
      mainBeamGroup.add(mainBeam);
      threeRefs.current.mainBeam = mainBeam;

      const sheathGeo = new THREE.CylinderGeometry(0.25, 0.25, 120, 24, 1, true);
      sheathGeo.translate(0, 60, 0);
      sheathGeo.rotateX(Math.PI / 2);
      const sheathMat = new THREE.MeshBasicMaterial({
        color: "#4da3ff",
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mainBeamGlow = new THREE.Mesh(sheathGeo, sheathMat);
      mainBeamGroup.add(mainBeamGlow);
      threeRefs.current.mainBeamGlow = mainBeamGlow;

      const coronaGeo = new THREE.CylinderGeometry(0.6, 0.6, 120, 16, 1, true);
      coronaGeo.translate(0, 60, 0);
      coronaGeo.rotateX(Math.PI / 2);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: "#8bd0ff",
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mainBeamCorona = new THREE.Mesh(coronaGeo, coronaMat);
      mainBeamGroup.add(mainBeamCorona);
      threeRefs.current.mainBeamCorona = mainBeamCorona;

      dishGroup.add(mainBeamGroup);

      const resizeViewport = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const handlePointerDown = (event: PointerEvent) => {
        if (!threeRefs.current.stationGroup || threeRefs.current.isAnimatingRotation) return;
        threeRefs.current.isPointerDown = true;
        threeRefs.current.pointerId = event.pointerId;
        threeRefs.current.lastPointerX = event.clientX;
        threeRefs.current.lastPointerY = event.clientY;
        renderer.domElement.setPointerCapture(event.pointerId);
      };

      const handlePointerMove = (event: PointerEvent) => {
        const refs = threeRefs.current;
        if (!refs.isPointerDown || refs.pointerId !== event.pointerId || !refs.stationGroup || refs.isAnimatingRotation) {
          return;
        }

        const deltaX = event.clientX - refs.lastPointerX;
        const deltaY = event.clientY - refs.lastPointerY;
        refs.lastPointerX = event.clientX;
        refs.lastPointerY = event.clientY;

        refs.stationGroup.rotation.y += deltaX * 0.0085;
        refs.stationGroup.rotation.x = THREE.MathUtils.clamp(
          refs.stationGroup.rotation.x + deltaY * 0.0032,
          -0.32,
          0.32,
        );
      };

      const handlePointerUp = (event: PointerEvent) => {
        const refs = threeRefs.current;
        if (refs.pointerId === event.pointerId) {
          refs.isPointerDown = false;
          refs.pointerId = null;
          if (renderer.domElement.hasPointerCapture(event.pointerId)) {
            renderer.domElement.releasePointerCapture(event.pointerId);
          }
        }
      };

      const syncSceneActivity = () => {
        const refs = threeRefs.current;
        const shouldRun = refs.sceneVisible && refs.pageVisible;
        shotTimeline.current?.paused(!shouldRun);
        if (shouldRun) wakeScene();
        else if (refs.frameId !== null) { cancelAnimationFrame(refs.frameId); refs.frameId = null; }
        (refs.starTweens as gsap.core.Tween[]).forEach((tween) => {
          tween.paused(!shouldRun);
        });
      };

      const handleVisibilityChange = () => {
        threeRefs.current.pageVisible = !document.hidden;
        syncSceneActivity();
      };

      window.addEventListener("resize", resizeViewport);
      renderer.domElement.addEventListener("pointerdown", handlePointerDown);
      renderer.domElement.addEventListener("pointermove", handlePointerMove);
      renderer.domElement.addEventListener("pointerup", handlePointerUp);
      renderer.domElement.addEventListener("pointercancel", handlePointerUp);
      cleanupCanvasEvents = () => {
        window.removeEventListener("resize", resizeViewport);
        renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
        renderer.domElement.removeEventListener("pointermove", handlePointerMove);
        renderer.domElement.removeEventListener("pointerup", handlePointerUp);
        renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      };
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          threeRefs.current.sceneVisible = Boolean(entry?.isIntersecting);
          syncSceneActivity();
        },
        // Wake before the viewport reaches the Hero, not at the section seam.
        { threshold: 0, rootMargin: "240px 0px" },
      );
      visibilityObserver.observe(container);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      cleanupVisibility = () => {
        visibilityObserver?.disconnect();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
      resizeViewport();

      let previousTime = performance.now();
      const worldNormal = new THREE.Vector3();
      const cutCenterWorld = new THREE.Vector3();

      const tick = () => {
        if (scrolling && firingStateRef.current === "ready" && !threeRefs.current.isPointerDown) { threeRefs.current.frameId = null; return; }
        if (!active || !threeRefs.current.sceneVisible || !threeRefs.current.pageVisible) { threeRefs.current.frameId = null; return; }
        threeRefs.current.frameId = requestAnimationFrame(tick);
        const now = performance.now();
        // Reserve 60 Hz for direct interaction and firing; idle orbit needs 30 Hz.
        const frameInterval = firingStateRef.current === "ready" && !threeRefs.current.isPointerDown ? 1000 / 30 : 1000 / 60;
        if (now - previousTime < frameInterval - 1) return;
        const delta = Math.min((now - previousTime) / 1000, .05);
        previousTime = now;

        if (stationGroup && !threeRefs.current.isAnimatingRotation) {
          stationGroup.rotation.y += delta * 0.022;
        }

        if (!threeRefs.current.sceneVisible || !threeRefs.current.pageVisible) {
          return;
        }

        if (dishGlow && firingStateRef.current === "ready") {
          (dishGlow.material as THREE.MeshBasicMaterial).opacity = 0.0;
          dishGlow.scale.setScalar(0.7);
        }

        // Shake around the resting position, so repeated shots cannot drift the framing.
        camera.position.copy(restingCameraPosition);
        if (threeRefs.current.shakeStrength > 0.001) {
          const shake = threeRefs.current.shakeStrength;
          camera.position.x += (Math.random() - 0.5) * shake;
          camera.position.y += (Math.random() - 0.5) * shake;
          camera.position.z += (Math.random() - 0.5) * shake;
          threeRefs.current.shakeStrength *= 0.9;
        }

        if (hullClipPlane && dishGroup) {
          dishGroup.getWorldDirection(worldNormal);
          worldNormal.negate();

          cutCenterWorld.set(0, 0, 0);
          dishGroup.localToWorld(cutCenterWorld);
          const constant = -cutCenterWorld.dot(worldNormal);

          hullClipPlane.normal.copy(worldNormal);
          hullClipPlane.constant = constant;
        }

        // Transparent beams still submit huge cylinders unless explicitly culled.
        [threeRefs.current.mainBeam, threeRefs.current.mainBeamGlow, threeRefs.current.mainBeamCorona].forEach(beam => {
          if (beam) beam.visible = beam.material.opacity > .001;
        });
        renderer.render(scene, camera);
      };

      wakeScene = () => { if (threeRefs.current.frameId === null) { previousTime = performance.now(); tick(); } };
      wakeScene();
    };

    const spawnGSAPMilkyWay = () => {
      const panel = starfieldRef.current;
      if (!panel) return;

      panel.innerHTML = "";
      const starTotal = 96;

      for (let i = 0; i < starTotal; i += 1) {
        const dot = document.createElement("div");
        dot.className = "deathstar-dom-star";

        const randomSize = Math.random() * 2.2 + 0.5;
        const hueVariations = ["#ffffff", "#e2f5ff", "#fffef2", "#fafcff"];

        dot.style.width = `${randomSize}px`;
        dot.style.height = `${randomSize}px`;
        dot.style.backgroundColor = hueVariations[Math.floor(Math.random() * hueVariations.length)];
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.opacity = String(Math.random());

        if (Math.random() > 0.85) {
          dot.style.boxShadow = `0 0 6px 1px ${dot.style.backgroundColor}`;
        }

        panel.appendChild(dot);

      }
    };

    try {
      setLoadingMsg("Initializing Visual Matrix...");
      setLoadingMsg("Structuring Space coordinates...");
      if (active) {
        setIsLoaded(true);
        setupGraphicsEngine();
        spawnGSAPMilkyWay();
      }
    } catch (error) {
      console.error("Environment setup error:", error);
      setLoadingMsg("System Core Offline: Verification failed.");
    }

    return () => {
      active = false;
      stopScroll();
      const refs = engineRefs;
      shotTimeline.current?.kill();
      shotTimeline.current = null;
      if (refs.frameId) cancelAnimationFrame(refs.frameId);
      refs.frameId = null;
      cleanupCanvasEvents?.();
      cleanupVisibility?.();
      (refs.starTweens as gsap.core.Tween[]).forEach((tween) => tween.kill());
      refs.starTweens = [];
      if (refs.renderer) {
        const geometries = new Set<THREE.BufferGeometry>();
        const materials = new Set<THREE.Material>();
        const textures = new Set<THREE.Texture>();
        refs.scene?.traverse(object => {
          if (!(object instanceof THREE.Mesh)) return;
          geometries.add(object.geometry);
          const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
          meshMaterials.forEach(material => {
            materials.add(material);
            Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); });
          });
        });
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
        textures.forEach(texture => texture.dispose());
        refs.renderer.dispose();
        if (mountedNode && refs.renderer.domElement.parentElement === mountedNode) {
          mountedNode.removeChild(refs.renderer.domElement);
        }
      }
      if (starsNode) {
        starsNode.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    const refs = threeRefs.current;
    const palette = beamPalette(theme);
    const tint = (mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> | null, color: string) => mesh?.material.color.set(color);
    tint(refs.mainBeam, palette.core);
    tint(refs.mainBeamGlow, palette.glow);
    tint(refs.mainBeamCorona, palette.corona);
    tint(refs.dishGlow, palette.charge);
    tint(refs.focalBlast, palette.flash);
    tint(refs.shockwave, palette.corona);
    refs.tributaryBeams.forEach((mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>) => tint(mesh, palette.corona));
    refs.dishLocalLight?.color.set(palette.charge);
  }, [theme]);

  const runSuperlaserSequence = () => {
    if (firingStateRef.current !== "ready" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    firingStateRef.current = "charging";

    setFiringState("charging");
    playSound("charge");

    const refs = threeRefs.current;
    refs.isAnimatingRotation = true;

    shotTimeline.current?.kill();
    const timeline = gsap.timeline();
    shotTimeline.current = timeline;
    timeline.to({ val: 0 }, {
      val: 1,
      duration: 4.0,
      ease: "power2.in",
      onUpdate() {
        const prog = this.targets()[0].val;

        if (refs.dishGlow) {
          refs.dishGlow.material.opacity = prog * 1.0;
          refs.dishGlow.scale.setScalar(0.5 + prog * 2.5);
        }

        if (refs.dishLocalLight) {
          refs.dishLocalLight.intensity = prog * 3.5;
        }

        refs.tributaryBeams.forEach((beam: THREE.Mesh, index: number) => {
          const convergence = Math.max(0, Math.min(1, prog * 1.7 - index * .08));
          (beam.material as THREE.MeshBasicMaterial).opacity = convergence * .8;
          beam.scale.z = convergence;
          beam.scale.x = beam.scale.y = .75 + convergence * .25;
        });
      },
      onComplete: () => {
        setFiringState("firing");
        firingStateRef.current = "firing";
        playSound("fire");

        refs.shakeStrength = 0.09;

        if (refs.shockwave) {
          refs.shockwave.scale.setScalar(1);
          refs.shockwave.material.opacity = 1.0;
          timeline.to(refs.shockwave.scale, { x: 18, y: 18, z: 18, duration: 1.1, ease: "power3.out" }, 4);
          timeline.to(refs.shockwave.material, { opacity: 0, duration: 1.1, ease: "power2.out" }, 4);
        }

        if (refs.focalBlast) {
          refs.focalBlast.material.opacity = 1.0;
          refs.focalBlast.scale.setScalar(.6);
          timeline.to(refs.focalBlast.scale, { x: 3, y: 3, z: 3, duration: .55, ease: "power3.out" }, 4);
        }

        if (refs.mainBeam && refs.mainBeamGlow && refs.mainBeamCorona) {
          refs.mainBeam.material.opacity = 1.0;
          refs.mainBeamGlow.material.opacity = 1.0;
          refs.mainBeamCorona.material.opacity = 0.65;

          [refs.mainBeam, refs.mainBeamGlow, refs.mainBeamCorona].forEach((beam, index) => {
            beam.scale.set(.8, .8, .001);
            timeline.to(beam.scale, { x: 1 + index * .15, y: 1 + index * .15, z: 1, duration: .5, ease: "power3.out" }, 4 + index * .04);
          });
        }

        if (refs.dishLocalLight) {
          refs.dishLocalLight.intensity = 12.0;
        }

        timeline.to({ integrity: 100 }, { integrity: 38, duration: 2, ease: "power1.out", onUpdate() { setCoreIntegrity(Math.round(this.targets()[0].integrity)); } }, 4);
        timeline.to({ decay: 1.0 }, {
            decay: 0.0,
            duration: 1.5,
            ease: "power2.out",
            onUpdate() {
              const val = this.targets()[0].decay;

              if (refs.mainBeam && refs.mainBeamGlow && refs.mainBeamCorona) {
                refs.mainBeam.material.opacity = val;
                refs.mainBeamGlow.material.opacity = val;
                refs.mainBeamCorona.material.opacity = val * 0.65;
              }

              if (refs.focalBlast) {
                refs.focalBlast.material.opacity = val;
                refs.focalBlast.scale.setScalar(val * 3.5);
              }

              if (refs.dishGlow) {
                refs.dishGlow.material.opacity = 0;
              }

              if (refs.dishLocalLight) {
                refs.dishLocalLight.intensity = val * 0.5;
              }

              refs.tributaryBeams.forEach((beam: THREE.Mesh) => {
                (beam.material as THREE.MeshBasicMaterial).opacity = val;
              });
            },
            onComplete: () => {
              setFiringState("ready");
              firingStateRef.current = "ready";
              refs.isAnimatingRotation = false;

              timeline.to({ restored: coreIntegrityRef.current }, {
                restored: 100,
                duration: 2.5,
                ease: "power1.out",
                onUpdate() {
                  setCoreIntegrity(Math.floor(this.targets()[0].restored));
                },
              }, 7.5);
            },
          }, 6);
      },
    });
  };

  return (
    <div className={`deathstar-scene ${className}`.trim()}>
      {!isLoaded ? (
        <div className="deathstar-loader">
          <div className="deathstar-loader-ring">
            <div className="deathstar-loader-track" />
            <div className="deathstar-loader-spin" />
          </div>
          <div className="deathstar-loader-text">{loadingMsg}</div>
        </div>
      ) : null}

      <div ref={starfieldRef} className="deathstar-dom-starfield" />
      <div ref={mountRef} className="deathstar-canvas" />
      <div className="deathstar-overlay-frame" />
      <div className="deathstar-grid-overlay" />

      <div className="deathstar-overlay">
        <div className="deathstar-bottom-note">
          Built as a custom interactive orbital scene using Three.js tooling.
        </div>

        <div className="deathstar-hud">
          <div className="deathstar-hud-head">
            <span className="deathstar-pip" />
            <p>Weapon telemetry</p>
            <span className="deathstar-head-state">SYS: ONLINE</span>
          </div>

          <div className="deathstar-hud-line">
            <span>Reactor energy:</span>
            <strong>1.21 GW</strong>
          </div>

          <div className="deathstar-hud-line">
            <span>Reactor core integrity:</span>
            <strong>{coreIntegrity}%</strong>
          </div>

          <div className="deathstar-bars" aria-hidden="true">
            {Array.from({ length: 15 }).map((_, idx) => {
              const segmentPercentage = (idx / 15) * 100;
              const isActive = segmentPercentage < coreIntegrity;
              return <span key={idx} className={isActive ? "is-active" : ""} />;
            })}
          </div>

          <button
            type="button"
            disabled={firingState !== "ready"}
            onClick={runSuperlaserSequence}
            className={`deathstar-button ${
              firingState === "ready" ? "is-ready" : firingState === "charging" ? "is-charging" : "is-firing"
            }`}
          >
            {firingState === "ready" && "Initiate weapon test"}
            {firingState === "charging" && "Charging core..."}
            {firingState === "firing" && "Discharging plasma"}
          </button>

          <p className="deathstar-hint">Click and drag to orbit space station.</p>
        </div>
      </div>
    </div>
  );
}
