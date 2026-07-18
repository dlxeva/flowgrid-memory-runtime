# FlowGrid Memory Runtime Video Narration

This is the audio-first script for the rebuilt demo video. The voiceover is
generated locally from an owner-provided reference sample. Every visual must be
an editable HTML/CSS scene: text, cards, state transitions, and architecture
shapes are rendered as vectors rather than screenshots or bitmap diagrams.

Generate one audio clip per beat. Set the final scene duration from the produced
clip duration plus a short transition, not from a preallocated 90-second grid.

## Narration And Scene Contract

| Beat | Narration | HTML/CSS scene derived from the line |
| --- | --- | --- |
| 1 | Agent memory can retrieve what was said. A project also needs to know what is still authorized to change it. | A flowing chat-memory stream condenses into a project frame. The word `authorized` becomes the visual pivot. |
| 2 | Here, D-zero-zero-one is a confirmed decision. It carries its rationale, its rejected alternative, and the condition that would reopen it. | A single decision card expands three attached vector fields: `Why`, `Rejected`, and `Reopen when`. |
| 3 | Then an agent receives a new request: make KOL promotion the priority. That request does not overwrite the project. It becomes a pending revision. | A red incoming request meets the confirmed card, then moves into an amber `P-001 Pending revision` lane. No content is covered or removed. |
| 4 | The next agent can now see the active decision, the unresolved proposal, and the evidence still required. | A handoff view presents three clearly separated columns: `Active`, `Pending`, and `Required evidence`. |
| 5 | Only qualifying conversion evidence can authorize the revision. When that evidence arrives, D-zero-zero-two becomes current. D-zero-zero-one remains visible as superseded history. | A green evidence token unlocks a state transition. `D-002 Current` rises above a muted but readable `D-001 Superseded` card linked by an audit line. |
| 6 | CockroachDB stores this lifecycle as sources, judgments, revisions, evidence, handoffs, and audit events. | Six vector nodes animate into a compact durable-record graph. CockroachDB is a labeled storage surface, not a product-logo screenshot. |
| 7 | The result is more than a fluent summary. It is a governed record of what an agent may believe, change, or challenge. | The graph resolves into the three verbs: `Believe`, `Change`, `Challenge`, each with a distinct status color. |
| 8 | This demo uses synthetic data. The runtime is local with live CockroachDB validation. The AWS deployment path remains the next step. | A precise disclosure card: `Local runtime: live`, `CockroachDB: validated`, `AWS deployment: planned`. |

## Visual Rules

- Use HTML/CSS or native vector motion graphics only. Do not place screenshots,
  raster diagrams, or text baked into images on the timeline.
- Keep each scene at 1920 by 1080 and use a title-safe grid.
- Let the narration lead: animate the noun or state transition being spoken,
  rather than filling the screen before the line explains it.
- Use synthetic identifiers and data only. Do not include private FlowGrid
  ledgers, sessions, user voice samples, or customer material.

## Delivery Boundary

- Do not claim that Lambda, API Gateway, or S3 are deployed.
- The final Devpost submission still needs a deployed AWS integration, a public
  functional demo URL, and a video that shows that deployed path.
