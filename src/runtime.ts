import type { AuditEvent, Decision, RuntimeState, SourceEvent } from "./domain";

const timestamp = "2026-07-18T09:00:00Z";

function audit(id: string, action: AuditEvent["action"], summary: string): AuditEvent {
  return { id, action, summary, occurredAt: timestamp };
}

function source(id: string, kind: SourceEvent["kind"], summary: string): SourceEvent {
  return { id, kind, summary, occurredAt: timestamp };
}

export function createDemoState(): RuntimeState {
  const initialDecision: Decision = {
    id: "D-001",
    title: "Do not use KOL-heavy promotion for launch",
    status: "confirmed",
    authority: "high",
    rationale: "The launch budget is better spent on returning-player activation until conversion evidence exists.",
    reversalCondition: "Reopen only when a conversion experiment shows KOL traffic can outperform reactivation spend.",
    sourceIds: ["S-001"],
  };

  return {
    projectSlug: "local-demo",
    frame: "Launch a seasonal game update by prioritizing returning-player activation.",
    sources: [source("S-001", "conversation", "Human owner confirmed the launch strategy and budget boundary.")],
    decisions: [initialDecision],
    proposals: [],
    auditEvents: [audit("A-001", "created", "Agent A committed D-001 with its rationale and reversal condition.")],
  };
}

export function resume(state: RuntimeState): RuntimeState {
  if (state.auditEvents.some((event) => event.action === "resumed")) return state;

  return {
    ...state,
    auditEvents: [...state.auditEvents, audit("A-002", "resumed", "Agent B loaded the active frame, confirmed decisions, and pending revisions.")],
  };
}

export function proposeKolRevision(state: RuntimeState): RuntimeState {
  if (state.proposals.some((proposal) => proposal.id === "P-001")) return state;

  const existing = state.decisions.find((decision) => decision.id === "D-001");
  if (!existing || existing.status !== "confirmed") throw new Error("The protected decision is unavailable.");

  const request = source("S-002", "conversation", "User request: reconsider KOL investment for the launch.");

  return {
    ...state,
    sources: [...state.sources, request],
    proposals: [
      ...state.proposals,
      {
        id: "P-001",
        title: "Reconsider KOL investment for launch",
        status: "pending",
        basedOn: "D-001",
        reason: "The request is relevant to a protected decision, but the recorded reversal condition has not been met.",
        sourceIds: ["S-002"],
      },
    ],
    auditEvents: [...state.auditEvents, audit("A-003", "proposed", "Runtime created P-001 instead of overwriting D-001.")],
  };
}

export function applyConversionEvidence(state: RuntimeState): RuntimeState {
  const proposal = state.proposals.find((candidate) => candidate.id === "P-001");
  const current = state.decisions.find((decision) => decision.id === "D-001");
  if (!proposal || proposal.status !== "pending" || !current || current.status !== "confirmed") {
    throw new Error("A pending revision and active decision are required.");
  }

  const evidence = source("S-003", "evidence", "Conversion experiment: KOL traffic outperformed reactivation spend by 18%.");
  const replacement: Decision = {
    id: "D-002",
    title: "Run a measured KOL conversion campaign alongside reactivation",
    status: "confirmed",
    authority: "high",
    rationale: "The recorded reversal condition for D-001 is now supported by a conversion experiment.",
    reversalCondition: "Reassess after the first campaign cohort completes.",
    sourceIds: ["S-002", "S-003"],
  };

  return {
    ...state,
    sources: [...state.sources, evidence],
    decisions: [
      ...state.decisions.map((decision): Decision =>
        decision.id === "D-001"
          ? { ...decision, status: "superseded", supersededBy: "D-002" }
          : decision,
      ),
      replacement,
    ],
    proposals: state.proposals.map((candidate) => candidate.id === "P-001" ? { ...candidate, status: "applied", sourceIds: [...candidate.sourceIds, "S-003"] } : candidate),
    auditEvents: [...state.auditEvents, audit("A-004", "superseded", "One transaction applied D-002, linked evidence, and superseded D-001.")],
  };
}
