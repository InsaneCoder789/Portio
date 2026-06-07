import type { ExperienceItem } from "@/data/linkedin";
import { SectionHeader } from "@/components/portfolio/SectionHeader";

type ExperienceSectionProps = {
  items: ExperienceItem[];
};

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
              className={`experience-row grid gap-6 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[22rem_minmax(0,1fr)] ${index !== items.length - 1 ? "border-b border-black/10 dark:border-white/10" : ""}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 sm:gap-5 lg:flex-col lg:items-start lg:gap-5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/5 sm:h-40 sm:w-40 sm:p-4 lg:h-52 lg:w-52 lg:p-6">
                    <img src={item.logo} alt={item.company} className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.34em] text-sky-600/75 dark:text-sky-300/70">{item.type}</p>
                    <h3 className="font-['Outfit'] text-xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-2xl">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
