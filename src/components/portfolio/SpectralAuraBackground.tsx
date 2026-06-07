"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function SpectralAuraBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const blobs = Array.from(root.querySelectorAll<HTMLElement>("[data-aura]"));
    const animations = blobs.map((blob, index) =>
      gsap.to(blob, {
        xPercent: index % 2 === 0 ? 8 : -7,
        yPercent: index % 2 === 0 ? -6 : 9,
        scale: index === 1 ? 1.08 : 0.96,
        rotation: index % 2 === 0 ? 10 : -12,
        duration: 11 + index * 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),
    );

    return () => {
      animations.forEach((animation) => animation.kill());
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="spectral-base" />
      <div data-aura className="spectral-aura spectral-aura-one" />
      <div data-aura className="spectral-aura spectral-aura-two" />
      <div data-aura className="spectral-aura spectral-aura-three" />
      <div data-aura className="spectral-aura spectral-aura-four" />
      <div className="spectral-vignette" />
    </div>
  );
}
