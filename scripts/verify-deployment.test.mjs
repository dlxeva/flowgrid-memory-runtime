import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function runScript(env) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, ["scripts/verify-deployment.mjs"], {
      cwd: root,
      env: { ...process.env, ...env },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("close", (code) => resolveResult({ code, stdout, stderr }));
  });
}

describe("deployed runtime verifier", () => {
  it("proves the protected judgment lifecycle without printing the write token", async () => {
    const requests = [];
    const server = createServer(async (request, response) => {
      let body = "";
      for await (const chunk of request) body += chunk;
      const payload = body ? JSON.parse(body) : null;
      requests.push({ method: request.method, payload, token: request.headers["x-runtime-token"] });

      const responseBody = payload?.action === "initialize_demo"
        ? { decisions: [{ id: "D-001", status: "confirmed" }] }
        : payload?.action === "request_revision"
          ? { status: "pending", revisionKey: "P-001" }
          : payload?.action === "apply_evidence"
            ? { status: "applied", superseded: "D-001", current: "D-002" }
            : {
                decisions: [
                  { id: "D-001", status: "superseded" },
                  { id: "D-002", status: "confirmed" },
                ],
                proposals: [{ id: "P-001", status: "applied" }],
              };
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(responseBody));
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");

    try {
      const address = server.address();
      const result = await runScript({
        RUNTIME_API_URL: `http://127.0.0.1:${address.port}/runtime`,
        RUNTIME_WRITE_TOKEN: "test-write-token",
        RUNTIME_PROJECT_SLUG: "smoke-test",
      });

      expect(result.code).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("D-001 superseded by D-002");
      expect(result.stdout).not.toContain("test-write-token");
      expect(requests.map((request) => request.payload?.action ?? request.method)).toEqual([
        "initialize_demo",
        "request_revision",
        "apply_evidence",
        "GET",
      ]);
      expect(requests.slice(0, 3).every((request) => request.token === "test-write-token")).toBe(true);
      expect(requests[3].token).toBeUndefined();
    } finally {
      server.close();
      await once(server, "close");
    }
  });
});
