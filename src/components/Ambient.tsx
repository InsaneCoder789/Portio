"use client";

import { useEffect, useRef } from "react";

/*
 * The background behind everything except the first and last sections: a circuit grid with bright white pulses
 * running along its lines, like requests moving through a system. A pulse leaves a spark each time it crosses a
 * grid point, and the crossings near the pointer light up. Sections sit on top as blurred glass panels, so the
 * light shows through softly without ever competing with the text.
 * It stays pinned to the window while its sections scroll, and only draws while it is on screen.
 */

type Pulse = { horizontal: boolean; line: number; at: number; speed: number; length: number; bright: boolean };
type Spark = { x: number; y: number; age: number };

// `calm` is for pages that are mostly reading: a finer grid, fewer and slower pulses, thin lines and no sparks.
export default function Ambient({ calm = false }: { calm?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const CELL = calm ? 40 : 64;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, dpr = 1, frame = 0, previous = 0, visible = false, degraded = false, slow = 0, broken = false;
    const booting = () => document.documentElement.dataset.boot === "running";
    let pulses: Pulse[] = [];
    let sparks: Spark[] = [];
    const pointer = { x: -999, y: -999, heat: 0, moved: -10, time: 0 };

    const spawn = (anywhere: boolean): Pulse => {
      const horizontal = Math.random() < 0.58;
      const span = horizontal ? width : height;
      const lines = Math.floor((horizontal ? height : width) / CELL);
      const direction = Math.random() < 0.5 ? -1 : 1;
      const length = calm ? 60 + Math.random() * 100 : 120 + Math.random() * 190;
      return {
        horizontal,
        line: Math.floor(Math.random() * (lines + 1)) * CELL,
        at: anywhere ? Math.random() * span : direction > 0 ? -length : span + length,
        speed: direction * (calm ? 45 + Math.random() * 90 : 90 + Math.random() * 220),
        length,
        bright: Math.random() < 0.7,
      };
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      dpr = degraded ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const base = calm ? Math.max(7, Math.min(16, Math.round((width * height) / 80000))) : Math.max(16, Math.min(54, Math.round((width * height) / 30000)));
      const count = degraded ? Math.max(6, Math.round(base * 0.55)) : base;
      pulses = Array.from({ length: count }, () => spawn(true));
      sparks = [];
    };

    const draw = (dt: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      // light under the pointer, and the grid crossings around it
      pointer.time += dt;
      const target = pointer.time - pointer.moved < 1.2 ? 1 : 0;
      pointer.heat += (target - pointer.heat) * Math.min(1, dt * (target ? 6 : 1.5));
      if (pointer.heat > 0.01) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 300);
        glow.addColorStop(0, `rgba(255,255,255,${(calm ? 0.05 : 0.3) * pointer.heat})`);
        glow.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = glow;
        context.fillRect(pointer.x - 300, pointer.y - 300, 600, 600);
        const x0 = Math.floor((pointer.x - 220) / CELL) * CELL, y0 = Math.floor((pointer.y - 220) / CELL) * CELL;
        for (let x = x0; x <= pointer.x + 220; x += CELL) {
          for (let y = y0; y <= pointer.y + 220; y += CELL) {
            const near = 1 - Math.hypot(x - pointer.x, y - pointer.y) / 220;
            if (near <= 0) continue;
            context.fillStyle = `rgba(255,255,255,${near * pointer.heat})`;
            context.beginPath();
            context.arc(x, y, 1.4 + near * 2.6, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      // pulses along the grid lines: a wide soft halo, a bright core, and a glowing head
      context.lineCap = "round";
      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        const last = pulse.at;
        pulse.at += pulse.speed * dt;
        const span = pulse.horizontal ? width : height;
        if (pulse.at < -pulse.length * 2 || pulse.at > span + pulse.length * 2) { pulses[i] = spawn(false); continue; }

        // a spark where the head passes a grid point
        const crossed = Math.floor(pulse.at / CELL) !== Math.floor(last / CELL);
        if (crossed && !calm && Math.random() < 0.3 && sparks.length < 44 && pulse.at > 0 && pulse.at < span) {
          const point = Math.round(pulse.at / CELL) * CELL;
          sparks.push(pulse.horizontal ? { x: point, y: pulse.line, age: 0 } : { x: pulse.line, y: point, age: 0 });
        }

        const tail = pulse.at - Math.sign(pulse.speed) * pulse.length;
        const [x1, y1, x2, y2] = pulse.horizontal ? [tail, pulse.line, pulse.at, pulse.line] : [pulse.line, tail, pulse.line, pulse.at];
        const peak = (pulse.bright ? 1 : 0.75) * (calm ? 0.45 : 1);

        const halo = context.createLinearGradient(x1, y1, x2, y2);
        halo.addColorStop(0, "rgba(255,255,255,0)");
        halo.addColorStop(1, `rgba(255,255,255,${0.55 * peak})`);
        context.strokeStyle = halo;
        context.lineWidth = calm ? 4 : 16;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();

        const core = context.createLinearGradient(x1, y1, x2, y2);
        core.addColorStop(0, "rgba(255,255,255,0)");
        core.addColorStop(1, `rgba(255,255,255,${peak})`);
        context.strokeStyle = core;
        context.lineWidth = calm ? 1.2 : 2.8;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();

        const head = context.createRadialGradient(x2, y2, 0, x2, y2, calm ? 9 : 28);
        head.addColorStop(0, `rgba(255,255,255,${0.9 * peak})`);
        head.addColorStop(0.3, `rgba(255,255,255,${0.65 * peak})`);
        head.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = head;
        context.beginPath();
        context.arc(x2, y2, calm ? 9 : 28, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgba(255,255,255,${peak})`;
        context.beginPath();
        context.arc(x2, y2, calm ? 1.6 : 4, 0, Math.PI * 2);
        context.fill();
      }

      // sparks: a ring that opens and fades
      context.lineWidth = 2;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.age += dt / 0.9;
        if (spark.age >= 1) { sparks.splice(i, 1); continue; }
        context.strokeStyle = `rgba(255,255,255,${1 * (1 - spark.age)})`;
        context.beginPath();
        context.arc(spark.x, spark.y, 3 + spark.age * 30, 0, Math.PI * 2);
        context.stroke();
      }
      context.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || broken || booting()) return;
      const raw = (now - previous) / 1000, dt = Math.min(0.05, raw);
      previous = now;
      // a drawing error here would otherwise stop the loop silently: stop deliberately, and keep the page usable
      try { draw(dt); } catch { broken = true; return; }
      // on a slow device, drop to one pixel per pixel and fewer pulses rather than stutter
      if (!degraded) { slow = raw > 0.032 ? slow + 1 : Math.max(0, slow - 1); if (slow > 24) { degraded = true; resize(); } }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || !visible || document.hidden || broken || booting()) return;
      if (reduced.matches) { draw(0); return; }
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onPointer = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.moved = pointer.time;
    };
    const onResize = () => { resize(); if (reduced.matches) draw(0); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); });
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", start);
    const bootWatch = new MutationObserver(start);
    bootWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-boot"] });
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      bootWatch.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", start);
    };
  }, [calm]);

  return (
    <div className={calm ? "ambient is-calm" : "ambient"} aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
