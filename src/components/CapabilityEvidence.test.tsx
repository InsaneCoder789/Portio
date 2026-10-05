// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CapabilityEvidence } from "./CapabilityEvidence";
import { featuredProjects } from "../features/portfolio/content";

vi.mock("../features/portfolio/content", () => ({
  skillsMatrix: [],
  featuredProjects: ["K1000", "StayPilot", "Lakshman-Rekha", "ClassSync", "Rail", "IncidentLens", "OfflineQR Attendance"].map(name => ({ name, githubUrl: `https://github.com/InsaneCoder789/${name}` })),
}));

afterEach(cleanup);

describe("capability evidence", () => {
  it("shows honest tool groups without proficiency percentages", () => {
    const { container } = render(<CapabilityEvidence />);
    for (const name of ["Core tools", "Applied in projects", "Currently exploring"]) {
      expect(screen.getByRole("heading", { name })).toBeTruthy();
    }
    expect(container.textContent).not.toMatch(/\d+%/);
    expect(screen.getByText("Learning directions, not claims of mastery.")).toBeTruthy();
  });

  it("links evidence to existing project repositories and supports native disclosure", () => {
    const { container } = render(<CapabilityEvidence />);
    for (const link of screen.getAllByRole("link", { hidden: true })) {
      expect(featuredProjects.some(project => project.githubUrl === link.getAttribute("href"))).toBe(true);
    }
    const details = container.querySelectorAll(".capability-receipts details");
    expect(details).toHaveLength(4);
    expect(details[0].open).toBe(true);
    expect(details[1].open).toBe(false);
    expect(details[1].querySelector("summary")?.textContent).toContain("Android experiences");
    expect(screen.getByRole("link", { name: "K1000 repository ↗" }).getAttribute("href")).toBe("https://github.com/InsaneCoder789/K1000");
  });
});
