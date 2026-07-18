export type Authority = "high" | "medium" | "low";
export type DecisionStatus = "confirmed" | "superseded";
export type ProposalStatus = "pending" | "applied";

export interface SourceEvent {
  id: string;
  kind: "conversation" | "evidence";
  summary: string;
  occurredAt: string;
}

export interface Decision {
  id: string;
  title: string;
  status: DecisionStatus;
  authority: Authority;
  rationale: string;
  reversalCondition: string;
  sourceIds: string[];
  supersededBy?: string;
}

export interface ProposedRevision {
  id: string;
  title: string;
  status: ProposalStatus;
  basedOn: string;
  reason: string;
  sourceIds: string[];
}

export interface AuditEvent {
  id: string;
  action: "created" | "resumed" | "proposed" | "superseded";
  summary: string;
  occurredAt: string;
}

export interface RuntimeState {
  projectSlug: string;
  frame: string;
  sources: SourceEvent[];
  decisions: Decision[];
  proposals: ProposedRevision[];
  auditEvents: AuditEvent[];
}
