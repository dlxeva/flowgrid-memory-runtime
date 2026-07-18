# FlowGrid Memory Runtime

> Most agent memory retrieves what was said. This runtime decides what is still authorized to change the project.

FlowGrid Memory Runtime is a new hackathon prototype inspired by the open-source FlowGrid project. It demonstrates how long-running agents can preserve a project's confirmed decisions, propose safe revisions, and resume work without silently overwriting human-authorized state.

## What works now

This repository provides a local, synthetic demo of the judgment lifecycle. It requires no cloud credentials:

1. Agent A commits a protected decision with rationale and a reversal condition.
2. Agent B resumes the project from its active frame and judgment ledger.
3. A conflicting request creates a pending proposed revision, not an overwrite.
4. Qualifying evidence applies the revision and preserves the supersession/audit chain.

- The browser demo runs the lifecycle locally with deterministic state transitions.
- The CockroachDB Basic cluster contains the same synthetic schema, lifecycle data, and a live vector index.
- The Lambda code maps CockroachDB rows into the same runtime snapshot that the browser consumes. Deployment remains optional because it creates AWS resources and requires credentials.

See [docs/VALIDATION.md](docs/VALIDATION.md) for the live database evidence and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the runtime contract.

## Run the demo

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, then follow the three buttons in order:

1. Resume with Agent B. `D-001` stays confirmed.
2. Request KOL change. The runtime creates pending `P-001`; it does not overwrite `D-001`.
3. Add conversion evidence. `D-001` becomes superseded and `D-002` is confirmed with an audit trail.

The full walkthrough, expected states, and reviewer checklist are in [docs/DEMO.md](docs/DEMO.md).

Run automated checks:

```bash
npm test
npm run build
```

## Optional cloud architecture

```text
Agent -> CockroachDB Managed MCP (read active frame and judgments)
      -> AWS Lambda Memory API (controlled writes)
      -> CockroachDB (transactional ledger + vector index + audit)
      -> Amazon S3 (synthetic demo artifacts)
```

CockroachDB Vector Indexing retrieves related prior judgments. The Lambda runtime uses transactions to atomically write a proposed revision, evidence links, an embedding reference, updated handoff state, and an audit event.

## Deploy the synthetic cloud demo

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) only when a separate cost review approves deployment. It uses an AWS Lambda write path, CockroachDB Cloud for durable judgment state and vector recall, CockroachDB Managed MCP for agent inspection, and a private S3 bucket for synthetic run traces.

## Scope and disclosure

This is a separate project created for the CockroachDB x AWS Hackathon during its submission period. FlowGrid is a pre-existing open-source local project-state protocol and is disclosed as the conceptual basis. This prototype does not copy real project ledgers, user sessions, customer data, or private evaluation material.
