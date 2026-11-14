"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LegalLinks from "@/components/LegalLinks";

const PLACES = [
  ["Front page", "/", "The short version of everything"],
  ["Projects", "/projects", "All nine, in full"],
  ["Profile", "/about", "Timeline, stack and how I build"],
  ["Résumés", "/resumes", "Backend and Android, side by side"],
] as const;

/*
 * The 404. It is dark, and the visitor carries the light: a torch follows the pointer (or sits in the middle on a phone)
 * and shows a grid of depth marks. The page says what was asked for, where to go instead, and how to report the link.
 */
export default function Lost({ email }: { email: string }) {
  const stage = useRef<HTMLElement>(null);
  const path = usePathname();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    let frame = 0, x = 0, y = 0;
    const apply = () => { frame = 0; el.style.setProperty("--lx", `${x}px`); el.style.setProperty("--ly", `${y}px`); };
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      x = event.clientX - box.left; y = event.clientY - box.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    el.addEventListener("pointermove", move, { passive: true });
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, []);

  const subject = encodeURIComponent("Broken link on your site");
  const body = encodeURIComponent(`I reached a page that does not exist: ${path}\n\nI got there from: `);

  return (
    <section ref={stage} className="lost2" aria-labelledby="lost-title">
      <div className="lost2-grid" aria-hidden="true" />
      <div className="lost2-glow" aria-hidden="true" />
      <div className="wrap lost2-body">
        <p className="lost2-code" aria-hidden="true">4<span>0</span>4</p>
        <h1 id="lost-title">Nothing down here.</h1>
        <p className="sub-lead">
          There is no page at this address. It may have been mistyped, or the page may have moved.{" "}
          {fine ? "It is dark down here: move your light around, or pick somewhere that exists." : "Pick somewhere that exists."}
        </p>
        <p className="lost2-asked"><span>You asked for</span><code>{path}</code></p>

        <nav className="bento lost2-places" aria-label="Places that exist">
          {PLACES.map(([label, href, note]) => (
            <Link key={href} href={href} className="card s3">
              <b>{label}</b>
              <span>{note}</span>
            </Link>
          ))}
        </nav>

        <div className="acts">
          <button type="button" className="btn" onClick={() => window.history.back()}>Go back</button>
          <a className="link" href={`mailto:${email}?subject=${subject}&body=${body}`}>Report this link</a>
          <Link className="link" href="/#contact">Get in touch</Link>
        </div>
        <LegalLinks />
      </div>
    </section>
  );
}
