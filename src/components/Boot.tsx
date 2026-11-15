"use client";

import { useEffect, useRef, useState } from "react";
import { T_FACE, drawScene, inMotion } from "./boot/scene";

/*
 * The opening, played once per browser tab: a morning on a tropical sea, a red rowing boat, a diver on the bow.
 * He leaps, the camera follows him down past the reef and into the dark, where he switches on a torch and turns to face
 * us. The light floods the screen and the site opens through it.
 * The picture itself is in boot/scene.ts. This file owns the clock, the readout and the way out.
 * Click, Escape, Enter or Space skips to the opening. Visitors who prefer reduced motion never see it.
 */
const T_FLOOD = T_FACE + 0.55;
const T_OPEN = T_FACE + 1.05;
const T_END = T_OPEN + 1.05;
const DEPTH_MAX = 95;
const TAU = Math.PI * 2;

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = (value: number) => { const k = clamp(value); return k * k * (3 - 2 * k); };

export default function Boot() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const depthLabel = useRef<HTMLSpanElement>(null);
    const skipRef = useRef<() => void>(() => {});
  const bufRef = useRef<HTMLCanvasElement | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (html.dataset.boot !== "running" || !element || !context) {
      html.dataset.boot = "done";
      setGone(true);
      return;
    }

    // development only: ?bootSeek=4.2 freezes the film on one moment so a frame can be inspected
    const seekParam = process.env.NODE_ENV !== "production" ? new URLSearchParams(window.location.search).get("bootSeek") : null;
    const seek = seekParam === null ? null : Number(seekParam);

    let width = 0, height = 0, dpr = 1, frame = 0, previous = 0, startedAt = 0;
    let t = 0, opened = false, finished = false;
    let tOpen = T_OPEN, tEnd = T_END;

    // Adaptive resolution: the picture is drawn at a fraction of the screen's pixels and scaled up by the browser, and that
    // fraction follows the measured frame time, so a slow device keeps every frame instead of dropping them.
    let quality = clamp(Math.sqrt(2.1e6 / (window.innerWidth * window.innerHeight * Math.min(window.devicePixelRatio || 1, 1.5) ** 2)), 0.5, 1), avg = 16.7, slow = 0, fast = 0, frames = 0;
    const shown: Record<string, string> = {};
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      element.width = Math.max(2, Math.round(width * dpr * quality));
      element.height = Math.max(2, Math.round(height * dpr * quality));
    };
    const adapt = (ms: number) => {
      avg = avg * 0.88 + Math.min(ms, 80) * 0.12;
      if (frames % 20 === 0 && root.current) root.current.dataset.perf = `${avg.toFixed(1)}ms q${quality.toFixed(2)}`;
      if (++frames < 8) return;
      if (avg > 19 && quality > 0.5) { if (++slow >= 6) { quality = Math.max(0.5, quality - 0.12); slow = 0; resize(); } fast = 0; }
      else if (avg < 12.5 && quality < 1) { if (++fast >= 140) { quality = Math.min(1, quality + 0.06); fast = 0; resize(); } slow = 0; }
      else { slow = Math.max(0, slow - 1); }
    };

    const draw = () => {
      const c = context;
      const open = t >= tOpen ? clamp((t - tOpen) / (tEnd - tOpen)) : 0;
      const hud = clamp(t / 0.9) * (1 - clamp(open * 2));

      c.globalCompositeOperation = "source-over";
      const { depthM, focus } = drawScene(c, element.width, element.height, t); // the picture is drawn in device pixels
      // fast movement is blended over two earlier instants, like a camera shutter, so it reads as motion rather than as steps
      if (quality > 0.7 && avg < 9 && inMotion(t)) { // only when there is time to spare
        const buf = (bufRef.current ??= document.createElement("canvas")), bc = buf.getContext("2d");
        if (bc) {
          if (buf.width !== element.width || buf.height !== element.height) { buf.width = element.width; buf.height = element.height; }
          for (let k = 1; k <= 2; k++) {
            drawScene(bc, buf.width, buf.height, t - k * 0.0085);
            c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1 / (k + 1); c.drawImage(buf, 0, 0); c.globalAlpha = 1;
          }
        }
      }
      const k = element.width / width;
      c.setTransform(k, 0, 0, k, 0, 0); // everything after it is in CSS pixels
      const fx = focus[0] / k, fy = focus[1] / k; // where the torch is
      const depth = clamp(depthM / DEPTH_MAX);

      // the first fade up from black, like a film opening
      if (t < 0.55) { c.fillStyle = `rgba(0,0,0,${1 - smooth(t / 0.55)})`; c.fillRect(0, 0, width, height); }
      // depth gauge down the right edge, once he is under
      const gaugeIn = clamp(depthM / 4) * hud;
      if (gaugeIn > 0.01) {
        const gx = width - Math.max(22, width * 0.03), tick = 22, travel = depthM * 9;
        c.lineWidth = 1;
        for (let i = -16; i <= 16; i++) {
          const y = height / 2 + i * tick - (travel % tick);
          const fade = 1 - Math.abs(y - height / 2) / (height * 0.3);
          if (fade <= 0) continue;
          const major = (Math.floor(travel / tick) + i) % 5 === 0;
          c.strokeStyle = `rgba(255,255,255,${gaugeIn * fade * (major ? 0.8 : 0.4)})`;
          c.beginPath(); c.moveTo(gx, y); c.lineTo(gx - (major ? 18 : 9), y); c.stroke();
        }
        c.fillStyle = `rgba(255,184,28,${gaugeIn})`;
        c.beginPath(); c.moveTo(gx - 26, height / 2); c.lineTo(gx - 40, height / 2 - 7); c.lineTo(gx - 40, height / 2 + 7); c.closePath(); c.fill();
      }

      // the torch floods the screen with light
      const flood = smooth((t - T_FLOOD) / 0.55);
      if (flood > 0) {
        const reachPx = Math.hypot(width, height) * 1.15 * flood + 20;
        const g = c.createRadialGradient(fx, fy, 0, fx, fy, reachPx);
        g.addColorStop(0, `rgba(255,252,236,${0.98 * flood})`); g.addColorStop(0.35, `rgba(255,214,130,${0.7 * flood})`); g.addColorStop(1, "rgba(255,170,60,0)");
        c.fillStyle = g; c.fillRect(0, 0, width, height);
      }

      // the opening: the ping erases a widening circle, and the site shows through
      if (open > 0) {
        const radius = smooth(open) * (Math.hypot(width, height) + 60);
        const soft = Math.min(90, radius);
        c.globalCompositeOperation = "destination-out";
        const hole = c.createRadialGradient(fx, fy, Math.max(0, radius - soft), fx, fy, radius + 1);
        hole.addColorStop(0, "rgba(0,0,0,1)");
        hole.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = hole;
        c.beginPath(); c.arc(fx, fy, radius + 1, 0, TAU); c.fill();
        c.globalCompositeOperation = "source-over";
        if (open < 0.97) {
          c.strokeStyle = `rgba(255,184,28,${0.85 * (1 - open)})`;
          c.lineWidth = 2.4;
          c.beginPath(); c.arc(fx, fy, radius, 0, TAU); c.stroke();
        }
      }

      // only touch the page when a value has actually changed
      const label = String(Math.round(DEPTH_MAX * depth));
      if (depthLabel.current && label !== shown.label) { shown.label = label; depthLabel.current.textContent = label; }
      for (const [name, value] of [["--hud", hud], ["--under", clamp(depthM / 3)], ["--open", open]] as const) {
        const text = value.toFixed(2);
        if (shown[name] !== text) { shown[name] = text; root.current?.style.setProperty(name, text); }
      }
    };

    // while the film plays, the page behind it cannot be reached by keyboard or screen reader
    const behind = Array.from(document.body.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el !== root.current && el.tagName !== "SCRIPT");
    behind.forEach((el) => { el.inert = true; });
    const release = () => behind.forEach((el) => { el.inert = false; });
    const finish = () => {
      if (finished) return;
      finished = true;
      release();
      cancelAnimationFrame(frame);
      html.dataset.boot = "done";
      setGone(true);
    };
    const tick = (now: number) => {
      // the film advances by the time each frame took, capped: a hitch (a script compiling, the tab busy) holds the picture
      // for a moment and carries on from the same spot, instead of jumping ahead and dropping the frames in between
      const ms = now - previous;
      previous = now;
      t += Math.min(ms, 34) / 1000;
      if (t >= tOpen && !opened) { opened = true; html.dataset.boot = "reveal"; }
      // a drawing error must never leave the cover over the site: on any failure, open it straight away
      try { draw(); } catch { finish(); return; }
      adapt(ms);
      if (t >= tEnd) { finish(); return; }
      frame = requestAnimationFrame(tick);
    };

    skipRef.current = () => { if (t < tOpen) { tOpen = t; tEnd = t + 0.5; } };
    const onKey = (event: KeyboardEvent) => { if (["Escape", "Enter", " "].includes(event.key)) skipRef.current(); };
    const failsafe = window.setTimeout(finish, seek === null ? (T_END + 14) * 1000 : 600000);
    resize();
    if (seek !== null && Number.isFinite(seek)) {
      t = seek;
      draw();
      const began = performance.now();
      for (let i = 0; i < 20; i++) draw();
      if (root.current) root.current.dataset.cost = ((performance.now() - began) / 20).toFixed(1); // dev only: milliseconds per frame
      root.current?.classList.add("is-live");
      window.addEventListener("resize", () => { resize(); draw(); });
      return () => window.clearTimeout(failsafe);
    }
    // paint the first frame straight away, then let the overlay's own background go so the opening can show the site through
    try { draw(); } catch { finish(); return; }
    root.current?.classList.add("is-live");
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKey);
    frame = requestAnimationFrame((now) => { previous = now; startedAt = now; frame = requestAnimationFrame(tick); });

    return () => {
      release();
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="boot" role="status" aria-label="Opening the site" onClick={() => skipRef.current()}>
      <canvas ref={canvas} className="boot-canvas" />
      <div className="boot-hud" aria-hidden="true">
        <p className="boot-name">Rohan Chatterjee</p>
        <p className="boot-depth"><span ref={depthLabel}>0</span><small>m</small></p>
      </div>
      <button type="button" className="boot-skip" onClick={(event) => { event.stopPropagation(); skipRef.current(); }}>Skip</button>
    </div>
  );
}
