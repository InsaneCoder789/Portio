import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";
import "../App.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rochiee24.vercel.app"),
  title: "Rohan Chatterjee | Software Engineer",
  description: "Rohan Chatterjee's cinematic portfolio...",
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
    description: "Rohan Chatterjee's cinematic portfolio...",
    url: "https://rochiee24.vercel.app",
    siteName: "Rohan Chatterjee Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rohan Chatterjee portfolio preview banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Chatterjee | Software Engineer",
    description: "Rohan Chatterjee's cinematic portfolio...",
    images: ["/og-image.png"],
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
