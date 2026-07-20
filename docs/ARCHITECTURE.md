# Architecture: Cloud Milestone

## Product invariant

A retrieved memory cannot silently overwrite a human-authorized decision.

## Runtime flow

```text
source event
  -> retrieve semantically related judgments
  -> inspect status, authority, rationale, and reversal condition
  -> write proposed revision when authority protects the active decision
  -> apply a superseding decision only when a human reviewer attests qualifying evidence
```

## Runtime snapshot contract

The browser and Lambda exchange one `RuntimeState` JSON shape:

```text
projectSlug
frame
sources[]
decisions[]
proposals[]
auditEvents[]
```

`src/runtime.ts` produces this shape for the offline demo. `lambda/runtime-snapshot.mjs` maps CockroachDB rows to the same shape, including source references and supersession links. `src/cloud-runtime.ts` rejects incomplete remote responses before the UI renders them.

The browser stays offline by default. A deployed read-only endpoint is loaded only when `VITE_RUNTIME_API_URL` is configured; it is never given a CockroachDB connection URL. `GET` never creates a project or writes to the ledger. Unauthorized `POST` requests are rejected before a database connection is opened. Only an authenticated `initialize_demo` request may create the synthetic project.

## CockroachDB tables

| Table | Purpose |
| --- | --- |
| `source_events` | Verbatim synthetic user requests and external evidence. |
| `judgments` | Confirmed and superseded decisions with rationale and reversal conditions. |
| `proposed_revisions` | Changes that cannot yet alter active project state. |
| `evidence_links` | Many-to-many provenance links from judgments/proposals to source events. |
| `handoffs` | Resume-ready active state for the next agent. |
| `audit_events` | Immutable lifecycle record. |
| `memory_embeddings` | Vector-searchable summaries tied to judgment records. |

## Required integrations

- **CockroachDB Distributed Vector Indexing:** retrieves related historical judgments for a new request.
- **CockroachDB Managed MCP:** permits an agent to inspect active state, schema, and audit history through the provider's RBAC-controlled connection.
- **AWS Lambda:** runs the controlled memory write endpoint using a restricted service account.
- **Amazon S3:** stores only synthetic demo artifacts and exported run traces.

## Current deployed route

The hackathon proof targets the existing CockroachDB Basic cluster on AWS Jakarta (`ap-southeast-3`). The schema and synthetic lifecycle data have been validated through the managed MCP. A deployed AWS stack in `us-east-1` runs the controlled Lambda write path and exposes a public, read-only API snapshot for the browser demo. The browser never receives database credentials or the runtime write token.

## Transaction boundary

One revision transaction writes the proposed or superseding judgment, its evidence links, an embedding reference, updated handoff state, and an audit event. Embedding inference completes before the transaction; the resulting vector reference is committed with the lifecycle change.

## Cloud implementation boundary

- `lambda/app.mjs` is the only write path. It requires a runtime write token and uses a dedicated CockroachDB SQL connection supplied as an encrypted `NoEcho` deployment parameter for this synthetic demo. Production or customer-data deployments require a dedicated secret store.
- Managed MCP supports interactive read, schema, and audit inspection. It is not the runtime's mutation path.
- `infra/migrations/001_judgment_memory.sql` stores source events, judgments, proposals, evidence links, handoffs, audit events, and vector-searchable memory summaries.
- `infra/template.yaml` deploys Lambda, API Gateway, and a private S3 bucket that only receives synthetic run traces.

## Explicit exclusions

- No real FlowGrid ledger import.
- No automatic deletion or autonomous overriding of human-authorized decisions.
- No multi-tenant authorization system in the hackathon MVP.
