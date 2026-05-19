import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contactContent,
  experienceItems,
  featuredProjects,
  githubUsername,
  heroContent,
  performanceBenchmarks,
  skillsMatrix,
} from "@/features/portfolio/content";
import ParticleBackground from "@/components/ParticleBackground";
import { publicAsset } from "@/lib/utils";
import "./App.css";

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

function App() {
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

  useEffect(() => {
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

      gsap.to(".portrait-card", {
        y: -10,
        rotate: 0.8,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray<HTMLElement>(".section-shell").forEach((shell) => {
        gsap.fromTo(
          shell,
          { y: 24, opacity: 0.72, scale: 0.992 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: shell,
              start: "top 84%",
            },
          },
        );

        const items = shell.querySelectorAll(".reveal");
        if (!items.length) return;

        gsap.from(items, {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: shell,
            start: "top 80%",
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let alive = true;

    const projectContentMap = new Map(
      featuredProjects.map((project) => [project.name.toLowerCase(), project]),
    );

    const normalizePinnedProject = (repo: GithubRepo): ProjectCard => {
      const fallback = projectContentMap.get(repo.name.toLowerCase());

      return {
        name: repo.name === "K1000" ? "K1000 Platform" : repo.name,
        description:
          fallback?.description ||
          repo.description ||
          "Repository details will appear here once the live metadata resolves.",
        details:
          fallback?.details ||
          repo.description ||
          "A concise implementation note that explains the shipping outcome and technical shape of the repo.",
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
      <ParticleBackground />

      <nav className="nav-shell">
        <div className="nav-inner">
          <a href="#about" className="brand-shell">
            <img src={heroContent.profilePhoto} alt={heroContent.name} className="brand-avatar" />
            <span className="brand-copy">
              <strong>{heroContent.name}</strong>
              <small>{heroContent.role}</small>
            </span>
          </a>

          <div className="nav-links">
            {[
              ["About", "#about"],
              ["Experience", "#experience"],
              ["Projects", "#projects"],
              ["Skills", "#skills"],
              ["GitHub", "#github"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="page-stack">
        <section id="about" className="chapter section-shell hero-shell">
          <div className="hero-copy">
            <p className="eyebrow reveal">
              <span className="eyebrow-dot" />
              Full Stack Engineer
            </p>
            <h1 className="hero-title reveal">
              <span>Engineering</span>
              <span className="hero-title-accent">Scalable</span>
              <span>Systems.</span>
            </h1>
            <div className="manifesto-card reveal">
              <p className="manifesto-kicker">A portfolio with a point of view</p>
              <p>{heroContent.intro}</p>
              <p>{heroContent.summary}</p>
            </div>
            <div className="hero-actions reveal">
              <a href="#contact" className="button button-primary">
                Start Conversation
              </a>
              <a href="#projects" className="button button-secondary">
                Selected Works
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-card reveal">
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

            <div className="signal-grid reveal">
              <article>
                <span>Built for</span>
                <strong>People, products, and platforms</strong>
              </article>
              <article>
                <span>Current stack</span>
                <strong>Kotlin • React • Next.js • FastAPI • Node.js</strong>
              </article>
            </div>
          </div>
        </section>

        <section id="experience" className="chapter">
          <div className="section-shell experience-shell">
            <div className="section-heading reveal">
              <p className="section-label">01 / Journey</p>
              <h2>Experience</h2>
              <p className="section-intro">
                A clean archive of the roles, systems, and teams that shaped how I build and ship products.
              </p>
            </div>

            <div className="experience-layout">
              <aside className="experience-note reveal">
                <p className="note-title">Working thesis</p>
                <p>
                  Great software feels deliberate. I like roles that combine product judgment, technical
                  execution, and a clear visual system around the work.
                </p>
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
              <h2>Selected Works</h2>
              <p className="section-intro">
                Live pinned repositories from GitHub, recast into a uniform grid so the work reads like a
                curated portfolio rather than a list of links.
              </p>
            </div>

            <div className="project-grid">
              {projectShowcase.map((project, index) => (
                <article key={project.name} className="project-card reveal">
                  <div className="project-top">
                    <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="project-badge">Pinned repository</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <p className="project-details">{project.details}</p>
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
              <h2>Capability Atlas</h2>
              <p className="section-intro">
                The tools I lean on most, plus the language mix surfaced from my public GitHub repositories.
              </p>
            </div>

            <div className="skills-layout">
              <div className="skills-grid reveal">
                {allSkills.map((skill) => (
                  <article key={skill.label} className="skill-tile">
                    <div className="skill-icon">
                      {skill.logo ? (
                        <img src={skill.logo} alt={skill.label} />
                      ) : (
                        <span>{skill.label.slice(0, 2).toUpperCase()}</span>
                      )}
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

        <section id="github" className="chapter">
          <div className="section-shell github-shell">
            <div className="section-heading reveal">
              <p className="section-label">04 / GitHub</p>
              <h2>Telemetry</h2>
              <p className="section-intro">
                A live proof-of-work view with public repo counts, total stars, and the last year of
                contributions only.
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
                    <span key={month.index} style={{ gridColumnStart: month.index + 1 }}>
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
          </div>
        </section>

        <section id="contact" className="chapter">
          <div className="section-shell contact-shell reveal">
            <div className="contact-copy">
              <p className="section-label">05 / Contact</p>
              <h2>Connect</h2>
              <p>
                Code • Create • Collaborate. If the work feels right, let’s turn the next idea into a
                serious build.
              </p>
            </div>

            <div className="contact-card">
              <a href={`mailto:${contactContent.email}`} className="contact-cta">
                Start Conversation
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
