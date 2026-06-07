"use client";

import { useEffect } from "react";

type CinematicBootScreenProps = {
  onComplete: () => void;
  staticMode?: boolean;
};

const BOOT_SESSION_KEY = "portfolio-cinematic-boot-played";

export function CinematicBootScreen({ onComplete, staticMode = false }: CinematicBootScreenProps) {
  useEffect(() => {
    if (staticMode) {
      onComplete();
      return;
    }

    if (window.sessionStorage.getItem(BOOT_SESSION_KEY) === "true") {
      onComplete();
      return;
    }

    const previousOverflow = document.documentElement.style.overflow;
    const previousScrollRestoration = window.history.scrollRestoration;
    document.documentElement.style.overflow = "hidden";
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, "true");
      onComplete();
    }, reducedMotion ? 180 : 4500);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = previousOverflow;
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [onComplete, staticMode]);

  return (
    <div className="cinematic-boot" role="status" aria-label="Opening Rohan Chatterjee's portfolio">
      <p className="cinematic-boot-name">Rohan Chatterjee</p>
      <div className="cinematic-boot-stage" aria-hidden="true">
        <div className="cinematic-boot-outline">
          <img src="/transparent1.png" alt="" width={1536} height={1536} draggable={false} />
        </div>
        <div className="cinematic-boot-fill">
          <img src="/transparent1.png" alt="" width={1536} height={1536} draggable={false} />
        </div>
      </div>
    </div>
  );
}
