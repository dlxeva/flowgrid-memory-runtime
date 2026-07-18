import { describe, expect, it, vi } from "vitest";
import { createHandler, semanticRecall } from "./app.mjs";

describe("runtime HTTP boundary", () => {
  it("uses the same L2 operator as the deployed CockroachDB vector index", async () => {
    const db = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
    };

    await semanticRecall(db, "project-id", "KOL conversion evidence");

    expect(db.query).toHaveBeenCalledOnce();
    const [query] = db.query.mock.calls[0];
    expect(query).toContain("embedding <-> $2::VECTOR");
    expect(query).toContain("ORDER BY embedding <-> $2::VECTOR");
  });

  it("rejects an unauthorized mutation before opening a database connection", async () => {
    const acquireClient = vi.fn(async () => {
      throw new Error("The database must not be reached.");
    });
    const handler = createHandler({ acquireClient, writeToken: "secret" });

    const result = await handler({
      requestContext: { http: { method: "POST" } },
      headers: {},
      body: JSON.stringify({ action: "initialize_demo" }),
    });

    expect(result.statusCode).toBe(401);
    expect(acquireClient).not.toHaveBeenCalled();
  });

  it("returns 404 for a read of a project that was never initialized", async () => {
    const query = vi.fn(async () => ({ rows: [] }));
    const release = vi.fn();
    const handler = createHandler({ acquireClient: async () => ({ query, release }) });

    const result = await handler({
      requestContext: { http: { method: "GET" } },
      queryStringParameters: { project: "missing-demo" },
    });

    expect(result.statusCode).toBe(404);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toMatch(/^SELECT id, slug FROM projects/);
    expect(release).toHaveBeenCalledTimes(1);
  });
});
