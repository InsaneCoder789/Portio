"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { projectSlug } from "@/lib/projects";

/*
 * "How I build", as something to operate rather than look at. Four stages sit on a diagram; pick a failure, then step through
 * what happens, one move at a time. Nothing moves by itself. The counters show the point of the whole design: however many
 * times a request is sent, and whatever breaks on the way, the ledger ends up with exactly one row for it.
 */

type NodeId = "client" | "api" | "outbox" | "ledger";
type EdgeId = "send" | "append" | "apply" | "ack" | "retry";
type State = { sent: number; queued: number; outbox: number; ledger: number; reply: string };
type Step = { title: string; text: string; nodes: NodeId[]; edges: EdgeId[]; state: State; log: string; mood?: "bad" };
type Scenario = { id: string; label: string; blurb: string; steps: Step[] };

const NODES: Record<NodeId, { n: string; title: string; sub: [string, string]; does: string; breaks: string; saves: string; seen: string[] }> = {
  client: {
    n: "01", title: "Phone or browser", sub: ["Works offline.", "Keeps a local queue."],
    does: "Writes every action to a local queue, with a fresh idempotency key, before it touches the network. Sends when it can, and again when it must.",
    breaks: "The network drops mid-request, or the app is closed, or the reply is lost on the way back.",
    saves: "The queue is durable and the key never changes, so resending is always safe, however many times it happens.",
    seen: ["OfflineQR Attendance", "ClassSync", "Folio"],
  },
  api: {
    n: "02", title: "API", sub: ["Validates and signs.", "Drops duplicates."],
    does: "Checks the signature and the shape of the request, then looks the key up. A key it has seen returns the stored result at once.",
    breaks: "Two copies of the same request arrive together, or the same one arrives hours later.",
    saves: "The key lookup and the write share one transaction, so a duplicate can never slip between the check and the insert.",
    seen: ["Rail", "StayPilot", "IncidentLens"],
  },
  outbox: {
    n: "03", title: "Outbox", sub: ["Durable queue, written in", "the same transaction."],
    does: "Holds the promise to do the work. The row is written in the same transaction as the key, so either both exist or neither does.",
    breaks: "A worker takes a row and dies halfway through.",
    saves: "Rows are leased, not removed. If the lease runs out, another worker picks the row up and applies it again, safely.",
    seen: ["Rail", "OfflineQR Attendance"],
  },
  ledger: {
    n: "04", title: "Ledger", sub: ["PostgreSQL. The one", "source of truth."],
    does: "Records the effect: one row per key, with a unique constraint on the key. It is the only place the outcome is decided.",
    breaks: "The same row is applied twice, by two workers or by one that retried.",
    saves: "The unique constraint makes the second write a no-op. History is append-only, so every outcome can be replayed and audited.",
    seen: ["Rail", "StayPilot", "IncidentLens"],
  },
};

const S = (sent: number, queued: number, outbox: number, ledger: number, reply = "none"): State => ({ sent, queued, outbox, ledger, reply });

const SCENARIOS: Scenario[] = [
  {
    id: "happy", label: "Happy path", blurb: "Nothing goes wrong. This is the shape everything else is measured against.",
    steps: [
      { title: "Written down first", text: "The action goes into a local queue with an idempotency key, before any network call. If the app is closed now, nothing is lost.", nodes: ["client"], edges: [], state: S(0, 1, 0, 0), log: "client   queue    key=7f3a" },
      { title: "Sent with its key", text: "Back online, the phone sends it. The API checks the signature and looks the key up. Never seen.", nodes: ["client", "api"], edges: ["send"], state: S(1, 1, 0, 0), log: "client   send     key=7f3a  attempt 1" },
      { title: "Promised, not yet done", text: "In one transaction the API stores the key and an outbox row, then answers quickly. The work is now guaranteed, not finished.", nodes: ["api", "outbox"], edges: ["append"], state: S(1, 1, 1, 0), log: "api      accept   key=7f3a  outbox +1" },
      { title: "Applied once", text: "A worker takes the row and writes the ledger entry. The key is unique in the ledger, so this can only ever succeed one time.", nodes: ["outbox", "ledger"], edges: ["apply"], state: S(1, 1, 0, 1), log: "worker   apply    key=7f3a  ledger +1" },
      { title: "Answered", text: "The result goes back to the phone, which clears its local queue. One request, one row.", nodes: ["ledger", "client"], edges: ["ack"], state: S(1, 0, 0, 1, "result"), log: "client   done     key=7f3a  queue -1" },
    ],
  },
  {
    id: "lost", label: "Reply is lost", blurb: "The server does everything right, and the phone never hears about it.",
    steps: [
      { title: "Sent as usual", text: "The request leaves the phone with its key, exactly as in the happy path.", nodes: ["client", "api"], edges: ["send"], state: S(1, 1, 0, 0), log: "client   send     key=7f3a  attempt 1" },
      { title: "Applied on the server", text: "The API accepts it, the worker applies it, the ledger has its row. Everything on the server side has worked.", nodes: ["api", "outbox", "ledger"], edges: ["append", "apply"], state: S(1, 1, 0, 1), log: "worker   apply    key=7f3a  ledger +1" },
      { title: "The reply never arrives", text: "The phone went into a lift. As far as it can tell, the request may or may not have worked. It cannot know.", nodes: ["ledger", "client"], edges: [], state: S(1, 1, 0, 1, "lost"), log: "client   timeout  key=7f3a  no reply", mood: "bad" },
      { title: "It asks again, the same way", text: "After a backoff the phone sends the same request with the same key. It does not need to know what happened.", nodes: ["client", "api"], edges: ["send"], state: S(2, 1, 0, 1, "lost"), log: "client   send     key=7f3a  attempt 2" },
      { title: "The stored answer comes back", text: "The API finds the key, skips all the work and returns the saved result. The ledger still has one row.", nodes: ["api", "client"], edges: ["ack"], state: S(2, 0, 0, 1, "result"), log: "api      replay   key=7f3a  ledger unchanged" },
    ],
  },
  {
    id: "crash", label: "Worker crashes", blurb: "A worker takes the job and dies halfway through applying it.",
    steps: [
      { title: "Accepted and queued", text: "The request is accepted. The key and the outbox row are written in one transaction.", nodes: ["client", "api", "outbox"], edges: ["send", "append"], state: S(1, 1, 1, 0), log: "api      accept   key=7f3a  outbox +1" },
      { title: "A worker leases the row", text: "The worker marks the row as leased for 30 seconds and starts applying it. The row is not removed.", nodes: ["outbox"], edges: [], state: S(1, 1, 1, 0), log: "worker-1 lease    key=7f3a  30s" },
      { title: "The worker dies", text: "The process is killed before it writes anything. The ledger is unchanged, and the outbox row is still there.", nodes: ["outbox"], edges: [], state: S(1, 1, 1, 0), log: "worker-1 crashed  key=7f3a", mood: "bad" },
      { title: "The lease runs out", text: "Nobody renewed it, so the row becomes available again. A second worker takes it.", nodes: ["outbox"], edges: ["retry"], state: S(1, 1, 1, 0), log: "worker-2 lease    key=7f3a  attempt 2" },
      { title: "Applied, once", text: "The second worker writes the ledger entry. Had the first one got that far, the unique key would have made this a no-op.", nodes: ["outbox", "ledger"], edges: ["apply"], state: S(1, 1, 0, 1), log: "worker-2 apply    key=7f3a  ledger +1" },
      { title: "Answered", text: "The result reaches the phone. A crash cost some time, not correctness.", nodes: ["ledger", "client"], edges: ["ack"], state: S(1, 0, 0, 1, "result"), log: "client   done     key=7f3a" },
    ],
  },
  {
    id: "twice", label: "Sent twice at once", blurb: "A double tap, or two devices, produce the same request at the same moment.",
    steps: [
      { title: "Two copies leave together", text: "The same key, two requests, a few milliseconds apart. Neither knows about the other.", nodes: ["client", "api"], edges: ["send"], state: S(2, 1, 0, 0), log: "client   send x2  key=7f3a" },
      { title: "One wins the key", text: "Both reach the API. The key is inserted under a unique constraint: the first insert succeeds, the second fails.", nodes: ["api"], edges: [], state: S(2, 1, 0, 0), log: "api      conflict key=7f3a  1 accepted, 1 refused" },
      { title: "One outbox row", text: "Only the winner wrote an outbox row. The loser reads the winner's row instead of creating another.", nodes: ["api", "outbox"], edges: ["append"], state: S(2, 1, 1, 0), log: "api      accept   key=7f3a  outbox +1 (not +2)" },
      { title: "Applied once", text: "One row, one worker, one ledger entry.", nodes: ["outbox", "ledger"], edges: ["apply"], state: S(2, 1, 0, 1), log: "worker   apply    key=7f3a  ledger +1" },
      { title: "Both get the same answer", text: "Both callers receive the same result. Two requests came in; one thing happened.", nodes: ["ledger", "client"], edges: ["ack"], state: S(2, 0, 0, 1, "result"), log: "client   done     key=7f3a  x2 same result" },
    ],
  },
  {
    id: "offline", label: "Offline for an hour", blurb: "Three actions happen with no connection at all, and arrive together.",
    steps: [
      { title: "Three actions, no network", text: "Each one is written to the local queue with its own key. The app keeps working and shows them as pending.", nodes: ["client"], edges: [], state: S(0, 3, 0, 0), log: "client   queue x3 keys a1 b2 c3" },
      { title: "The connection returns", text: "The phone sends them in the order they were made, each with its own key.", nodes: ["client", "api"], edges: ["send"], state: S(3, 3, 0, 0), log: "client   send x3  attempt 1 each" },
      { title: "Three promises", text: "Each is accepted separately. Three keys, three outbox rows, written in order.", nodes: ["api", "outbox"], edges: ["append"], state: S(3, 3, 3, 0), log: "api      accept   outbox +3" },
      { title: "Three entries, in order", text: "Workers apply them in the order they were queued. The ledger now matches the order things happened in the real world.", nodes: ["outbox", "ledger"], edges: ["apply"], state: S(3, 3, 0, 3), log: "worker   apply x3 ledger +3" },
      { title: "The queue drains", text: "Results come back and the local queue empties. An hour offline, and nothing was lost or doubled.", nodes: ["ledger", "client"], edges: ["ack"], state: S(3, 0, 0, 3, "result"), log: "client   done x3  queue 0" },
    ],
  },
];

const X = (i: number) => 40 + i * 300, Y = 150, W = 220, H = 124;
const ORDER: NodeId[] = ["client", "api", "outbox", "ledger"];

function Glyph({ id, x, y }: { id: NodeId; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="flow-glyph" aria-hidden="true">
      {id === "client" ? (<><rect x="5" y="1" width="14" height="22" rx="3" /><path d="M10 19h4" /></>) : null}
      {id === "api" ? (<><path d="M12 1.5 21 5v7c0 5.2-3.6 8.6-9 10.5C6.6 20.6 3 17.2 3 12V5z" /><path d="m8 12 3 3 5-6" /></>) : null}
      {id === "outbox" ? (<><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 12 10 5 10-5" /><path d="m2 17 10 5 10-5" /></>) : null}
      {id === "ledger" ? (<><ellipse cx="12" cy="5" rx="9" ry="3.2" /><path d="M3 5v14c0 1.8 4 3.2 9 3.2s9-1.4 9-3.2V5" /><path d="M3 12c0 1.8 4 3.2 9 3.2s9-1.4 9-3.2" /></>) : null}
    </g>
  );
}

export default function BuildFlow() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<NodeId | null>(null);

  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];
  const step = scenario.steps[index];
  const last = scenario.steps.length - 1;
  const focus: NodeId = picked ?? step.nodes[step.nodes.length - 1];
  const detail = NODES[focus];

  const choose = useCallback((id: string) => { setScenarioId(id); setIndex(0); setPicked(null); }, []);
  const go = useCallback((by: number) => { setIndex((current) => Math.min(last, Math.max(0, current + by))); setPicked(null); }, [last]);

  const onKey = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLElement && event.target.closest("[role=tablist]")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
  };

  const history = useMemo(() => scenario.steps.slice(0, index + 1).map((item) => item.log).slice(-6), [scenario, index]);
  const done = index === last;

  const edgeOn = (id: EdgeId) => step.edges.includes(id);
  const nodeOn = (id: NodeId) => step.nodes.includes(id);

  return (
    <div className="flow" onKeyDown={onKey}>
      <div className="flow-top">
        <div className="flow-tabs" role="tablist" aria-label="Choose what goes wrong">
          {SCENARIOS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === scenarioId} className={item.id === scenarioId ? "is-on" : undefined} onClick={() => choose(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="flow-blurb">{scenario.blurb}</p>
      </div>

      <div className="flow-stage">
        <svg className="flow-svg" viewBox="0 0 1200 380" role="group" aria-label="The four stages a request passes through. Select a stage to read about it.">
          <defs>
            <pattern id="flow-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" className="flow-dot" /></pattern>
            <linearGradient id="flow-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#fff" stopOpacity=".025" /></linearGradient>
            <linearGradient id="flow-hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb81c" stopOpacity=".3" /><stop offset="1" stopColor="#ffb81c" stopOpacity=".06" /></linearGradient>
            <filter id="flow-glow" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="12" /></filter>
            <marker id="flow-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M1 1.5 10.5 6 1 10.5l2.5-4.5z" className="flow-head" /></marker>
            <marker id="flow-arrow-on" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M1 1.5 10.5 6 1 10.5l2.5-4.5z" className="flow-head-on" /></marker>
          </defs>
          <rect width="1200" height="380" fill="url(#flow-dots)" />

          {/* the way back: the answer, over the top */}
          <path d={`M${X(3) + W / 2} ${Y - 6} C${X(3) + W / 2} 22 ${X(0) + W / 2} 22 ${X(0) + W / 2} ${Y - 8}`} className={edgeOn("ack") ? "flow-edge is-on dashed" : "flow-edge dashed"} markerEnd={edgeOn("ack") ? "url(#flow-arrow-on)" : "url(#flow-arrow)"} />
          <text x="600" y="48" textAnchor="middle" className={edgeOn("ack") ? "flow-note is-on" : "flow-note"}>the answer</text>

          {/* the lease coming back round on the outbox */}
          <path d={`M${X(2) + W - 40} ${Y + H + 4} C${X(2) + W - 40} ${Y + H + 70} ${X(2) + 40} ${Y + H + 70} ${X(2) + 40} ${Y + H + 6}`} className={edgeOn("retry") ? "flow-edge is-on dashed" : "flow-edge dashed"} markerEnd={edgeOn("retry") ? "url(#flow-arrow-on)" : "url(#flow-arrow)"} />
          <text x={X(2) + W / 2} y={Y + H + 90} textAnchor="middle" className={edgeOn("retry") ? "flow-note is-on" : "flow-note"}>lease expires, taken again</text>

          {([["send", "request + key"], ["append", "one transaction"], ["apply", "unique key"]] as [EdgeId, string][]).map(([id, label], i) => (
            <g key={id}>
              <line x1={X(i) + W + 8} y1={Y + H / 2} x2={X(i + 1) - 10} y2={Y + H / 2} className={edgeOn(id) ? "flow-edge is-on" : "flow-edge"} markerEnd={edgeOn(id) ? "url(#flow-arrow-on)" : "url(#flow-arrow)"} />
              <text x={(X(i) + W + X(i + 1)) / 2} y={Y + H / 2 - 12} textAnchor="middle" className={edgeOn(id) ? "flow-tag is-on" : "flow-tag"}>{label}</text>
            </g>
          ))}

          {ORDER.map((id, i) => {
            const node = NODES[id], on = nodeOn(id), sel = picked === id;
            return (
              <g
                key={id} role="button" tabIndex={0} className={`flow-node${on ? " is-on" : ""}${sel ? " is-picked" : ""}${on && step.mood === "bad" ? " is-bad" : ""}`}
                aria-pressed={sel} aria-label={`${node.title}. ${on ? "Active in this step. " : ""}Read about this stage.`}
                onClick={() => setPicked(sel ? null : id)}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setPicked(sel ? null : id); } }}
              >
                {on ? <rect x={X(i)} y={Y} width={W} height={H} rx="16" className="flow-halo" filter="url(#flow-glow)" /> : null}
                <rect x={X(i)} y={Y} width={W} height={H} rx="16" fill={on ? "url(#flow-hot)" : "url(#flow-card)"} className="flow-fill" />
                <rect x={X(i) + 0.75} y={Y + 0.75} width={W - 1.5} height={H - 1.5} rx="15.25" className="flow-outline" />
                <text x={X(i) + 22} y={Y + 32} className="flow-num">{node.n}</text>
                <Glyph id={id} x={X(i) + W - 46} y={Y + 16} />
                <text x={X(i) + 22} y={Y + 68} className="flow-title">{node.title}</text>
                <text x={X(i) + 22} y={Y + 92} className="flow-sub">{node.sub[0]}</text>
                <text x={X(i) + 22} y={Y + 109} className="flow-sub">{node.sub[1]}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flow-grid">
        <section className="flow-step" aria-label="What is happening">
          <p className="flow-count">Step {index + 1} of {scenario.steps.length}</p>
          <h3 className={step.mood === "bad" ? "is-bad" : undefined}>{step.title}</h3>
          <p className="flow-text" aria-live="polite">{step.text}</p>
          <div className="flow-dots-row" aria-hidden="true">
            {scenario.steps.map((item, i) => <i key={item.title} className={i === index ? "is-now" : i < index ? "is-past" : undefined} />)}
          </div>
          <div className="flow-controls">
            <button type="button" className="btn" onClick={() => go(-1)} disabled={index === 0}>Back</button>
            {done ? (
              <button type="button" className="btn btn-hot" onClick={() => { setIndex(0); setPicked(null); }}>Run it again</button>
            ) : (
              <button type="button" className="btn btn-hot" onClick={() => go(1)}>Next step</button>
            )}
            <span className="flow-hint">or use the arrow keys</span>
          </div>
        </section>

        <section className="flow-state" aria-label="What the system holds right now">
          <dl className="flow-meters">
            <div><dt>Sent</dt><dd key={`s${step.state.sent}`}>{step.state.sent}</dd></div>
            <div><dt>In outbox</dt><dd key={`o${step.state.outbox}`}>{step.state.outbox}</dd></div>
            <div className="is-key"><dt>Ledger rows</dt><dd key={`l${step.state.ledger}`}>{step.state.ledger}</dd></div>
            <div><dt>Reply</dt><dd className="is-word" key={step.state.reply}>{step.state.reply === "none" ? "none yet" : step.state.reply === "lost" ? "lost" : "received"}</dd></div>
          </dl>
          <ol className="flow-log" aria-label="Event log">
            {history.map((line, i) => <li key={`${line}${i}`} className={i === history.length - 1 ? "is-new" : undefined}>{line}</li>)}
          </ol>
        </section>

        <section className="flow-detail" aria-label={`About ${detail.title}`}>
          <p className="flow-count">{picked ? "You picked" : "In this step"} · {detail.n}</p>
          <h3>{detail.title}</h3>
          <dl>
            <div><dt>What it does</dt><dd>{detail.does}</dd></div>
            <div><dt>What goes wrong</dt><dd>{detail.breaks}</dd></div>
            <div><dt>Why it still works</dt><dd>{detail.saves}</dd></div>
          </dl>
          <p className="flow-seen">Seen in {detail.seen.map((name, i) => (
            <span key={name}>{i ? ", " : ""}<Link href={`/projects#${projectSlug(name)}`}>{name}</Link></span>
          ))}</p>
        </section>
      </div>
    </div>
  );
}
