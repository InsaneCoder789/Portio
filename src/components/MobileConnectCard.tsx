import { contactContent } from "../features/portfolio/content";

/** Restore the original connection-focused ending on phones, without a portrait. */
export function MobileConnectCard() {
  return (
    <div className="mobile-connect-card section-shell contact-shell">
          <div className="contact-panel-grid">
            <div className="contact-panel-left">
              <p className="section-label">07 / Contact</p>
              <h2>Connect</h2>
              <p className="contact-lead">Have a product worth building? Let’s talk.</p>
              <p className="contact-subcopy">Open to product work, engineering partnerships, and thoughtful frontend builds.</p>
            </div>
            <div className="contact-panel-right">
              <div className="contact-status"><span className="contact-status-dot" aria-hidden="true" />Available for selected collaborations</div>
              <p className="contact-right-copy contact-email-address">{contactContent.email}</p>
              <a href={`mailto:${contactContent.email}`} className="contact-cta">Email Rohan ↗</a>
              <a href="/Rohan_Chatterjee_Resume.pdf" className="contact-resume-link" target="_blank" rel="noreferrer">Download Resume ↗</a>
              <div className="contact-links">
                <a href={contactContent.instagram} target="_blank" rel="noreferrer">Instagram</a>
                <a href={contactContent.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={contactContent.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          </div>
    </div>
  );
}
