import { experienceItems } from "@/features/portfolio/content";

const ExperienceScene = () => {
  return (
    <section className="story-section" id="experience">
      <div className="section-header">
        <p>Experience</p>
        <h2>Career Chapters</h2>
      </div>

      <div className="experience-scene-grid">
        {experienceItems.map((item) => (
          <article key={`${item.company}-${item.role}`} className="experience-panel scene-card">
            <div className="experience-logo-shell">
              <img src={item.logo} alt={item.company} className="experience-logo" referrerPolicy="no-referrer" />
            </div>
            <div className="experience-panel-copy">
              <p className="experience-company">{item.company}</p>
              <h3>{item.role}</h3>
              <span>{item.duration}</span>
              {item.points?.[0] && <p>{item.points[0]}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ExperienceScene;
