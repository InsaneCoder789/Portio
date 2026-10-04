import { z } from "zod";
import bundledSnapshots from "../features/portfolio/github-snapshot.json";

const snapshots: Record<string, { capturedAt: string; data: unknown }> = bundledSnapshots;
export const savedRepositorySummary = bundledSnapshots.repositorySummary.data;

export function savedTelemetry<T>(url: string, schema: z.ZodType<T>) {
  const candidates: unknown[] = [];
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(`portfolio-telemetry-v1:${url}`) : null;
    if (stored) candidates.push(JSON.parse(stored));
  } catch { /* Denied storage or a corrupt entry must not block the bundled fallback. */ }
  candidates.push(snapshots[url]);
  for (const candidate of candidates) {
    const envelope = z.object({ capturedAt: z.string().datetime(), data: schema }).safeParse(candidate);
    if (envelope.success) return envelope.data;
  }
  return null;
}

export async function readCachedTelemetry<T>(url: string, schema: z.ZodType<T>, signal: AbortSignal) {
  try {
    const data = await readTelemetry(url, schema, signal);
    const snapshot = { data, capturedAt: new Date().toISOString() };
    try { window.localStorage.setItem(`portfolio-telemetry-v1:${url}`, JSON.stringify(snapshot)); } catch { /* Quota/private-mode failures are nonfatal. */ }
    return { ...snapshot, source: "live" as const };
  } catch (error) {
    const saved = savedTelemetry(url, schema);
    if (saved) return { ...saved, source: "saved" as const };
    throw error;
  }
}

const profileUrl = "https://api.github.com/users/InsaneCoder789";
export const initialProfile = bundledSnapshots[profileUrl].data;
export const initialContributions = Object.entries(bundledSnapshots)
  .filter(([url]) => url.startsWith("https://github-contributions-api"))
  .flatMap(([, snapshot]) => (snapshot.data as { contributions: { date: string; count: number; level?: number }[] }).contributions);

export const profileSchema = z.object({ public_repos: z.number(), followers: z.number(), following: z.number(), bio: z.string().nullable() });
export const reposSchema = z.array(z.object({ name: z.string(), description: z.string().nullable(), html_url: z.string(), homepage: z.string().nullable(), language: z.string().nullable(), stargazers_count: z.number(), fork: z.boolean() }));
export const contributionsSchema = z.object({ contributions: z.array(z.object({ date: z.string(), count: z.number(), level: z.number().optional() })) });

/** HTTP errors must never be mistaken for a valid zero-activity snapshot. */
export async function readTelemetry<T>(url: string, schema: z.ZodType<T>, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Telemetry source returned ${response.status}`);
  return schema.parse(await response.json());
}

export function contributionYears(now = new Date()) {
  const start = new Date(now);
  start.setDate(start.getDate() - 364);
  return Array.from({ length: now.getFullYear() - start.getFullYear() + 1 }, (_, index) => start.getFullYear() + index);
}

export function calendarDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
