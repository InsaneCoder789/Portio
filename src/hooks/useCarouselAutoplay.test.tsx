// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { createElement, StrictMode, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CAROUSEL_DELAY, useCarouselAutoplay } from "./useCarouselAutoplay";

describe("carousel autoplay lifecycle", () => {
  let intersect: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void;
  let motion: () => void;
  let matches: boolean;
  let visibility: DocumentVisibilityState;
  const disconnect = vi.fn();
  const removeMotion = vi.fn();
  const stage = { current: document.createElement("div") };
  beforeEach(() => {
    vi.useFakeTimers();
    matches = false;
    visibility = "visible";
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: typeof intersect) { intersect = callback; }
      observe() {}
      disconnect = disconnect;
    });
    vi.stubGlobal("matchMedia", () => ({
      get matches() { return matches; },
      addEventListener: (_: string, callback: () => void) => { motion = callback; },
      removeEventListener: removeMotion,
    }));
    vi.spyOn(document, "visibilityState", "get").mockImplementation(() => visibility);
  });
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
  const enter = () => act(() => intersect([{ isIntersecting: true, intersectionRatio: 1 }]));

  it("has no offscreen timer; schedules only one advance, not a frame loop", () => {
    const advance = vi.fn();
    renderHook(() => useCarouselAutoplay(stage, true, 0, advance));
    expect(vi.getTimerCount()).toBe(0);
    enter();
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(CAROUSEL_DELAY * 3));
    expect(advance).toHaveBeenCalledTimes(1);
  });
  it("cancels when offscreen or explicitly paused", () => {
    const advance = vi.fn();
    const { rerender } = renderHook(({ enabled }) => useCarouselAutoplay(stage, enabled, 0, advance), { initialProps: { enabled: true } });
    enter();
    act(() => intersect([{ isIntersecting: false, intersectionRatio: 0 }]));
    expect(vi.getTimerCount()).toBe(0);
    enter();
    rerender({ enabled: false });
    expect(vi.getTimerCount()).toBe(0);
  });
  it("suspends hidden tabs and starts a fresh countdown on return", () => {
    const advance = vi.fn();
    renderHook(() => useCarouselAutoplay(stage, true, 0, advance));
    enter();
    act(() => { visibility = "hidden"; document.dispatchEvent(new Event("visibilitychange")); });
    expect(vi.getTimerCount()).toBe(0);
    act(() => { visibility = "visible"; document.dispatchEvent(new Event("visibilitychange")); });
    expect(vi.getTimerCount()).toBe(1);
  });
  it("obeys reduced motion, including changes during playback", () => {
    matches = true;
    renderHook(() => useCarouselAutoplay(stage, true, 0, vi.fn()));
    enter();
    expect(vi.getTimerCount()).toBe(0);
    act(() => { matches = false; motion(); });
    expect(vi.getTimerCount()).toBe(1);
    act(() => { matches = true; motion(); });
    expect(vi.getTimerCount()).toBe(0);
  });
  it("manual activity resets the countdown and cleanup cancels all work", () => {
    const advance = vi.fn();
    const { rerender, unmount } = renderHook(({ activity }) => useCarouselAutoplay(stage, true, activity, advance), { initialProps: { activity: 0 } });
    enter();
    act(() => vi.advanceTimersByTime(CAROUSEL_DELAY - 1));
    rerender({ activity: 1 });
    act(() => vi.advanceTimersByTime(1));
    expect(advance).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(disconnect).toHaveBeenCalledOnce();
    expect(removeMotion).toHaveBeenCalledOnce();
  });
  it("does not duplicate timers under React Strict Mode", () => {
    const advance = vi.fn();
    const { unmount } = renderHook(() => useCarouselAutoplay(stage, true, 0, advance), {
      wrapper: ({ children }: { children: ReactNode }) => createElement(StrictMode, null, children),
    });
    enter();
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(CAROUSEL_DELAY));
    expect(advance).toHaveBeenCalledOnce();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
