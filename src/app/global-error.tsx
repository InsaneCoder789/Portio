"use client";

// The last resort: even the layout failed, so this brings its own page and styles.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000", color: "#f3f2ed", fontFamily: "system-ui, sans-serif", minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <main style={{ maxWidth: 560 }}>
          <p style={{ color: "#ffb81c", letterSpacing: ".16em", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>Rohan Chatterjee</p>
          <h1 style={{ fontSize: 44, margin: "8px 0 12px" }}>The site hit a problem.</h1>
          <p style={{ color: "#b9b9c2", lineHeight: 1.6 }}>Something failed before the page could load. Trying again usually fixes it.</p>
          <button type="button" onClick={reset} style={{ marginTop: 16, minHeight: 44, padding: "0 20px", border: "2px solid #f3f2ed", background: "#f3f2ed", color: "#000", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
