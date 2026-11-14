import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import TopBar from "@/components/TopBar";
import { featuredProjects } from "@/features/portfolio/content";
import { coverSize } from "@/features/portfolio/story";
import { projectSlug } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Every project in full: the problem, how it works, the outcome and what it taught me.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <a className="skip-link" href="#list">Skip to the projects</a>
      <TopBar solid />

      <main className="sub">
        <header className="band sub-head">
          <div className="wrap">
            <h1>All projects</h1>
            <p className="sub-lead">
              {featuredProjects.length} builds across payments, safety, operations and campus tools. Each one covers
              the problem, how it works, where it ended up and what it taught me.
            </p>
            <nav className="jump" aria-label="Jump to a project">
              {featuredProjects.map((project) => (
                <a key={project.name} href={`#${projectSlug(project.name)}`}>{project.name}</a>
              ))}
            </nav>
          </div>
        </header>

        <div className="mid">
        <Ambient />
        <div id="list" className="band cases">
          <div className="wrap">
            {featuredProjects.map((project, index) => (
              <article key={project.name} id={projectSlug(project.name)} className="case">
                <div className="case-top">
                  <div>
                    <h2>{project.name}</h2>
                    <p className="case-lead">{project.description}</p>
                    <p className="case-stack">{project.stack.join(", ")}</p>
                    <a className="link" href={project.githubUrl} target="_blank" rel="noreferrer">View {project.name} on GitHub</a>
                  </div>
                  <Image className="case-shot" src={project.preview} alt={`${project.name} cover`} width={(coverSize[project.preview] ?? [1600, 900])[0]} height={(coverSize[project.preview] ?? [1600, 900])[1]} sizes="(max-width: 900px) 100vw, 55vw" priority={index === 0} />
                </div>
                <dl className="case-grid">
                  <div><dt>Challenge</dt><dd>{project.challenge}</dd></div>
                  <div><dt>Outcome</dt><dd>{project.outcome}</dd></div>
                  <div><dt>What I learned</dt><dd>{project.learning}</dd></div>
                </dl>
                <div className="case-how">
                  <h3>How it works</h3>
                  <p>{project.details}</p>
                  <p>{project.analysis}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        </div>

        <section className="band closing-short">
          <div className="wrap">
            <h2>Seen enough to talk?</h2>
            <div className="acts">
              <Link className="btn" href="/#contact">Get in touch</Link>
              <Link className="link" href="/#work">Back to the overview</Link>
              <Link className="link" href="/about">Full profile</Link>
            </div>
            <p className="fine">© 2026 Rohan Chatterjee</p>
          </div>
        </section>
      </main>
    </>
  );
}
