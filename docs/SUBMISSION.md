# Hackathon Submission Draft

> Status: submission draft. The CockroachDB memory layer, AWS deployment, and public browser demo are live with synthetic data. The remaining gate is a public under-three-minute video that shows the deployed path.

![FlowGrid Memory Runtime architecture](assets/runtime-architecture.svg)

## Project name

FlowGrid Memory Runtime

## Tagline

Agent memory that preserves what is still authorized to change a project.

## Project description

Long-running agents can retrieve context yet still mishandle project commitments: a new request can be treated as permission to overwrite an earlier human decision. FlowGrid Memory Runtime keeps a durable judgment lifecycle instead.

Each confirmed judgment stores its rationale, reversal condition, source events, evidence links, and audit history. A conflicting request becomes a pending proposed revision. It cannot replace an active judgment until qualifying evidence satisfies the recorded reversal condition. When evidence does qualify, the runtime creates a new confirmed judgment, preserves the previous judgment as superseded history, updates the handoff frame, and records the transition.

The demo follows one compact lifecycle:

1. A project owner confirms `D-001`: avoid KOL-heavy launch promotion.
2. Agent B resumes the project and receives the active judgment and its boundary.
3. A KOL request creates pending `P-001`, while `D-001` remains protected.
4. Conversion evidence applies `P-001`, supersedes `D-001`, and confirms `D-002`.

The prototype uses only synthetic data. It does not import FlowGrid project ledgers, private conversations, customer data, or evaluation material.

## Visual proof of the core invariant

| A protected decision | A conflicting request stays pending | Qualifying evidence changes the state |
| --- | --- | --- |
| ![Confirmed D-001](assets/demo-initial.png) | ![Pending P-001 with D-001 still confirmed](assets/demo-pending-revision.png) | ![D-001 superseded and D-002 confirmed](assets/demo-judgment-outcome.png) |

## CockroachDB tools used

| Tool | What the prototype does |
| --- | --- |
| CockroachDB Cloud Basic | Persists synthetic projects, source events, judgments, revisions, evidence links, handoffs, and audit events. |
| Distributed Vector Indexing | A live `VECTOR(8)` index on `memory_embeddings` supports semantic recall of related prior judgments. |
| CockroachDB Managed MCP | Inspects the live schema and synthetic judgment lifecycle with scoped read access; it was also used for narrowly approved setup validation. |

The live cluster evidence is recorded in [VALIDATION.md](VALIDATION.md).

## AWS integration status

The repository includes an AWS SAM template for a controlled Lambda write API, API Gateway, and a private S3 trace bucket. For this synthetic demo, the CockroachDB URL is supplied as an encrypted `NoEcho` deployment parameter rather than through a recurring Secrets Manager resource. The Lambda code performs the lifecycle transaction and returns the same Runtime Snapshot contract consumed by the browser.

**Deployed and verified:** the SAM stack is live in `us-east-1` with Lambda, API Gateway, a private S3 trace bucket, and a seven-day CloudWatch log group. The deployed verifier completed the full synthetic lifecycle against CockroachDB. The public read-only API is `https://ie23uv52be.execute-api.us-east-1.amazonaws.com/demo/runtime/`; the browser build never receives the runtime write token. See [DEPLOYED_RUNTIME.md](DEPLOYED_RUNTIME.md).

## 90-second video script

| Time | On screen | Narration |
| --- | --- | --- |
| 0:00-0:12 | Title and the initial judgment ledger | “Agents remember conversations, but a retrieved request should not silently overwrite a human commitment.” |
| 0:12-0:30 | `D-001` with rationale and reversal condition | “This confirmed judgment has a boundary: do not use KOL-heavy promotion until conversion evidence exists.” |
| 0:30-0:45 | Resume Agent B | “A new agent resumes with the active frame and judgment. Context recovery does not grant edit authority.” |
| 0:45-1:05 | Create `P-001`; keep `D-001` confirmed | “The conflicting KOL request becomes a pending revision. The protected decision remains intact.” |
| 1:05-1:23 | CockroachDB tables, vector index, and Managed MCP read evidence | “CockroachDB persists sources, judgments, revisions, evidence links, handoffs, audit events, and vector-searchable judgment summaries.” |
| 1:23-1:43 | Supply evidence; show `D-001` superseded and `D-002` confirmed | “Only qualifying conversion evidence changes project truth. The previous decision remains traceable instead of being erased.” |
| 1:43-2:00 | Deployed Lambda endpoint and S3 trace after deployment | “AWS Lambda performs the controlled transaction; the browser receives a read-only runtime snapshot. This turns memory into governed project state.” |

The V3 timeline now shows the deployed AWS path and public browser demo. The final export uses the corrected disclosure audio and is publicly available on YouTube. The event requires a publicly visible video under three minutes that shows the CockroachDB memory layer in operation.

## Submission readiness

| Requirement | Current evidence | Status |
| --- | --- | --- |
| Public, open-source repository with license and setup instructions | Public repository, MIT license, README, local demo and tests | Ready |
| Agentic application with CockroachDB persistent memory | Live synthetic schema, lifecycle rows, vector index, Managed MCP inspection | Ready |
| Meaningful AWS integration | Deployed Lambda, API Gateway, private S3 trace bucket, and end-to-end CockroachDB verification | Ready |
| Functional public demo URL | GitHub Pages build reads the deployed public snapshot without browser credentials | Ready: https://dlxeva.github.io/flowgrid-memory-runtime/ |
| Public video under 3 minutes | Public YouTube demonstration showing the browser lifecycle and CockroachDB SQL results | Ready: https://youtu.be/Wcs3EQojEzE |
| CockroachDB tool explanation | This document and `VALIDATION.md` | Ready |
| AWS service explanation | This document distinguishes deployed Lambda, API Gateway, private S3 traces, and read-only browser access | Ready |

## Submission record

The Devpost submission was completed on 2026-07-19 with the public repository,
functional demo, and YouTube video links below.

```text
Repository URL: https://github.com/dlxeva/flowgrid-memory-runtime
Demo URL: https://dlxeva.github.io/flowgrid-memory-runtime/
Video URL: https://youtu.be/Wcs3EQojEzE
```

## Rule reference

The official rules require a project that uses CockroachDB as persistent memory, is deployed on AWS, has meaningful integration of both components, and includes a functional demo URL plus a public demonstration video under three minutes. See the [official rules](https://cockroachdb-ai.devpost.com/rules).
