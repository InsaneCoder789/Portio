import { NextResponse } from "next/server";
import { githubUsername } from "@/features/portfolio/content";

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "rochiee-portfolio",
};

async function fetchJson<T>(url: string, headers?: HeadersInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function GET() {
  const currentYear = new Date().getUTCFullYear();
  const years = [currentYear - 1, currentYear];

  const [profile, repos, ...contributionResponses] = await Promise.all([
    fetchJson(`https://api.github.com/users/${githubUsername}`, githubHeaders),
    fetchJson(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, githubHeaders),
    ...years.map((year) =>
      fetchJson(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=${year}`),
    ),
  ]);

  const contributions = contributionResponses.flatMap((response) => {
    if (!response || typeof response !== "object" || !("contributions" in response)) return [];
    const value = response as { contributions?: unknown[] };
    return Array.isArray(value.contributions) ? value.contributions : [];
  });

  return NextResponse.json(
    { profile, repos: Array.isArray(repos) ? repos : [], contributions },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
