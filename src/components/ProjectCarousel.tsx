"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Pause, Play } from "lucide-react";
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";
import Image from "next/image";
import { EmphasisText } from "@/components/EmphasisText";
import { carouselOffset } from "@/lib/carousel";

export type ProjectCard = {
  name: string;
  description: string;
  details: string;
  analysis?: string;
  challenge?: string;
  outcome?: string;
  learning?: string;
  preview?: string;
  stack: string[];
  githubUrl: string;
  homepage?: string | null;
  stars?: number;
  language?: string | null;
};

export function ProjectCarousel({ projects }: { projects: ProjectCard[] }) {
  const [active, setActive] = useState(0);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [activity, setActivity] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const indexRef = useRef<HTMLElement>(null);
  const selected = projects[active % projects.length];
  const advance = useCallback(() => {
    setInstant(false);
    setActive(index => (index + 1) % projects.length);
    setActivity(value => value + 1);
  }, [projects.length]);
  const { running, reducedMotion } = useCarouselAutoplay(stageRef, !paused && !keyboardFocus && projects.length > 1, activity, advance);
  useEffect(() => {
    const nav = indexRef.current;
    const button = nav?.querySelector<HTMLButtonElement>('button[aria-current="true"]');
    if (!nav || !button || nav.scrollWidth <= nav.clientWidth) return;
    const navRect = nav.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    nav.scrollTo({ left: nav.scrollLeft + buttonRect.left - navRect.left - (nav.clientWidth - buttonRect.width) / 2 });
  }, [active]);
  if (!selected) return null;

  const select = (index: number, keyboard = false) => {
    setInstant(keyboard);
    setActivity(value => value + 1);
    setActive((index + projects.length) % projects.length);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    select(event.key === "Home" ? 0 : event.key === "End" ? projects.length - 1 : active + (event.key === "ArrowRight" ? 1 : -1), true);
  };

  return (
    <section className={`project-carousel${instant ? " is-instant" : ""}`} aria-label="Selected project carousel" aria-roledescription="carousel"
      data-autoplay={running ? "running" : "idle"}
      onKeyDownCapture={() => setKeyboardFocus(true)}
      onFocusCapture={(event) => setKeyboardFocus(event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false); }}>
      <div className="project-carousel-toolbar">
        <p aria-live={running ? "off" : "polite"} aria-atomic="true"><span>{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span> {selected.name}</p>
        <div className="project-carousel-controls">
          {!reducedMotion && <button type="button" aria-label={paused ? "Resume project autoplay" : "Pause project autoplay"} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>}
          <button type="button" aria-label="Previous project" onClick={(e) => select(active - 1, e.detail === 0)}>←</button>
          <button type="button" aria-label="Next project" onClick={(e) => select(active + 1, e.detail === 0)}>→</button>
        </div>
      </div>
      <div ref={stageRef} className="project-carousel-stage" tabIndex={0} aria-label="Project deck. Use arrow keys to browse." onKeyDown={onKeyDown}
        onPointerDown={(e) => { gesture.current = { x: e.clientX, y: e.clientY }; swiped.current = false; }}
        onPointerCancel={() => { gesture.current = null; }}
        onPointerUp={(e) => {
          const start = gesture.current;
          gesture.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            swiped.current = true;
            select(active + (dx < 0 ? 1 : -1));
          }
        }}>
        {projects.map((project, index) => {
          const offset = carouselOffset(index, active, projects.length);
          const visible = Math.abs(offset) <= 2;
          return (
            <button key={project.githubUrl} type="button" className={`project-deck-card${offset === 0 ? " is-selected" : ""}`}
              style={{ "--slot": offset, "--distance": Math.abs(offset), zIndex: 5 - Math.abs(offset) } as CSSProperties}
              data-visible={visible} aria-hidden={!visible} tabIndex={offset === 0 ? 0 : -1}
              aria-label={`Show ${project.name}`} aria-pressed={offset === 0}
              onClick={(e) => { if (swiped.current) { swiped.current = false; return; } select(index, e.detail === 0); }}>
              <span className="project-deck-preview">
                {project.preview ? <Image src={project.preview} alt="" width={1600} height={900} sizes="(max-width: 720px) 70vw, (max-width: 1200px) 30vw, 24vw" draggable={false} unoptimized={project.preview.endsWith(".svg")} /> : null}
              </span>
              <span className="project-deck-label"><small>{String(index + 1).padStart(2, "0")}</small><strong>{project.name}</strong></span>
              <span className="project-deck-stack">{project.stack.slice(0, 2).join(" / ")}</span>
            </button>
          );
        })}
      </div>
      <nav ref={indexRef} className="project-carousel-index" aria-label="Choose a project">
        {projects.map((project, index) => <button key={project.githubUrl} type="button" aria-label={`Select ${project.name}`} aria-current={index === active ? "true" : undefined} onClick={(e) => select(index, e.detail === 0)}><span>{String(index + 1).padStart(2, "0")}</span>{project.name}</button>)}
      </nav>
      <article className="project-card project-selected-detail" aria-label={`${selected.name} case study`}>
        <div className="project-selected-summary">
          <div className="project-top"><span className="project-number">Selected system</span><a href={selected.githubUrl} target="_blank" rel="noreferrer">Repository ↗</a></div>
          <h3>{selected.name}</h3>
          <p className="project-description"><EmphasisText>{selected.description}</EmphasisText></p>
          <p className="project-details"><EmphasisText>{selected.details}</EmphasisText></p>
          {selected.analysis && <div className="project-brief-analysis"><span>Engineering analysis</span><p><EmphasisText>{selected.analysis}</EmphasisText></p><a href={`${selected.githubUrl}#readme`} target="_blank" rel="noreferrer">Explore the README ↗</a></div>}
          <div className="project-tags">{selected.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
          {selected.homepage ? <div className="project-links"><a href={selected.homepage} target="_blank" rel="noreferrer">Live ↗</a></div> : null}
        </div>
        <div className="project-case-study">
          {[["Challenge", selected.challenge], ["Implementation", selected.outcome], ["Design takeaway", selected.learning]].map(([label, copy]) => copy ? <div key={label}><span>{label}</span><p><EmphasisText>{copy.replace(/^Design takeaway: ([a-z])/, (_, initial: string) => initial.toUpperCase())}</EmphasisText></p></div> : null)}
        </div>
      </article>
    </section>
  );
}
