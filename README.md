# FlowGrid Memory Runtime

> Most agent memory retrieves what was said. This runtime decides what is still authorized to change the project.

FlowGrid Memory Runtime is a new hackathon prototype inspired by the open-source FlowGrid project. It demonstrates how long-running agents can preserve a project's confirmed decisions, propose safe revisions, and resume work without silently overwriting human-authorized state.

## Current milestone

This repository currently provides a local, synthetic demo of the judgment lifecycle:

1. Agent A commits a protected decision with rationale and a reversal condition.
2. Agent B resumes the project from its active frame and judgment ledger.
3. A conflicting request creates a pending proposed revision, not an overwrite.
4. Qualifying evidence applies the revision and preserves the supersession/audit chain.

It does **not** yet connect to CockroachDB Cloud, Managed MCP, AWS Lambda, or production data. Those integrations are the next milestone and will be implemented openly in this repository.

## Local development

```bash
npm install
npm run dev
```

Run checks:

```bash
npm test
npm run build
```

## Planned cloud architecture

```text
Agent -> CockroachDB Managed MCP (read active frame and judgments)
      -> AWS Lambda Memory API (controlled writes)
      -> CockroachDB (transactional ledger + vector index + audit)
      -> Amazon S3 (synthetic demo artifacts)
```

CockroachDB Vector Indexing will retrieve relevant prior judgments. The runtime will use transactions to atomically write a proposed revision, evidence links, embedding reference, and audit event.

## Scope and disclosure

This is a separate project created for the CockroachDB x AWS Hackathon during its submission period. FlowGrid is a pre-existing open-source local project-state protocol and is disclosed as the conceptual basis. This prototype does not copy real project ledgers, user sessions, customer data, or private evaluation material.

