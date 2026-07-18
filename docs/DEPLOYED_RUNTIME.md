# Deployed Runtime Evidence

## Live endpoint

`https://ie23uv52be.execute-api.us-east-1.amazonaws.com/demo/runtime/`

The endpoint is a public, read-only snapshot API for synthetic demo projects.
`GET` requests do not create projects or write to CockroachDB. Lambda mutation
requests require a deployment-time runtime token, which is never included in
the browser build.

## Verified lifecycle

The deployed verifier completed this sequence against CockroachDB Cloud:

1. Initialize `D-001` as a confirmed human-authorized judgment.
2. Create pending revision `P-001` without overwriting `D-001`.
3. Apply synthetic qualifying evidence.
4. Confirm `D-002`, mark `D-001` superseded, and mark `P-001` applied.

An independent unauthenticated `GET` then returned the final snapshot for the
synthetic verification project. The public GitHub Pages demo reads that same
verified synthetic project through the read-only endpoint.

## Cost and cleanup boundary

The stack uses Lambda, API Gateway, a private S3 trace bucket, and a seven-day
CloudWatch log group. The project has a $3 AWS monthly budget alert. After the
hackathon demonstration, delete the `flowgrid-memory-runtime` stack and its
SAM-managed packaging artifacts as described in [COST_PLAN.md](COST_PLAN.md).
