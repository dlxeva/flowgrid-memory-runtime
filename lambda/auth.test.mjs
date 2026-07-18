import { describe, expect, it } from "vitest";
import { hasValidWriteToken } from "./auth.mjs";

describe("runtime write authorization", () => {
  it("denies writes when the runtime token is not configured", () => {
    expect(hasValidWriteToken({ headers: {} }, undefined)).toBe(false);
  });

  it("accepts only the configured write token", () => {
    expect(hasValidWriteToken({ headers: { "x-runtime-token": "correct" } }, "correct")).toBe(true);
    expect(hasValidWriteToken({ headers: { "x-runtime-token": "wrong" } }, "correct")).toBe(false);
  });
});
