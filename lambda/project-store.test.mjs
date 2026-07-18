import { describe, expect, it } from "vitest";
import { ensureProject, findProject } from "./project-store.mjs";

function database(responses) {
  const query = async (...args) => {
    calls.push(args);
    return responses.shift();
  };
  const calls = [];
  return { query, calls };
}

describe("project store", () => {
  it("reads an existing project without mutating the ledger", async () => {
    const db = database([{ rows: [{ id: "p-1", slug: "demo" }] }]);

    await expect(findProject(db, "demo")).resolves.toEqual({ id: "p-1", slug: "demo" });
    expect(db.calls[0][0]).toMatch(/^SELECT id, slug FROM projects/);
    expect(db.calls[0][1]).toEqual(["demo"]);
  });

  it("creates a project only when a write flow initializes it", async () => {
    const db = database([{ rows: [{ id: "p-1", slug: "demo" }] }]);

    await expect(ensureProject(db, "demo")).resolves.toEqual({ id: "p-1", slug: "demo" });
    expect(db.calls[0][0]).toMatch(/^INSERT INTO projects/);
    expect(db.calls[0][0]).toContain("ON CONFLICT (slug) DO NOTHING");
  });

  it("recovers the project after a concurrent initializer wins the insert", async () => {
    const db = database([
      { rows: [] },
      { rows: [{ id: "p-2", slug: "demo" }] },
    ]);

    await expect(ensureProject(db, "demo")).resolves.toEqual({ id: "p-2", slug: "demo" });
    expect(db.calls).toHaveLength(2);
    expect(db.calls[1][0]).toMatch(/^SELECT id, slug FROM projects/);
  });
});
