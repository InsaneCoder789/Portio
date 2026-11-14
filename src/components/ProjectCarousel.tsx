"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProjects } from "@/features/portfolio/content";
import { coverSize, reel } from "@/features/portfolio/story";
import { projectSlug } from "@/lib/projects";

const items = reel.map((item) => ({ ...item, data: featuredProjects.find((project) => project.name === item.project)! }));
const count = items.length;
const TURN_MS = 1900;

/*
 * A plain card carousel. Three cover cards in a row: the selected one in the middle, one on its left, one on its
 * right. The row slides one card at a time and never ends; there is no tilt, fade or zoom. It keeps moving by
 * itself while on screen, and only the pause button stops it. The summary of the middle project sits underneath;
 * the full write-up is on the projects page.
 */
export default function ProjectCarousel() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [hold, setHold] = useState(false); // the pointer is over it, or the keyboard is in it: leave it alone
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

  const running = playing && inView && !hold;
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
    <section
      id="work" className="band work" ref={section} aria-labelledby="work-title" aria-roledescription="carousel" onKeyDown={onKey}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHold(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setHold(false); }}
      onFocus={(event) => { if (event.target.matches(":focus-visible")) setHold(true); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHold(false); }}
    >
      <div className="wrap">
        <header className="head">
          <div>
            <h2 id="work-title">Selected work</h2>
            <p>Nine builds. Each one starts from a specific way things go wrong.</p>
          </div>
          <div className="controls">
            <p className="count"><b>{String(active + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}</p>
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
        </header>
      </div>

      <div className="strip" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { dragFrom.current = null; }}>
        {items.map((item, index) => {
          let slot = index - active;
          if (slot > count / 2) slot -= count;
          if (slot < -count / 2) slot += count;
          const size = coverSize[item.data.preview] ?? [1600, 900];
          const near = Math.abs(slot) <= 2;
          return (
            <button
              key={item.project}
              type="button"
              className={`strip-card${slot === 0 ? " is-front" : ""}${near ? "" : " is-far"}`}
              style={{ "--slot": slot } as CSSProperties}
              onClick={() => { if (dragged.current) { dragged.current = false; return; } setActive(index); }}
              tabIndex={Math.abs(slot) === 1 ? 0 : -1}
              aria-hidden={Math.abs(slot) > 1}
              aria-label={slot === 0 ? `${item.project}, showing` : `Show ${item.project}`}
            >
              <span className="strip-frame">
                <Image className="strip-fill" src={item.data.preview} alt="" width={160} height={90} sizes="160px" loading="lazy" draggable={false} />
                <Image className="strip-cover" src={item.data.preview} alt="" width={size[0]} height={size[1]} sizes="(max-width: 900px) 78vw, 34vw" priority={index < 2 || index === count - 1} draggable={false} />
              </span>
              <span className="strip-label">
                <b>{item.project}</b>
                <small>{item.data.stack.slice(0, 2).join(", ")}</small>
              </span>
            </button>
          );
        })}
      </div>

      <div className="wrap">
        <div className="card summary" key={current.project} aria-live={playing ? "off" : "polite"}>
          <div>
            <p className="summary-name">{current.project}</p>
            <h3>{current.statement}</h3>
          </div>
          <div className="summary-side">
            <p>{current.detail}</p>
            <ul className="tags">
              {current.data.stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="acts">
              <Link className="btn" href={`/projects#${projectSlug(current.project)}`}>The full project</Link>
              <Link className="link" href="/projects">All {featuredProjects.length} projects</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
