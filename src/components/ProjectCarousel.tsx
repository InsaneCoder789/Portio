"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProjects } from "@/features/portfolio/content";
import { coverSize, reel } from "@/features/portfolio/story";
import { projectSlug } from "@/lib/projects";

const items = reel.map((item) => ({ ...item, data: featuredProjects.find((project) => project.name === item.project)! }));
const count = items.length;
const TURN_MS = 2200;

/*
 * A five-card deck. The selected card sits raised in the middle; two neighbours on each side stand beside it,
 * a little smaller and turned slightly away. It keeps turning by itself for as long as it is on screen, and only
 * the pause button stops it. Each cover is shown whole: where its shape differs from the card, a blurred copy
 * of the same cover fills the gap.
 */
export default function ProjectCarousel() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null);
  const dragFrom = useRef<number | null>(null);
  const dragged = useRef(false);

  const turn = useCallback((by: number) => setActive((current) => (current + by + count) % count), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = playing && inView;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => turn(1), TURN_MS);
    return () => window.clearTimeout(timer);
  }, [running, active, turn]);

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") { event.preventDefault(); turn(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); turn(-1); }
  };
  const onDown = (event: PointerEvent) => { dragFrom.current = event.clientX; dragged.current = false; };
  const onUp = (event: PointerEvent) => {
    if (dragFrom.current === null) return;
    const moved = event.clientX - dragFrom.current;
    dragFrom.current = null;
    if (Math.abs(moved) > 40) { dragged.current = true; turn(moved < 0 ? 1 : -1); }
  };

  const current = items[active];

  return (
    <section id="work" className="work" ref={section} aria-labelledby="work-title" aria-roledescription="carousel" onKeyDown={onKey}>
      <div className="wrap work-head">
        <div>
          <h2 id="work-title">Selected work</h2>
          <p className="work-intro">Nine builds. Each one starts from a specific way things go wrong.</p>
        </div>
        <div className="work-controls">
          <p className="work-count"><b>{String(active + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}</p>
          <button type="button" className="round" onClick={() => turn(-1)} aria-label="Previous project">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" /></svg>
          </button>
          <button type="button" className="round" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause rotation" : "Resume rotation"}>
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l9 6-9 6z" /></svg>
            )}
          </button>
          <button type="button" className="round" onClick={() => turn(1)} aria-label="Next project">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" /></svg>
          </button>
        </div>
      </div>

      <div className="deck" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { dragFrom.current = null; }}>
        {items.map((item, index) => {
          let slot = index - active;
          if (slot > count / 2) slot -= count;
          if (slot < -count / 2) slot += count;
          const size = coverSize[item.data.preview] ?? [1600, 900];
          const shown = Math.abs(slot) <= 2;
          return (
            <button
              key={item.project}
              type="button"
              className={slot === 0 ? "deck-card is-front" : "deck-card"}
              style={{ "--slot": slot, "--far": Math.abs(slot) } as CSSProperties}
              onClick={() => { if (dragged.current) { dragged.current = false; return; } setActive(index); }}
              tabIndex={shown && slot !== 0 ? 0 : -1}
              aria-hidden={!shown}
              aria-label={slot === 0 ? `${item.project}, showing` : `Show ${item.project}`}
            >
              <span className="deck-frame">
                <Image className="deck-fill" src={item.data.preview} alt="" width={160} height={90} sizes="160px" loading="lazy" draggable={false} />
                <Image className="deck-cover" src={item.data.preview} alt="" width={size[0]} height={size[1]} sizes="(max-width: 900px) 72vw, 34vw" priority={index < 3} draggable={false} />
                {slot === 0 ? <i className={running ? "deck-timer is-running" : "deck-timer"} key={active} style={{ animationDuration: `${TURN_MS}ms` }} /> : null}
              </span>
              <span className="deck-label">
                <b>{item.project}</b>
                <small>{item.data.stack.slice(0, 2).join(", ")}</small>
              </span>
            </button>
          );
        })}
      </div>

      <div className="deck-dots" role="group" aria-label="Choose a project">
        {items.map((item, index) => (
          <button key={item.project} type="button" aria-label={`Show ${item.project}`} aria-current={index === active} onClick={() => setActive(index)}>
            <span />
          </button>
        ))}
      </div>

      <div className="wrap work-detail" key={current.project} aria-live={playing ? "off" : "polite"}>
        <h3>{current.statement}</h3>
        <div className="work-side">
          <p className="work-name">{current.project}</p>
          <p className="work-text">{current.detail}</p>
          <p className="work-stack">{current.data.stack.join(", ")}</p>
          <div className="work-acts">
            <Link className="btn" href={`/projects#${projectSlug(current.project)}`}>How {current.project} works</Link>
            <Link className="link" href="/projects">All {featuredProjects.length} projects</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
