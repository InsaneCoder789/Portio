// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MobileConnectCard } from "./MobileConnectCard";

vi.mock("../features/portfolio/content", () => ({ contactContent: {
  email: "hello@example.com", instagram: "https://instagram.com/example", linkedin: "https://linkedin.com/in/example", github: "https://github.com/example",
} }));
afterEach(cleanup);

describe("mobile Connect card", () => {
  it("uses one outer card without legacy nested frames or a portrait", () => {
    const { container } = render(<MobileConnectCard />);
    expect(screen.getByRole("heading", { name: "Connect" })).toBeTruthy();
    expect(container.querySelectorAll(".section-shell")).toHaveLength(1);
    expect(container.querySelector(".contact-surface,.contact-card,.contact-card-single,img")).toBeNull();
  });
  it("preserves all contact actions and the availability message", () => {
    render(<MobileConnectCard />);
    expect(screen.getByText("Available for selected collaborations")).toBeTruthy();
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /Email Rohan/ }).getAttribute("href")).toBe("mailto:hello@example.com");
    expect(screen.getByText("hello@example.com")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Download Resume/ }).getAttribute("href")).toBe("/Rohan_Chatterjee_Resume.pdf");
  });
});
