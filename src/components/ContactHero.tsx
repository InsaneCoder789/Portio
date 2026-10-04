"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import "./ContactHero.css";
import { contactContent } from "@/features/portfolio/content";

type ContactHeroProps = {
  hero: {
    name?: string;
    role?: string;
    heroPrimary?: string;
    heroSecondary?: string;
  };
  theme: "light" | "dark";
  staticMode?: boolean;
};

export function ContactHero({ hero, theme, staticMode = false }: ContactHeroProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);
  const [supportsHoverMask, setSupportsHoverMask] = useState(false);
  const SIZE = 280;
  const marqueeTopText = "ENGINEERING SCALABLE SYSTEMS";
  const marqueeBottomText = "PRODUCT DESIGN MARKETING WEB DESIGN";
  const primaryImage = (theme === "light" ? hero.heroPrimary : hero.heroSecondary) ?? "/transparent1.png";
  const secondaryImage = (theme === "light" ? hero.heroSecondary : hero.heroPrimary) ?? "/transparent2.png";
  const primaryMaskImage = primaryImage?.replace(/\.png$/i, "-fill-mask.png");
  const secondaryMaskImage = secondaryImage?.replace(/\.png$/i, "-fill-mask.png");

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    let visible = false;
    const sync = () => shell.toggleAttribute("data-motion-visible", visible && !document.hidden && !staticMode);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(shell);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [staticMode]);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const compactQuery = window.matchMedia("(max-width: 768px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncHoverSupport = () => {
      setSupportsHoverMask(!staticMode && !reducedQuery.matches && hoverQuery.matches && !compactQuery.matches);
      overlayRef.current?.style.setProperty("--r", "0px");
    };

    syncHoverSupport();
    hoverQuery.addEventListener("change", syncHoverSupport);
    compactQuery.addEventListener("change", syncHoverSupport);
    reducedQuery.addEventListener("change", syncHoverSupport);

    return () => {
      hoverQuery.removeEventListener("change", syncHoverSupport);
      compactQuery.removeEventListener("change", syncHoverSupport);
      reducedQuery.removeEventListener("change", syncHoverSupport);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [staticMode]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!supportsHoverMask) return;
    const rect = event.currentTarget.getBoundingClientRect();

    pendingPointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const pointer = pendingPointerRef.current;
      const overlay = overlayRef.current;
      if (!pointer || !overlay) return;

      overlay.style.setProperty("--mx", `${pointer.x}px`);
      overlay.style.setProperty("--my", `${pointer.y}px`);
    });
  };

  const handleEnter = () => {
    const overlay = overlayRef.current;
    if (overlay) overlay.style.setProperty("--r", `${SIZE / 2}px`);
  };

  const handleLeave = () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    pendingPointerRef.current = null;
    const overlay = overlayRef.current;
    if (overlay) overlay.style.setProperty("--r", "0px");
  };

  return (
    <section id="contact" className="chapter contact-portrait" aria-labelledby="contact-portrait-title" data-theme={theme}>
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
        <div className="hero-framer-surface" aria-hidden="true" />
        <div className="hero-contour-lines" aria-hidden="true" />
        <div className="hero-center-line" aria-hidden="true" />

        <h2 id="contact-portrait-title" className="hero-signature">
          <span>{hero.name?.split(" ")[0] ?? "Rohan"}</span>
          <strong>{hero.name?.split(" ").slice(1).join(" ") || "Chatterjee"}</strong>
        </h2>

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

        <div className="hero-mask-stage">
          <div
            className="hero-mask-container"
          >
            <div
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
              <Image
                src={primaryImage}
                alt={hero.name ?? "Rohan Chatterjee"}
                width={1536}
                height={1536}
                className="hero-mask-image hero-mask-primary"
                sizes="(max-width: 768px) 100vw, 65vw"
                unoptimized={supportsHoverMask}
                loading="lazy"
                decoding="async"
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
                  <Image
                    src={secondaryImage}
                    alt=""
                    aria-hidden="true"
                    width={1536}
                    height={1536}
                    className="hero-mask-image hero-mask-secondary"
                    sizes="(max-width: 768px) 100vw, 65vw"
                    unoptimized
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="contact-hero-caption">
          <p>Code · Create · Collaborate.</p>
          <a href={`mailto:${contactContent.email}`}>Start a conversation ↗</a>
          <a href="/Rohan_Chatterjee_Resume.pdf" target="_blank" rel="noreferrer">Download résumé ↗</a>
        </div>
      </div>
    </section>
  );
}
