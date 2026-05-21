import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";
import "../App.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rochiee24.vercel.app"),
  title: "Rohan Chatterjee | Software Engineer",
  description:
    "Rohan Chatterjee's cinematic portfolio — software engineering, selected works, systems thinking, GitHub telemetry, and contact.",
  keywords: [
    "Rohan Chatterjee",
    "Software Engineer",
    "Full Stack Engineer",
    "React Developer",
    "Kotlin Developer",
    "Portfolio",
  ],
  authors: [{ name: "Rohan Chatterjee" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Rohan Chatterjee | Software Engineer",
    description: "Rohan Chatterjee's cinematic portfolio — software engineering, selected works & more.",
    url: "https://rochiee24.vercel.app/",
    siteName: "Rohan Chatterjee Portfolio",
    images: [
      {
        url: "/og-preview.jpeg",
        width: 2400,
        height: 1792,
        alt: "Rohan Chatterjee portfolio preview banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Chatterjee | Software Engineer",
    description: "Cinematic portfolio for Rohan Chatterjee — software engineering, selected works, systems thinking, and more.",
    images: ["/og-preview.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
