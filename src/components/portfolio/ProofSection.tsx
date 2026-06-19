"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Activity, Binary, NotebookPen, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { MetricTile } from "@/components/portfolio/MetricTile";
import { CountUpValue } from "@/components/portfolio/CountUpValue";
import type { GithubContributionGrid, GithubProfile } from "@/components/portfolio/types";

type ProofSectionProps = {
  githubProfile: GithubProfile | null;
  githubStats: {
    publicRepos: number;
    totalStars: number;
  };
  pastYearContributionTotal: number;
  contributionGrid: GithubContributionGrid;
  contributionRangeLabel: string;
  githubLanguages: Array<{ name: string; count: number }>;
  writingNotes: Array<{ title: string; summary: string; status: string }>;
  portfolioSignals: Array<{ title: string; description: string }>;
  credibilitySignals: Array<{ title: string; description: string }>;
};

export function ProofSection({
  githubProfile,
  githubStats,
  pastYearContributionTotal,
  contributionGrid,
  contributionRangeLabel,
  githubLanguages,
  writingNotes,
  portfolioSignals,
  credibilitySignals,
}: ProofSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.16 });
  const recentWeeks = contributionGrid.weeks.slice(-22);
  const monthStart = Math.max(contributionGrid.weeks.length - recentWeeks.length, 0);
  const recentMonths = contributionGrid.monthLabels
    .filter((month) => month.index >= monthStart)
    .map((month) => ({ ...month, index: month.index - monthStart }));

  return (
    <section ref={sectionRef} id="proof" className={`w-full ${isInView ? "proof-is-visible" : ""}`}>
      <div className="section-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <SectionHeader
          eyebrow="06 / Proof"
          title="Public signal, writing, and collaboration credibility."
          description="This is the evidence layer: what the public graph says, what the writing is exploring, and how the work tends to show up in collaborative settings when the conversation gets serious."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <MetricTile
            label="Public repos"
            value={githubStats.publicRepos}
            valueNode={<CountUpValue active={isInView} value={githubStats.publicRepos} />}
            icon={Radar}
          />
          <MetricTile
            label="Total stars"
            value={githubStats.totalStars}
            valueNode={<CountUpValue active={isInView} value={githubStats.totalStars} />}
            icon={Sparkles}
          />
          <MetricTile
            label="Past year contributions"
            value={pastYearContributionTotal}
            valueNode={<CountUpValue active={isInView} value={pastYearContributionTotal} />}
            icon={Binary}
          />
          <MetricTile
            label="Followers"
            value={githubProfile?.followers ?? 0}
            valueNode={<CountUpValue active={isInView} value={githubProfile?.followers ?? 0} />}
            icon={Activity}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card className="portfolio-card portfolio-card-strong proof-grid-card overflow-hidden border">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Public telemetry</p>
                  <h3 className="mt-2 font-['Outfit'] text-3xl font-semibold tracking-[-0.05em] text-white">
                    Contribution rhythm
                  </h3>
                </div>
                <span className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">{contributionRangeLabel}</span>
              </div>

              <div className="space-y-4">
                <div
                  className="grid items-center gap-2 text-[0.58rem] uppercase tracking-[0.26em] text-slate-500"
                  style={{ gridTemplateColumns: `3rem repeat(${recentWeeks.length}, minmax(0, 1fr))` }}
                >
                  <span />
                  {recentMonths.map((month) => (
                    <span key={`${month.label}-${month.index}`} style={{ gridColumnStart: month.index + 2 }}>
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2">
                  <div className="grid grid-rows-7 gap-2 text-[0.58rem] uppercase tracking-[0.26em] text-slate-500">
                    <span className="row-start-2">Mon</span>
                    <span className="row-start-4">Wed</span>
                    <span className="row-start-6">Fri</span>
                  </div>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${recentWeeks.length}, minmax(0, 1fr))` }}>
                    {recentWeeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-rows-7 gap-2">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            className={`proof-graph-cell level-${day.level ?? 0}`}
                            title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {githubLanguages.map((language) => (
                  <Badge
                    key={language.name}
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-slate-200"
                  >
                    {language.name}
                    <span className="ml-2 text-sky-300">{language.count}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="portfolio-card proof-writing-card border">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-3 text-cyan-300">
                  <NotebookPen className="h-4 w-4" />
                  <p className="text-[0.62rem] uppercase tracking-[0.32em] text-cyan-300">Writing in motion</p>
                </div>
                {writingNotes.slice(0, 2).map((note) => (
                  <div key={note.title} className="space-y-2 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[0.58rem] uppercase tracking-[0.3em] text-slate-500">{note.status}</p>
                    <h3 className="font-['Outfit'] text-2xl font-semibold tracking-[-0.05em] text-white">{note.title}</h3>
                    <p className="text-sm leading-7 text-slate-300">{note.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="portfolio-card proof-signals-card border">
              <CardContent className="grid gap-5 p-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sky-300">
                    <ShieldCheck className="h-4 w-4" />
                    <p className="text-[0.62rem] uppercase tracking-[0.32em] text-sky-300">Working signal</p>
                  </div>
                  {portfolioSignals.slice(0, 2).map((signal) => (
                    <div key={signal.title} className="space-y-2">
                      <h3 className="font-['Outfit'] text-2xl font-semibold tracking-[-0.05em] text-white">
                        {signal.title}
                      </h3>
                      <p className="text-sm leading-7 text-slate-300">{signal.description}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.32em] text-slate-500">Collaboration credibility</p>
                  {credibilitySignals.map((signal) => (
                    <div key={signal.title} className="space-y-2 border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-['Outfit'] text-xl font-semibold tracking-[-0.05em] text-white">{signal.title}</h3>
                      <p className="text-sm leading-7 text-slate-300">{signal.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
