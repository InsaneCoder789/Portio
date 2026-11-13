import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const title = "Rohan Chatterjee, software engineer";
const description =
  "Full-stack and Android engineer. Offline-first payments, on-device safety tools and operations software built to keep working when the network doesn't.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rochiee24.vercel.app"),
  title: { default: title, template: "%s | Rohan Chatterjee" },
  description,
  authors: [{ name: "Rohan Chatterjee" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "https://rochiee24.vercel.app",
    siteName: "Rohan Chatterjee",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rohan Chatterjee portfolio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
