# Project Snapshot

**Updated:** 2026-07-19

## Current Stage

Hackathon prototype hardening

## Current Core Goal

Ship a synthetic, publicly demonstrable CockroachDB memory runtime that protects human-authorized judgments from silent AI overwrite.

## Current Core Judgments

- Confirmed judgments remain separate from agent-proposed revisions.
- The current Basic CockroachDB cluster and Lambda use L2 vector retrieval.
- AWS deployment is limited to synthetic data, short-lived serverless resources, and a $3 monthly budget alert.

## Confirmed

- Local React/Vite and Lambda runtimes are implemented.
- CockroachDB Basic contains a synthetic lifecycle, provenance links, handoff, audit history, and vector embeddings.
- The AWS SAM stack is deployed in `us-east-1`; Lambda, API Gateway, private S3 trace storage, and seven-day CloudWatch logs are live.
- The deployed verifier completed the protected lifecycle against CockroachDB: `D-001` confirmed, `P-001` pending, then `D-001` superseded by `D-002` after evidence.
- Current HTML/CSS demo video is rendered and intentionally frozen for later visual refinement.

## Unconfirmed

- GitHub Pages public demo deployment and final video update.
- Independent judge or design-partner response.
- Independent judge or design-partner response.

## Current Risks

- The browser demo must remain read-only; the runtime write token must never enter the Pages build.
- The deployed stack creates billable services after free-tier/credit limits; the $3 alert is monitoring, not a hard cost cap.
- Public product readiness remains unproven until a reviewer can use the hosted demo.

## Next Highest Priority Action

Publish the configured GitHub Pages build, validate the hosted browser against the deployed read-only API, then update the final video and Devpost evidence.

---

*Last Updated: 2026-07-19T02:12:00+08:00*
