import { contactContent } from "../features/portfolio/content";

/** Restore the original connection-focused ending on phones, without a portrait. */
export function MobileConnectCard() {
  return (
    <div className="mobile-connect-card section-shell contact-shell">
      <div className="contact-surface contact-surface-single">
        <div className="contact-card contact-card-single">
          <div className="contact-panel-grid">
            <div className="contact-panel-left">
              <p className="section-label">07 / Contact</p>
              <h2>Connect</h2>
              <p className="contact-lead">Code • Create • Collaborate. If the work feels right, let’s turn the next idea into a serious build.</p>
              <p className="contact-subcopy">Open to product work, engineering partnerships, and ambitious interface builds that need a strong point of view.</p>
            </div>
            <div className="contact-panel-right">
              <div className="contact-status"><span className="contact-status-dot" aria-hidden="true" />Available for selected collaborations</div>
              <p className="contact-right-copy">Product-minded engineering, frontend systems, and high-conviction interfaces built with technical clarity.</p>
              <a href={`mailto:${contactContent.email}`} className="contact-cta">Start Conversation ↗</a>
              <a href="/Rohan_Chatterjee_Resume.pdf" className="contact-resume-link" target="_blank" rel="noreferrer">Download Resume ↗</a>
              <div className="contact-links">
                <a href={contactContent.instagram} target="_blank" rel="noreferrer">Instagram</a>
                <a href={contactContent.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={contactContent.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
