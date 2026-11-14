import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/projects", "/resumes"].map((path, index) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
