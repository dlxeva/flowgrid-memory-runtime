# Project Snapshot

**Updated:** 2026-07-18

## Current Stage

Hackathon prototype hardening

## Current Core Goal

Ship a synthetic, publicly demonstrable CockroachDB memory runtime that protects human-authorized judgments from silent AI overwrite.

## Current Core Judgments

- Confirmed judgments remain separate from agent-proposed revisions.
- The current Basic CockroachDB cluster and Lambda use L2 vector retrieval.
- AWS deployment requires a separate cost review and must use synthetic data only.

## Confirmed

- Local React/Vite and Lambda runtimes are implemented.
- CockroachDB Basic contains a synthetic lifecycle, provenance links, handoff, audit history, and vector embeddings.
- Local AWS CLI/SAM tooling is installed and the SAM template passes lint.
- Current HTML/CSS demo video is rendered and intentionally frozen for later visual refinement.

## Unconfirmed

- Authenticated AWS deployment and Lambda-to-CockroachDB runtime proof.
- Public read-only demo URL, S3 synthetic trace, and final submission evidence.
- Independent judge or design-partner response.

## Current Risks

- Local AWS CLI has no configured credentials.
- AWS resources are not yet cost-reviewed or deployed.
- Public product readiness remains unproven until the deployed path works.

## Next Highest Priority Action

Authenticate AWS through the approved owner flow, run the read-only preflight, then review the exact resource and cost exposure before deployment.

---

*Last Updated: 2026-07-18T18:28:52*
