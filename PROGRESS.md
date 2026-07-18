# Progress Log

## 2026-07-18

- Created the synthetic CockroachDB schema and lifecycle proof on the existing Basic cluster.
- Added and verified local AWS CLI/SAM tooling and a read-only deployment preflight script.
- Hardened Lambda reads so GET does not initialize state and unauthorized POST requests do not open a database connection.
- Aligned the runtime's vector recall operator and migration with the live `vector_l2_ops` index; unit, build, and SAM validation pass.
- Rendered a synthetic HTML/CSS demo video using an owner-provided voice clone; the current cut is intentionally frozen for later visual refinement.
- Completed the owner-approved $3 AWS budget alert and deployed the `flowgrid-memory-runtime` stack in `us-east-1`.
- Verified the deployed Lambda -> CockroachDB -> S3 synthetic lifecycle: `D-001` confirmed, `P-001` pending, then `D-001` superseded by confirmed `D-002` after qualifying evidence.
- Independently read the deployed final snapshot through the public unauthenticated `GET` path; the browser build remains read-only and receives no database URL or runtime token.
- Published the browser demo at `https://dlxeva.github.io/flowgrid-memory-runtime/`; verified HTTP 200, the deployed API URL in the static bundle, and the absence of database URL and runtime write token strings.
- Rebuilt the editable V3 ChatCut visual timeline in the 人工智障研究所 archive style: the seal is brand-only, pending revisions use seal red, evidence uses signal blue, and state-transition lines are explicit and reviewed.

## Next

- Replace the legacy disclosure voice clip with the deployed-runtime wording, export V3, and publish the submission evidence.
- Delete the stack and SAM packaging artifacts after the hackathon demonstration window.

---

*Created: 2026-07-18T18:28:52*
*Last Updated: 2026-07-19T02:12:00+08:00*
