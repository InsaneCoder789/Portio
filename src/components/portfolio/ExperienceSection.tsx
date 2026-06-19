"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, MapPin, Sparkles } from "lucide-react";
import type { ExperienceItem } from "@/data/linkedin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/portfolio/SectionHeader";

type ExperienceSectionProps = {
  items: ExperienceItem[];
};

const riseTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

const supportingMetrics = [
  {
    label: "Operating lanes",
    value: "Frontend, Android, systems",
  },
  {
    label: "Work rhythm",
    value: "Shipping while scaling taste",
  },
  {
    label: "Environment mix",
    value: "Internships, orgs, platform ownership",
  },
];

function summarizeExperience(item: ExperienceItem) {
  return item.points?.[0] ?? item.description ?? `${item.role} at ${item.company}`;
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeItem = items[selectedIndex] ?? items[0];

  return (
    <section id="experience" className="w-full">
      <div className="section-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <SectionHeader
          eyebrow="02 / Experience"
          title="A role reel shaped around environments that sharpened execution."
          description="Instead of reading like a timeline, this section behaves like a live operating atlas: each role shows what changed in the way I build, lead, and turn product pressure into something ship-ready."
        />

        <div className="experience-atlas mt-12 grid gap-8 xl:grid-cols-[minmax(0,1.16fr)_22rem]">
          <motion.div
            initial={{ opacity: 0.72, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.18 }}
            transition={riseTransition}
            className="experience-atlas-shell rounded-[2rem] p-2"
          >
            <Card className="experience-stage-card overflow-hidden border-0">
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeItem.company}-${activeItem.role}`}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                    transition={riseTransition}
                    className="grid gap-8 px-6 py-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8 lg:py-8"
                  >
                    <div className="experience-brand-column flex flex-col gap-5">
                      <div className="experience-brand-mark flex items-start justify-between gap-4">
                        <span className="font-mono text-[0.64rem] uppercase tracking-[0.34em] text-sky-600/80 dark:text-amber-200/85">
                          {String(selectedIndex + 1).padStart(2, "0")}
                        </span>
                        <Badge
                          variant="outline"
                          className="experience-floating-badge rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]"
                        >
                          {activeItem.type}
                        </Badge>
                      </div>

                      <div className="experience-logo-capsule flex h-40 w-full items-center justify-center rounded-[2rem] p-6">
                        <img
                          src={activeItem.logo}
                          alt={activeItem.company}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="experience-meta-grid grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <div className="experience-meta-row flex items-center gap-2">
                          <BriefcaseBusiness className="h-4 w-4 shrink-0" />
                          <span>{activeItem.duration}</span>
                        </div>
                        <div className="experience-meta-row flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>
                            {activeItem.location} · {activeItem.mode}
                          </span>
                        </div>
                      </div>

                      <div className="experience-stage-signals grid gap-3">
                        {supportingMetrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="experience-stage-signal rounded-[1.35rem] px-4 py-4"
                          >
                            <p className="text-[0.58rem] uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                              {metric.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-200">
                              {metric.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="experience-stage-copy flex flex-col gap-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="experience-floating-badge rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]"
                        >
                          {activeItem.company}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="experience-floating-badge rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]"
                        >
                          {activeItem.mode}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-['Outfit'] text-3xl font-semibold tracking-[-0.07em] text-slate-950 dark:text-white sm:text-4xl lg:text-[3.35rem]">
                          {activeItem.role}
                        </h3>
                        <p className="max-w-3xl text-base leading-8 text-slate-700 dark:text-slate-300">
                          {summarizeExperience(activeItem)}
                        </p>
                      </div>

                      <Separator className="bg-black/10 dark:bg-white/10" />

                      <div className="grid gap-3">
                        {(activeItem.points ?? []).slice(1).map((point, index) => (
                          <motion.div
                            key={point}
                            initial={{ opacity: 0.68, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...riseTransition, delay: 0.05 + index * 0.05 }}
                            className="experience-stage-point rounded-[1.35rem] px-4 py-4"
                          >
                            <div className="flex gap-3">
                              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-sky-600 dark:text-amber-200" />
                              <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{point}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {!!activeItem.skills?.length && (
                        <div className="flex flex-wrap gap-2">
                          {activeItem.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="experience-skill-chip rounded-full px-3 py-1 text-[0.64rem] uppercase tracking-[0.24em]"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.72, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ ...riseTransition, delay: 0.06 }}
            className="experience-selector-column flex flex-col gap-4"
          >
            <div className="experience-selector-shell rounded-[2rem] p-2">
              <Card className="experience-selector-card border-0">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <div className="flex items-center gap-3 text-sky-600 dark:text-amber-200">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-[0.62rem] uppercase tracking-[0.32em]">Role selector</p>
                  </div>

                  <div className="grid gap-3">
                    {items.map((item, index) => {
                      const active = index === selectedIndex;

                      return (
                        <button
                          key={`${item.company}-${item.role}`}
                          type="button"
                          onClick={() => setSelectedIndex(index)}
                          className={`experience-selector-card-button ${active ? "is-active" : ""}`}
                        >
                          <div className="experience-selector-card-top">
                            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <Badge
                              variant="outline"
                              className="experience-selector-badge rounded-full px-2.5 py-0.5 text-[0.56rem] uppercase tracking-[0.24em]"
                            >
                              {item.type}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="font-['Outfit'] text-xl font-semibold tracking-[-0.05em]">
                              {item.company}
                            </p>
                            <p className="text-sm leading-6 opacity-80">{item.role}</p>
                          </div>

                          <div className="flex items-center justify-between gap-4 text-[0.62rem] uppercase tracking-[0.24em] opacity-70">
                            <span>{item.mode}</span>
                            <span>{item.duration}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="experience-rail-actions flex items-center gap-3 overflow-x-auto pb-1">
              {items.map((item, index) => {
                const active = index === selectedIndex;

                return (
                  <Button
                    key={`pill-${item.company}`}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedIndex(index)}
                    className={`experience-company-pill rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-[0.28em] ${
                      active ? "is-active" : ""
                    }`}
                  >
                    {item.company}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
