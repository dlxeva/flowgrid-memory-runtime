import { useState } from "react";
import { createRoot } from "react-dom/client";
import type { Authority, RuntimeState } from "./domain";
import { applyConversionEvidence, createDemoState, proposeKolRevision, resume } from "./runtime";
import "./styles.css";

const authorityLabel: Record<Authority, string> = { high: "Human-confirmed", medium: "Reviewed", low: "Inferred" };

function App() {
  const [state, setState] = useState<RuntimeState>(createDemoState);
  const resumed = state.auditEvents.some((event) => event.action === "resumed");
  const pending = state.proposals.some((proposal) => proposal.status === "pending");
  const applied = state.proposals.some((proposal) => proposal.status === "applied");

  return (
    <main>
      <header className="masthead">
        <div>
          <p className="eyebrow">FlowGrid research prototype</p>
          <h1>Memory should respect commitments.</h1>
        </div>
        <div className="runtime-status"><span /> Local demo runtime</div>
      </header>

      <section className="thesis">
        <p>Most agent memory retrieves what was said. This runtime decides what is still authorized to change the project.</p>
      </section>

      <section className="stage" aria-label="Demo controls">
        <div className="stage-copy">
          <p className="eyebrow">Three-agent continuity test</p>
          <h2>{applied ? "Evidence changed the decision safely." : pending ? "The project is protected from a silent overwrite." : resumed ? "Agent B resumed with the active judgment." : "Agent A has committed the launch strategy."}</h2>
        </div>
        <div className="controls">
          <button disabled={resumed} onClick={() => setState(resume)}>1. Resume with Agent B</button>
          <button disabled={!resumed || pending || applied} onClick={() => setState(proposeKolRevision)}>2. Request KOL change</button>
          <button disabled={!pending || applied} onClick={() => setState(applyConversionEvidence)}>3. Add conversion evidence</button>
        </div>
      </section>

      <section className="grid">
        <article className="frame panel">
          <p className="eyebrow">Active frame</p>
          <p>{state.frame}</p>
          <div className="mcp-note">In cloud mode, an Agent reads this view through CockroachDB Managed MCP.</div>
        </article>

        <article className="panel decisions">
          <p className="eyebrow">Judgment ledger</p>
          {state.decisions.map((decision) => (
            <div className={`decision ${decision.status}`} key={decision.id}>
              <div className="decision-head"><code>{decision.id}</code><span className="badge">{decision.status}</span></div>
              <h3>{decision.title}</h3>
              <p>{decision.rationale}</p>
              <dl><dt>Authority</dt><dd>{authorityLabel[decision.authority]}</dd><dt>Reopen when</dt><dd>{decision.reversalCondition}</dd><dt>Sources</dt><dd>{decision.sourceIds.join(", ")}</dd></dl>
            </div>
          ))}
        </article>

        <article className="panel proposals">
          <p className="eyebrow">Proposed revisions</p>
          {state.proposals.length === 0 ? <p className="muted">No revision can change the active strategy without evidence.</p> : state.proposals.map((proposal) => (
            <div className={`proposal ${proposal.status}`} key={proposal.id}>
              <div className="decision-head"><code>{proposal.id}</code><span className="badge">{proposal.status}</span></div>
              <h3>{proposal.title}</h3><p>{proposal.reason}</p><p className="muted">Based on {proposal.basedOn} · Sources: {proposal.sourceIds.join(", ")}</p>
            </div>
          ))}
        </article>

        <article className="panel audit">
          <p className="eyebrow">Atomic audit trail</p>
          <ol>{state.auditEvents.map((event) => <li key={event.id}><code>{event.id}</code><strong>{event.action}</strong><span>{event.summary}</span></li>)}</ol>
          <p className="transaction">Cloud milestone: write judgment, evidence link, embedding reference, and audit event in one CockroachDB transaction.</p>
        </article>
      </section>

      <footer><span>Prototype scope: Frame · Decision · Proposed revision · Resume</span><span>No production data is used.</span></footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

