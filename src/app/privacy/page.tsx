import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { contactContent } from "@/features/portfolio/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site collects, what it does not, and how to ask me to delete anything. In short: no accounts, no advertising trackers and no cookies set by the site.",
  alternates: { canonical: "/privacy" },
  openGraph: { type: "website", title: "Privacy | Rohan Chatterjee", description: "What this site collects, what it does not, and how to ask me to delete anything.", url: "/privacy", siteName: "Rohan Chatterjee", locale: "en_IN" },
};

const mail = contactContent.email;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      lead="The short version: this site has no accounts, no forms, no advertising and no cookies of its own. It counts visits without following anyone, and that is all."
      updated="14 November 2026"
      sections={[
        { id: "who", title: "Who this is about", body: (<>
          <p>This is the personal website of Rohan Chatterjee, an individual based in Bhubaneswar, Odisha, India. I am the person responsible for the information described on this page. You can reach me at <a href={`mailto:${mail}`}>{mail}</a>.</p>
        </>) },
        { id: "collected", title: "What is collected when you visit", body: (<>
          <p>The site is hosted by Vercel. Like any web host, it processes your IP address and browser details to deliver the pages. I do not receive or store these myself.</p>
          <p>I also use Vercel Web Analytics to see which pages are read. It records the page address, the site you came from, your country, and your browser, operating system and device type. It does not use cookies, does not store your IP address, and cannot follow you from one site to another.</p>
          <ul>
            <li>No advertising or marketing trackers.</li>
            <li>No profiling, and nothing is sold or shared for advertising.</li>
            <li>No sign-in, so there is no account data to hold.</li>
          </ul>
        </>) },
        { id: "device", title: "What stays on your device", body: (<>
          <p>The site sets no cookies. It uses one small note in your browser&apos;s session storage, called <code>boot</code>, so that the opening animation plays once per tab rather than on every page. It never leaves your device and disappears when you close the tab.</p>
        </>) },
        { id: "fetched", title: "Information the site fetches", body: (<>
          <p>The GitHub figures on the front page are fetched by the server from GitHub&apos;s public data and a stats-card service, and refreshed every few minutes. Your browser is not involved, so none of your information is sent to them. Fonts are bundled with the site, so your browser does not contact a font provider either.</p>
        </>) },
        { id: "contact", title: "If you get in touch", body: (<>
          <p>If you email me, I receive your address and what you write. I use it only to reply and to keep a record of the conversation, and I keep it for as long as it is useful. Ask me to delete it and I will.</p>
        </>) },
        { id: "links", title: "Other sites", body: (<>
          <p>The site links to GitHub, LinkedIn, Instagram and to project repositories, and offers résumé PDFs for download. Those places have their own privacy practices that I do not control.</p>
        </>) },
        { id: "rights", title: "Your choices", body: (<>
          <p>You can ask me what I hold about you, to correct it, or to delete it, by emailing <a href={`mailto:${mail}`}>{mail}</a>. I will answer within a reasonable time, and within the limits set by the laws that apply to you, including India&apos;s Digital Personal Data Protection Act, 2023 and, where it applies, the GDPR. You may also complain to your local data protection authority.</p>
          <p>If you would rather not be counted in the visit statistics, most browsers and content blockers can switch analytics off, and the site works the same without it.</p>
        </>) },
        { id: "children", title: "Children", body: (<><p>The site is written for professional visitors and is not aimed at children.</p></>) },
        { id: "changes", title: "Changes", body: (<><p>If the site starts collecting something new, I will update this page and the date at the top before it does.</p></>) },
      ]}
    />
  );
}
