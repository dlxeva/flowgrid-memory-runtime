# FlowGrid Memory Runtime Video Narration

This is the audio-first script for the rebuilt demo video. The voiceover is
generated locally from an owner-provided reference sample. Every visual must be
an editable HTML/CSS scene: text, cards, state transitions, and architecture
shapes are rendered as vectors rather than screenshots or bitmap diagrams.

Generate one audio clip per beat. Set the final scene duration from the produced
clip duration plus a short transition, not from a preallocated 90-second grid.

## V3 Narration And Scene Contract

| Beat | Narration | HTML/CSS scene derived from the line |
| --- | --- | --- |
| 1 | Agent memory can retrieve what was said. A project also needs to know what is still authorized to change it. | A flowing chat-memory stream condenses into a project frame. The word `authorized` becomes the visual pivot. |
| 2 | Here, D-zero-zero-one is a confirmed decision. It carries its rationale, its rejected alternative, and the condition that would reopen it. | A single decision card expands three attached vector fields: `Why`, `Rejected`, and `Reopen when`. |
| 3 | Then an agent receives a new request: make KOL promotion the priority. That request does not overwrite the project. It becomes a pending revision. | A seal-red incoming request is connected from `D-001` into `P-001 Pending revision` by an explicit right-angle path. No content is covered or removed. |
| 4 | The next agent can now see the active decision, the unresolved proposal, and the evidence still required. | A handoff view presents three clearly separated columns: `Active`, `Pending`, and `Required evidence`. |
| 5 | Only qualifying conversion evidence can authorize the revision. When that evidence arrives, D-zero-zero-two becomes current. D-zero-zero-one remains visible as superseded history. | A signal-blue evidence node connects `D-001 Superseded` to `D-002 Current` with exact edge-to-node contact. Confirmed state is typographic and black, not green. |
| 6 | CockroachDB stores this lifecycle as sources, judgments, revisions, evidence, handoffs, and audit events. | Six vector nodes animate into a compact durable-record graph. CockroachDB is a labeled storage surface, not a product-logo screenshot. |
| 7 | The result is more than a fluent summary. It is a governed record of what an agent may believe, change, or challenge. | The graph resolves into the three verbs: `Believe`, `Change`, `Challenge`, each with a distinct status color. |
| 8 | This demo uses synthetic data. The runtime is deployed on AWS, and the public browser demo is read only. CockroachDB holds the lifecycle state. | A final live-demo card: synthetic data, AWS Lambda + API read-only browser demo, CockroachDB persistent lifecycle state, the public demo URL, and the Institute seal. |

## Visual Rules

- Use HTML/CSS or native vector motion graphics only. Do not place screenshots,
  raster diagrams, or text baked into images on the timeline.
- Keep each scene at 1920 by 1080 and use a title-safe grid.
- Use the 人工智障研究所 archive palette: paper `#f5eedb`, ink `#26221a`,
  seal red `#8c2f23` for pending revisions, signal blue `#2a6df5` for
  qualifying evidence, and muted brown `#7a6244` for historical state.
- Use the Institute seal only as the opening and closing brand signature. It
  is never a status marker for a confirmed or pending judgment.
- Let the narration lead: animate the noun or state transition being spoken,
  rather than filling the screen before the line explains it.
- Use synthetic identifiers and data only. Do not include private FlowGrid
  ledgers, sessions, user voice samples, or customer material.

## Delivery Boundary

- The V3 visual timeline shows only synthetic data and never contains a
  database URL, runtime write token, or private FlowGrid material.
- The deployed AWS path and public demo are real. The final export remains
  blocked only on replacing the legacy closing voice clip, which still says
  deployment is planned.
