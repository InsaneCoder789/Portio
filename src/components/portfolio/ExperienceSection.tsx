import { ChevronDown } from "lucide-react";
import type { ExperienceItem } from "@/data/linkedin";
import { SectionHeader } from "@/components/portfolio/SectionHeader";

type ExperienceSectionProps = {
  items: ExperienceItem[];
};

function ExperienceDetails({ item }: { item: ExperienceItem }) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h4 className="font-['Outfit'] text-2xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-3xl">
          {item.role}
        </h4>
        {item.points?.map((point) => (
          <p key={point} className="max-w-4xl text-base leading-8 text-slate-700 dark:text-slate-300">
            {point}
          </p>
        ))}
      </div>

      {item.skills?.length ? (
        <div className="flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[0.66rem] uppercase tracking-[0.26em] text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  return (
    <section id="experience" className="w-full">
      <div className="section-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <SectionHeader
          eyebrow="02 / Experience"
          title="Experience across product systems, Android builds, and platform execution."
          description="A mix of internships, product engineering work, and student-led technical roles where the emphasis stayed on shipping, structure, and maintainability."
        />

        <div className="mt-10 grid gap-0">
          {items.map((item, index) => (
            <article
              key={`${item.company}-${item.role}`}
              className={`experience-row py-5 sm:py-10 ${index !== items.length - 1 ? "border-b border-black/10 dark:border-white/10" : ""}`}
            >
              <details className="experience-mobile-disclosure sm:hidden">
                <summary className="flex cursor-pointer list-none items-center gap-4 py-2">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-white/70 p-2.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <img src={item.logo} alt="" aria-hidden="true" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] uppercase tracking-[0.34em] text-sky-600/75 dark:text-sky-300/70">{item.type}</p>
                    <h3 className="font-['Outfit'] text-xl font-semibold leading-tight tracking-[-0.05em] text-slate-950 dark:text-white">
                      {item.company}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.duration}</p>
                  </div>
                  <ChevronDown className="experience-disclosure-icon h-5 w-5 shrink-0 text-slate-700 transition-transform dark:text-slate-200" />
                </summary>
                <div className="experience-mobile-content space-y-5 pb-3 pt-5">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.location} · {item.mode}
                  </p>
                  <ExperienceDetails item={item} />
                </div>
              </details>

              <div className="hidden gap-8 sm:grid lg:grid-cols-[22rem_minmax(0,1fr)]">
                <div className="space-y-4">
                  <div className="flex items-center gap-5 lg:flex-col lg:items-start">
                    <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 lg:h-52 lg:w-52 lg:p-6">
                      <img src={item.logo} alt={item.company} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.34em] text-sky-600/75 dark:text-sky-300/70">{item.type}</p>
                      <h3 className="font-['Outfit'] text-2xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">
                        {item.company}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p>{item.duration}</p>
                    <p>
                      {item.location} · {item.mode}
                    </p>
                  </div>
                </div>
                <ExperienceDetails item={item} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
