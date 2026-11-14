import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// The picture shown when a page is shared: black ground, the name set large, one amber accent.
export function ogCard({ kicker, title, line, tags }: { kicker: string; title: string; line: string; tags: string[] }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", color: "#f3f2ed", padding: "64px 72px", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "radial-gradient(900px 420px at 100% 0%, rgba(255,184,28,.22), rgba(0,0,0,0))" }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 150 + i * 120, height: 1, background: "rgba(255,255,255,.07)", display: "flex" }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#ffb81c", fontWeight: 700 }}>
          <div style={{ width: 44, height: 4, background: "#ffb81c", display: "flex" }} />
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: title.length > 10 ? 112 : 150, whiteSpace: "nowrap", fontWeight: 800, lineHeight: 0.95, letterSpacing: -4, display: "flex" }}>{title}</div>
          <div style={{ fontSize: 34, color: "#b9b9c2", lineHeight: 1.3, maxWidth: 940, display: "flex" }}>{line}</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {tags.map((tag) => (
            <div key={tag} style={{ display: "flex", border: "2px solid rgba(255,255,255,.5)", padding: "8px 20px", fontSize: 24, fontWeight: 600 }}>{tag}</div>
          ))}
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
