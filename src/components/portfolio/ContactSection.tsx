import { ArrowUpRight, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ContactSectionProps = {
  contact: {
    email: string;
    instagram: string;
    linkedin: string;
    github: string;
  };
};

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" className="w-full">
      <div className="section-frame contact-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="liquid-blob liquid-blob-contact" />
        <div className="contact-layout relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div className="contact-copy space-y-6">
            <p className="text-[0.68rem] uppercase tracking-[0.42em] text-sky-100/72">07 / Contact</p>
            <h2 className="contact-title max-w-4xl font-['Outfit'] text-[clamp(2.7rem,8vw,7rem)] font-semibold uppercase leading-[0.88] tracking-[-0.08em] text-white">
              Let&apos;s build something with taste and backbone.
            </h2>
            <p className="contact-description max-w-3xl text-base leading-8 text-sky-50/82 md:text-lg">
              Open to software engineering roles, frontend-heavy builds, product-minded internships, and collaborative work where technical clarity still matters.
            </p>
            <div className="contact-cta-row flex flex-wrap gap-3">
              <Button asChild className="contact-primary-action rounded-full">
                <a href={`mailto:${contact.email}`}>
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </a>
              </Button>
              <Button asChild className="contact-primary-action contact-linkedin-action rounded-full">
                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-linkedin-action">
                  LinkedIn
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <Card className="contact-panel-card portfolio-card border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <CardContent className="contact-panel-content space-y-6 p-6">
              <div className="space-y-3">
                <p className="text-[0.62rem] uppercase tracking-[0.32em] text-sky-100/78">Available for selected collaborations</p>
                <h3 className="font-['Outfit'] text-3xl font-semibold tracking-[-0.05em] text-white">
                  Frontend systems, product taste, and serious execution.
                </h3>
                <p className="text-sm leading-7 text-slate-200/85">
                  The ideal work sits at the intersection of interface quality, technical structure, and product clarity.
                </p>
              </div>

              <div className="contact-social-links flex flex-wrap gap-3">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white transition hover:bg-white/10 sm:px-4 sm:text-[0.68rem] sm:tracking-[0.3em]"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-linkedin-pill inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white transition hover:bg-white/10 sm:px-4 sm:text-[0.68rem] sm:tracking-[0.3em]"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white transition hover:bg-white/10 sm:px-4 sm:text-[0.68rem] sm:tracking-[0.3em]"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
