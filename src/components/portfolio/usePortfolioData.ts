"use client";

import { useEffect, useMemo, useState } from "react";
import {
  credibilitySignals,
  featuredProjects,
  performanceBenchmarks,
  portfolioSignals,
  skillsMatrix,
  writingNotes,
} from "@/features/portfolio/content";
import { publicAsset } from "@/lib/utils";
import type {
  GithubContributionDay,
  GithubContributionGrid,
  GithubProfile,
  GithubRepo,
  ProjectCard,
  SkillItem,
} from "@/components/portfolio/types";

const PINNED_REPOS = ["Rail", "K1000", "Lakshman-Rekha", "KYLR"];

const githubLanguageLogoMap: Record<string, string> = {
  C: publicAsset("logos/c.svg"),
  Dart: publicAsset("logos/dart.svg"),
  React: publicAsset("logos/react.svg"),
  TypeScript: publicAsset("logos/typescript.svg"),
  Kotlin: publicAsset("logos/kotlin.svg"),
  Firebase: publicAsset("logos/firebase.svg"),
  Python: publicAsset("logos/python.svg"),
  MySQL: publicAsset("logos/mysql.svg"),
  PostgreSQL: publicAsset("logos/postgresql.svg"),
  Git: publicAsset("logos/git.svg"),
  JavaScript: publicAsset("logos/javascript.svg"),
  HTML: publicAsset("logos/html.svg"),
  CSS: publicAsset("logos/css.svg"),
  "C++": publicAsset("logos/cpp.svg"),
  Tcl: publicAsset("logos/tcl.svg"),
  "Express.js": publicAsset("logos/express.svg"),
  FastAPI: publicAsset("logos/fastapi.svg"),
  Flutter: publicAsset("logos/flutter.svg"),
};

function contributionLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function formatRangeLabel(startDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
  return `${formatter.format(start)} → ${formatter.format(end)}`;
}

export function usePortfolioData(staticMode = false) {
  const [githubProfile, setGithubProfile] = useState<GithubProfile | null>(null);
  const [githubStats, setGithubStats] = useState({
    publicRepos: 0,
    totalStars: 0,
  });
  const [githubContributions, setGithubContributions] = useState<GithubContributionDay[]>([]);
  const [projectShowcase, setProjectShowcase] = useState<ProjectCard[]>(
    featuredProjects.map((project) => ({
      name: project.name,
      headerImage: project.headerImage,
      headerImageAlt: project.headerImageAlt,
      headerImagePosition: project.headerImagePosition,
      description: project.description,
      details: project.details,
      challenge: project.challenge,
      outcome: project.outcome,
      learning: project.learning,
      stack: project.stack,
      githubUrl: project.githubUrl,
    })),
  );
  const [githubLanguages, setGithubLanguages] = useState<Array<{ name: string; count: number }>>([]);

  const contributionStartDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 364);
    return date.toISOString().slice(0, 10);
  }, []);

  const contributionRangeLabel = useMemo(() => formatRangeLabel(contributionStartDate), [contributionStartDate]);

  const pastYearContributionTotal = useMemo(
    () =>
      githubContributions
        .filter((day) => day.date >= contributionStartDate)
        .reduce((sum, day) => sum + day.count, 0),
    [githubContributions, contributionStartDate],
  );

  const contributionGrid = useMemo<GithubContributionGrid>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(`${contributionStartDate}T00:00:00`);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const contributionMap = new Map(
      githubContributions
        .filter((day) => day.date >= contributionStartDate && day.date <= today.toISOString().slice(0, 10))
        .map((day) => [day.date, day]),
    );

    const weeks: GithubContributionDay[][] = [];
    const monthLabels: Array<{ index: number; label: string }> = [];
    const cursor = new Date(startDate);
    let weekIndex = -1;

    while (cursor <= today) {
      if (cursor.getDay() === 0) {
        weeks.push([]);
        weekIndex += 1;
      }

      const iso = cursor.toISOString().slice(0, 10);
      const contribution = contributionMap.get(iso) ?? { date: iso, count: 0, level: 0 };

      weeks[weekIndex].push({
        ...contribution,
        level: contribution.level ?? contributionLevel(contribution.count),
      });

      if (cursor.getDate() <= 7) {
        const month = cursor.toLocaleString("en-US", { month: "short" });
        const last = monthLabels[monthLabels.length - 1];
        if (!last || last.label !== month) {
          monthLabels.push({ index: weekIndex, label: month });
        }
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    return { weeks, monthLabels };
  }, [githubContributions, contributionStartDate]);

  const allSkills = useMemo(() => {
    const skills = new Map<string, SkillItem>();

    skillsMatrix.forEach((skill) => {
      skills.set(skill.label.toLowerCase(), { ...skill });
    });

    githubLanguages.forEach((language) => {
      const normalized = language.name.toLowerCase();

      if (!skills.has(normalized)) {
        skills.set(normalized, {
          label: language.name,
          logo: githubLanguageLogoMap[language.name],
          count: language.count,
        });
        return;
      }

      const current = skills.get(normalized)!;
      skills.set(normalized, {
        ...current,
        count: Math.max(current.count ?? 0, language.count),
      });
    });

    return Array.from(skills.values()).sort((a, b) => {
      const diff = (b.count ?? 0) - (a.count ?? 0);
      return diff !== 0 ? diff : a.label.localeCompare(b.label);
    });
  }, [githubLanguages]);

  useEffect(() => {
    let alive = true;

    const projectContentMap = new Map(
      featuredProjects.flatMap((project) => {
        const repoSlug = project.githubUrl.split("/").pop()?.toLowerCase();
        return [
          [project.name.toLowerCase(), project] as const,
          ...(repoSlug ? [[repoSlug, project] as const] : []),
        ];
      }),
    );

    const normalizePinnedProject = (repo: GithubRepo): ProjectCard => {
      const fallback = projectContentMap.get(repo.name.toLowerCase());
      const languageLabel = repo.language ?? "a modern application stack";
      const deliveryLabel = repo.homepage ? "a published live build" : "an open-source release";

      return {
        name: repo.name === "K1000" ? "K1000 Platform" : repo.name,
        headerImage: fallback?.headerImage,
        headerImageAlt: fallback?.headerImageAlt,
        headerImagePosition: fallback?.headerImagePosition,
        description:
          fallback?.description ||
          repo.description ||
          "Repository details will appear here once the live metadata resolves.",
        details:
          fallback?.details ||
          `Built with ${languageLabel} and ${deliveryLabel}, with an emphasis on maintainable structure, dependable execution, and clear product delivery.`,
        challenge: fallback?.challenge,
        outcome: fallback?.outcome,
        learning: fallback?.learning,
        stack: Array.from(
          new Set(
            [
              repo.language,
              repo.homepage ? "Live Site" : "Open Source",
              `${repo.stargazers_count} Star${repo.stargazers_count === 1 ? "" : "s"}`,
            ].filter(Boolean) as string[],
          ),
        ),
        githubUrl: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        language: repo.language,
      };
    };

    async function loadGithubData() {
      try {
        const response = await fetch("/api/portfolio/github");
        if (!response.ok) throw new Error("GitHub data request failed");

        const {
          profile,
          repos,
          contributions,
        } = (await response.json()) as {
          profile: GithubProfile | null;
          repos: GithubRepo[];
          contributions: GithubContributionDay[];
        };

        if (!alive) return;

        const publicRepos = repos.filter((repo) => !repo.fork);
        const repoMap = new Map(publicRepos.map((repo) => [repo.name.toLowerCase(), repo]));

        const pinned = PINNED_REPOS.map((name) => repoMap.get(name.toLowerCase()))
          .filter(Boolean)
          .map((repo) => normalizePinnedProject(repo as GithubRepo));

        if (profile) setGithubProfile(profile);
        setGithubStats({
          publicRepos: profile?.public_repos ?? publicRepos.length,
          totalStars: publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        });
        setProjectShowcase(
          pinned.length
            ? pinned
            : featuredProjects.map((project) => ({
                name: project.name,
                headerImage: project.headerImage,
                headerImageAlt: project.headerImageAlt,
                headerImagePosition: project.headerImagePosition,
                description: project.description,
                details: project.details,
                challenge: project.challenge,
                outcome: project.outcome,
                learning: project.learning,
                stack: project.stack,
                githubUrl: project.githubUrl,
              })),
        );
        setGithubLanguages(
          Object.entries(
            publicRepos.reduce<Record<string, number>>((acc, repo) => {
              if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
              return acc;
            }, {}),
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, count]) => ({ name, count })),
        );
        setGithubContributions(contributions);
      } catch {
        if (!alive) return;
      }
    }

    if (!staticMode) {
      loadGithubData();
    }

    return () => {
      alive = false;
    };
  }, [staticMode]);

  return {
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
  };
}
