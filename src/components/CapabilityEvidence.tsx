import { featuredProjects, skillsMatrix } from "../features/portfolio/content";

const capabilityGroups = [
  { title: "Core tools", note: "Across frontend platforms and Android delivery.", tools: ["React", "TypeScript", "Next.js", "Kotlin", "Node.js"] },
  { title: "Applied in projects", note: "Selected implementation paths you can inspect.", tools: ["FastAPI", "Postgres", "Redis", "Flutter", "SQLite"] },
  { title: "Currently exploring", note: "Learning directions, not claims of mastery.", tools: ["Distributed systems", "System design", "Software architecture"] },
];

const evidenceLanes = [
  { title: "Frontend systems", projects: ["K1000", "StayPilot"], description: "Reusable React / Next.js interfaces and property-scoped product workflows." },
  { title: "Android experiences", projects: ["Lakshman-Rekha", "ClassSync"], description: "Kotlin interfaces, explicit application state, and local-first academic workflows." },
  { title: "Backend coordination", projects: ["Rail", "IncidentLens"], description: "Replay-safe execution, persisted evidence, and durable investigation jobs." },
  { title: "Offline workflows", projects: ["OfflineQR Attendance"], description: "Flutter capture, a durable SQLite outbox, and centrally verified attendance proofs." },
];
const additionalTools = skillsMatrix.filter(skill => !capabilityGroups.some(group => group.tools.includes(skill.label)));

/** Native disclosure keeps implementation evidence accessible without more animation. */
export function CapabilityEvidence() {
  return (
    <div className="capability-evidence-layout">
      <div className="capability-groups reveal">
        {capabilityGroups.map(group => (
          <article className="capability-group" key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.note}</p>
            <ul className="capability-tools">
              {group.tools.map(tool => {
                const logo = skillsMatrix.find(skill => skill.label === tool)?.logo;
                return <li key={tool}>{logo ? <img src={logo} alt="" width={22} height={22} loading="lazy" /> : <span className="capability-tool-mark" aria-hidden="true">{tool.slice(0, 2)}</span>}<span>{tool}</span></li>;
              })}
            </ul>
          </article>
        ))}
        <details className="capability-additional">
          <summary>Supporting toolkit</summary>
          <p>Additional technologies from my existing stack.</p>
          <ul className="capability-tools">
            {additionalTools.map(tool => <li key={tool.label}>{tool.logo ? <img src={tool.logo} alt="" width={22} height={22} loading="lazy" /> : null}<span>{tool.label}</span></li>)}
          </ul>
        </details>
      </div>
      <aside className="capability-receipts reveal" aria-label="Project implementation evidence">
        <p className="section-label">Follow the implementation</p>
        <h3>Tools earn their place in the work.</h3>
        {evidenceLanes.map((lane, index) => (
          <details key={lane.title} open={index === 0}>
            <summary>{lane.title}<span aria-hidden="true">↗</span></summary>
            <p>{lane.description}</p>
            <div className="capability-repository-links">
              {lane.projects.map(name => {
                const project = featuredProjects.find(item => item.name === name);
                return project ? <a key={name} href={project.githubUrl} target="_blank" rel="noreferrer">{name} repository ↗</a> : null;
              })}
            </div>
          </details>
        ))}
      </aside>
    </div>
  );
}
