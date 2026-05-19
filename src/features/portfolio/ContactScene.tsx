import { contactContent } from "@/features/portfolio/content";

const ContactScene = () => {
  return (
    <section className="contact-scene story-section" id="contact">
      <div className="section-header">
        <p>Contact</p>
        <h2>Build The Next Chapter</h2>
      </div>

      <div className="contact-panel scene-card">
        <a href={`mailto:${contactContent.email}`} className="contact-primary">
          {contactContent.email}
        </a>
        <div className="contact-links">
          <a href={contactContent.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={contactContent.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactScene;
