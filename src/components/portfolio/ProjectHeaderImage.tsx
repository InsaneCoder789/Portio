"use client";

import { useState } from "react";

type ProjectHeaderImageProps = {
  src: string;
  alt: string;
  position?: string;
};

export function ProjectHeaderImage({
  src,
  alt,
  position = "center center",
}: ProjectHeaderImageProps) {
  const [available, setAvailable] = useState(true);

  if (!available) {
    return (
      <div
        className="relative min-h-52 w-full border-b border-white/10 bg-[linear-gradient(135deg,rgba(205,33,42,0.12),rgba(26,34,56,0.82)_44%,rgba(255,215,0,0.08))]"
        aria-hidden="true"
      />
    );
  }

  return (
    <figure className="group relative w-full overflow-hidden border-b border-white/10 bg-slate-950/40">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setAvailable(false)}
        className="block h-auto w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.008]"
        style={{ objectPosition: position }}
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
    </figure>
  );
}
