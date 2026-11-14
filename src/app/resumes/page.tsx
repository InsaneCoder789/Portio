import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import JsonLd from "@/components/JsonLd";
import { resumesLd } from "@/lib/seo";
import TopBar from "@/components/TopBar";
import { facts, roles, tracks } from "@/features/portfolio/story";

export const metadata: Metadata = {
  title: "Résumés",
  description: "Two résumés for Rohan Chatterjee: one for backend and full-stack roles and one for Android. Each has a PDF to download, a list of what it covers, and the roles and degree both share.",
  alternates: { canonical: "/resumes" },
  openGraph: { type: "website", title: "Résumés | Rohan Chatterjee", description: "One for backend and full-stack roles, one for Android. Side by side, with PDFs.", url: "/resumes", siteName: "Rohan Chatterjee", locale: "en_IN" },
};

// The two résumés next to each other, then what each one lists, then what they have in common.
export default function ResumesPage() {
  return (
    <>
      <JsonLd data={resumesLd} />
      <a className="skip-link" href="#pair">Skip to the résumés</a>
      <TopBar solid />

      <main className="sub calm">
        <header className="band sub-head">
          <div className="wrap">
            <h1>Two résumés, one engineer.</h1>
            <p className="sub-lead">Same person, same roles, same degree. Each one puts different work first.</p>
          </div>
        </header>

        <div className="mid">
        <Ambient calm />
        <section id="pair" className="band">
          <div className="wrap pair">
            {tracks.map((track, index) => (
              <article key={track.id} id={track.id} className="card cv">
                <a className="cv-page" href={track.file} target="_blank" rel="noreferrer" aria-label={`Open the ${track.label.toLowerCase()} résumé as a PDF`}>
                  <Image src={track.preview} alt={`First page of the ${track.label.toLowerCase()} résumé`} width={1273} height={1800} sizes="(max-width: 900px) 100vw, 46vw" priority={index === 0} />
                  <span>Open the full page</span>
                </a>
                <div className="cv-body">
                  <p className="pill">{track.forRoles}</p>
                  <h2>{track.label}</h2>
                  <ol className="cv-work">
                    {track.work.map(([name, line]) => (
                      <li key={name}><b>{name}</b><span>{line}</span></li>
                    ))}
                  </ol>
                  <a className="btn" href={track.file} target="_blank" rel="noreferrer">Download PDF</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="compare" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>What each one lists</h2>
                <p>Only what is on that résumé.</p>
              </div>
            </header>
            <div className="bento">
              {tracks.map((track) => (
                <div key={track.id} className="card s6">
                  <p className="pill">{track.label}</p>
                  <h3 className="card-title">{track.title}</h3>
                  <dl className="listing">
                    {track.skills.map(([group, items]) => (
                      <div key={group}><dt>{group}</dt><dd>{items}</dd></div>
                    ))}
                    <div><dt>Projects</dt><dd>{track.projects}</dd></div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="shared" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>What both share</h2>
                <p>Word for word on each.</p>
              </div>
              <Link className="link" href="/about#experience">See the timeline</Link>
            </header>
            <div className="bento">
              <div className="card s7">
                <h3 className="card-title">Roles</h3>
                <table className="plain">
                  <thead><tr><th scope="col">Where</th><th scope="col">Role</th><th scope="col">When</th></tr></thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.org}><th scope="row">{role.org}</th><td>{role.role}</td><td className="nowrap">{role.when}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card s5">
                <h3 className="card-title">Education and recognition</h3>
                <table className="plain">
                  <tbody>
                    {facts.map(([term, detail]) => (
                      <tr key={term}><th scope="row">{term}</th><td>{detail}</td></tr>
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
            <h2>Hiring for one of these?</h2>
            <div className="acts">
              <Link className="btn" href="/#contact">Get in touch</Link>
              <Link className="link" href="/about">Profile</Link>
              <Link className="link" href="/">Front page</Link>
            </div>
            <p className="fine">© 2026 Rohan Chatterjee</p>
          </div>
        </section>
      </main>
    </>
  );
}
