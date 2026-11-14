import type { Metadata } from "next";
import Lost from "@/components/Lost";
import TopBar from "@/components/TopBar";
import { contactContent } from "@/features/portfolio/content";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

// The request went out and nothing came back.
export default function NotFound() {
  return (
    <>
      <TopBar solid />
      <main className="sub">
        <Lost email={contactContent.email} />
      </main>
    </>
  );
}
