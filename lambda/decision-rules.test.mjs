import { describe, expect, it } from "vitest";
import { classifyRevision, deterministicEmbedding, vectorLiteral } from "./decision-rules.mjs";

describe("judgment memory rules", () => {
  it("creates stable, normalized vectors for semantic recall", () => {
    const vector = deterministicEmbedding("KOL launch proposal");

    expect(vector).toHaveLength(8);
    expect(vector).toEqual(deterministicEmbedding("KOL launch proposal"));
    expect(Math.hypot(...vector)).toBeCloseTo(1, 4);
  });

  it("serializes vectors for CockroachDB VECTOR parameters", () => {
    expect(vectorLiteral([0.1, 0.2, 0.3])).toBe("[0.1,0.2,0.3]");
  });

  it("protects a confirmed judgment until qualifying evidence exists", () => {
    expect(classifyRevision({ hasQualifyingEvidence: false })).toBe("propose");
    expect(classifyRevision({ hasQualifyingEvidence: true })).toBe("apply");
  });
});
