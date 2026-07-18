# Architecture: Cloud Milestone

## Product invariant

A retrieved memory cannot silently overwrite a human-authorized decision.

## Runtime flow

```text
source event
  -> retrieve semantically related judgments
  -> inspect status, authority, rationale, and reversal condition
  -> write proposed revision when authority protects the active decision
  -> apply a superseding decision only when qualifying evidence is present
```

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

## Transaction boundary

One revision transaction writes the proposed or superseding judgment, its evidence links, an embedding reference, updated handoff state, and an audit event. Embedding inference completes before the transaction; the resulting vector reference is committed with the lifecycle change.

## Cloud implementation boundary

- `lambda/app.mjs` is the only write path. It requires a runtime write token and uses a dedicated CockroachDB SQL connection stored in AWS Secrets Manager.
- Managed MCP supports interactive read, schema, and audit inspection. It is not the runtime's mutation path.
- `infra/migrations/001_judgment_memory.sql` stores source events, judgments, proposals, evidence links, handoffs, audit events, and vector-searchable memory summaries.
- `infra/template.yaml` deploys Lambda, API Gateway, and a private S3 bucket that only receives synthetic run traces.

## Explicit exclusions

- No real FlowGrid ledger import.
- No automatic deletion or autonomous overriding of human-authorized decisions.
- No multi-tenant authorization system in the hackathon MVP.
