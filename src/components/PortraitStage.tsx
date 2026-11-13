import Image from "next/image";
import Link from "next/link";
import { facts, premise } from "@/features/portfolio/story";

/*
 * The portrait, staged like a cover and kept still. The name is set as large as the window allows and split in
 * depth: ROHAN stands behind the figure, CHATTERJEE is set solid across the foot of the frame.
 */
export default function PortraitStage() {
  return (
    <section id="about" className="stage-section" aria-labelledby="about-title">
      <div className="stage">
        <div className="stage-light" aria-hidden="true" />
        <p className="stage-name stage-name-back" aria-hidden="true">Rohan</p>
        <div className="stage-figure">
          <Image className="stage-photo" src="/transparent1.png" alt="Rohan Chatterjee in a navy suit and sunglasses" width={1536} height={1536} sizes="(max-width: 900px) 120vw, 60vw" />
        </div>
        <div className="stage-floor" aria-hidden="true" />
        <p className="stage-name stage-name-front" aria-hidden="true">Chatterjee</p>
        <p className="stage-tag" aria-hidden="true"><span>Backend and full-stack</span><span>Android</span><span>KIIT, class of 2028</span></p>
      </div>

      <div className="wrap stage-copy">
        <div className="stage-lead">
          <h2 id="about-title">{premise.statement}</h2>
          <p className="about-lead">{premise.note}</p>
          <p className="about-body">{premise.bio}</p>
          <div className="about-acts">
            <Link className="btn" href="/about">Read the full profile</Link>
            <Link className="link" href="/resumes">The two résumés</Link>
          </div>
        </div>
        <dl className="stage-facts">
          {facts.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
