import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { projectSlug } from "./projects";
import { featuredProjects } from "../features/portfolio/content";

describe("projects", () => {
  it("gives every project a unique anchor for the projects page", () => {
    const slugs = featuredProjects.map((project) => projectSlug(project.name));
    expect(new Set(slugs).size).toBe(featuredProjects.length);
    expect(projectSlug("OfflineQR Attendance")).toBe("offlineqr-attendance");
  });

  it("points every project at a cover image that exists", () => {
    for (const project of featuredProjects) {
      expect(existsSync(join(process.cwd(), "public", project.preview)), project.name).toBe(true);
    }
  });
});
