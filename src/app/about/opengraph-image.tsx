import { ogCard, ogSize } from "@/lib/og";

export const alt = "Rohan Chatterjee's profile";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ kicker: "Profile", title: "Rohan Chatterjee", line: "Five roles on one timeline, what each project uses, and how the systems are built.", tags: ["Timeline","Stack","Toolkit"] });
}
