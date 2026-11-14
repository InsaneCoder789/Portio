import type { MetadataRoute } from "next";

const site = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/projects", "/resumes"].map((path, index) => ({
    url: `${site}${path}`,
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
