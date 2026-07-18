import { describe, expect, it } from "vitest";
import { createRuntimeSnapshot } from "./runtime-snapshot.mjs";

describe("CockroachDB runtime snapshot", () => {
  it("keeps the supersession chain and evidence references visible to the browser", () => {
    const state = createRuntimeSnapshot({
      projectSlug: "hackathon-demo",
      sources: [{ source_key: "S-001", event_type: "user_confirmation", content: "Protect D-001", occurred_at: "2026-07-18T09:00:00Z" }],
      judgments: [{ decision_key: "D-001", title: "Protected decision", status: "superseded", authority: "user_confirmed", rationale: "Original rationale", reversal_condition: "Evidence required", superseded_by_key: "D-002" }],
      proposedRevisions: [{ revision_key: "P-001", proposal: "Change request", status: "applied", active_decision_key: "D-001", required_evidence: "Conversion evidence" }],
      evidenceLinks: [{ source_key: "S-001", decision_key: "D-001", revision_key: null }],
      handoff: { active_frame: "D-002 is confirmed." },
      auditEvents: [{ event_type: "judgment_superseded", artifact_key: "D-001", created_at: "2026-07-18T09:25:00Z" }],
    });

    expect(state.decisions[0]).toMatchObject({ id: "D-001", status: "superseded", supersededBy: "D-002", sourceIds: ["S-001"] });
    expect(state.proposals[0]).toMatchObject({ id: "P-001", basedOn: "D-001", status: "applied" });
    expect(state.auditEvents[0]?.action).toBe("superseded");
  });
});
