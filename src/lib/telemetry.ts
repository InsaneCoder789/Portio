import snapshot from "@/features/portfolio/github-snapshot.json";

type Day = { date: string; count: number; level?: number };

const profileKey = "https://api.github.com/users/InsaneCoder789";

// Built from the GitHub snapshot saved in the repo: the 53 weeks up to the day it was captured.
export function telemetry() {
  const capturedAt = snapshot[profileKey].capturedAt;
  const end = capturedAt.slice(0, 10);
  const all = Object.entries(snapshot)
    .filter(([url]) => url.startsWith("https://github-contributions-api"))
    .flatMap(([, entry]) => (entry.data as { contributions: Day[] }).contributions)
    .filter((day) => day.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));

  const lastWeekday = new Date(`${end}T00:00:00Z`).getUTCDay();
  const days = all.slice(-(52 * 7 + lastWeekday + 1));
  const weeks: Day[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const months = weeks.map((week, index) => {
    const month = week[0].date.slice(5, 7);
    const previous = index > 0 ? weeks[index - 1][0].date.slice(5, 7) : "";
    return month !== previous ? new Date(`${week[0].date}T00:00:00Z`).toLocaleString("en", { month: "short", timeZone: "UTC" }) : "";
  });

  return {
    weeks,
    months,
    total: days.reduce((sum, day) => sum + day.count, 0),
    activeDays: days.filter((day) => day.count > 0).length,
    busiest: days.reduce((max, day) => Math.max(max, day.count), 0),
    repos: snapshot[profileKey].data.public_repos,
    stars: snapshot.repositorySummary.data.totalStars,
    captured: new Date(capturedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
  };
}
