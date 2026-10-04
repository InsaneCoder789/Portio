// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BootProgress } from "@/lib/boot-preload";
import KaliBootScreen from "./KaliBootScreen";

const preload = vi.hoisted(() => ({ update: (_progress: BootProgress) => {} }));
vi.mock("../lib/boot-preload", () => ({ preloadBootAssets: (_signal: AbortSignal, update: typeof preload.update) => { preload.update = update; return Promise.resolve(); } }));
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: { div: ({ children, className }: { children: React.ReactNode; className: string }) => <div className={className}>{children}</div> },
}));
afterEach(() => { cleanup(); vi.useRealTimers(); });
describe("boot release gate", () => {
  it("does not open on the timer alone; waits for assets AND the scene", () => {
    vi.useFakeTimers();
    const complete = vi.fn();
    const page = render(<KaliBootScreen onComplete={complete} scenesReady={false} />);
    act(() => vi.advanceTimersByTime(6000));
    expect(complete).not.toHaveBeenCalled();
    act(() => preload.update({ completed: 36, total: 36, failed: 0, finished: true }));
    act(() => vi.advanceTimersByTime(1000));
    expect(complete).not.toHaveBeenCalled();
    page.rerender(<KaliBootScreen onComplete={complete} scenesReady />);
    act(() => vi.advanceTimersByTime(500));
    expect(complete).toHaveBeenCalledTimes(1);
  });
  it("keeps failed loading gated but permits an explicit lighter fallback", () => {
    vi.useFakeTimers();
    const complete = vi.fn();
    render(<KaliBootScreen onComplete={complete} />);
    act(() => { preload.update({ completed: 36, total: 36, failed: 2, finished: true }); vi.advanceTimersByTime(6000); });
    expect(complete).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Retry loading" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Continue with available visuals" }));
    expect(complete).toHaveBeenCalledTimes(1);
  });
});
