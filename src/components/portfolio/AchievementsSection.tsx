"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, BadgeCheck, Landmark, Mic2, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import type { AchievementEntry } from "@/features/portfolio/content";

type AchievementsSectionProps = {
  items: AchievementEntry[];
};

const riseTransition = {
  duration: 0.82,
  ease: [0.22, 1, 0.36, 1] as const,
};

const achievementIcons = [Trophy, Award, Sparkles, BadgeCheck, Mic2, Landmark];

const summarySignals = [
  { label: "Competitive outcomes", value: "02", note: "Ranked and podium finishes under timed pressure" },
  { label: "Leadership / service", value: "03", note: "Live coordination, public work, and student representation" },
  { label: "Creative execution", value: "01", note: "Stage presence, direction, and narrative ownership" },
];

export function AchievementsSection({ items }: AchievementsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const activeItem = items[selectedIndex] ?? items[0];

  return (
    <section id="achievements" className="w-full">
      <div className="section-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="liquid-blob liquid-blob-soft left-[-8rem] top-[10rem]" />
        <div className="liquid-blob liquid-blob-soft right-[-6rem] top-[28rem]" />

        <SectionHeader
          eyebrow="03 / Achievements"
          title="Public proof, pressure-tested outcomes, and leadership signals that read beyond code."
          description="This chapter now behaves like a swipeable proof dossier. Each card isolates one achievement so the section feels intentional, focused, and easy to read instead of spreading the story across an awkward grid."
        />

        <motion.div
          initial={{ opacity: 0.72, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={riseTransition}
          className="achievement-overview-shell mt-12 rounded-[2rem] p-2"
        >
          <Card className="achievement-overview-card border-0">
            <CardContent className="grid gap-8 px-6 py-6 lg:grid-cols-[minmax(0,1.12fr)_23rem] lg:px-8 lg:py-8">
              <div className="space-y-5">
                <Badge
                  variant="outline"
                  className="achievement-overview-badge rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]"
                >
                  Proof dossier
                </Badge>
                <h3 className="font-['Outfit'] text-3xl font-semibold leading-[1.08] tracking-[-0.075em] text-white sm:text-4xl sm:leading-[1.08] lg:text-[4rem] lg:leading-[1.1]">
                  Achievements that strengthen execution trust, not just the resume surface.
                </h3>
                <p className="max-w-3xl text-base leading-8 text-white/78">
                  These outcomes matter because they happened in environments where judgment, responsibility,
                  collaboration, and visibility were part of the work. The point is not volume, but signal quality.
                </p>
                <div className="achievement-overview-doctrine rounded-[1.5rem] px-5 py-5">
                  <p className="text-[0.58rem] uppercase tracking-[0.32em] text-white/58">Current focus card</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="font-['Outfit'] text-2xl font-semibold leading-[1.08] tracking-[-0.06em] text-white">
                      {activeItem.title}
                    </p>
                    {activeItem.metric ? (
                      <Badge
                        variant="outline"
                        className="achievement-overview-badge rounded-full px-3 py-1 text-[0.58rem] uppercase tracking-[0.26em]"
                      >
                        {activeItem.metric}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {summarySignals.map((signal) => (
                  <div key={signal.label} className="achievement-overview-signal rounded-[1.5rem] px-5 py-5">
                    <p className="text-[0.58rem] uppercase tracking-[0.32em] text-white/58">{signal.label}</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <p className="font-['Outfit'] text-4xl font-semibold tracking-[-0.08em] text-white">
                        {signal.value}
                      </p>
                      <p className="max-w-[11rem] text-right text-xs leading-6 text-white/62">{signal.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.72, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ ...riseTransition, delay: 0.06 }}
          className="achievement-carousel-shell mt-8 rounded-[2rem] p-2"
        >
          <Card className="achievement-carousel-card border-0">
            <CardContent className="space-y-6 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-white/72">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-[0.62rem] uppercase tracking-[0.32em]">Swipe through records</p>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-white/68">
                    Each card isolates one signal so the section reads like a sequence of strong proof points instead
                    of one dense block of content.
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={scrollPrev}
                    className="achievement-carousel-button rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-[0.28em]"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={scrollNext}
                    className="achievement-carousel-button rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-[0.28em]"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="achievement-mobile-dropdown rounded-[1.4rem] p-2 sm:hidden">
                <div className="achievement-mobile-dropdown-inner rounded-[calc(1.4rem-0.5rem)] px-4 py-4">
                  <label
                    htmlFor="achievement-mobile-select"
                    className="mb-3 flex items-center gap-3 text-white/78"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[0.62rem] uppercase tracking-[0.32em]">Achievement selector</span>
                  </label>
                  <select
                    id="achievement-mobile-select"
                    value={selectedIndex}
                    onChange={(event) => scrollTo(Number(event.target.value))}
                    className="experience-mobile-select w-full rounded-full px-4 py-3 text-[0.7rem] uppercase tracking-[0.24em] outline-none"
                  >
                    {items.map((item, index) => (
                      <option key={`${item.title}-${item.year}`} value={index}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-hidden" ref={emblaRef}>
                <div className="achievement-carousel-track flex">
                  {items.map((item, index) => {
                    const ItemIcon = achievementIcons[index % achievementIcons.length] ?? Trophy;

                    return (
                      <div key={item.title} className="achievement-carousel-slide min-w-0 flex-[0_0_100%] pl-0">
                        <div className="achievement-carousel-slide-shell rounded-[1.8rem] p-2">
                          <div className="achievement-carousel-slide-core rounded-[calc(1.8rem-0.5rem)] px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(19rem,0.74fr)]">
                              <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="achievement-slide-badge rounded-full px-3 py-1 text-[0.58rem] uppercase tracking-[0.26em]"
                                  >
                                    {item.category}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="achievement-slide-badge rounded-full px-3 py-1 text-[0.58rem] uppercase tracking-[0.26em]"
                                  >
                                    {item.year}
                                  </Badge>
                                </div>

                                <div className="space-y-4">
                                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-white/56">
                                    {String(index + 1).padStart(2, "0")} / proof signal
                                  </span>
                                  <h3 className="font-['Outfit'] text-3xl font-semibold leading-[1.08] tracking-[-0.075em] text-white sm:text-4xl sm:leading-[1.08] lg:text-[4rem] lg:leading-[1.1]">
                                    {item.title}
                                  </h3>
                                  <p className="max-w-3xl text-base leading-8 text-white/78">{item.summary}</p>
                                </div>

                                <div className="grid gap-3">
                                  {item.details.map((detail) => (
                                    <div
                                      key={detail}
                                      className="achievement-slide-detail rounded-[1.35rem] px-4 py-4"
                                    >
                                      <p className="text-sm leading-7 text-white/74">{detail}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid gap-4">
                                <div className="achievement-slide-aside rounded-[1.6rem] px-5 py-5">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p className="text-[0.58rem] uppercase tracking-[0.32em] text-white/56">
                                        Outcome marker
                                      </p>
                                      <p className="mt-3 font-['Outfit'] text-4xl font-semibold tracking-[-0.09em] text-white sm:text-[3.35rem]">
                                        {item.metric ?? item.year}
                                      </p>
                                    </div>
                                    <div className="achievement-slide-icon flex h-12 w-12 items-center justify-center rounded-[1.25rem]">
                                      <ItemIcon className="h-4 w-4" />
                                    </div>
                                  </div>
                                </div>

                                <div className="achievement-slide-aside rounded-[1.6rem] px-5 py-5">
                                  <p className="text-[0.58rem] uppercase tracking-[0.32em] text-white/56">
                                    Why it counts
                                  </p>
                                  <p className="mt-3 text-sm leading-7 text-white/72">
                                    This record adds signal because it combines delivery, visibility, and judgment in
                                    a public environment rather than staying hidden as an internal win.
                                  </p>
                                </div>

                                <div className="achievement-slide-aside rounded-[1.6rem] px-5 py-5">
                                  <p className="text-[0.58rem] uppercase tracking-[0.32em] text-white/56">
                                    Dossier marker
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge
                                      variant="outline"
                                      className="achievement-slide-badge rounded-full px-3 py-1 text-[0.56rem] uppercase tracking-[0.24em]"
                                    >
                                      Execution
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="achievement-slide-badge rounded-full px-3 py-1 text-[0.56rem] uppercase tracking-[0.24em]"
                                    >
                                      Pressure
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="achievement-slide-badge rounded-full px-3 py-1 text-[0.56rem] uppercase tracking-[0.24em]"
                                    >
                                      Visibility
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="achievement-carousel-dots hidden flex-wrap gap-2 sm:flex">
                {items.map((item, index) => (
                  <button
                    key={`achievement-dot-${item.title}`}
                    type="button"
                    onClick={() => scrollTo(index)}
                    className={`achievement-carousel-dot rounded-full px-4 py-2 text-[0.58rem] uppercase tracking-[0.28em] ${
                      selectedIndex === index ? "is-active" : ""
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
