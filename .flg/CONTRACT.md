# FlowGrid Contract

## Core Rules

1. **Project directory is the highest priority source of truth.**
   AI memory is only temporary cache. When conflicts arise, project files win.

2. **AI memory is temporary cache only.**
   Do not rely on AI memory for project facts. Always verify against project files.

3. **Agent startup reading protocol (TWO-LAYER STATE):**

   **Layer 1 - Formal Ledger (已合并事实):**
   - `.flg/CONTRACT.md`
   - `PROJECT.md`
   - `FRAMING.md`
   - `SNAPSHOT.md`
   - `DECISIONS.md`
   - `PROGRESS.md`

   **Layer 2 - Pending Patches (待审核事实):**
   - `.flg/patches/` 中所有 `status: pending_review` 的 patch
   - Pending patches 不是正式事实，但属于"待确认项目状态"
   - Agent 必须读取并理解 pending patches 的内容

4. **Agent must distinguish four types of facts:**
   - **已合并事实 (Merged facts):** 正式账本中的内容
   - **待审核事实 (Pending facts):** pending patches 中的内容
   - **冲突事实 (Conflicting facts):** pending patches 与正式账本冲突的内容
   - **需显式行动边界的事实 (Action-boundary facts):** 涉及外部不可逆动作的变更

5. **If pending patches are relevant to current task, Agent must process them in the background:**
   - Read only patches whose header is `status: pending_review`
   - Run `flg review --report-only` before autonomous adoption
   - Keep shell and ambiguous candidates pending
   - Report only material state changes, unresolved ambiguity, or an external irreversible action

6. **Before execution, check:**
   - Goals
   - Boundaries
   - User objects
   - Success criteria
   - Constraints

7. **Session end requires closeout.**
   Execute `flg closeout` or generate closeout recommendations.

8. **Low risk writes can be appended directly.**
   Progress logs, discussion notes, and non-critical updates.

9. **Medium/high risk writes must enter patch.**
   - Target changes
   - Boundary changes
   - Strategy judgments
   - Decision updates
   - Snapshot updates

10. **Never directly overwrite core files for medium/high risk changes.**
    All such changes go to `.flg/patches/` for background processing. Surface
    the boundary and interrupt only when an irreversible external action depends
    on the change.

11. **When agent memory conflicts with project files:**
    - Project files win
    - Generate conflict patch
    - Explain source and reasoning
    - Keep ambiguous candidates pending; do not create a routine approval prompt

12. **Multi-agent relay protocol:**
    - Later agents must read BOTH formal ledger AND pending patches
    - Then continue from current state (including pending state)
    - Closeout before leaving

13. **Project materials live in `docs/`.**
    - `docs/` is the user's free zone for research, meeting notes, background
      docs, client intelligence, and other process materials.
    - FLG does NOT scan or audit `docs/` — it is outside the formal ledger.
    - `docs/README.md` is the index: list what's inside so a new agent knows
      what materials exist without crawling the directory.
    - Materials in `docs/` are reference, not truth. When a material contradicts
      the formal ledger, the ledger wins (Core Rule 1).

## Agent Startup Context Protocol

When an agent enters a FLG project, it MUST read these three sources in order.
Total payload: ~3-4KB. Every source is a plaintext file — the user can inspect,
modify, and verify what the agent sees. No black-box memory.

### 1. SNAPSHOT.md (~2KB) — Current State

The project snapshot gives the agent immediate situational awareness:
current stage, core goal, confirmed/unconfirmed judgments, risks, and the next
highest-priority action. Always read first.

### 2. Most Recent 1-2 Decisions from DECISIONS.md (~1KB) — Decision Boundary

The agent must know what has already been decided (and why) before making new
recommendations. Reading the most recent decisions prevents re-suggesting
rejected alternatives and keeps the agent within the project's current judgment
boundary.

### 3. `next_actions` from `.flg/state.json` (~0.5KB) — Immediate Task

The agent must know what the project considers the next concrete actions. This
is the bridge between "understanding the project" and "doing something useful."

### Why This Protocol

Without this protocol, agents re-discover the project from scratch every session.
They read arbitrary files, skip important ones, and the user has no visibility
into what was loaded. This protocol makes agent startup:
- **Predictable** — same 3 sources every time
- **Auditable** — user can read the same files the agent reads
- **Efficient** — 3-4KB instead of 40KB+ of history dump
- **Host-agnostic** — works for Hermes, Codex, Claude Code, or any agent

Run `flg context` to see exactly what an agent would get on startup.

## Write Risk Levels

| Risk Level | Files | Strategy |
|------------|-------|----------|
| Low | PROGRESS.md | Direct append |
| Medium | SNAPSHOT.md, FRAMING.md (supplement) | Generate patch |
| High | FRAMING.md (modify goals/boundaries), DECISIONS.md (override), PROJECT.md | Preserve patch and provenance; interrupt only before an external irreversible action |

## State Schema (`.flg/state.json`)

FlowGrid maintains a project state file at `.flg/state.json`. The schema is split into two layers:

### Core Fields (CLI depends on these)

These 13 fields are required for CLI operations. When reading a state file, the CLI normalizes variant field names (see map below) and auto-fills safe defaults for missing fields.

| Field | Type | Description |
|-------|------|-------------|
| `schema_version` | string | Schema version for migration ("1") |
| `project_id` | string | Unique project identifier |
| `project_name` | string | Human-readable project name |
| `flg_version` | string | FLG version that last wrote this state |
| `created_at` | string | ISO timestamp of project creation |
| `updated_at` | string | ISO timestamp of last update |
| `current_stage` | string | Current project stage |
| `last_closeout_at` | string/null | Last closeout timestamp |
| `pending_patches` | array | List of pending patch objects |
| `next_actions` | array | List of next action strings |
| `active_agent` | string/null | Currently active agent |
| `dirty_files` | array | Files with uncommitted changes |
| `last_snapshot_hash` | string/null | Hash of last snapshot |

### Variant Field Map (legacy compatibility)

The CLI reads these alternative key names from older or skill-written states. No forced rewrite — compatibility is handled at read time.

| Canonical | Variants |
|-----------|----------|
| `project_name` | `name` |
| `created_at` | `created`, `date_created` |
| `updated_at` | `updated`, `last_updated` |
| `current_stage` | `phase`, `current_phase`, `phase_status`, `status` |
| `flg_version` | `version` |

### Extension Fields

Any key not in the core set is treated as a **project-specific extension**. The CLI preserves these fields but never depends on them. Examples from real projects: `linked_projects`, `platforms_tracked`, `database_path`, `decision_log_format`, `content_lines`.

### Schema Health

Run `flg state-schema` to see your project's state health:
- **ok** — all core fields present, no variant mappings needed
- **legacy** — variant field names detected, but all core fields can be resolved
- **degraded** — some core fields are missing and cannot be autofilled

## Decision Log Protocol

Decision logs are the most durable asset in a project. They record not just what was decided, but why — the context, alternatives considered, reasoning, and conditions under which the decision should be revisited.

When an agent reads DECISIONS.md, it should:
1. Understand the reasoning chain, not just the conclusions
2. Avoid re-suggesting rejected alternatives without new evidence
3. Reference past decisions when making new recommendations

When an agent generates a closeout, it should extract:
- What was decided (confirmation/trade-off signals)
- Why it was decided (reasoning from the conversation)
- What was rejected (alternatives mentioned and why they were dropped)
- What could reverse the decision (trigger conditions)

## Agent Capabilities

When working on a FLG project, an agent should be capable of three things:

### Memory QA (项目记忆问答)
User: "我们之前为什么不做KOL？"
Agent: Reads DECISIONS.md, finds D-XXX, returns the reasoning chain.

### Context Enhance (上下文增强)
User: "我想做一个新的推广方案"
Agent: Reads FRAMING.md + DECISIONS.md + SNAPSHOT.md, then asks:
  "基于之前的判断（预算有限、私域优先），你这次想沿用还是调整？"

### Context Critic (上下文审计)
User: "客户说要投KOL"
Agent: Reads DECISIONS.md, finds D-XXX (rejected KOL), then says:
  "之前判断过KOL ROI不确定（D-XXX）。有新信息改变了这个判断吗？"

---

*FlowGrid v0.3.0*
