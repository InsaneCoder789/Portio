import { ogCard, ogSize } from "@/lib/og";

export const alt = "Rohan Chatterjee, full-stack and Android engineer";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ kicker: "Software engineer · Bhubaneswar", title: "Rohan Chatterjee", line: "Full-stack and Android. Software that keeps working when the network doesn't.", tags: ["Kotlin","TypeScript","PostgreSQL","Next.js"] });
}
