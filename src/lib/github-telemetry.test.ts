import { describe, it, expect, vi, afterEach } from "vitest";
import { contributionYears, readTelemetry, profileSchema, reposSchema } from "./github-telemetry";

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
});
