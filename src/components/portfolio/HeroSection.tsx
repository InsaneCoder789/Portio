"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { contactContent } from "@/features/portfolio/content";

type HeroSectionProps = {
  hero: {
    name?: string;
    role?: string;
    heroPrimary?: string;
    heroSecondary?: string;
  };
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function HeroSection({ hero, theme, onToggleTheme }: HeroSectionProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingPointerRef = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null);
  const frameRef = useRef<number | null>(null);
  const [supportsHoverMask, setSupportsHoverMask] = useState(false);
  const SIZE = 280;
  const marqueeTopText = "ENGINEERING SCALABLE SYSTEMS";
  const marqueeBottomText = "PRODUCT DESIGN MARKETING WEB DESIGN";
  const primaryImage = theme === "light" ? hero.heroPrimary : hero.heroSecondary;
  const secondaryImage = theme === "light" ? hero.heroSecondary : hero.heroPrimary;
  const primaryMaskImage = primaryImage?.replace(/\.png$/i, "-fill-mask.png");
  const secondaryMaskImage = secondaryImage?.replace(/\.png$/i, "-fill-mask.png");

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const compactQuery = window.matchMedia("(max-width: 768px)");
    const syncHoverSupport = () => setSupportsHoverMask(hoverQuery.matches && !compactQuery.matches);

    syncHoverSupport();
    hoverQuery.addEventListener("change", syncHoverSupport);
    compactQuery.addEventListener("change", syncHoverSupport);

    return () => {
      hoverQuery.removeEventListener("change", syncHoverSupport);
      compactQuery.removeEventListener("change", syncHoverSupport);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    pendingPointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      clientX: event.clientX,
      clientY: event.clientY,
    };

    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const pointer = pendingPointerRef.current;
      const overlay = overlayRef.current;
      const shell = shellRef.current;
      if (!pointer || !overlay) return;

      overlay.style.setProperty("--mx", `${pointer.x}px`);
      overlay.style.setProperty("--my", `${pointer.y}px`);
      if (shell) {
        shell.style.setProperty("--mx", `${pointer.clientX}px`);
        shell.style.setProperty("--my", `${pointer.clientY}px`);
      }
    });
  };

  const handleEnter = () => {
    const overlay = overlayRef.current;
    if (overlay) overlay.style.setProperty("--r", `${SIZE / 2}px`);
  };

  const handleLeave = () => {
    const overlay = overlayRef.current;
    if (overlay) overlay.style.setProperty("--r", "0px");
  };

  return (
    <section id="about" className="mx-auto min-h-screen w-full px-0">
      <div
        ref={shellRef}
        className="hero-framer-shell"
        style={
          {
            ["--mx" as string]: "50%",
            ["--my" as string]: "50%",
          } as CSSProperties
        }
      >
        <div className="hero-framer-surface" />
        <div className="hero-contour-lines" />
        <div className="hero-center-line" aria-hidden="true" />

        <div className="hero-signature">
          <span>{hero.name?.split(" ")[0] ?? "Rohan"}</span>
          <strong>{hero.name?.split(" ").slice(1).join(" ") || "Chatterjee"}</strong>
        </div>

        <div className="hero-social-actions">
          <a href={contactContent.github} target="_blank" rel="noreferrer">
            Github
          </a>
          <a href={contactContent.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={contactContent.instagram} target="_blank" rel="noreferrer" className="hero-social-primary">
            Instagram
          </a>
          <button type="button" className="hero-theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            <img
              src={theme === "light" ? "/logos/theme/rcb-mark-blue.png" : "/logos/theme/mib-mark-gold.png"}
              alt=""
              aria-hidden="true"
              width={512}
              height={512}
              className="hero-theme-logo"
              draggable={false}
            />
          </button>
        </div>

        <div className="hero-scroll-lane hero-scroll-lane-faint" aria-hidden="true">
          <div className="hero-scroll-track">
            <div className="hero-scroll-group">
              <span>{marqueeTopText}</span>
              <span>{marqueeTopText}</span>
            </div>
            <div className="hero-scroll-group">
              <span>{marqueeTopText}</span>
              <span>{marqueeTopText}</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll-lane hero-scroll-lane-bold" aria-hidden="true">
          <div className="hero-scroll-track hero-scroll-track-slow">
            <div className="hero-scroll-group">
              <span>{marqueeBottomText}</span>
              <span>{marqueeBottomText}</span>
            </div>
            <div className="hero-scroll-group">
              <span>{marqueeBottomText}</span>
              <span>{marqueeBottomText}</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="hero-mask-stage"
        >
          <div
            className="hero-mask-container"
          >
            <div
              ref={containerRef}
              className="hero-mask-hitbox"
              onMouseMove={handleMove}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              style={
                {
                  ["--mx" as string]: "50%",
                  ["--my" as string]: "50%",
                  ["--r" as string]: "0px",
                } as CSSProperties
              }
            >
              <img
                src={primaryImage}
                alt={hero.name ?? "Rohan Chatterjee"}
                width={1536}
                height={1536}
                className="hero-mask-image hero-mask-primary"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                draggable={false}
              />
              {supportsHoverMask ? (
                <div
                  ref={overlayRef}
                  className="hero-mask-overlay"
                  style={
                    {
                      ["--mx" as string]: "50%",
                      ["--my" as string]: "50%",
                      ["--r" as string]: "0px",
                      ["--primary-mask-url" as string]: `url("${primaryMaskImage}")`,
                      ["--secondary-url" as string]: `url("${secondaryImage}")`,
                      ["--secondary-mask-url" as string]: `url("${secondaryMaskImage}")`,
                    } as CSSProperties
                  }
                >
                  <img
                    src={secondaryImage}
                    alt=""
                    aria-hidden="true"
                    width={1536}
                    height={1536}
                    className="hero-mask-image hero-mask-secondary"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
