import Link from "next/link";
import RailField from "@/components/RailField";
import TopBar from "@/components/TopBar";
import PortraitStage from "@/components/PortraitStage";
import ProjectCarousel from "@/components/ProjectCarousel";
import { contactContent } from "@/features/portfolio/content";
import { disciplines, premise, roles } from "@/features/portfolio/story";
import { githubStats } from "@/lib/github-live";

// The front page is the edited story. The long version of each segment is on /about; every project is on /projects.
export default async function Page() {
  const github = await githubStats();

  return (
    <>
      <a className="skip-link" href="#work">Skip to the work</a>
      <RailField />
      <TopBar />

      <main>
        <section id="top" className="hero" data-field>
          <div className="hero-shade" aria-hidden="true" />
          <div className="wrap">
            <h1 className="hero-title">
              <span className="line"><span>Software that holds</span></span>
              <span className="line"><span>when the network</span></span>
              <span className="line"><span>doesn&rsquo;t.</span></span>
            </h1>
            <div className="hero-foot">
              <p className="hero-lead">{premise.lead}</p>
              <div className="hero-acts">
                <a className="btn" href="#work">See the work</a>
                <a className="link" href={`mailto:${contactContent.email}`}>Email me</a>
              </div>
            </div>
          </div>
          <p className="hero-hint">Move through the lines. They settle back.</p>
        </section>

        <PortraitStage />

        <section id="experience" className="band band-raised band-tight">
          <div className="wrap">
            <header className="xp-head">
              <h2>Experience</h2>
              <div className="xp-acts">
                <Link className="link" href="/about#experience">Each role in full</Link>
                <Link className="btn" href="/resumes">See both résumés</Link>
              </div>
            </header>
            <ol className="rows">
              {roles.map((role) => (
                <li key={role.org}>
                  <h3>{role.org}</h3>
                  <p className="rows-role">{role.role}</p>
                  <p className="rows-kind">{role.kind}</p>
                  <p className="rows-when">{role.when}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((group) => (
              <p key={group}>
                {disciplines.map((item) => <span key={item}>{item}</span>)}
              </p>
            ))}
          </div>
        </div>

        <ProjectCarousel />

        <section id="github" className="band">
          <div className="wrap">
            <header className="band-head">
              <h2>GitHub, live.</h2>
              <p className="live">
                <span className={github.live ? "dot is-live" : "dot"} aria-hidden="true" />
                {github.live ? `Read from GitHub and refreshed every five minutes. Last update ${github.updated}.` : `GitHub could not be reached, so these are the numbers saved on ${github.updated}.`}
              </p>
            </header>
            <dl className="stats">
              {github.big.map((item) => (
                <div key={item.label}><dd>{item.value}</dd><dt>{item.label}</dt></div>
              ))}
            </dl>
            {github.languages.length ? (
              <div className="gh-lower">
                <div className="langs">
                  <h3>Languages across my repositories</h3>
                  <ul>
                    {github.languages.map((language) => (
                      <li key={language.name}>
                        <span>{language.name}</span>
                        <i style={{ "--share": `${language.share / github.languages[0].share}` } as React.CSSProperties} />
                        <b>{language.share.toFixed(1)}%</b>
                      </li>
                    ))}
                  </ul>
                </div>
                <dl className="gh-small">
                  {github.small.map((item) => (
                    <div key={item.label}><dd>{item.value}</dd><dt>{item.label}</dt></div>
                  ))}
                </dl>
              </div>
            ) : null}
            <a className="link" href={contactContent.github} target="_blank" rel="noreferrer">Open my profile on GitHub</a>
          </div>
        </section>

        <section id="contact" className="closing" data-field>
          <div className="wrap">
            <h2>Building something that can&rsquo;t go down?</h2>
            <a className="closing-mail" href={`mailto:${contactContent.email}`}>{contactContent.email}</a>
            <div className="closing-links">
              <Link className="link" href="/resumes">Résumés</Link>
              <a className="link" href={contactContent.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="link" href={contactContent.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="link" href={contactContent.instagram} target="_blank" rel="noreferrer">Instagram</a>
            </div>
            <div className="closing-foot">
              <p>© 2026 Rohan Chatterjee</p>
              <a href="#top">Back to top</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
