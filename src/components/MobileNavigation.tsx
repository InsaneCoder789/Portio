"use client";

import { useEffect, useRef } from "react";
import { X, ArrowUpRight } from "lucide-react";

type Props = {
  open: boolean;
  instant: boolean;
  items: readonly (readonly [string, string])[];
  onClose: () => void;
};

export function MobileNavigation({ open, instant, items, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const desktop = window.matchMedia("(min-width: 1081px)");
    const resize = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", resize);
    return () => {
      desktop.removeEventListener("change", resize);
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <dialog ref={dialogRef} id="mobile-navigation" className="mobile-navigation-page" data-instant={instant || undefined}
      aria-labelledby="mobile-navigation-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <header className="mobile-navigation-head">
        <span>Rohan Chatterjee <small>Portfolio / Index</small></span>
        <button type="button" autoFocus aria-label="Close navigation menu" onClick={onClose}><X size={24} /></button>
      </header>
      <h2 id="mobile-navigation-title">Explore the portfolio.</h2>
      <nav aria-label="Mobile navigation">
        {items.map(([label, href], index) => (
          <a key={href} href={href} onClick={onClose}>
            <span className="mobile-navigation-number">0{index + 1}</span>
            <span>{label}</span><ArrowUpRight size={24} aria-hidden="true" />
          </a>
        ))}
      </nav>
      <footer>Engineering with intention.<br />Systems. Interfaces. Real-world work.</footer>
    </dialog>
  );
}
