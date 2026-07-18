# Validation Evidence

## CockroachDB Basic vector-index readiness

- Date: 2026-07-18
- Environment: existing CockroachDB Cloud Basic cluster on AWS Jakarta (`ap-southeast-3`)
- Check: `SHOW CLUSTER SETTING feature.vector_index.enabled;`
- Result: `true`
- Evidence: manually executed in the CockroachDB Cloud SQL Shell by the project owner.

This verifies that the current free-tier cluster can create and query the `VECTOR` index used by the synthetic hackathon runtime. No database, table, source event, or AWS resource was created during this check.

## CockroachDB Managed MCP read-only access

- Date: 2026-07-18
- Endpoint: `https://cockroachlabs.cloud/mcp`
- Cluster binding: current AWS Jakarta Basic cluster
- OAuth scope: `mcp:read`
- Local tool allowlist: `list_clusters`, `get_cluster`, `list_databases`, `list_tables`, `get_table_schema`, `select_query`, `explain_query`, and `show_running_queries`
- Result: OAuth login completed successfully after the earlier broad credential was removed. A live read-only query returned the existing `defaultdb` database and confirmed that it has no tables.

The runtime keeps mutation tools out of the Codex MCP configuration. Application writes stay in the separately reviewed Lambda path.

## Remaining validation gates

1. Synthetic schema application and `VECTOR` index creation.
2. AWS deployment after a separate zero-cost review.
