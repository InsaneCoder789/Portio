import { describe, expect, it, vi } from "vitest";
import { reloadScrollScript } from "./reload-scroll";

function run(type: string, hash = "#about") {
  const listeners: Record<string, () => void> = {};
  const browser = { scrollTo: vi.fn(), addEventListener: vi.fn((event: string, fn: () => void) => { listeners[event] = fn; }) };
  const history = { scrollRestoration: "auto", state: { existing: true }, replaceState: vi.fn() };
  const execute = new Function("performance", "history", "location", "window", reloadScrollScript);
  execute({ getEntriesByType: () => [{ type }] }, history, { hash, pathname: "/", search: "?preview=1" }, browser);
  return { browser, history, listeners };
}

describe("reload scroll policy", () => {
  it("resets reloads before hydration and after browser page restoration", () => {
    const { browser, history, listeners } = run("reload");
    expect(history.scrollRestoration).toBe("manual");
    expect(history.replaceState).toHaveBeenCalledWith(history.state, "", "/?preview=1");
    expect(browser.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    listeners.pageshow();
    expect(browser.scrollTo).toHaveBeenCalledTimes(2);
    listeners.pagehide();
    expect(history.scrollRestoration).toBe("auto");
  });
  it.each(["navigate", "back_forward"])("preserves %s navigation and anchor behavior", (type) => {
    const { browser, history } = run(type);
    expect(browser.scrollTo).not.toHaveBeenCalled();
    expect(history.replaceState).not.toHaveBeenCalled();
    expect(browser.addEventListener).not.toHaveBeenCalled();
    expect(history.scrollRestoration).toBe("auto");
  });
  it("does not rewrite URLs without an anchor", () => {
    expect(run("reload", "").history.replaceState).not.toHaveBeenCalled();
  });
});
