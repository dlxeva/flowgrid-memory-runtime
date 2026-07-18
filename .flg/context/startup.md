# FLG Context Pack

## Project Identity

- Project: FlowGrid Memory Runtime
- Project type: solution
- Client/Sponsor: CockroachDB AI Hackathon
- Stage: hackathon_prototype_hardening
- Mode: resume
- Generated: 2026-07-18T18:32:11

## Review Object

Source code, unit tests, production build, and SAM template validation.

## Proof Object

A query retrieves related prior judgments from CockroachDB without directly altering the active state.

## Current Goal

Ship a synthetic, publicly demonstrable CockroachDB memory runtime that protects human-authorized judgments from silent AI overwrite.

## Confirmed Decisions

### D-002 | The hackathon runtime uses synthetic data only; no
- Status: confirmed
- Authority: high if accepted through review; otherwise check DECISIONS.md
- Decision: The hackathon runtime uses synthetic data only; no real FlowGrid ledger, user session, customer record, or private evaluation material may enter the demo.
- Rationale: The submission needs a demonstrable memory lifecycle without exposing personal or project-sensitive context.
- Alternatives considered: A. Import a real ledger、Use anonymized project traces
- Rejected alternatives: 选择了当前方案，放弃其他备选方案。
- Reversal conditions: 如果关键前提变化或出现新的替代方案，需要重新评估。

---

*原则 | Source: Owner instruction and hackathon scope*
- Evidence: DECISIONS.md#D-002

### D-003 | AWS deployment is gated by a separate explicit cos
- Status: confirmed
- Authority: high if accepted through review; otherwise check DECISIONS.md
- Decision: AWS deployment is gated by a separate explicit cost review; until then only local validation and read-only cloud inspection are allowed.
- Rationale: The owner requires zero unapproved cloud spend while away from the computer.
- Alternatives considered: A. Deploy immediately、Create a second AWS environment
- Rejected alternatives: 选择了当前方案，放弃其他备选方案。
- Reversal conditions: 如果关键前提变化或出现新的替代方案，需要重新评估。

---

*原则 | Source: Owner instruction: do not deduct fees and do what is safely possible*
- Evidence: DECISIONS.md#D-003

### D-004 | Use L2 vector retrieval with normalized determinis
- Status: confirmed
- Authority: high if accepted through review; otherwise check DECISIONS.md
- Decision: Use L2 vector retrieval with normalized deterministic embeddings to match the existing CockroachDB Basic vector index.
- Rationale: The live cluster uses vector_l2_ops; unit-normalized embeddings preserve cosine ranking under L2 and align query/index semantics without rebuilding cloud schema.
- Alternatives considered: A. Rebuild the live index as cosine、Keep a query/index mismatch
- Rejected alternatives: 选择了当前方案，放弃其他备选方案。
- Reversal conditions: 如果关键前提变化或出现新的替代方案，需要重新评估。

---

*原则 | Source: Live CockroachDB schema inspection and official CockroachDB vector-index documentation*
- Evidence: DECISIONS.md#D-004


## Pending Judgments

- (none recorded)

## Active Assumptions

- Authenticated AWS deployment and Lambda-to-CockroachDB runtime proof.
- Public read-only demo URL, S3 synthetic trace, and final submission evidence.
- Independent judge or design-partner response.
- Which zero-cost AWS credential flow will authenticate the local CLI or CloudShell deployment?
- Can the deployed Lambda demonstrate the full database transaction and S3 synthetic trace within the approved free-tier route?
- Does the public demo make the protected-judgment value legible to judges without FlowGrid context?

## Rejected Alternatives

- D-002: 选择了当前方案，放弃其他备选方案。
- D-003: 选择了当前方案，放弃其他备选方案。
- D-004: 选择了当前方案，放弃其他备选方案。

## Goal Evolution

- **When:** 2026-07-18
- **Previous Goal:** establish the FlowGrid Memory Runtime hackathon repository and synthetic CockroachDB proof.
- **New Goal:** harden a publicly demonstrable, protected-judgment runtime without deploying unreviewed AWS resources.
- **Trigger:** local runtime, live synthetic CockroachDB lifecycle, demo video, and AWS/SAM preparation are now available; authenticated AWS deployment remains blocked.
- **Impact:** implementation now focuses on deployment preflight, end-to-end cloud proof, public demo readiness, and submission evidence rather than additional product scope.

## Current Risks

- Local AWS CLI has no configured credentials.
- AWS resources are not yet cost-reviewed or deployed.
- Public product readiness remains unproven until the deployed path works.

## Recent Progress

# Progress Log ## 2026-07-18 - Created the synthetic CockroachDB schema and lifecycle proof on the existing Basic cluster. - Added and verified local AWS CLI/SAM tooling and a read-only deployment preflight script. - Hardened Lambda reads so GET does not initialize state and unauthorized POST requests do not open a database connection. - Aligned the runtime's vector recall operator and migration with the live `vector_l2_ops` index; unit, build, and SAM validation pass. - Rendered a synthetic HTML/CSS demo video using an owner-provided voice clone; the current cut is intentionally frozen for later visual refinement. ## Next - Authenticate AWS CLI or CloudShell without committing credentials. - Run the read-only preflight and perform a cost review before deployment. - Deploy and verify the real Lambda -> CockroachDB -> S3 synthetic path, then update the video and submission evidence.

## Active Constraints

# Constraints and Rules ## Constraint Blocks - **If:** adding data, examples, traces, or demo artifacts - **Then:** use only synthetic hackathon data - **Owner:** project owner - **Review Trigger:** any request to import a real FlowGrid ledger, user session, customer record, or private evaluation material - **If:** creating AWS Secrets Manager, Lambda, API Gateway, S3, or another cloud resource - **Then:** stop after read-only preflight and request a separate explicit cost review - **Owner:** project owner - **Review Trigger:** before every `sam deploy` or console resource-creation action - **If:** an agent request conflicts with a confirmed judgment - **Then:** create a pending revision an…

## Source Health

- Status: ok
- Formal decisions: 3
- Indexed decisions: 3
- Missing index entries: 0
- Orphan index entries: 0
- Broken evidence references: 0
- Legacy paths: 0
- Closed patches still pending: 0
- Required action: none; continue to monitor source health.

## Next Actions

- Authenticate AWS through the approved owner flow, run the read-only preflight, then review the exact resource and cost exposure before deployment.

## Evidence References

- D-002: DECISIONS.md#D-002 (source_type: review_action, status: confirmed)
- D-003: DECISIONS.md#D-003 (source_type: review_action, status: confirmed)
- D-004: DECISIONS.md#D-004 (source_type: review_action, status: confirmed)

## Agent Instructions

- Read this Context Pack before acting.
- Treat confirmed decisions as inheritable current project truth.
- Treat pending judgments as candidates, not confirmed facts.
- Surface assumptions when using them to support recommendations.
- Do not revive rejected alternatives unless new evidence exists.
- Do not rely on superseded judgments as current truth.
- Surface the boundary before changing goals, boundaries, review objects, proof
  objects, or core judgments; interrupt the user only when an external,
  irreversible action depends on that change.
- Retrieve evidence when asked why a judgment was made.
- Do not load raw sessions by default.

## Sources Included

- PROJECT.md
- FRAMING.md
- SNAPSHOT.md
- DECISIONS.md
- PROGRESS.md
- CONSTRAINTS.md
- GOAL_EVOLUTION.md
- .flg/state.json
- .flg/patches/*.patch.md
