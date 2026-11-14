import type { CSSProperties } from "react";
import { matrix, roles, timeline } from "@/features/portfolio/story";
import type { GithubStats } from "@/lib/github-live";

const SHADES = ["#ffb81c", "#ff8a1f", "#ffe08a", "#f3f2ed", "#b9b9c2", "#85868f", "#5b5c64", "#3d3d44"];

// Languages as one stacked bar with a legend.
export function LanguageBar({ languages }: { languages: GithubStats["languages"] }) {
  const total = languages.reduce((sum, language) => sum + language.share, 0) || 1;
  return (
    <div className="langbar">
      <div className="langbar-bar" role="img" aria-label={languages.map((language) => `${language.name} ${language.share}%`).join(", ")}>
        {languages.map((language, index) => (
          <i key={language.name} style={{ width: `${(language.share / total) * 100}%`, background: SHADES[index % SHADES.length] }} />
        ))}
      </div>
      <ul className="langbar-key">
        {languages.map((language, index) => (
          <li key={language.name}>
            <i style={{ background: SHADES[index % SHADES.length] }} />
            <span>{language.name}</span>
            <b>{language.share.toFixed(1)}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

// A ring: how far the current value is towards the best one.
export function Ring({ value, of, label }: { value: number; of: number; label: string }) {
  const r = 52, c = 2 * Math.PI * r;
  const part = of > 0 ? Math.min(1, value / of) : 0;
  return (
    <div className="ring-chart">
      <svg viewBox="0 0 128 128" role="img" aria-label={`${value} of ${of} ${label}`}>
        <circle cx="64" cy="64" r={r} className="ring-track" />
        <circle cx="64" cy="64" r={r} className="ring-value" strokeDasharray={`${c * part} ${c}`} transform="rotate(-90 64 64)" />
        <text x="64" y="60" textAnchor="middle" className="ring-num">{value}</text>
        <text x="64" y="80" textAnchor="middle" className="ring-of">of {of}</text>
      </svg>
    </div>
  );
}

// Roles drawn as bars on a month axis, May 2025 to December 2026.
export function Timeline() {
  return (
    <div className="gantt-scroll">
      <div className="gantt" style={{ "--months": timeline.months } as CSSProperties}>
        <div className="gantt-axis" aria-hidden="true">
          {timeline.ticks.map(([at, label]) => (
            <span key={label} style={{ gridColumn: `${at + 1} / span 3` }}>{label}</span>
          ))}
        </div>
        <i className="gantt-now" style={{ "--at": (timeline.now + 0.5) / timeline.months } as CSSProperties} aria-hidden="true"><b>Now</b></i>
        {[...roles].sort((a, b) => a.span[0] - b.span[0]).map((role) => {
          const [start, end] = role.span;
          return (
            <div className="gantt-row" key={role.org}>
              <p className="gantt-label"><b>{role.org}</b><span>{role.role}</span></p>
              <div className="gantt-track">
                <i
                  className={end === null ? "gantt-bar is-open" : "gantt-bar"}
                  data-kind={role.kind === "Internship" ? "intern" : "lead"}
                  style={{ gridColumn: `${start + 1} / ${(end ?? timeline.months) + 1}` }}
                  title={`${role.org}: ${role.when}`}
                >
                  <span>{role.when}</span>
                </i>
                {"mark" in role && role.mark ? (
                  <i className="gantt-mark" style={{ gridColumn: role.mark.at + 1 }} title={role.mark.label}><b>{role.mark.label}</b></i>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <p className="chart-key">
        <span><i data-kind="intern" />Internship</span>
        <span><i data-kind="lead" />Leadership and student teams</span>
        <span><i data-kind="open" />Ongoing</span>
      </p>
    </div>
  );
}

// Which project uses which technology.
export function StackMatrix() {
  return (
    <div className="table-scroll">
      <table className="matrix">
        <thead>
          <tr>
            <th scope="col">Project</th>
            {matrix.cols.map((col) => <th key={col} scope="col"><span>{col}</span></th>)}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map(([name, uses]) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              {matrix.cols.map((col) => (
                <td key={col} className={uses.includes(col) ? "is-used" : undefined}>
                  {uses.includes(col) ? <i aria-label="uses" /> : <span aria-hidden="true" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Projects using it</th>
            {matrix.cols.map((col) => <td key={col}>{matrix.rows.filter(([, uses]) => uses.includes(col)).length}</td>)}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// The pattern most of the projects share: accept the request, record it, do the work once, replay safely. Drawn still: it is a diagram, not a screensaver.
const STAGES = [
  { n: "01", title: "Phone or browser", sub: ["Works offline.", "Keeps a local queue."], note: "request + key", icon: "device" },
  { n: "02", title: "API", sub: ["Validates and signs.", "Drops duplicates."], note: "append", icon: "shield" },
  { n: "03", title: "Outbox", sub: ["Durable queue, written in", "the same transaction."], note: "apply once", icon: "stack", pivot: true },
  { n: "04", title: "Ledger", sub: ["PostgreSQL. The one", "source of truth."], note: "", icon: "database" },
] as const;
const GUARANTEES = ["Safe to retry", "Applied exactly once", "Survives a crash", "Replayable history"];

function Glyph({ kind, x, y }: { kind: (typeof STAGES)[number]["icon"]; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="arch-glyph">
      {kind === "device" ? (<><rect x="5" y="1" width="14" height="22" rx="3" /><path d="M10 19h4" /></>) : null}
      {kind === "shield" ? (<><path d="M12 1.5 21 5v7c0 5.2-3.6 8.6-9 10.5C6.6 20.6 3 17.2 3 12V5z" /><path d="m8 12 3 3 5-6" /></>) : null}
      {kind === "stack" ? (<><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 12 10 5 10-5" /><path d="m2 17 10 5 10-5" /></>) : null}
      {kind === "database" ? (<><ellipse cx="12" cy="5" rx="9" ry="3.2" /><path d="M3 5v14c0 1.8 4 3.2 9 3.200s9-1.4 9-3.200V5" /><path d="M3 12c0 1.8 4 3.2 9 3.200s9-1.4 9-3.2" /></>) : null}
    </g>
  );
}

export function PipelineDiagram() {
  const X = (i: number) => 40 + i * 300, Y = 196, W = 220, H = 128;
  return (
    <svg className="arch" viewBox="0 0 1200 570" role="img" aria-label="A request travels from the phone or browser to the API, into a durable outbox, then into a PostgreSQL ledger. A failed step is retried along the same path with the same idempotency key, so the work is done once, and the result is returned to the client however many times it was sent.">
      <defs>
        <pattern id="arch-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" className="arch-dot" /></pattern>
        <linearGradient id="arch-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".1" /><stop offset="1" stopColor="#ffffff" stopOpacity=".025" /></linearGradient>
        <linearGradient id="arch-hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb81c" stopOpacity=".26" /><stop offset="1" stopColor="#ffb81c" stopOpacity=".05" /></linearGradient>
        <linearGradient id="arch-edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".7" /><stop offset=".5" stopColor="#ffffff" stopOpacity=".16" /><stop offset="1" stopColor="#ffffff" stopOpacity=".45" /></linearGradient>
        <linearGradient id="arch-edge-hot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset=".55" stopColor="#ffb81c" stopOpacity=".5" /><stop offset="1" stopColor="#ff8a1f" /></linearGradient>
        <linearGradient id="arch-ack" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity=".15" /><stop offset=".5" stopColor="#ffffff" stopOpacity=".7" /><stop offset="1" stopColor="#ffffff" stopOpacity=".15" /></linearGradient>
        <filter id="arch-glow" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="14" /></filter>
        <marker id="arch-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M1 1.5 10.5 6 1 10.500l2.5-4.500z" className="arch-head" /></marker>
        <marker id="arch-arrow-hot" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M1 1.5 10.5 6 1 10.500l2.5-4.500z" className="arch-head-hot" /></marker>
      </defs>

      <rect width="1200" height="570" fill="url(#arch-dots)" />

      {/* zones */}
      {[["CLIENT", 40, 260], ["SERVER", 340, 520], ["DURABLE STATE", 640, 520]].map(([label, from, to]) => (
        <g key={label as string}>
          <text x={from as number} y="42" className="arch-zone">{label}</text>
          <line x1={from as number} y1="54" x2={to as number} y2="54" className="arch-zone-line" />
        </g>
      ))}
      <text x="940" y="42" className="arch-zone">SOURCE OF TRUTH</text>
      <line x1="940" y1="54" x2="1160" y2="54" className="arch-zone-line" />

      {/* the acknowledgement returns over the top */}
      <path d="M1050 188 C1050 96 150 96 150 186" className="arch-ack" markerEnd="url(#arch-arrow)" />
      <rect x="388" y="76" width="424" height="30" rx="15" className="arch-chip" />
      <text x="600" y="96" textAnchor="middle" className="arch-note">one result, however many times it was sent</text>

      {/* the retry loop underneath */}
      <path d="M750 332 C750 430 450 430 450 334" className="arch-retry" markerEnd="url(#arch-arrow-hot)" />
      <rect x="470" y="392" width="260" height="30" rx="15" className="arch-chip-hot" />
      <text x="600" y="412" textAnchor="middle" className="arch-note-hot">retry with the same idempotency key</text>

      {/* the straight path */}
      {STAGES.slice(0, 3).map((stage, i) => (
        <g key={stage.n}>
          <line x1={X(i) + W + 10} y1={Y + H / 2} x2={X(i + 1) - 12} y2={Y + H / 2} className={i === 2 ? "arch-line-hot" : "arch-line"} markerEnd={i === 2 ? "url(#arch-arrow-hot)" : "url(#arch-arrow)"} />
          <text x={(X(i) + W + X(i + 1)) / 2} y={Y + H / 2 - 12} textAnchor="middle" className="arch-edge-note">{stage.note}</text>
        </g>
      ))}

      {/* the four stages */}
      {STAGES.map((stage, i) => {
        const hot = "pivot" in stage && stage.pivot;
        return (
          <g key={stage.n}>
            {hot ? <rect x={X(i)} y={Y} width={W} height={H} rx="16" className="arch-halo" filter="url(#arch-glow)" /> : null}
            <rect x={X(i)} y={Y} width={W} height={H} rx="16" fill={hot ? "url(#arch-hot)" : "url(#arch-card)"} />
            <rect x={X(i) + 0.75} y={Y + 0.75} width={W - 1.5} height={H - 1.5} rx="15.250" fill="none" stroke={hot ? "url(#arch-edge-hot)" : "url(#arch-edge)"} strokeWidth="1.5" />
            <path d={`M${X(i) + 24} ${Y + 1} H${X(i) + W - 24}`} className={hot ? "arch-shine-hot" : "arch-shine"} />
            <text x={X(i) + 22} y={Y + 32} className={hot ? "arch-num-hot" : "arch-num"}>{stage.n}</text>
            <Glyph kind={stage.icon} x={X(i) + W - 46} y={Y + 16} />
            <text x={X(i) + 22} y={Y + 68} className="arch-title">{stage.title}</text>
            <text x={X(i) + 22} y={Y + 92} className="arch-sub">{stage.sub[0]}</text>
            <text x={X(i) + 22} y={Y + 110} className="arch-sub">{stage.sub[1]}</text>
          </g>
        );
      })}

      {/* what the shape buys */}
      <line x1="40" y1="468" x2="1160" y2="468" className="arch-zone-line" />
      <text x="40" y="498" className="arch-zone">WHAT THIS GUARANTEES</text>
      {GUARANTEES.map((label, i) => (
        <g key={label} transform={`translate(${340 + i * 205} 478)`}>
          <circle cx="12" cy="12" r="11" className="arch-tick-ring" />
          <path d="m7 12.5 3.5 3.500L17.5 8.5" className="arch-tick" />
          <text x="32" y="17" className="arch-guarantee">{label}</text>
        </g>
      ))}
    </svg>
  );
}
