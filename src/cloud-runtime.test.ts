import { describe, expect, it } from "vitest";
import { parseRuntimeSnapshot } from "./cloud-runtime";

const snapshot = {
  projectSlug: "hackathon-demo",
  frame: "D-002 is confirmed.",
  sources: [{ id: "S-001", kind: "conversation", summary: "Owner confirmation", occurredAt: "2026-07-18T09:00:00Z" }],
  decisions: [{ id: "D-002", title: "Scoped KOL test", status: "confirmed", authority: "high", rationale: "Evidence met threshold.", reversalCondition: "Recheck after cohort.", sourceIds: ["S-001"] }],
  proposals: [],
  auditEvents: [{ id: "A-001", action: "created", summary: "D-002 confirmed", occurredAt: "2026-07-18T09:00:00Z" }],
};

describe("cloud runtime contract", () => {
  it("accepts the runtime snapshot shared by Lambda and the browser", () => {
    expect(parseRuntimeSnapshot(snapshot)).toMatchObject({ projectSlug: "hackathon-demo", frame: "D-002 is confirmed." });
  });

  it("rejects an incomplete cloud response", () => {
    expect(() => parseRuntimeSnapshot({ frame: "missing lifecycle state" })).toThrow("invalid snapshot");
  });
});
