import { describe, it, expect, vi, afterEach } from "vitest";
import { contributionYears, readTelemetry, readCachedTelemetry, savedTelemetry, profileSchema, reposSchema } from "./github-telemetry";

afterEach(() => vi.unstubAllGlobals());
describe("GitHub readings", () => {
  it("requests the actual rolling-year range rather than hardcoded years", () => {
    expect(contributionYears(new Date(2028, 5, 1))).toEqual([2027, 2028]);
    expect(contributionYears(new Date(2028, 11, 31))).toEqual([2028]);
  });
  it("rejects rate-limited HTTP responses instead of displaying zero", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(readTelemetry("/profile", profileSchema, new AbortController().signal)).rejects.toThrow("403");
  });
  it("rejects error objects masquerading as repositories", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: "Unavailable" }) }));
    await expect(readTelemetry("/repos", reposSchema, new AbortController().signal)).rejects.toThrow();
  });
  it("keeps genuine zero readings and passes cancellation to fetch", async () => {
    const profile = { public_repos: 0, followers: 0, following: 0, bio: null };
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => profile });
    vi.stubGlobal("fetch", fetcher);
    const signal = new AbortController().signal;
    expect(await readTelemetry("/profile", profileSchema, signal)).toEqual(profile);
    expect(fetcher).toHaveBeenCalledWith("/profile", { signal });
  });
  it("uses the verified bundled profile during a first-visit outage", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    const snapshot = await readCachedTelemetry("https://api.github.com/users/InsaneCoder789", profileSchema, new AbortController().signal);
    expect(snapshot.source).toBe("saved");
    expect(snapshot.data.public_repos).toBe(33);
    expect(snapshot.data.followers).toBe(5);
  });
  it("prefers a newer successful browser snapshot and retains it when requests fail", async () => {
    const cache = new Map<string, string>();
    vi.stubGlobal("window", { localStorage: { getItem: (key: string) => cache.get(key), setItem: (key: string, value: string) => cache.set(key, value) } });
    const data = { public_repos: 40, followers: 7, following: 6, bio: "Updated profile" };
    const fetcher = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => data }).mockResolvedValueOnce({ ok: false, status: 503 });
    vi.stubGlobal("fetch", fetcher);
    const url = "https://api.github.com/users/InsaneCoder789";
    expect((await readCachedTelemetry(url, profileSchema, new AbortController().signal)).source).toBe("live");
    expect((await readCachedTelemetry(url, profileSchema, new AbortController().signal)).data).toEqual(data);
  });
  it("ignores corrupt cache and safely tolerates inaccessible browser storage", () => {
    vi.stubGlobal("window", { localStorage: { getItem: () => "invalid json" } });
    expect(savedTelemetry("https://api.github.com/users/InsaneCoder789", profileSchema)?.data.followers).toBe(5);
    vi.stubGlobal("window", { localStorage: { getItem: () => { throw new Error("Denied"); } } });
    expect(savedTelemetry("https://api.github.com/users/InsaneCoder789", profileSchema)?.data.followers).toBe(5);
    expect(savedTelemetry("/unknown", profileSchema)).toBeNull();
  });
});
