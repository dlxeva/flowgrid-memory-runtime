import assert from "node:assert/strict";

const apiUrl = process.env.RUNTIME_API_URL;
const writeToken = process.env.RUNTIME_WRITE_TOKEN;
const projectSlug = process.env.RUNTIME_PROJECT_SLUG ?? `smoke-${Date.now()}`;

if (!apiUrl) throw new Error("Set RUNTIME_API_URL to the deployed RuntimeApiUrl output.");
if (!writeToken) throw new Error("Set RUNTIME_WRITE_TOKEN to the deployment write token.");

function endpoint() {
  const url = new URL(apiUrl);
  url.searchParams.set("project", projectSlug);
  return url;
}

async function request(method, body) {
  const response = await fetch(endpoint(), {
    method,
    headers: {
      ...(body ? { "content-type": "application/json", "x-runtime-token": writeToken } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  assert.equal(response.status, 200, `${method} ${endpoint()} failed: ${JSON.stringify(payload)}`);
  return payload;
}

const initial = await request("POST", { action: "initialize_demo" });
assert.equal(initial.decisions.find((decision) => decision.id === "D-001")?.status, "confirmed");

const pending = await request("POST", {
  action: "request_revision",
  decisionKey: "D-001",
  revisionKey: "P-001",
  sourceKey: "S-002",
  request: "Try KOL promotion for launch.",
  proposal: "Run a KOL-heavy launch campaign.",
});
assert.equal(pending.status, "pending");
assert.equal(pending.revisionKey, "P-001");

const applied = await request("POST", {
  action: "apply_evidence",
  revisionKey: "P-001",
  nextDecisionKey: "D-002",
  sourceKey: "S-003",
  qualifyingEvidence: "Synthetic attributed conversion result demonstrates KOL fit.",
  title: "Allow evidence-backed KOL promotion",
  rationale: "Synthetic conversion evidence satisfies D-001's reversal condition.",
});
assert.deepEqual(applied, { status: "applied", superseded: "D-001", current: "D-002" });

const finalState = await request("GET");
assert.equal(finalState.decisions.find((decision) => decision.id === "D-001")?.status, "superseded");
assert.equal(finalState.decisions.find((decision) => decision.id === "D-002")?.status, "confirmed");
assert.equal(finalState.proposals.find((proposal) => proposal.id === "P-001")?.status, "applied");

console.log(JSON.stringify({
  projectSlug,
  initial: "D-001 confirmed",
  revision: "P-001 pending",
  outcome: "D-001 superseded by D-002",
}, null, 2));
