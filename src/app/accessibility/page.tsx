import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { contactContent } from "@/features/portfolio/content";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How this site is built to be usable by everyone, what is known to fall short, and how to tell me about a barrier.",
  alternates: { canonical: "/accessibility" },
  openGraph: { type: "website", title: "Accessibility | Rohan Chatterjee", description: "How this site is built to be usable by everyone, what is known to fall short, and how to tell me about a barrier.", url: "/accessibility", siteName: "Rohan Chatterjee", locale: "en_IN" },
};

const mail = contactContent.email;

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      lead="I want this site to work for everyone. Here is what I do about it, what I know falls short, and how to tell me about anything I have missed."
      updated="14 November 2026"
      sections={[
        { id: "aim", title: "What I aim for", body: (<><p>The aim is to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. I check by hand with the keyboard and a screen reader, and with automated tools. The site has not been through a formal external audit, so I describe it as an aim, not a certificate.</p></>) },
        { id: "built", title: "What is built in", body: (<>
          <ul>
            <li>Every page has a &ldquo;skip to content&rdquo; link and a clear heading structure.</li>
            <li>Everything can be used with a keyboard, with a visible focus outline.</li>
            <li>Text is high-contrast on a plain black ground and scales with your browser&apos;s text size.</li>
            <li>On phones, tap targets are at least 44 pixels tall and the pages do not scroll sideways.</li>
            <li>Charts and diagrams have text labels or a written description, and the interactive diagram on the profile page works with the keyboard.</li>
            <li>If your device is set to reduce motion, the opening animation is skipped and the background animations stay still.</li>
          </ul>
        </>) },
        { id: "known", title: "What I know falls short", body: (<>
          <ul>
            <li>The opening animation is drawn on a canvas and has no description. It can be skipped with a click, Escape, Enter or Space, and it plays only once per tab.</li>
            <li>Some project cover images are screenshots, and their text is not available to screen readers; the written project description beside each one carries the same information.</li>
            <li>The moving background on some pages is decorative and hidden from assistive technology, but it can still be distracting. Reducing motion in your system settings stops it.</li>
          </ul>
        </>) },
        { id: "feedback", title: "Tell me about a barrier", body: (<>
          <p>If something on the site is hard to use, email <a href={`mailto:${mail}`}>{mail}</a> with the page address and what happened. I will reply, and I will fix what I can as soon as I can.</p>
        </>) },
      ]}
    />
  );
}
