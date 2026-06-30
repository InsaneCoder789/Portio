import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { ProjectHeaderImage } from "@/components/portfolio/ProjectHeaderImage";
import type { ProjectCard } from "@/components/portfolio/types";

type WorkSectionProps = {
  projects: ProjectCard[];
};

function ProjectDetails({ project }: { project: ProjectCard }) {
  return (
    <>
      <div className="space-y-4">
        <p className="text-base leading-8 text-slate-100/95">{project.description}</p>
        <p className="text-sm leading-7 text-slate-300">{project.details}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Challenge</p>
          <p className="text-sm leading-7 text-slate-300">
            {project.challenge || "Shaping a solution that remained stable under changing product and engineering pressure."}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Outcome</p>
          <p className="text-sm leading-7 text-slate-300">
            {project.outcome || "Delivered a tighter, more maintainable system that made the product read clearly."}
          </p>
        </div>
      </div>

      {project.learning ? (
        <div className="border border-white/8 bg-slate-950/20 px-4 py-4">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Technical decision / learning</p>
          <p className="mt-2 text-sm leading-7 text-slate-300">{project.learning}</p>
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-slate-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-slate-200">
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              Repository
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
          {project.homepage ? (
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
            >
              <a href={project.homepage} target="_blank" rel="noreferrer">
                Live build
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function WorkSection({ projects }: WorkSectionProps) {
  const featuredProjects = projects.slice(0, 4);

  return (
    <section id="work" className="w-full">
      <div className="section-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="liquid-blob liquid-blob-soft right-[-12rem] top-[-6rem]" />
        <SectionHeader
          eyebrow="04 / Work"
          title="Selected work, told like product case studies."
          description="The portfolio should show more than what was built. Each case study here focuses on the problem, the technical decision, and the product outcome that made the work worth shipping."
        />

        <div className="mt-8 space-y-4 sm:hidden">
          {featuredProjects.map((project, index) => (
            <details
              key={project.name}
              className="project-mobile-disclosure portfolio-card portfolio-card-strong work-case-card overflow-hidden border"
            >
              <summary className="cursor-pointer list-none">
                {project.headerImage ? (
                  <ProjectHeaderImage
                    src={project.headerImage}
                    alt={project.headerImageAlt || `${project.name} project overview`}
                    position={project.headerImagePosition}
                    tone={project.headerImageTone}
                  />
                ) : null}
                <div className="flex items-center gap-4 px-5 py-5">
                  <span className="text-[0.68rem] uppercase tracking-[0.34em] text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="font-['Outfit'] text-2xl font-semibold tracking-[-0.05em] text-white">
                      {project.name}
                    </h3>
                    {project.awardTagline ? (
                      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-amber-200/85">
                        {project.awardTagline}
                      </p>
                    ) : null}
                  </div>
                  <ChevronDown className="project-disclosure-icon h-5 w-5 shrink-0 text-slate-300 transition-transform duration-300" />
                </div>
              </summary>
              <div className="space-y-5 border-t border-white/10 px-5 py-5">
                <ProjectDetails project={project} />
              </div>
            </details>
          ))}
        </div>

        <BentoGrid className="mt-10 hidden auto-rows-auto grid-cols-1 gap-5 sm:grid lg:mt-12 lg:grid-cols-12">
          {featuredProjects.map((project, index) => (
            <Card
              key={project.name}
              className={`portfolio-card portfolio-card-strong work-case-card col-span-1 overflow-hidden border lg:col-span-6 ${
                index % 2 === 1 ? "lg:translate-y-8" : ""
              }`}
            >
              <CardContent className="relative flex h-full flex-col gap-5 p-0 sm:gap-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(147,197,253,0.18),transparent_32%)]" />

                {project.headerImage ? (
                  <ProjectHeaderImage
                    src={project.headerImage}
                    alt={project.headerImageAlt || `${project.name} project overview`}
                    position={project.headerImagePosition}
                    tone={project.headerImageTone}
                  />
                ) : null}

                <div className="relative flex flex-1 flex-col gap-5 px-5 pb-5 sm:gap-6 sm:px-6 sm:pb-6">
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="text-[0.68rem] uppercase tracking-[0.34em] text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-slate-300"
                    >
                      Compact case study
                    </Badge>
                  </div>

                  <div className="relative">
                    <h3 className="font-['Outfit'] text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">
                      {project.name}
                    </h3>
                    {project.awardTagline ? (
                      <p className="mt-2 text-[0.64rem] uppercase tracking-[0.32em] text-amber-200/85">
                        {project.awardTagline}
                      </p>
                    ) : null}
                  </div>

                  <div className="relative mt-auto flex flex-1 flex-col gap-5">
                    <ProjectDetails project={project} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
