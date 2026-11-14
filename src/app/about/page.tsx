import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import TopBar from "@/components/TopBar";
import { LanguageBar, PipelineDiagram, StackMatrix, Timeline } from "@/components/Charts";
import { aboutContent, credibilitySignals, portfolioSignals, skillsMatrix, writingNotes } from "@/features/portfolio/content";
import { facts, kpis, principles, roles, tracks } from "@/features/portfolio/story";
import { githubStats } from "@/lib/github-live";

export const metadata: Metadata = {
  title: "Profile",
  description: "Rohan Chatterjee in charts: the experience timeline, which project uses what, how the systems are built, and the toolkit.",
  alternates: { canonical: "/about" },
};

const toolGroups = [
  { title: "Core", tools: ["React", "TypeScript", "Next.js", "Kotlin", "Node.js"] },
  { title: "Applied in projects", tools: ["FastAPI", "Postgres", "Redis", "Flutter", "SQLite"] },
];
const grouped = toolGroups.flatMap((group) => group.tools);
const supporting = skillsMatrix.filter((skill) => !grouped.includes(skill.label)).map((skill) => skill.label);

function Tools({ names }: { names: string[] }) {
  return (
    <ul className="tags tags-logo">
      {names.map((name) => {
        const logo = skillsMatrix.find((skill) => skill.label === name)?.logo;
        return (
          <li key={name}>
            {logo ? <Image src={logo} alt="" width={20} height={20} unoptimized loading="eager" /> : null}
            {name}
          </li>
        );
      })}
    </ul>
  );
}

// The profile, shown rather than described: a timeline, a matrix, a diagram and a few tables.
export default async function AboutPage() {
  const github = await githubStats();

  return (
    <>
      <a className="skip-link" href="#experience">Skip to the timeline</a>
      <TopBar solid />

      <main className="sub calm">
        <header className="band sub-head">
          <div className="wrap">
            <h1>Profile</h1>
            <p className="sub-lead">Backend, full-stack and Android engineer. The rest of this page is mostly charts.</p>
            <dl className="bento kpis">
              {kpis.map(([value, label], index) => (
                <div key={label} className={index === 0 ? "card tile s4 tile-hot" : "card tile s4"}>
                  <dd className="tile-num">{value}</dd>
                  <dt className="tile-label">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="mid">
        <Ambient calm />
        <section id="experience" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>Timeline</h2>
                <p>Every role on one axis, May 2025 to now.</p>
              </div>
              <Link className="btn" href="/resumes">Both résumés</Link>
            </header>
            <div className="card">
              <Timeline />
            </div>
            <div className="role-notes">
              {roles.map((role) => (
                <details key={role.org} className="card" name="roles">
                  <summary>
                    <Image src={role.logo} alt="" width={44} height={44} unoptimized />
                    <span>
                      <b>{role.org}</b>
                      <span>{role.role}</span>
                    </span>
                  </summary>
                  <ul>
                    {role.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>What runs where</h2>
                <p>Eleven projects against the nine technologies I use most.</p>
              </div>
              <Link className="link" href="/projects">Read the projects</Link>
            </header>
            <div className="card">
              <StackMatrix />
            </div>
          </div>
        </section>

        <section id="method" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>How I build</h2>
                <p>The shape most of these systems share: record the request, do the work once, replay safely.</p>
              </div>
            </header>
            <div className="bento">
              <div className="card s12 card-diagram">
                <PipelineDiagram />
              </div>
              <ol className="s12 steps">
                {principles.map(([title, line]) => (
                  <li key={title}>
                    <b>{title}</b>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="toolkit" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>Toolkit</h2>
                <p>What I reach for, and how much of my code is in each language.</p>
              </div>
            </header>
            <div className="bento">
              {github.languages.length ? (
                <div className="card s7">
                  <h3 className="card-title">Languages on GitHub{github.live ? ", live" : ""}</h3>
                  <LanguageBar languages={github.languages} />
                </div>
              ) : null}
              <div className={github.languages.length ? "card s5" : "card s12"}>
                {toolGroups.map((group) => (
                  <div key={group.title} className="tool-group">
                    <h3 className="card-title">{group.title}</h3>
                    <Tools names={group.tools} />
                  </div>
                ))}
              </div>
              <div className="card s7">
                <h3 className="card-title">Also shipped with</h3>
                <Tools names={supporting} />
              </div>
              <div className="card s5">
                <h3 className="card-title">Focused on now</h3>
                <ul className="tags">
                  {aboutContent.focus.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="record" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>On the record</h2>
                <p>Education, recognition, the two résumés and what I am writing.</p>
              </div>
            </header>
            <div className="bento">
              <div className="card s6">
                <h3 className="card-title">Education and recognition</h3>
                <table className="plain">
                  <tbody>
                    {facts.map(([term, detail]) => (
                      <tr key={term}><th scope="row">{term}</th><td>{detail}</td></tr>
                    ))}
                    <tr><th scope="row">School</th><td>Mayoor Private School, Abu Dhabi (CBSE).</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="card s6">
                <h3 className="card-title">Two résumés</h3>
                <table className="plain">
                  <thead><tr><th scope="col">Version</th><th scope="col">Leads with</th></tr></thead>
                  <tbody>
                    {tracks.map((track) => (
                      <tr key={track.id}><th scope="row">{track.label}</th><td>{track.projects}</td></tr>
                    ))}
                  </tbody>
                </table>
                <Link className="link" href="/resumes">Compare them side by side</Link>
              </div>
              <div className="card s6">
                <h3 className="card-title">Writing</h3>
                <table className="plain">
                  <thead><tr><th scope="col">Note</th><th scope="col">Status</th></tr></thead>
                  <tbody>
                    {writingNotes.map((note) => (
                      <tr key={note.title}><th scope="row">{note.title}</th><td><span className="pill">{note.status}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card s6">
                <h3 className="card-title">Working with me</h3>
                <table className="plain">
                  <tbody>
                    {[...portfolioSignals.slice(0, 2), ...credibilitySignals.slice(1)].map((item) => (
                      <tr key={item.title}><th scope="row">{item.title}</th><td>{item.description}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        </div>

        <section className="band closing-short">
          <div className="wrap">
            <h2>Seen enough to talk?</h2>
            <div className="acts">
              <Link className="btn" href="/#contact">Get in touch</Link>
              <Link className="link" href="/projects">All projects</Link>
              <Link className="link" href="/">Front page</Link>
            </div>
            <p className="fine">© 2026 Rohan Chatterjee</p>
          </div>
        </section>
      </main>
    </>
  );
}
