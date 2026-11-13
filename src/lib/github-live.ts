import { telemetry } from "./telemetry";

// The stats card service reads GitHub live and refreshes every five minutes. It answers with a drawn card (SVG),
// so the numbers are read out of that card and redrawn in the site's own style.
const CARD = "https://github-stats-card-gules.vercel.app/api/card?username=InsaneCoder789";

type Node = { x: number; y: number; text: string };
export type GithubStats = {
  live: boolean;
  updated: string;
  big: { value: string; label: string }[];
  small: { value: string; label: string }[];
  languages: { name: string; share: number }[];
};

function parse(svg: string): GithubStats | null {
  const nodes: Node[] = [];
  for (const match of svg.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)) {
    const x = Number(/\bx="([\d.]+)"/.exec(match[1])?.[1]);
    const y = Number(/\by="([\d.]+)"/.exec(match[1])?.[1]);
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (text && Number.isFinite(x) && Number.isFinite(y)) nodes.push({ x, y, text });
  }

  // On the card every number sits directly above its label, in the same column.
  const above = (label: string) => {
    const at = nodes.find((node) => node.text === label);
    if (!at) return "";
    return nodes
      .filter((node) => Math.abs(node.x - at.x) < 1 && node.y < at.y && /^[\d,.]+$/.test(node.text))
      .sort((a, b) => b.y - a.y)[0]?.text ?? "";
  };

  const commits = above("Commits, past year");
  const allTime = above("Total contributions");
  if (!commits || !allTime) return null;

  const since = nodes.find((node) => /^since /.test(node.text))?.text ?? "";
  const rank = nodes.find((node) => /^[SABCDE][+-]?$/.test(node.text))?.text ?? "";
  const updated = /updated (.+)$/.exec(nodes.find((node) => node.text.includes("updated"))?.text ?? "")?.[1] ?? "";
  const languages = nodes
    .filter((node) => /^[\d.]+%$/.test(node.text))
    .map((share) => ({
      name: nodes.find((node) => node.y === share.y && Math.abs(node.x - (share.x - 200)) < 1)?.text ?? "",
      share: parseFloat(share.text),
    }))
    .filter((language) => language.name)
    .sort((a, b) => b.share - a.share);

  return {
    live: true,
    updated,
    big: [
      { value: commits, label: "commits in the past year" },
      { value: allTime, label: `contributions ${since || "in total"}` },
      { value: above("Longest streak"), label: "days, longest streak" },
      { value: above("Total stars"), label: "stars" },
    ],
    small: [
      { value: above("Pull requests"), label: "pull requests" },
      { value: above("Current streak"), label: "day current streak" },
      { value: above("Followers"), label: "followers" },
      { value: rank, label: "overall grade" },
    ].filter((item) => item.value),
    languages,
  };
}

export async function githubStats(): Promise<GithubStats> {
  try {
    const response = await fetch(CARD, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`stats card answered ${response.status}`);
    const stats = parse(await response.text());
    if (stats) return stats;
  } catch {
    // fall through to the snapshot saved in the repo
  }
  const saved = telemetry();
  return {
    live: false,
    updated: saved.captured,
    big: [
      { value: saved.total.toLocaleString("en"), label: "contributions in the past year" },
      { value: String(saved.activeDays), label: "days with at least one" },
      { value: String(saved.repos), label: "public repositories" },
      { value: String(saved.stars), label: "stars" },
    ],
    small: [],
    languages: [],
  };
}
