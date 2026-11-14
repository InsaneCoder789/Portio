import { ogCard, ogSize } from "@/lib/og";

export const alt = "Rohan Chatterjee's two résumés";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ kicker: "Résumés", title: "Two résumés", line: "One for backend and full-stack roles, one for Android. Side by side, with PDFs.", tags: ["Backend and full-stack","Android"] });
}
