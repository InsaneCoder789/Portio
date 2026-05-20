import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  vx: number;
  vy: number;
};

type ParticleBackgroundProps = {
  className?: string;
  zIndex?: number;
  densityDesktop?: number;
  densityMobile?: number;
  maxParticles?: number;
  lineDistance?: number;
  mouseRadius?: number;
  disableLinesOnMobile?: boolean;
};

const MOBILE_BREAKPOINT = 768;

const PRIMARY_RGB = "77, 163, 255";
const GLOW_RGB = "111, 194, 255";

export default function ParticleBackground({
  className = "",
  zIndex = 0,
  densityDesktop = 18000,
  densityMobile = 26000,
  maxParticles = 72,
  lineDistance = 96,
  mouseRadius = 132,
  disableLinesOnMobile = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let animationFrameId = 0;
    let lastFrameTime = 0;
    let width = 0;
    let height = 0;
    let isMobile = false;
    let isPageVisible = !document.hidden;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < MOBILE_BREAKPOINT;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      mouse.x = width / 2;
      mouse.y = height / 2;
      mouse.targetX = mouse.x;
      mouse.targetY = mouse.y;

      const density = isMobile ? densityMobile : densityDesktop;
      const count = Math.min(Math.floor((width * height) / density), maxParticles);

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        baseSize: Math.random() * 1.7 + 0.9,
        size: 0,
        vx: (Math.random() - 0.5) * 0.33,
        vy: (Math.random() - 0.5) * 0.33,
      })).map((particle) => ({ ...particle, size: particle.baseSize }));
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.targetX = event.clientX;
      mouse.targetY = event.clientY;
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        lastFrameTime = 0;
      }
    };

    const animate = (timestamp: number) => {
      animationFrameId = window.requestAnimationFrame(animate);
      if (!isPageVisible) return;
      if (lastFrameTime && timestamp - lastFrameTime < 33) return;
      lastFrameTime = timestamp;

      context.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      const mouseRadiusSq = mouseRadius * mouseRadius;
      const lineDistanceSq = lineDistance * lineDistance;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distanceSq = dx * dx + dy * dy;
        const isNearMouse = distanceSq < mouseRadiusSq;
        const targetSize = isNearMouse ? particle.baseSize * 2.8 : particle.baseSize;

        particle.size += (targetSize - particle.size) * (isNearMouse ? 0.12 : 0.06);

        context.fillStyle = `rgba(${PRIMARY_RGB}, ${isNearMouse ? 0.9 : 0.72})`;
        context.shadowBlur = isNearMouse ? 6 : 3;
        context.shadowColor = `rgba(${GLOW_RGB}, ${isNearMouse ? 0.42 : 0.14})`;
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
        context.shadowBlur = 0;

        if (disableLinesOnMobile && isMobile) continue;

        for (let j = i + 1; j < particles.length; j += 1) {
          const neighbor = particles[j];
          const lineDx = particle.x - neighbor.x;
          const lineDy = particle.y - neighbor.y;
          const lineDistanceCurrentSq = lineDx * lineDx + lineDy * lineDy;

          if (lineDistanceCurrentSq < lineDistanceSq) {
            const opacity = 0.28 * (1 - lineDistanceCurrentSq / lineDistanceSq);
            context.beginPath();
            context.strokeStyle = `rgba(${PRIMARY_RGB}, ${opacity})`;
            context.lineWidth = 0.65;
            context.moveTo(particle.x, particle.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.stroke();
          }
        }
      }

    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    densityDesktop,
    densityMobile,
    disableLinesOnMobile,
    lineDistance,
    maxParticles,
    mouseRadius,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-background fixed inset-0 pointer-events-none ${className}`.trim()}
      style={{ zIndex, transform: "translateZ(0)" }}
    />
  );
}
