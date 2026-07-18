# Validation Evidence

## CockroachDB Basic vector-index readiness

- Date: 2026-07-18
- Environment: existing CockroachDB Cloud Basic cluster on AWS Jakarta (`ap-southeast-3`)
- Check: `SHOW CLUSTER SETTING feature.vector_index.enabled;`
- Result: `true`
- Evidence: manually executed in the CockroachDB Cloud SQL Shell by the project owner.

This verifies that the current free-tier cluster can create and query the `VECTOR` index used by the synthetic hackathon runtime. No database, table, source event, or AWS resource was created during this check.

## Remaining validation gates

1. Managed MCP authentication and read-only schema inspection.
2. Synthetic schema application and `VECTOR` index creation.
3. AWS deployment after a separate zero-cost review.
