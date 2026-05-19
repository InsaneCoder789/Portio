import { heroContent } from "@/features/portfolio/content";

type NarrativeSectionProps = {
  onReplay: () => void;
  onTidy: () => void;
};

const NarrativeSection = ({ onReplay, onTidy }: NarrativeSectionProps) => {
  return (
    <section className="narrative-section" id="about">
      <div className="section-header">
        <p>About</p>
        <h2>The Narrative Layer</h2>
      </div>

      <main className="narrative-layout">
        <p className="narrative-copy">{heroContent.about}</p>
      </main>

      <fieldset className="narrative-controls">
        <button type="button" onClick={onReplay}>
          Replay narrative
        </button>
        <button type="button" onClick={onTidy}>
          Tidy words
        </button>
      </fieldset>
    </section>
  );
};

export default NarrativeSection;
