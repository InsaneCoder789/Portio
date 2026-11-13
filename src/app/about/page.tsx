import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import {
  aboutContent,
  credibilitySignals,
  portfolioSignals,
  skillsMatrix,
  writingNotes,
} from "@/features/portfolio/content";
import { facts, roles } from "@/features/portfolio/story";

export const metadata: Metadata = {
  title: "Profile",
  description: "Rohan Chatterjee in full: every role, the toolkit, how he works and what he is writing.",
  alternates: { canonical: "/about" },
};

const toolGroups = [
  { title: "Core tools", note: "Across frontend platforms and Android delivery.", tools: ["React", "TypeScript", "Next.js", "Kotlin", "Node.js"] },
  { title: "Applied in projects", note: "Implementation paths you can inspect.", tools: ["FastAPI", "Postgres", "Redis", "Flutter", "SQLite"] },
  { title: "Currently exploring", note: "Learning directions, not claims of mastery.", tools: ["Distributed systems", "System design", "Software architecture"] },
];
const grouped = toolGroups.flatMap((group) => group.tools);
const supporting = skillsMatrix.filter((skill) => !grouped.includes(skill.label));

function Tools({ names }: { names: string[] }) {
  return (
    <ul className="tools">
      {names.map((name) => {
        const logo = skillsMatrix.find((skill) => skill.label === name)?.logo;
        return (
          <li key={name}>
            {logo ? <Image src={logo} alt="" width={18} height={18} unoptimized /> : null}
            {name}
          </li>
        );
      })}
    </ul>
  );
}

// Everything the front page leaves out: the long version of each segment.
export default function AboutPage() {
  return (
    <>
      <a className="skip-link" href="#experience">Skip to experience</a>
      <TopBar solid />

      <main className="sub">
        <header className="band sub-head">
          <div className="wrap">
            <h1>Profile</h1>
            <p className="sub-lead">{aboutContent.lead}</p>
            <nav className="jump" aria-label="On this page">
              <a href="#experience">Experience</a>
              <a href="#resumes">Résumés</a>
              <a href="#education">Education</a>
              <a href="#toolkit">Toolkit</a>
              <a href="#principles">Principles</a>
              <a href="#signals">Signals</a>
            </nav>
          </div>
        </header>

        <section id="experience" className="band band-raised">
          <div className="wrap">
            <h2>Experience</h2>
            <ol className="ledger">
              {roles.map((role) => (
                <li key={role.org}>
                  <p className="ledger-when">
                    <span>{role.when}</span>
                    <span>{role.kind}</span>
                  </p>
                  <div>
                    <h3>{role.org}</h3>
                    <p className="ledger-role">{role.role}</p>
                    <ul className="ledger-points">
                      {role.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="resumes" className="band">
          <div className="wrap principles">
            <h2>Two résumés</h2>
            <div className="cv-pointer">
              <p>One for backend and full-stack roles, one for Android. Same person and experience; different work goes first.</p>
              <Link className="btn" href="/resumes">See both résumés</Link>
            </div>
          </div>
        </section>

        <section id="education" className="band band-raised">
          <div className="wrap principles">
            <h2>Education and recognition</h2>
            <dl className="stage-facts">
              {facts.map(([term, detail]) => (
                <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>
              ))}
              <div><dt>School</dt><dd>Mayoor Private School, Abu Dhabi (CBSE).</dd></div>
            </dl>
          </div>
        </section>

        <section id="toolkit" className="band">
          <div className="wrap">
            <h2>Toolkit</h2>
            <div className="toolkit">
              {toolGroups.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <p className="quiet">{group.note}</p>
                  <Tools names={group.tools} />
                </article>
              ))}
              <article>
                <h3>Supporting toolkit</h3>
                <p className="quiet">The rest of the stack I have shipped with.</p>
                <Tools names={supporting.map((tool) => tool.label)} />
              </article>
            </div>
          </div>
        </section>

        <section id="principles" className="band band-raised">
          <div className="wrap principles">
            <h2>Principles</h2>
            <div>
              <ol className="principle-list">
                {aboutContent.points.map((point) => <li key={point}>{point}</li>)}
              </ol>
              <h3>What I&rsquo;m focused on</h3>
              <ul className="tools">
                {aboutContent.focus.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="signals" className="band">
          <div className="wrap">
            <h2>Signals</h2>
            <div className="signals">
              <article>
                <h3>Fit</h3>
                <dl>
                  {portfolioSignals.map((item) => (
                    <div key={item.title}><dt>{item.title}</dt><dd>{item.description}</dd></div>
                  ))}
                </dl>
              </article>
              <article>
                <h3>Writing</h3>
                <dl>
                  {writingNotes.map((note) => (
                    <div key={note.title}><dt>{note.title}</dt><dd>{note.summary}</dd><dd className="status">{note.status}</dd></div>
                  ))}
                </dl>
              </article>
              <article>
                <h3>Proof</h3>
                <dl>
                  {credibilitySignals.map((signal) => (
                    <div key={signal.title}><dt>{signal.title}</dt><dd>{signal.description}</dd></div>
                  ))}
                </dl>
              </article>
            </div>
          </div>
        </section>

        <section className="closing closing-short">
          <div className="wrap">
            <h2>Seen enough to talk?</h2>
            <div className="closing-links">
              <Link className="btn" href="/#contact">Get in touch</Link>
              <Link className="link" href="/projects">All projects</Link>
              <Link className="link" href="/">Back to the front page</Link>
            </div>
            <p className="closing-fine">© 2026 Rohan Chatterjee</p>
          </div>
        </section>
      </main>
    </>
  );
}
