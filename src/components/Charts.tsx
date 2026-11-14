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
