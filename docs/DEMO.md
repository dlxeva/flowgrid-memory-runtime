# 90-Second Demo

## Goal

Show that an agent can retrieve project memory without receiving authority to silently overwrite a human-confirmed judgment.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. No database URL, AWS account, token, or external service is required for this walkthrough.

## Walkthrough

### 1. Start with the authorized state

The Judgment Ledger contains `D-001`, a human-confirmed decision that prevents KOL-heavy launch promotion. Its rationale and reversal condition are visible beside the decision.

### 2. Resume with Agent B

Click **Resume with Agent B**. The audit trail gains a resume event. `D-001` remains `confirmed` because resuming context does not grant authority to change it.

### 3. Submit a conflicting request

Click **Request KOL change**. The proposal panel receives pending `P-001`, while `D-001` remains `confirmed`. This is the key protection: a relevant request is recorded without being promoted to project truth.

### 4. Supply the qualifying evidence

Click **Add conversion evidence**. The runtime preserves `D-001` as `superseded`, creates confirmed `D-002`, marks `P-001` as `applied`, and appends an audit event.

## What is real versus simulated

| Capability | Status |
| --- | --- |
| Local judgment-protection lifecycle | Runs in the browser with tested deterministic state transitions. |
| CockroachDB schema and lifecycle data | Live in the existing free Basic cluster using synthetic records only. |
| CockroachDB vector index | Live and verified on `memory_embeddings`. |
| Managed MCP inspection | Live read and narrowly approved schema/data setup validation. |
| Lambda API and S3 trace storage | Code is present but intentionally not deployed. |

## Reviewer checks

```bash
npm test
npm run build
```

The test suite checks the protected-decision invariant, cloud snapshot contract, CockroachDB row mapping, vector serialization, and write-token behavior.

## Optional cloud mode

After a separately approved Lambda deployment, configure:

```bash
VITE_RUNTIME_API_URL=https://<runtime-api-url>
```

The **Load CockroachDB state** button then loads the same `RuntimeState` contract from the API. The browser never receives a CockroachDB connection URL or write token.
