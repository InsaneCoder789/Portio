import { z } from "zod";

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
