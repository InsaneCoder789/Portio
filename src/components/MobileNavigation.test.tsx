// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileNavigation } from "./MobileNavigation";

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("mobile navigation", () => {
  const items = [["About", "#about"], ["Contact", "#contact"]] as const;
  it("locks background scrolling only while open and restores the previous value", () => {
    document.body.style.overflow = "auto";
    const close = vi.fn();
    const page = render(<MobileNavigation open instant={false} items={items} onClose={close} />);
    expect(screen.getByRole("dialog").getAttribute("open")).toBe("");
    expect(document.body.style.overflow).toBe("hidden");
    page.rerender(<MobileNavigation open={false} instant={false} items={items} onClose={close} />);
    expect(document.body.style.overflow).toBe("auto");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("provides working anchors, explicit close, and Escape dismissal", () => {
    const close = vi.fn();
    render(<MobileNavigation open instant items={items} onClose={close} />);
    expect(screen.getByRole("link", { name: /About/ }).getAttribute("href")).toBe("#about");
    fireEvent.click(screen.getByRole("link", { name: /About/ }));
    fireEvent.click(screen.getByRole("button", { name: "Close navigation menu" }));
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: true, cancelable: true }));
    expect(close).toHaveBeenCalledTimes(3);
    expect(screen.getByRole("dialog").getAttribute("data-instant")).toBe("true");
  });
});
