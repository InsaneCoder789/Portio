// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { subscribeScrollActivity } from "./scroll-activity";

describe("shared scroll budget", () => {
  it("suspends once per scroll burst, resumes after settling and cleans up", () => {
    vi.useFakeTimers();
    const first = vi.fn();
    const second = vi.fn();
    const stopFirst = subscribeScrollActivity(first);
    const stopSecond = subscribeScrollActivity(second);
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    expect(first.mock.calls).toEqual([[false], [true]]);
    expect(second.mock.calls).toEqual([[false], [true]]);
    vi.advanceTimersByTime(140);
    expect(first).toHaveBeenLastCalledWith(false);
    stopFirst(); stopSecond();
    window.dispatchEvent(new Event("scroll"));
    expect(first).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });
});
