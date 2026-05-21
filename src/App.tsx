"use client";

import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  credibilitySignals,
  contactContent,
  experienceItems,
  featuredProjects,
  githubUsername,
  heroContent,
  performanceBenchmarks,
  portfolioSignals,
  skillsMatrix,
  writingNotes,
} from "@/features/portfolio/content";
import DeathStarScene from "@/components/DeathStarScene";
import KaliBootScreen from "@/components/KaliBootScreen";
import { publicAsset } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type GithubProfile = {
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
};

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

type GithubContributionDay = {
  date: string;
  count: number;
  level?: number;
};

type ProjectCard = {
  name: string;
  description: string;
  details: string;
  challenge?: string;
  outcome?: string;
  learning?: string;
  stack: string[];
  githubUrl: string;
  homepage?: string | null;
  stars?: number;
  language?: string | null;
};

type SkillItem = {
  label: string;
  logo?: string;
  count?: number;
};

const PINNED_REPOS = ["Rail", "K1000", "Lakshman-Rekha", "KYLR"];

const githubLanguageLogoMap: Record<string, string> = {
  React: publicAsset("logos/react.svg"),
  TypeScript: publicAsset("logos/typescript.svg"),
  Kotlin: publicAsset("logos/kotlin.svg"),
  Firebase: publicAsset("logos/firebase.svg"),
  Python: publicAsset("logos/python.svg"),
  MySQL: publicAsset("logos/mysql.svg"),
  PostgreSQL: publicAsset("logos/postgresql.svg"),
  Linux: publicAsset("logos/linux.svg"),
  Git: publicAsset("logos/git.svg"),
  JavaScript: publicAsset("logos/javascript.svg"),
  HTML: publicAsset("logos/html.svg"),
  CSS: publicAsset("logos/css.svg"),
  "C++": publicAsset("logos/cpp.svg"),
  Tcl: publicAsset("logos/tcl.svg"),
};

const contributionTone = ["", "is-soft", "is-mid", "is-strong", "is-bright"];

const skillBadgeTextMap: Record<string, string> = {
  C: "C",
  Dart: "DA",
  Java: "JV",
  Vercel: "VC",
  "Google Cloud": "GC",
  TailwindCSS: "TW",
  "React Router": "RR",
  OpenCV: "CV",
  "Next.js": "NX",
  "Node.js": "ND",
  Flutter: "FL",
  FastAPI: "FA",
  "Express.js": "EX",
  MongoDB: "MG",
  Redis: "RD",
  SQLite: "SQ",
  Postgres: "PG",
};

const skillBadgeToneMap: Record<string, string> = {
  C: "linear-gradient(135deg, rgba(68,138,255,0.24), rgba(37,73,146,0.9))",
  Dart: "linear-gradient(135deg, rgba(88,207,255,0.24), rgba(28,88,170,0.9))",
  Java: "linear-gradient(135deg, rgba(255,176,107,0.26), rgba(127,58,21,0.92))",
  Vercel: "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(18,25,39,0.92))",
  "Google Cloud": "linear-gradient(135deg, rgba(114,197,255,0.22), rgba(52,96,186,0.92))",
  TailwindCSS: "linear-gradient(135deg, rgba(93,230,255,0.24), rgba(24,112,138,0.92))",
  "React Router": "linear-gradient(135deg, rgba(255,107,129,0.24), rgba(131,29,48,0.92))",
  OpenCV: "linear-gradient(135deg, rgba(255,186,124,0.24), rgba(132,65,22,0.92))",
  "Next.js": "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(40,49,67,0.92))",
  "Node.js": "linear-gradient(135deg, rgba(140,232,120,0.22), rgba(47,104,48,0.92))",
  Flutter: "linear-gradient(135deg, rgba(96,198,255,0.24), rgba(25,93,166,0.92))",
  FastAPI: "linear-gradient(135deg, rgba(101,255,212,0.22), rgba(18,108,94,0.92))",
  "Express.js": "linear-gradient(135deg, rgba(195,213,255,0.22), rgba(54,76,121,0.92))",
  MongoDB: "linear-gradient(135deg, rgba(139,239,145,0.22), rgba(31,102,49,0.92))",
  Redis: "linear-gradient(135deg, rgba(255,129,129,0.24), rgba(133,31,31,0.92))",
  SQLite: "linear-gradient(135deg, rgba(117,195,255,0.22), rgba(24,85,142,0.92))",
  Postgres: "linear-gradient(135deg, rgba(115,160,255,0.22), rgba(44,66,132,0.92))",
};

function skillBadgeText(label: string) {
  return skillBadgeTextMap[label] ?? label.slice(0, 2).toUpperCase();
}

function skillBadgeStyle(label: string) {
  return skillBadgeToneMap[label]
    ? { background: skillBadgeToneMap[label] }
    : undefined;
}

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

type AppProps = {
  initialBooting?: boolean;
  staticMode?: boolean;
};

function App({ initialBooting = true, staticMode = false }: AppProps) {
  const [booting, setBooting] = useState(initialBooting);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [githubProfile, setGithubProfile] = useState<GithubProfile | null>(null);
  const [githubStats, setGithubStats] = useState({
    publicRepos: 0,
    totalStars: 0,
  });
  const [githubContributions, setGithubContributions] = useState<GithubContributionDay[]>([]);
  const [projectShowcase, setProjectShowcase] = useState<ProjectCard[]>(
    featuredProjects.map((project) => ({
      name: project.name,
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

  const navItems = [
    ["About", "#about"],
    ["Experience", "#experience"],
    ["Projects", "#projects"],
    ["Skills", "#skills"],
    ["Signals", "#signals"],
    ["GitHub", "#github"],
    ["Contact", "#contact"],
  ] as const;

  const pastYearContributionTotal = useMemo(
    () =>
      githubContributions
        .filter((day) => day.date >= contributionStartDate)
        .reduce((sum, day) => sum + day.count, 0),
    [githubContributions, contributionStartDate],
  );

  const contributionGrid = useMemo(() => {
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
    let cursor = new Date(startDate);
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
      if (["flutter", "dart"].includes(normalized)) return;

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

  const logoSkills = useMemo(
    () => skillsMatrix.filter((skill) => Boolean(skill.logo)),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined" || staticMode) return;
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, [staticMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.dataset.theme = theme;
    if (!staticMode && typeof window !== "undefined") {
      window.localStorage.setItem("portfolio-theme", theme);
    }
  }, [staticMode, theme]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".nav-shell", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.fromTo(
        ".hero-title span",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out", delay: 0.1 },
      );

      if (document.querySelector(".portrait-card")) {
        gsap.to(".portrait-card", {
          y: -10,
          rotate: 0.8,
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      gsap.utils.toArray<HTMLElement>(".section-shell").forEach((shell) => {
        gsap.fromTo(
          shell,
          { opacity: 0.86 },
          {
            opacity: 1,
            duration: 0.42,
            ease: "power2.out",
            scrollTrigger: {
              trigger: shell,
              start: "top 84%",
              once: true,
            },
          },
        );

        const items = shell.querySelectorAll(".reveal");
        if (!items.length) return;

        gsap.fromTo(items, {
          y: 12,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.52,
          ease: "power2.out",
          stagger: 0.045,
          scrollTrigger: {
            trigger: shell,
            start: "top 92%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

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
      const deliveryLabel = repo.homepage ? "a published live build" : "an open-source delivery flow";

      return {
        name: repo.name === "K1000" ? "K1000 Platform" : repo.name,
        description:
          fallback?.description ||
          repo.description ||
          "Repository details will appear here once the live metadata resolves.",
        details:
          fallback?.details ||
          `Built with ${languageLabel} and ${deliveryLabel}, with an emphasis on maintainable structure, dependable execution, and clean interface delivery.`,
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
        const [profileRes, reposRes, contrib2025Res, contrib2026Res] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUsername}`),
          fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=2025`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=2026`),
        ]);

        const [profile, repos, contrib2025, contrib2026] = await Promise.all([
          profileRes.json() as Promise<GithubProfile>,
          reposRes.json() as Promise<GithubRepo[]>,
          contrib2025Res.json() as Promise<{ contributions?: GithubContributionDay[] }>,
          contrib2026Res.json() as Promise<{ contributions?: GithubContributionDay[] }>,
        ]);

        if (!alive) return;

        const publicRepos = repos.filter((repo) => !repo.fork);
        const repoMap = new Map(publicRepos.map((repo) => [repo.name.toLowerCase(), repo]));

        const pinned = PINNED_REPOS.map((name) => repoMap.get(name.toLowerCase()))
          .filter(Boolean)
          .map((repo) => normalizePinnedProject(repo as GithubRepo));

        setGithubProfile(profile);
        setGithubStats({
          publicRepos: profile.public_repos,
          totalStars: publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        });
        setProjectShowcase(
          pinned.length
            ? pinned
            : featuredProjects.map((project) => ({
                name: project.name,
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
            .filter(([name]) => !["Flutter", "Dart"].includes(name))
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, count]) => ({ name, count })),
        );
        setGithubContributions([
          ...(contrib2025.contributions ?? []),
          ...(contrib2026.contributions ?? []),
        ]);
      } catch {
        if (!alive) return;
      }
    }

    loadGithubData();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="portfolio-root">
      {booting ? <KaliBootScreen onComplete={() => setBooting(false)} /> : null}
      <div className="background-stage" aria-hidden="true" />
      <div className={`mobile-nav-control ${mobileMenuOpen ? "is-open" : ""}`.trim()}>
        <button
          type="button"
          className={`nav-menu-toggle ${mobileMenuOpen ? "is-open" : ""}`.trim()}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          <span className="nav-menu-glyph" aria-hidden="true">
            {mobileMenuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      <nav className={`nav-shell ${mobileMenuOpen ? "is-menu-open" : ""}`.trim()}>
        <div className="nav-inner">
          <a href="#about" className="brand-shell">
            <img src={heroContent.profilePhoto} alt={heroContent.name} className="brand-avatar" />
            <span className="brand-copy">
              <strong>{heroContent.name}</strong>
              <small>{heroContent.role}</small>
            </span>
          </a>

          <div className="nav-cluster">
            <div id="primary-navigation" className={`nav-links ${mobileMenuOpen ? "is-open" : ""}`.trim()}>
              {navItems.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="page-stack">
        <section id="about" className="chapter section-shell hero-shell">
          <div className="hero-visual">
            <div className="hero-starfield" />

            <div className="portrait-card mobile-portrait-card reveal">
              <div className="portrait-badge">Rohan Chatterjee</div>
              <div className="portrait-frame">
                <img src={heroContent.profilePhoto} alt={heroContent.name} />
              </div>
              <div className="portrait-meta">
                <span>Product thinking</span>
                <span>Systems discipline</span>
                <span>Visual taste</span>
              </div>
            </div>

            <div className="deathstar-panel reveal">
              <DeathStarScene className="deathstar-panel-inner" />
            </div>
          </div>

          <div className="hero-copy">
            <h1 className="hero-title reveal">
              <span>Engineering</span>
              <span className="hero-title-accent">Scalable</span>
              <span>Systems.</span>
            </h1>
            <div className="manifesto-card reveal">
              <p className="manifesto-kicker">A portfolio with a point of view</p>
              <p className="hero-current-line">{heroContent.current}</p>
              <p>{heroContent.intro}</p>
              <p>{heroContent.summary}</p>
            </div>
            <div className="signal-grid reveal">
              <article>
                <span>Operating mode</span>
                <strong>Builder with systems taste</strong>
              </article>
              <article>
                <span>Current focus</span>
                <strong>Web platforms, product interfaces, resilient backends</strong>
              </article>
            </div>
          </div>

        </section>

        <section id="experience" className="chapter">
          <div className="section-shell experience-shell">
            <div className="section-heading reveal">
              <p className="section-label">01 / Journey</p>
              <p className="section-command">~ /experience --timeline</p>
              <h2>Experience</h2>
              <p className="section-intro">
                A structured record of the roles, systems, and teams that shaped how I build, ship, and scale product work.
              </p>
            </div>

            <div className="experience-layout">
              <aside className="experience-note reveal">
                <p className="note-title">Field notes</p>
                <p>
                  Great software feels deliberate. I like roles that combine product judgment, technical
                  execution, and a clear visual system around the work.
                </p>
                <p>
                  The through-line in my work is systems thinking that stays understandable: interfaces that
                  feel clear, operations that remain maintainable, and engineering that still knows how to
                  communicate.
                </p>
                <div className="note-meta">
                  <div>
                    <span>Focus areas</span>
                    <strong>Frontend systems, Android delivery, backend coordination</strong>
                  </div>
                  <div>
                    <span>Working style</span>
                    <strong>Fast iterations, reusable structure, product-aware implementation</strong>
                  </div>
                </div>
                <div className="note-pills">
                  <span>Frontend systems</span>
                  <span>Mobile workflows</span>
                  <span>Technical execution</span>
                  <span>Team coordination</span>
                </div>
              </aside>

              <div className="experience-list">
                {experienceItems.map((exp, index) => (
                  <article key={`${exp.company}-${exp.role}`} className="experience-card reveal">
                    <div className="experience-top">
                      <img src={exp.logo} alt={`${exp.company} logo`} className="experience-logo" />
                      <div className="experience-copy">
                        <div className="experience-company-row">
                          <p className="experience-index">{String(index + 1).padStart(2, "0")}</p>
                          <p className="experience-company">{exp.company}</p>
                        </div>
                        <h3>{exp.role}</h3>
                        <p className="experience-meta">
                          {exp.duration} · {exp.mode} · {exp.location}
                        </p>
                      </div>
                    </div>

                    <div className="experience-body">
                      {exp.points?.map((point) => (
                        <p key={point}>{point}</p>
                      ))}
                    </div>

                    <div className="chip-row">
                      {(exp.skills ?? []).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="chapter">
          <div className="section-shell projects-shell">
            <div className="section-heading reveal">
              <p className="section-label">02 / Portfolio</p>
              <p className="section-command">~ /projects --curated --case-studies</p>
              <h2>Selected Works</h2>
              <p className="section-intro">
                A curated selection of systems, product builds, and technical experiments shaped into
                portfolio-ready case studies.
              </p>
            </div>

            <div className="project-mosaic">
              {projectShowcase.map((project, index) => (
                <article
                  key={project.name}
                  className={`project-card reveal ${index === 0 || index === 2 ? "project-card-rise" : "project-card-fall"}`}
                >
                  <div className="project-top">
                    <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="project-badge">Pinned repository</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <p className="project-details">{project.details}</p>
                  <div className="project-system-row">
                    <span>Structure</span>
                    <strong>{project.language ?? project.stack[0] ?? "System build"}</strong>
                    <span className="project-divider" />
                    <span>Signal</span>
                    <strong>{project.homepage ? "Live deployment" : "Open-source release"}</strong>
                  </div>
                  <div className="project-case-study">
                    {project.challenge ? (
                      <div>
                        <span>Challenge</span>
                        <p>{project.challenge}</p>
                      </div>
                    ) : null}
                    {project.outcome ? (
                      <div>
                        <span>Outcome</span>
                        <p>{project.outcome}</p>
                      </div>
                    ) : null}
                    {project.learning ? (
                      <div>
                        <span>Learning</span>
                        <p>{project.learning}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="project-tags">
                    {project.stack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                    {project.homepage ? (
                      <a href={project.homepage} target="_blank" rel="noreferrer">
                        Live ↗
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="chapter">
          <div className="section-shell skills-shell">
            <div className="section-heading reveal">
              <p className="section-label">03 / Stack</p>
              <p className="section-command">~ /stack --atlas --core-tools</p>
              <h2>Capability Atlas</h2>
              <p className="section-intro">
                The tools I lean on most, plus the language mix surfaced from my public GitHub repositories.
              </p>
            </div>

            <div className="skills-layout">
              <div className="skills-grid reveal">
                {logoSkills.map((skill, index) => (
                  <article
                    key={skill.label}
                    className={`skill-tile ${index === 0 || index === 4 ? "skill-tile-wide" : ""}`}
                  >
                    <div className="skill-icon">
                      <img src={skill.logo} alt={skill.label} />
                    </div>
                    <div className="skill-copy">
                      <strong>{skill.label}</strong>
                    </div>
                  </article>
                ))}
              </div>

              <div className="benchmark-panel reveal">
                <div className="benchmark-head">
                  <p>Performance benchmarks</p>
                  <span>Core depth</span>
                </div>

                <div className="benchmark-list">
                  {performanceBenchmarks.map((item) => (
                    <div key={item.name} className="benchmark-item">
                      <div className="benchmark-row">
                        <span>{item.name}</span>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="benchmark-track">
                        <div className="benchmark-fill" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="signals" className="chapter">
          <div className="section-shell signals-shell">
            <div className="section-heading reveal">
              <p className="section-label">04 / Signals</p>
              <p className="section-command">~ /signals --metrics --writing --proof</p>
              <h2>Signals</h2>
              <p className="section-intro">
                The numbers, notes, and credibility markers that make the work easier to evaluate beyond visuals alone.
              </p>
            </div>

            <div className="signals-layout">
              <article className="signal-panel reveal">
                <div className="signal-panel-head">
                  <p className="section-label">Fit</p>
                  <span>Working signal</span>
                </div>
                <div className="portfolio-signal-grid">
                  {portfolioSignals.map((item) => (
                    <div key={item.title} className="portfolio-signal-card">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="signal-panel reveal">
                <div className="signal-panel-head">
                  <p className="section-label">Writing</p>
                  <span>Field notes in progress</span>
                </div>
                <div className="writing-stack">
                  {writingNotes.map((note) => (
                    <div key={note.title} className="writing-card">
                      <span>{note.status}</span>
                      <h3>{note.title}</h3>
                      <p>{note.summary}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="signal-panel reveal">
                <div className="signal-panel-head">
                  <p className="section-label">Proof</p>
                  <span>Collaboration signal</span>
                </div>
                <div className="credibility-stack">
                  {credibilitySignals.map((signal) => (
                    <div key={signal.title} className="credibility-card">
                      <h3>{signal.title}</h3>
                      <p>{signal.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="github" className="chapter">
          <div className="section-shell github-shell">
            <div className="section-heading reveal">
              <p className="section-label">05 / GitHub</p>
              <p className="section-command">~ /github --telemetry --public-signal</p>
              <h2>Telemetry</h2>
              <p className="section-intro">
                A professional snapshot of public repository activity, contribution consistency, and open-source
                output across the past year.
              </p>
            </div>

            <div className="github-stats reveal">
              <article>
                <span>Public repos</span>
                <strong>{githubStats.publicRepos || githubProfile?.public_repos || projectShowcase.length}</strong>
              </article>
              <article>
                <span>Followers</span>
                <strong>{githubProfile?.followers ?? 0}</strong>
              </article>
              <article>
                <span>Total stars</span>
                <strong>{githubStats.totalStars}</strong>
              </article>
              <article>
                <span>Past year contributions</span>
                <strong>{pastYearContributionTotal}</strong>
              </article>
            </div>

            <div className="graph-panel reveal">
              <div className="graph-panel-head">
                <div>
                  <p className="section-label">Contribution activity</p>
                  <h3>Past 12 months</h3>
                </div>
                <span>{contributionRangeLabel}</span>
              </div>

              <div className="graph-scroll">
                <div className="graph-months">
                  {contributionGrid.monthLabels.map((month) => (
                    <span key={month.index} style={{ gridColumnStart: month.index + 2 }}>
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="graph-grid">
                  <div className="graph-axis">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  <div className="graph-body">
                    {contributionGrid.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="graph-week">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            className={`graph-cell level-${day.level ?? 0}`}
                            title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="graph-legend">
                <span>Less</span>
                {contributionTone.slice(1).map((tone, index) => (
                  <span key={tone} className={`legend-swatch level-${index + 1}`} />
                ))}
                <span>More</span>
              </div>
            </div>

            <div className="github-lower reveal">
              <article className="github-lower-card">
                <p className="section-label">Profile signal</p>
                <h3>{githubProfile?.bio || "Public work that leans toward product-minded engineering."}</h3>
                <p>
                  The public graph reflects a mix of Android, frontend, and backend experiments shaped into
                  real portfolio systems.
                </p>
              </article>

              <article className="github-lower-card">
                <p className="section-label">Most used languages</p>
                <div className="github-language-row">
                  {githubLanguages.slice(0, 5).map((language) => (
                    <span key={language.name}>
                      {language.name}
                      <strong>{language.count}</strong>
                    </span>
                  ))}
                </div>
              </article>

              <article className="github-lower-card">
                <p className="section-label">Current snapshot</p>
                <p>
                  {githubStats.publicRepos || githubProfile?.public_repos || projectShowcase.length} public
                  repositories, {githubStats.totalStars} total stars, and {pastYearContributionTotal} tracked
                  contributions across the last twelve months.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="chapter">
          <div className="section-shell contact-shell reveal">
            <div className="contact-surface contact-surface-single">
              <div className="contact-card contact-card-single">
                <div className="contact-panel-grid">
                  <div className="contact-panel-left">
                    <p className="section-label">06 / Contact</p>
                    <p className="section-command">~ /contact --open-channel</p>
                    <h2>Connect</h2>
                    <p className="contact-lead">
                      Code • Create • Collaborate. If the work feels right, let’s turn the next idea into a
                      serious build.
                    </p>
                    <p className="contact-subcopy">
                      Open to product work, engineering partnerships, and ambitious interface builds that
                      need a strong point of view.
                    </p>
                  </div>

                  <div className="contact-panel-right">
                    <div className="contact-status">
                      <span className="contact-status-dot" />
                      Available for selected collaborations
                    </div>
                    <p className="contact-right-copy">
                      Product-minded engineering, frontend systems, and high-conviction interfaces built with
                      technical clarity.
                    </p>
                    <a href={`mailto:${contactContent.email}`} className="contact-cta">
                      Start Conversation
                    </a>
                    <a
                      href={publicAsset("Rohan_Chatterjee_Resume.pdf")}
                      className="contact-resume-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download Resume
                    </a>
                    <div className="contact-links">
                      <a href={contactContent.instagram} target="_blank" rel="noreferrer">
                        Instagram
                      </a>
                      <a href={contactContent.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                      <a href={contactContent.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built with precision • 2026</p>
        <div>
          <a href={contactContent.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={contactContent.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={contactContent.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
