import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rohan Chatterjee",
    short_name: "Rohan",
    description: "Full-stack and Android engineer. Portfolio, projects and résumés.",
    start_url: "/",
    display: "browser",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  };
}
