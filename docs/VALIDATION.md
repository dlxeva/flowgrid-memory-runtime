# Validation Evidence

## CockroachDB Basic vector-index readiness

- Date: 2026-07-18
- Environment: existing CockroachDB Cloud Basic cluster on AWS Jakarta (`ap-southeast-3`)
- Check: `SHOW CLUSTER SETTING feature.vector_index.enabled;`
- Result: `true`
- Evidence: manually executed in the CockroachDB Cloud SQL Shell by the project owner.

This verifies that the current free-tier cluster can create and query the `VECTOR` index used by the synthetic hackathon runtime. The later controlled write validation below created only synthetic demo state. No AWS resource was created.

## CockroachDB Managed MCP access

- Date: 2026-07-18
- Endpoint: `https://cockroachlabs.cloud/mcp`
- Cluster binding: current AWS Jakarta Basic cluster
- OAuth scopes: `mcp:read`, `mcp:write`
- Local tool allowlist: read inspection plus the narrow `create_table` and `insert_rows` operations.
- Result: OAuth login completed successfully after explicit owner approval for write access. The write scope is used only for this synthetic hackathon schema and demo data.

The runtime still keeps application writes in the separately reviewed Lambda path. The temporary managed-MCP write scope exists solely to validate the database model without creating AWS resources.

## Live synthetic runtime schema and lifecycle

- Date: 2026-07-18
- Database: existing `defaultdb` in the Basic cluster
- Data classification: synthetic demo data only; no FlowGrid ledger, user session, customer, or private evaluation data.
- Tables created: `projects`, `source_events`, `judgments`, `proposed_revisions`, `evidence_links`, `handoffs`, `audit_events`, and `memory_embeddings`.
- Vector evidence: `memory_embeddings` was created with a real CockroachDB vector index. The live schema reports `VECTOR INDEX memory_embeddings_project_id_embedding_idx (project_id, embedding vector_l2_ops)`. The runtime uses the matching L2 operator (`<->`). Its deterministic synthetic embeddings are unit-normalized, so L2 and cosine produce the same ranking while the live index can accelerate the query.
- Lifecycle evidence: `D-001` is stored as `superseded`, `D-002` is stored as `confirmed`, `P-001` is stored as `applied`, and evidence links preserve the confirmation, request, supporting evidence, and invalidation relationships.
- Handoff evidence: the active frame permits only the scoped test represented by `D-002` and retains `D-001` as superseded history.
- Audit evidence: the persisted event sequence is `confirmed`, `revision_requested`, `evidence_applied`, and `superseded`.

The managed MCP `create_table` interface permits vector-index creation inside `CREATE TABLE`, which uses CockroachDB's default `vector_l2_ops`. The deployment migration and Lambda recall query now use that same operator, preventing an index/query mismatch.

## Remaining validation gates

1. Execute the Lambda write path against the existing schema only after a separate zero-cost review of AWS Secrets Manager, Lambda, and S3.
2. Validate vector retrieval through the deployed runtime rather than direct managed-MCP inspection.
