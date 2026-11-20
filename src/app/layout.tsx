import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Boot from "@/components/Boot";
import { DESCRIPTION, KEYWORDS, NAME, SITE } from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: NAME, template: `%s | ${NAME}` },
  description: DESCRIPTION,
  applicationName: NAME,
  authors: [{ name: NAME, url: SITE }],
  creator: NAME,
  publisher: NAME,
  keywords: KEYWORDS,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: { type: "website", title: NAME, description: DESCRIPTION, url: SITE, siteName: NAME, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: NAME, description: DESCRIPTION },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
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
