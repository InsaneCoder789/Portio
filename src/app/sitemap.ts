import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/projects", "/resumes", "/privacy", "/terms", "/accessibility"].map((path, index) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : index < 4 ? 0.7 : 0.3,
  }));
}
