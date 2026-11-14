import Image from "next/image";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import RailField from "@/components/RailField";
import TopBar from "@/components/TopBar";
import PortraitStage from "@/components/PortraitStage";
import ProjectCarousel from "@/components/ProjectCarousel";
import { LanguageBar, Ring } from "@/components/Charts";
import { contactContent } from "@/features/portfolio/content";
import { disciplines, premise, roles } from "@/features/portfolio/story";
import { githubStats } from "@/lib/github-live";

const number = (text: string | undefined) => Number((text ?? "").replace(/[^\d.]/g, "")) || 0;

// The front page is the edited story. The long version of each segment is on /about; every project is on /projects.
export default async function Page() {
  const github = await githubStats();
  const find = (label: string) => [...github.big, ...github.small].find((item) => item.label.includes(label))?.value;

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
              <div className="acts">
                <a className="btn" href="#work">See the work</a>
                <a className="link" href={`mailto:${contactContent.email}`}>Email me</a>
              </div>
            </div>
          </div>
        </section>

        <div className="mid">
        <Ambient />
        <PortraitStage />
        </div>

        <div className="mid calm">
        <Ambient calm />

        <section id="experience" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>Experience</h2>
                <p>Two internships and three teams I help run.</p>
              </div>
              <div className="acts">
                <Link className="link" href="/about#experience">See it as a timeline</Link>
                <Link className="btn" href="/resumes">Both résumés</Link>
              </div>
            </header>
            <div className="drawers">
              {roles.map((role, index) => (
                <details key={role.org} className="card drawer" name="experience" open={index === 0}>
                  <summary>
                    <Image src={role.logo} alt="" width={56} height={56} unoptimized />
                    <span className="drawer-who">
                      <b>{role.org}</b>
                      <span>{role.role}</span>
                    </span>
                    <span className="drawer-kind"><i data-kind={role.kind === "Internship" ? "intern" : "lead"} />{role.kind}</span>
                    <span className="drawer-when">{role.when}</span>
                    <span className="drawer-arrow" aria-hidden="true" />
                  </summary>
                  <ul>
                    {role.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>

        <ProjectCarousel />

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((group) => (
              <p key={group}>
                {disciplines.map((item, index) => <span key={item} className={index % 2 ? "is-dim" : undefined}>{item}</span>)}
              </p>
            ))}
          </div>
        </div>

        <section id="github" className="band">
          <div className="wrap">
            <header className="head">
              <div>
                <h2>GitHub, live</h2>
                <p className="live">
                  <span className={github.live ? "dot is-live" : "dot"} aria-hidden="true" />
                  {github.live ? `Refreshed every five minutes. Last update ${github.updated}.` : `GitHub could not be reached. Saved on ${github.updated}.`}
                </p>
              </div>
              <a className="link" href={contactContent.github} target="_blank" rel="noreferrer">Open my profile</a>
            </header>

            <div className="bento">
              <div className="card tile s5 tile-hot">
                <p className="tile-num">{github.big[0]?.value}</p>
                <p className="tile-label">{github.big[0]?.label}</p>
              </div>
              <div className="card tile s4">
                <p className="tile-num">{github.big[1]?.value}</p>
                <p className="tile-label">{github.big[1]?.label}</p>
              </div>
              {github.live ? (
                <div className="card tile s3 tile-ring">
                  <Ring value={number(find("current streak"))} of={number(find("longest streak"))} label="day streak" />
                  <p className="tile-label">day streak, against my longest</p>
                </div>
              ) : (
                <div className="card tile s3">
                  <p className="tile-num">{github.big[2]?.value}</p>
                  <p className="tile-label">{github.big[2]?.label}</p>
                </div>
              )}
              {github.languages.length ? (
                <div className="card s7">
                  <h3 className="card-title">Languages across my repositories</h3>
                  <LanguageBar languages={github.languages} />
                </div>
              ) : null}
              <div className={github.languages.length ? "card s5 minis" : "card s12 minis"}>
                {[...github.big.slice(3), ...github.small.filter((item) => !item.label.includes("current streak"))].map((item) => (
                  <div key={item.label}>
                    <p className="mini-num">{item.value}</p>
                    <p className="tile-label">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        </div>

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
