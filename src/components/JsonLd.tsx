import { ld } from "@/lib/seo";

// Structured data for search engines: who this site is about, and what is on each page.
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(data) }} />;
}
