const authorityBySource = {
  user_confirmed: "high",
  validated_evidence: "high",
  high: "high",
  medium: "medium",
  agent_proposed: "low",
  low: "low",
};

function sourceKind(eventType) {
  return eventType.includes("evidence") || eventType.includes("evaluation") ? "evidence" : "conversation";
}

function auditAction(eventType) {
  if (eventType.includes("resume")) return "resumed";
  if (eventType.includes("revision") || eventType.includes("proposed")) return "proposed";
  if (eventType.includes("supersed") || eventType.includes("evidence")) return "superseded";
  return "created";
}

export function createRuntimeSnapshot({ projectSlug, sources, judgments, proposedRevisions, evidenceLinks, handoff, auditEvents }) {
  const decisionSources = new Map();
  const proposalSources = new Map();

  for (const link of evidenceLinks) {
    if (link.decision_key) {
      decisionSources.set(link.decision_key, [...(decisionSources.get(link.decision_key) ?? []), link.source_key]);
    }
    if (link.revision_key) {
      proposalSources.set(link.revision_key, [...(proposalSources.get(link.revision_key) ?? []), link.source_key]);
    }
  }

  return {
    projectSlug,
    frame: handoff?.active_frame ?? "No active handoff is recorded.",
    sources: sources.map((source) => ({
      id: source.source_key,
      kind: sourceKind(source.event_type),
      summary: source.content,
      occurredAt: source.occurred_at,
    })),
    decisions: judgments.map((judgment) => ({
      id: judgment.decision_key,
      title: judgment.title,
      status: judgment.status,
      authority: authorityBySource[judgment.authority] ?? "medium",
      rationale: judgment.rationale,
      reversalCondition: judgment.reversal_condition,
      sourceIds: decisionSources.get(judgment.decision_key) ?? [],
      ...(judgment.superseded_by_key ? { supersededBy: judgment.superseded_by_key } : {}),
    })),
    proposals: proposedRevisions.map((revision) => ({
      id: revision.revision_key,
      title: revision.proposal,
      status: revision.status,
      basedOn: revision.active_decision_key,
      reason: revision.required_evidence,
      sourceIds: proposalSources.get(revision.revision_key) ?? [],
    })),
    auditEvents: auditEvents.map((event, index) => ({
      id: `${event.artifact_key}:${index}`,
      action: auditAction(event.event_type),
      summary: `${event.event_type}: ${event.artifact_key}`,
      occurredAt: event.created_at,
    })),
  };
}
