import type { Metadata } from "next";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = { title: "Page not found" };

const places = [
  ["Front page", "/", "The short version of everything"],
  ["Projects", "/projects", "All nine, in full"],
  ["Profile", "/about", "Timeline, stack and toolkit"],
  ["Résumés", "/resumes", "Both versions, side by side"],
];

// The request went out and nothing came back.
export default function NotFound() {
  return (
    <>
      <TopBar solid />
      <main className="sub lost">
        <Ambient />
        <section className="band lost-band">
          <div className="wrap">
            <p className="lost-code" aria-hidden="true">
              4<span>0</span>4
            </p>
            <h1>That request never arrived.</h1>
            <p className="sub-lead">
              There is no page at this address. It may have been mistyped, or the page has moved. Everything that
              exists is one step from here.
            </p>

            <svg className="lost-line" viewBox="0 0 900 60" role="img" aria-label="A request leaves the browser and stops before it reaches the page.">
              <rect x="2" y="12" width="150" height="36" rx="0" className="pipe-box" />
              <text x="77" y="35" textAnchor="middle" className="pipe-sub">Your browser</text>
              <line x1="160" y1="30" x2="520" y2="30" className="pipe-line" />
              <line x1="560" y1="30" x2="738" y2="30" className="lost-gap" />
              <path d="M528 18 552 42M552 18 528 42" className="lost-cross" />
              <rect x="748" y="12" width="150" height="36" rx="0" className="lost-missing" />
              <text x="823" y="35" textAnchor="middle" className="pipe-sub">Nothing here</text>
              <circle r="5" className="pipe-packet">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M160 30 H520" />
              </circle>
            </svg>

            <nav className="bento lost-places" aria-label="Places that exist">
              {places.map(([label, href, note]) => (
                <Link key={href} href={href} className="card s3">
                  <b>{label}</b>
                  <span>{note}</span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
