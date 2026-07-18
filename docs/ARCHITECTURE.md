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
- **CockroachDB Managed MCP:** permits an agent to read active state through the provider's audited, read-only connection.
- **AWS Lambda:** runs the controlled memory write endpoint using a restricted service account.
- **Amazon S3:** stores only synthetic demo artifacts and exported run traces.

## Transaction boundary

One revision transaction writes the proposed or superseding judgment, its evidence links, an embedding reference, updated handoff state, and an audit event. Embedding inference completes before the transaction; the resulting vector reference is committed with the lifecycle change.

## Explicit exclusions

- No real FlowGrid ledger import.
- No automatic deletion or autonomous overriding of human-authorized decisions.
- No multi-tenant authorization system in the hackathon MVP.
