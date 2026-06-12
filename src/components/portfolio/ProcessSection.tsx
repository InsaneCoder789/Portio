import { CheckCircle2, ChevronDown, Cpu, Orbit, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import type { SkillItem } from "@/components/portfolio/types";

type ProcessSectionProps = {
  skills: SkillItem[];
  benchmarks: Array<{ name: string; value: number }>;
};

const processLanes = [
  {
    title: "Discover the real constraint",
    copy: "Clarify the user, operating environment, failure cases, and business pressure before choosing frameworks or drawing screens.",
  },
  {
    title: "Model the system",
    copy: "Map the data, states, contracts, and ownership boundaries so the product remains understandable as features and contributors increase.",
  },
  {
    title: "Prototype the risky path",
    copy: "Validate the interaction or technical assumption most likely to fail before investing in the polished, happy-path implementation.",
  },
  {
    title: "Build reusable foundations",
    copy: "Establish accessible components, predictable state transitions, typed boundaries, and APIs that support iteration instead of resisting it.",
  },
  {
    title: "Test real behavior",
    copy: "Exercise loading, latency, retries, empty states, smaller screens, and recovery paths rather than judging the product only in ideal demos.",
  },
  {
    title: "Ship, observe, refine",
    copy: "Treat deployment as the beginning of the feedback loop: monitor behavior, remove friction, document decisions, and improve the next release.",
  },
];

const deliveryChecks = [
  "Clear ownership and typed interfaces",
  "Responsive and accessible interaction states",
  "Failure, retry, and empty-state coverage",
  "Performance measured before visual excess",
];

function ToolkitGrid({ skills }: { skills: SkillItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {skills.map((skill) => (
        <div
          key={skill.label}
          className="toolkit-tile rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <div className="flex items-center gap-3">
            <div className="toolkit-logo flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40">
              {skill.logo ? (
                <img src={skill.logo} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
              ) : (
                <span className="font-['Outfit'] text-sm font-semibold tracking-[-0.04em] text-sky-200">
                  {skill.label.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-['Outfit'] text-lg font-semibold tracking-[-0.04em] text-white">{skill.label}</p>
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-slate-500">
                {skill.count ? `${skill.count} repos` : "core lane"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProcessSection({ skills, benchmarks }: ProcessSectionProps) {
  return (
    <section id="process" className="w-full">
      <div className="section-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <SectionHeader
          eyebrow="04 / Process"
          title="Systems process, not just a skills wall."
          description="The stack matters, but it is only useful when it supports a repeatable way of building. This section compresses the raw tool list into the process, capabilities, and delivery depth that actually shape the work."
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)_22rem]">
          <Card className="portfolio-card border-white/10 bg-[linear-gradient(180deg,rgba(10,18,33,0.9),rgba(5,10,20,0.98))]">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3 text-cyan-300">
                <Orbit className="h-4 w-4" />
                <p className="text-[0.62rem] uppercase tracking-[0.32em] text-cyan-300">How I build</p>
              </div>
              {processLanes.map((lane, index) => (
                <div
                  key={lane.title}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-white/8 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="pt-1 font-mono text-[0.62rem] tabular-nums tracking-[0.2em] text-sky-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-['Outfit'] text-xl font-semibold tracking-[-0.05em] text-white">{lane.title}</h3>
                    <p className="text-sm leading-6 text-slate-300">{lane.copy}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <details className="toolkit-mobile-disclosure portfolio-card portfolio-card-strong process-toolkit-card overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(16,34,64,0.82),rgba(8,18,37,0.98))] sm:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-6 text-sky-300">
              <Cpu className="h-4 w-4" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.62rem] uppercase tracking-[0.32em] text-sky-300">Selected toolkit</p>
                <p className="mt-1 text-sm text-slate-300">{skills.length} technologies</p>
              </div>
              <ChevronDown className="toolkit-disclosure-icon h-5 w-5 shrink-0 text-slate-300 transition-transform duration-300" />
            </summary>
            <div className="border-t border-white/10 px-5 py-5">
              <ToolkitGrid skills={skills} />
            </div>
          </details>

          <Card className="portfolio-card portfolio-card-strong process-toolkit-card hidden overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(16,34,64,0.82),rgba(8,18,37,0.98))] sm:block">
            <CardContent className="relative p-6">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-sky-400/10 to-transparent" />
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-sky-300">
                  <Cpu className="h-4 w-4" />
                  <p className="text-[0.62rem] uppercase tracking-[0.32em] text-sky-300">Selected toolkit</p>
                </div>
                <ToolkitGrid skills={skills} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="portfolio-card portfolio-card-strong border-white/10 bg-[linear-gradient(180deg,rgba(17,37,73,0.86),rgba(8,16,31,0.98))]">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-3 text-sky-300">
                  <Radar className="h-4 w-4" />
                  <p className="text-[0.62rem] uppercase tracking-[0.32em] text-sky-300">Benchmarks</p>
                </div>
                {benchmarks.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{item.name}</span>
                      <strong className="font-['Outfit'] text-white">{item.value}%</strong>
                    </div>
                    <div className="benchmark-track relative h-3 overflow-hidden rounded-full border border-white/10 bg-slate-950/45 shadow-[inset_0_1px_4px_rgba(0,0,0,0.35)]">
                      <div
                        className="benchmark-fill absolute inset-0 w-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 shadow-[0_0_18px_rgba(56,189,248,0.4)]"
                        style={{ transform: `scaleX(${item.value / 100})`, transformOrigin: "left center" }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="portfolio-card border-white/10 bg-white/[0.03]">
              <CardContent className="space-y-4 p-6">
                <p className="text-[0.62rem] uppercase tracking-[0.32em] text-slate-500">Delivery principle</p>
                <h3 className="font-['Outfit'] text-2xl font-semibold tracking-[-0.05em] text-white">
                  Reliable beats flashy, then the finish can amplify both.
                </h3>
                <p className="text-sm leading-7 text-slate-300">
                  I consider a feature complete when the experience is understandable, the system can recover from
                  imperfect conditions, and another engineer can extend it without reverse-engineering the intent.
                </p>
                <div className="space-y-3 border-y border-white/8 py-4">
                  {deliveryChecks.map((check) => (
                    <div key={check} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                      <span className="text-sm leading-6 text-slate-300">{check}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Maintainability", "Clarity", "Speed", "Reusability", "Product taste"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-slate-200"
                    >
                      {tag}
                    </Badge>
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
