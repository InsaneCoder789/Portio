import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Boot from "@/components/Boot";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

// The address Vercel serves this project from; falls back to localhost when run on a laptop.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";

const title = "Rohan Chatterjee, software engineer";
const description =
  "Full-stack and Android engineer. Offline-first payments, on-device safety tools and operations software built to keep working when the network doesn't.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: title, template: "%s | Rohan Chatterjee" },
  description,
  authors: [{ name: "Rohan Chatterjee" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description,
    url: site,
    siteName: "Rohan Chatterjee",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rohan Chatterjee portfolio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#000000" };

// Marks the page as booting before first paint, so the opening covers the site from the very first frame.
// Visitors who prefer reduced motion skip it, and without JavaScript it never appears.
// It plays once per tab: reloads and trips back to the front page go straight to the site.
const bootScript = `try{var d=document.documentElement,s=sessionStorage,f=/bootSeek/.test(location.search);d.dataset.boot=(!f&&(s.getItem("boot")||matchMedia("(prefers-reduced-motion: reduce)").matches))?"done":"running";if(!f)s.setItem("boot","1")}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <Boot />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
