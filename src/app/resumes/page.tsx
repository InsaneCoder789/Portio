import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { facts, roles, tracks } from "@/features/portfolio/story";

export const metadata: Metadata = {
  title: "Résumés",
  description: "Two résumés for two kinds of role: backend and full-stack, and Android. What each leads with, and what they share.",
  alternates: { canonical: "/resumes" },
};

// Why there are two résumés, what each one leads with, and what stays the same in both.
export default function ResumesPage() {
  return (
    <>
      <a className="skip-link" href="#tracks">Skip to the résumés</a>
      <TopBar solid />

      <main className="sub">
        <header className="band sub-head">
          <div className="wrap">
            <h1>Two résumés, one engineer.</h1>
            <p className="sub-lead">
              I build servers and I build Android apps, and a single page can&rsquo;t argue for both well. So there are
              two. The person, the internships and the education are identical. What changes is which work goes first.
            </p>
            <nav className="jump" aria-label="On this page">
              {tracks.map((track) => <a key={track.id} href={`#${track.id}`}>{track.label}</a>)}
              <a href="#shared">What both share</a>
            </nav>
          </div>
        </header>

        <div id="tracks">
          {tracks.map((track, index) => (
            <section key={track.id} id={track.id} className={index % 2 ? "band" : "band band-raised"}>
              <div className={index % 2 ? "wrap cv cv-flip" : "wrap cv"}>
                <a className="cv-page" href={track.file} target="_blank" rel="noreferrer" aria-label={`Open the ${track.label.toLowerCase()} résumé as a PDF`}>
                  <Image src={track.preview} alt={`First page of the ${track.label.toLowerCase()} résumé`} width={1273} height={1800} sizes="(max-width: 900px) 100vw, 44vw" priority={index === 0} />
                </a>

                <div className="cv-text">
                  <p className="cv-for">{track.forRoles}</p>
                  <h2>{track.label}</h2>
                  <p className="cv-story">{track.story}</p>

                  <h3>What it leads with</h3>
                  <dl className="cv-skills">
                    {track.skills.map(([group, items]) => (
                      <div key={group}><dt>{group}</dt><dd>{items}</dd></div>
                    ))}
                  </dl>

                  <h3>The four projects it puts forward</h3>
                  <ul className="cv-projects">
                    {track.work.map(([name, line]) => (
                      <li key={name}><b>{name}</b><span>{line}</span></li>
                    ))}
                  </ul>

                  <div className="cv-acts">
                    <a className="btn" href={track.file} target="_blank" rel="noreferrer">Download this résumé (PDF)</a>
                    <Link className="link" href="/projects">See the projects</Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section id="shared" className="band">
          <div className="wrap">
            <header className="band-head">
              <h2>What both share.</h2>
              <p>The same five roles, the same degree and the same recognition appear on each, word for word.</p>
            </header>
            <div className="shared">
              <ol className="shared-roles">
                {roles.map((role) => (
                  <li key={role.org}>
                    <b>{role.org}</b>
                    <span>{role.role}</span>
                    <span className="quiet">{role.when}</span>
                  </li>
                ))}
              </ol>
              <dl className="stage-facts">
                {facts.map(([term, detail]) => (
                  <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="closing closing-short">
          <div className="wrap">
            <h2>Hiring for one of these?</h2>
            <div className="closing-links">
              <Link className="btn" href="/#contact">Get in touch</Link>
              <Link className="link" href="/about">Full profile</Link>
              <Link className="link" href="/">Back to the front page</Link>
            </div>
            <p className="closing-fine">© 2026 Rohan Chatterjee</p>
          </div>
        </section>
      </main>
    </>
  );
}
