"use client";

import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { contactContent, heroContent } from "@/features/portfolio/content";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { WorkSection } from "@/components/portfolio/WorkSection";
import { ProcessSection } from "@/components/portfolio/ProcessSection";
import { ProofSection } from "@/components/portfolio/ProofSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { CinematicBootScreen } from "@/components/portfolio/CinematicBootScreen";
import { SpectralAuraBackground } from "@/components/portfolio/SpectralAuraBackground";
import { usePortfolioData } from "@/components/portfolio/usePortfolioData";
import { experienceItems } from "@/features/portfolio/content";

type AppProps = {
  initialBooting?: boolean;
  staticMode?: boolean;
};

function App({ initialBooting = true, staticMode = false }: AppProps) {
  const [booting, setBooting] = useState(initialBooting);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const completeBoot = useCallback(() => setBooting(false), []);
  const {
    githubProfile,
    githubStats,
    githubLanguages,
    projectShowcase,
    allSkills,
    contributionGrid,
    contributionRangeLabel,
    pastYearContributionTotal,
    writingNotes,
    portfolioSignals,
    credibilitySignals,
    performanceBenchmarks,
  } = usePortfolioData(staticMode);

  useEffect(() => {
    if (staticMode) return undefined;

    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 0.9,
    });

    let frameId = 0;

    const tick = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [staticMode]);

  return (
    <div className={`portfolio-root theme-${theme} relative min-h-screen overflow-x-hidden`}>
      {booting ? <CinematicBootScreen staticMode={staticMode} onComplete={completeBoot} /> : null}

      <SpectralAuraBackground active={!booting} />
      <main className="portfolio-main relative z-10 pb-0">
        <HeroSection hero={heroContent} theme={theme} onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))} />
        <AboutSection />
        <ExperienceSection items={experienceItems} />
        <WorkSection projects={projectShowcase} />
        <ProcessSection skills={allSkills} benchmarks={performanceBenchmarks} />
        <ProofSection
          githubProfile={githubProfile}
          githubStats={githubStats}
          pastYearContributionTotal={pastYearContributionTotal}
          contributionGrid={contributionGrid}
          contributionRangeLabel={contributionRangeLabel}
          githubLanguages={githubLanguages}
          writingNotes={writingNotes}
          portfolioSignals={portfolioSignals}
          credibilitySignals={credibilitySignals}
        />
        <ContactSection contact={contactContent} />
      </main>

      <footer className="portfolio-footer flex w-full flex-col gap-4 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <p>Designed and engineered by Rohan Chatterjee — where product thinking, resilient systems, and expressive interfaces meet.</p>
        <div className="flex flex-wrap gap-4">
          <a href={contactContent.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-white">
            LinkedIn
          </a>
          <a href={contactContent.github} target="_blank" rel="noreferrer" className="transition hover:text-white">
            GitHub
          </a>
          <a href={`mailto:${contactContent.email}`} className="transition hover:text-white">
            Email
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
