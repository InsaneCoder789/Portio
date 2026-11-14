import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { contactContent } from "@/features/portfolio/content";

export const metadata: Metadata = {
  title: "Terms",
  description: "The rules for using this site, who owns what on it, and what is and is not promised.",
  alternates: { canonical: "/terms" },
  openGraph: { type: "website", title: "Terms | Rohan Chatterjee", description: "The rules for using this site, who owns what on it, and what is and is not promised.", url: "/terms", siteName: "Rohan Chatterjee", locale: "en_IN" },
};

const mail = contactContent.email;

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      lead="A personal portfolio, offered as it is. Read it, share it, link to it. Please do not pass it off as yours."
      updated="14 November 2026"
      sections={[
        { id: "use", title: "Using the site", body: (<><p>You are welcome to browse the site, read the project write-ups and download the résumés. Please do not try to disrupt it, probe it for weaknesses without asking, or copy it wholesale and present it as your own work.</p></>) },
        { id: "ownership", title: "Who owns what", body: (<>
          <p>The writing, design, illustrations and code of this site are © 2026 Rohan Chatterjee unless a page says otherwise. Logos and product names belong to their owners and appear only to say which technologies and organisations are involved.</p>
          <p>Each project&apos;s source code is under the licence stated in its own repository, which may differ from the terms of this site.</p>
          <p>You may quote short passages with a link back, and link to any page. For anything more, ask first.</p>
        </>) },
        { id: "accuracy", title: "How accurate it is", body: (<><p>I try to keep roles, dates, projects and figures correct and current, but this is a personal site and it can lag behind. Statistics fetched from GitHub change on their own and are shown as they arrive. Nothing here is an offer of employment, a contract or professional advice.</p></>) },
        { id: "links", title: "Links to other sites", body: (<><p>Links lead to sites I do not control. I am not responsible for what they contain or how they treat your information.</p></>) },
        { id: "warranty", title: "No warranty, limited liability", body: (<><p>The site is provided as it is, without promises that it will always be available or free of errors. To the extent the law allows, I am not liable for loss arising from using it or from relying on what it says.</p></>) },
        { id: "law", title: "Governing law", body: (<><p>These terms are governed by the laws of India. If a dispute cannot be settled by talking, the courts of Bhubaneswar, Odisha have jurisdiction.</p></>) },
        { id: "contact", title: "Contact", body: (<><p>Questions about these terms: <a href={`mailto:${mail}`}>{mail}</a>.</p></>) },
      ]}
    />
  );
}
