import type { ReactNode } from "react";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import LegalLinks from "@/components/LegalLinks";
import TopBar from "@/components/TopBar";

export type LegalSection = { id: string; title: string; body: ReactNode };

// A plain, readable page for the small print: a short version first, a contents list, then the sections.
export default function LegalPage({ title, lead, updated, sections }: { title: string; lead: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <a className="skip-link" href="#text">Skip to the text</a>
      <TopBar solid />
      <main className="sub calm">
        <header className="band sub-head">
          <div className="wrap">
            <h1>{title}</h1>
            <p className="sub-lead">{lead}</p>
            <p className="fine">Last updated {updated}</p>
          </div>
        </header>

        <div className="mid">
          <Ambient calm />
          <section id="text" className="band">
            <div className="wrap legal-layout">
              <nav className="legal-toc card" aria-label="On this page">
                <p className="flow-count">On this page</p>
                <ol>
                  {sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
                </ol>
              </nav>
              <div className="prose">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`}>
                    <h2 id={`${section.id}-h`}>{section.title}</h2>
                    {section.body}
                  </section>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="band closing-short">
          <div className="wrap">
            <h2>Questions about this page?</h2>
            <div className="acts">
              <Link className="btn" href="/#contact">Get in touch</Link>
              <Link className="link" href="/">Front page</Link>
            </div>
            <LegalLinks />
            <p className="fine">© 2026 Rohan Chatterjee</p>
          </div>
        </section>
      </main>
    </>
  );
}
