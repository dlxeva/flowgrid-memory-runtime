import { describe, expect, it } from "vitest";
import { applyConversionEvidence, createDemoState, proposeKolRevision, resume } from "./runtime";

describe("judgment runtime", () => {
  it("resumes without modifying an active decision", () => {
    const state = resume(createDemoState());
    expect(state.decisions[0]).toMatchObject({ id: "D-001", status: "confirmed" });
    expect(state.auditEvents.at(-1)?.action).toBe("resumed");
  });

  it("creates a proposed revision instead of overwriting a protected decision", () => {
    const state = proposeKolRevision(createDemoState());
    expect(state.decisions[0]?.status).toBe("confirmed");
    expect(state.proposals[0]).toMatchObject({ id: "P-001", status: "pending", basedOn: "D-001" });
  });

  it("supersedes the active decision only after qualifying evidence arrives", () => {
    const state = applyConversionEvidence(proposeKolRevision(createDemoState()));
    expect(state.decisions.find((decision) => decision.id === "D-001")).toMatchObject({ status: "superseded", supersededBy: "D-002" });
    expect(state.decisions.find((decision) => decision.id === "D-002")).toMatchObject({ status: "confirmed", sourceIds: ["S-002", "S-003"] });
    expect(state.proposals[0]?.status).toBe("applied");
  });
});

