# Problem Definition

## Problem Statement

Agent memory can recover historical context but can also cause an AI to treat an unreviewed request as permission to overwrite a human-authorized decision. This prototype demonstrates a durable memory lifecycle where a retrieval can propose a revision, while only qualifying evidence can supersede the active judgment.

## Evidence Basis

- **Overall basis:** direct and verified for the synthetic CockroachDB schema and local runtime; deployment readiness remains partially verified.
- **Direct evidence:** a CockroachDB Basic cluster contains the synthetic judgment lifecycle, a real vector index, provenance links, and audit rows; local TypeScript/Lambda tests and SAM lint pass.
- **Verification needed before commitment:** authenticated Lambda-to-CockroachDB writes, public read-only endpoint, S3 trace persistence, and independent judging feedback.

## Requirements

### Explicit Requirements

- Demonstrate CockroachDB vector retrieval and durable memory state in a hackathon-ready prototype.
- Preserve human-authorized judgments from silent memory-driven overwrite.
- Keep all demo content synthetic and avoid cloud spend until a separate review approves deployment.
- Produce source, architecture, validation, video, and submission evidence suitable for judging.

### Real Needs Hypothesis

Knowledge workers need an AI runtime that can retrieve historical decisions without confusing a request, a proposal, evidence, and a confirmed commitment. The proof object is a visible lifecycle: source -> proposed revision -> qualifying evidence -> superseded judgment -> handoff and audit trace.

## Goals

1. Ship a verifiable synthetic end-to-end demo before the submission deadline.
2. Prove provenance, protected revision, vector recall, handoff, and audit behavior with CockroachDB.
3. Keep the browser usable without exposing a database URL or mutation token.

## Non-Goals

- Import real FlowGrid ledgers, user sessions, customer records, or private evaluation data.
- Build a multi-tenant enterprise memory platform or a full FlowGrid product replacement.
- Allow an agent or retrieved memory to autonomously overwrite a confirmed judgment.
- Create paid AWS resources before the owner explicitly approves the cost review.

## User Objects

- Hackathon judges evaluating memory design, CockroachDB use, technical implementation, product readiness, and creativity.
- A knowledge worker or operator who needs an agent to inherit decisions and their reversal conditions.
- The project owner, who retains authority to approve deployment and product-direction changes.

## Review Objects

- Source code, unit tests, production build, and SAM template validation.
- Live CockroachDB schema, vector index, lifecycle rows, provenance links, and audit trace.
- A deployed Lambda/API read path and synthetic S3 trace, after cost approval.
- Demo video and final submission material.

## Success Criteria

- A query retrieves related prior judgments from CockroachDB without directly altering the active state.
- A revision stays pending until qualifying evidence applies a successor judgment.
- The active handoff and audit history expose why the current judgment is valid.
- The runtime is publicly demonstrable and the submission can be independently inspected.

## Constraints

- Use only synthetic data.
- Keep CockroachDB on the existing Basic cluster in AWS Jakarta (`ap-southeast-3`).
- Do not create Secrets Manager, Lambda, API Gateway, S3, or other AWS resources without a separate cost review.
- Local AWS CLI credentials are currently not configured; browser console login does not substitute for CLI authentication.

## Open Questions

- Which zero-cost AWS credential flow will authenticate the local CLI or CloudShell deployment?
- Can the deployed Lambda demonstrate the full database transaction and S3 synthetic trace within the approved free-tier route?
- Does the public demo make the protected-judgment value legible to judges without FlowGrid context?

---

*Created: 2026-07-18T18:28:52*
*Last Updated: 2026-07-18T18:28:52*
