"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const [spy, setSpy] = useState("");
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  // Which section of the front page is on screen, so the bar can say where you are.
  useEffect(() => {
    if (pathname !== "/") { setSpy(""); return; }
    const ids = items.filter(([, href]) => href.startsWith("/#")).map(([, href]) => href.slice(2));
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) { if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio); else visible.delete(entry.target.id); }
      const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
      setSpy(best ? best[0] : "");
    }, { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.1, 0.3, 0.6] });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const current = (href: string): "page" | "location" | undefined => {
    if (href.startsWith("/#")) return pathname === "/" && spy === href.slice(2) ? "location" : undefined;
    return pathname === href ? "page" : undefined;
  };

  useEffect(() => {
    if (alwaysSolid) return;
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [alwaysSolid]);

  // While the sheet is open the page behind it stays put, focus stays inside it, and Escape closes it and gives focus back.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const links = () => [button.current, ...Array.from(sheet.current?.querySelectorAll<HTMLElement>("a") ?? [])].filter((el): el is HTMLElement => !!el);
    requestAnimationFrame(() => sheet.current?.querySelector<HTMLElement>("a")?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); return; }
      if (event.key !== "Tab") return;
      const all = links(), first = all[0], last = all[all.length - 1], active = document.activeElement;
      if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    };
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
            <Link key={label} href={href} aria-current={current(href)} className={label === "Contact" ? "nav-pill" : undefined}>{label}</Link>
          ))}
        </nav>
        <button ref={button} type="button" className="menu-btn" aria-expanded={open} aria-controls="menu-sheet" onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div ref={sheet} id="menu-sheet" className={open ? "menu-sheet is-open" : "menu-sheet"} aria-hidden={!open}>
        <nav aria-label="Menu">
          {items.map(([label, href, where]) => (
            <Link key={label} href={href} prefetch={false} aria-current={current(href)} onClick={() => setOpen(false)}>
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
