import { ogCard, ogSize } from "@/lib/og";

export const alt = "Rohan Chatterjee's projects";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ kicker: "Projects", title: "Nine builds", line: "Rail, OfflineQR Attendance, IncidentLens, StayPilot, ClassSync and more, in full.", tags: ["Backend","Android","Offline-first"] });
}
