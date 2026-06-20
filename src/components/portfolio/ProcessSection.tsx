"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChartNoAxesColumn, Layers3, Sparkles, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import type { SkillItem } from "@/components/portfolio/types";

type ProcessSectionProps = {
  skills: SkillItem[];
  benchmarks: Array<{ name: string; value: number }>;
};

const riseTransition = {
  duration: 0.82,
  ease: [0.22, 1, 0.36, 1] as const,
};

const buildSteps = [
  {
    title: "Read the product pressure first",
    copy: "I start by identifying what the interface or system is actually under pressure to do: handle complexity, reduce uncertainty, increase trust, or support repeated operations cleanly.",
  },
  {
    title: "Model states before styling outcomes",
    copy: "Once the pressure is clear, I map states, ownership boundaries, and data contracts so the visual layer rests on something stable instead of carrying hidden ambiguity.",
  },
  {
    title: "Prototype the failure-prone lane",
    copy: "I test the most fragile interaction, integration path, or system assumption first, because the fastest way to improve quality is to challenge the part most likely to break.",
  },
  {
    title: "Turn patterns into reusable surfaces",
    copy: "After the risky path settles, I compress what works into reusable components, typed interfaces, and UI rules that reduce drift across the rest of the build.",
  },
  {
    title: "Tune for real usage conditions",
    copy: "Responsiveness, empty states, degraded devices, latency, and imperfect flows are part of the build process, not a cleanup pass that happens after the visual layer is done.",
  },
  {
    title: "Ship with a documented next move",
    copy: "A good release should explain itself. I try to leave behind enough structure and reasoning that the next contributor can extend the work without guessing.",
  },
];

const deliveryDoctrines = [
  "Interfaces should stay readable under pressure, not only in polished screenshots.",
  "Components are more useful when they preserve intent as well as appearance.",
  "Architecture is part of user experience because unclear systems eventually leak into the product.",
  "Taste matters most when it strengthens trust, hierarchy, and clarity instead of decoration.",
];

function SkillChip({ skill }: { skill: SkillItem }) {
  return (
    <div className="process-skill-chip inline-flex items-center gap-3 rounded-[1.25rem] px-4 py-3">
      <div className="process-skill-icon flex size-10 items-center justify-center rounded-2xl">
        {skill.logo ? (
          <img src={skill.logo} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
        ) : (
          <span className="font-['Outfit'] text-sm font-semibold tracking-[-0.04em]">
            {skill.label.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-['Outfit'] text-lg font-semibold tracking-[-0.05em] text-white">
          {skill.label}
        </p>
        <p className="text-[0.58rem] uppercase tracking-[0.26em] text-slate-300">
          {skill.count ? `${skill.count} repos` : "core lane"}
        </p>
      </div>
    </div>
  );
}

function SkillsMarquee({
  skills,
  direction,
}: {
  skills: SkillItem[];
  direction: "forward" | "reverse";
}) {
  const repeated = [...skills, ...skills];

  return (
    <div className="process-marquee-shell overflow-hidden rounded-[1.9rem] p-2">
      <div className={`process-marquee-track ${direction === "reverse" ? "is-reverse" : ""}`}>
        {repeated.map((skill, index) => (
          <div key={`${direction}-${skill.label}-${index}`} className="process-marquee-item">
            <SkillChip skill={skill} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProcessSection({ skills, benchmarks }: ProcessSectionProps) {
  const firstLane = skills.slice(0, Math.ceil(skills.length / 2));
  const secondLane = skills.slice(Math.ceil(skills.length / 2));

  return (
    <section id="process" className="w-full">
      <div className="section-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <SectionHeader
          eyebrow="05 / Process"
          title="A capability system that feels alive instead of reading like a static toolkit list."
          description="This section is now built around motion, repetition, and delivery logic. The stack moves like a product surface, while the process beneath it explains how ideas are structured, pressure-tested, and shipped with clarity."
        />

        <div className="mt-12 grid gap-5">
          <motion.div
            initial={{ opacity: 0.72, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={riseTransition}
            className="grid gap-4"
          >
            <div className="flex items-center gap-3 text-sky-600 dark:text-amber-200">
              <Layers3 className="h-4 w-4" />
              <p className="text-[0.62rem] uppercase tracking-[0.32em]">Capability transmission</p>
            </div>
            <SkillsMarquee skills={firstLane} direction="forward" />
            <SkillsMarquee skills={secondLane} direction="reverse" />
          </motion.div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]">
            <motion.div
              initial={{ opacity: 0.72, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ ...riseTransition, delay: 0.05 }}
              className="process-column-shell rounded-[2rem] p-2"
            >
              <Card className="process-story-card border-0">
                <CardHeader className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 text-sky-600 dark:text-amber-200">
                    <Workflow className="h-4 w-4" />
                    <p className="text-[0.62rem] uppercase tracking-[0.32em]">How I build</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_15rem]">
                    <div className="space-y-4">
                      <CardTitle className="font-['Outfit'] text-4xl tracking-[-0.07em] text-white sm:text-5xl">
                        From ambiguity to something strong enough to ship repeatedly.
                      </CardTitle>
                      <CardDescription className="max-w-2xl text-base leading-8 text-slate-200">
                        I care less about collecting tools and more about building a repeatable system for making good technical decisions under real product pressure.
                      </CardDescription>
                    </div>

                    <div className="process-intent-panel rounded-[1.6rem] px-5 py-5">
                      <p className="text-[0.58rem] uppercase tracking-[0.32em] text-slate-300">
                        Repeated priorities
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["Clarity", "Trust", "Resilience", "Systems taste", "Reuse", "Performance"].map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="process-token-badge rounded-full px-3 py-1 text-[0.58rem] uppercase tracking-[0.24em]"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4">
                  {buildSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0.72, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.18 }}
                      transition={{ ...riseTransition, delay: 0.04 + index * 0.05 }}
                      className="process-step-shell rounded-[1.55rem] p-1.5"
                    >
                      <div className="process-step-card rounded-[calc(1.55rem-0.375rem)] px-5 py-5">
                        <div className="grid gap-4 md:grid-cols-[2.8rem_minmax(0,1fr)]">
                          <span className="font-mono text-[0.64rem] uppercase tracking-[0.32em] text-sky-600 dark:text-amber-200">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="space-y-2">
                            <h3 className="font-['Outfit'] text-2xl font-semibold tracking-[-0.05em] text-white">
                              {step.title}
                            </h3>
                            <p className="text-sm leading-7 text-slate-200">{step.copy}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0.72, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ ...riseTransition, delay: 0.08 }}
                className="process-column-shell rounded-[2rem] p-2"
              >
                <Card className="process-instruments-card border-0">
                  <CardHeader className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-sky-600 dark:text-amber-200">
                      <ChartNoAxesColumn className="h-4 w-4" />
                      <p className="text-[0.62rem] uppercase tracking-[0.32em]">Delivery instruments</p>
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="font-['Outfit'] text-3xl tracking-[-0.06em] text-white">
                        Confidence bands built from repetition, not guesswork.
                      </CardTitle>
                      <CardDescription className="text-base leading-8 text-slate-200">
                        These are the working lanes where repetition has become delivery confidence. The bars are intentionally thicker and more tactile so they read like instruments, not labels with percentages attached.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-5">
                    {benchmarks.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0.72, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.24 }}
                        transition={{ ...riseTransition, delay: 0.08 + index * 0.05 }}
                        className="space-y-3"
                      >
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-base text-white">{item.name}</p>
                            <p className="text-[0.58rem] uppercase tracking-[0.24em] text-slate-300">
                              Delivery depth
                            </p>
                          </div>
                          <strong className="font-['Outfit'] text-3xl tracking-[-0.05em] text-white">
                            {item.value}%
                          </strong>
                        </div>
                        <div className="process-benchmark-track relative h-5 overflow-hidden rounded-full">
                          <motion.div
                            className="process-benchmark-fill absolute inset-y-0 left-0 rounded-full"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: item.value / 100 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                              duration: 0.95,
                              delay: 0.14 + index * 0.06,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{ transformOrigin: "left center" }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0.72, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ ...riseTransition, delay: 0.11 }}
                className="process-column-shell rounded-[2rem] p-2"
              >
                <Card className="process-doctrine-card border-0">
                  <CardHeader className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-sky-600 dark:text-amber-200">
                      <Sparkles className="h-4 w-4" />
                      <p className="text-[0.62rem] uppercase tracking-[0.32em]">Delivery doctrine</p>
                    </div>
                    <CardTitle className="font-['Outfit'] text-3xl tracking-[-0.06em] text-white">
                      Reliable systems should still feel composed, intentional, and premium.
                    </CardTitle>
                    <CardDescription className="text-base leading-8 text-slate-200">
                      I don’t see structure and visual quality as trade-offs. The best products are usually the ones where architecture, responsiveness, and interface taste reinforce one another.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {deliveryDoctrines.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0.72, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.28 }}
                        transition={{ ...riseTransition, delay: 0.08 + index * 0.05 }}
                        className="process-doctrine-row rounded-[1.35rem] px-4 py-4"
                      >
                        <div className="flex gap-3">
                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-sky-600 dark:text-amber-200" />
                          <p className="text-sm leading-7 text-slate-200">{item}</p>
                        </div>
                      </motion.div>
                    ))}

                    <Separator className="bg-black/10 dark:bg-white/10" />

                    <div className="flex flex-wrap gap-2">
                      {["Maintainability", "Clarity", "Speed", "Reusability", "Product taste", "System trust"].map(
                        (tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="process-token-badge rounded-full px-3 py-1 text-[0.58rem] uppercase tracking-[0.24em]"
                          >
                            {tag}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
