"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const items = [
  ["About", "/#about", "On this page"],
  ["Experience", "/#experience", "On this page"],
  ["Work", "/#work", "On this page"],
  ["GitHub", "/#github", "On this page"],
  ["Profile", "/about", "Page"],
  ["Projects", "/projects", "Page"],
  ["Résumés", "/resumes", "Page"],
  ["Contact", "/#contact", "On this page"],
];

// Clear over the hero, a solid black strip once the page has scrolled.
// On phones the links fold into a Menu button that opens them as a full-screen sheet.
export default function TopBar({ solid: alwaysSolid = false }: { solid?: boolean }) {
  const [solid, setSolid] = useState(alwaysSolid);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alwaysSolid) return;
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [alwaysSolid]);

  // While the sheet is open the page behind it stays put, and Escape closes it.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const wide = window.matchMedia("(min-width: 821px)");
    const onWide = () => { if (wide.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <header className={`top${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
        <Link className="mark" href="/#top" aria-label="Rohan Chatterjee, back to top" onClick={() => setOpen(false)}>
          <span className="mark-full">Rohan Chatterjee</span>
          <span className="mark-short" aria-hidden="true">Rohan</span>
        </Link>
        <nav aria-label="Sections">
          {items.map(([label, href]) => (
            <Link key={label} href={href} className={label === "Contact" ? "nav-pill" : undefined}>{label}</Link>
          ))}
        </nav>
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="menu-sheet" onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div id="menu-sheet" className={open ? "menu-sheet is-open" : "menu-sheet"} aria-hidden={!open}>
        <nav aria-label="Menu">
          {items.map(([label, href, where]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
              <span>{where}</span>
            </Link>
          ))}
        </nav>
        <p>Rohan Chatterjee. Backend, full-stack and Android.</p>
      </div>
    </>
  );
}
