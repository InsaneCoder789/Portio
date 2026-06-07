"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const revealed = Boolean(reduceMotion || isInView);

  return (
    <div ref={headerRef} className="section-header max-w-3xl space-y-4">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={revealed ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="section-header-eyebrow text-[0.68rem] uppercase tracking-[0.4em] text-sky-200/55"
      >
        {eyebrow}
      </motion.p>
      <div className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
          animate={revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="section-header-title font-['Outfit'] text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="section-header-description max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}
