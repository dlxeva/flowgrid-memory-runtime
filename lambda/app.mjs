import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import pg from "pg";
import { hasValidWriteToken } from "./auth.mjs";
import { classifyRevision, deterministicEmbedding, vectorLiteral } from "./decision-rules.mjs";
import { ensureProject, findProject } from "./project-store.mjs";
import { createRuntimeSnapshot } from "./runtime-snapshot.mjs";

const { Pool } = pg;
const secrets = new SecretsManagerClient({});
const s3 = new S3Client({});

let pool;
let resolvedDatabaseUrl;

async function databaseUrl() {
  if (resolvedDatabaseUrl) return resolvedDatabaseUrl;
  if (process.env.DATABASE_URL) {
    resolvedDatabaseUrl = process.env.DATABASE_URL;
    return resolvedDatabaseUrl;
  }
  if (!process.env.DATABASE_URL_SECRET_ARN) {
    throw new Error("DATABASE_URL_SECRET_ARN or DATABASE_URL must be configured.");
  }

  const response = await secrets.send(
    new GetSecretValueCommand({ SecretId: process.env.DATABASE_URL_SECRET_ARN }),
  );
  resolvedDatabaseUrl = response.SecretString;
  return resolvedDatabaseUrl;
}

async function client() {
  if (!pool) {
    pool = new Pool({ connectionString: await databaseUrl(), max: 2 });
  }
  return pool.connect();
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type,x-runtime-token",
      "access-control-allow-methods": "GET,POST,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

function parseBody(event) {
  if (!event.body) return {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
}

async function recordSource(db, projectId, { sourceKey, eventType, actor, content, authority = "medium" }) {
  const result = await db.query(
    `INSERT INTO source_events
       (project_id, source_key, event_type, actor, content, authority, occurred_at)
     VALUES ($1, $2, $3, $4, $5, $6, now())
     ON CONFLICT (project_id, source_key) DO UPDATE SET content = excluded.content
     RETURNING id, source_key`,
    [projectId, sourceKey, eventType, actor, content, authority],
  );
  return result.rows[0];
}

async function audit(db, projectId, eventType, artifactKey, detail) {
  await db.query(
    `INSERT INTO audit_events (project_id, event_type, artifact_key, actor, detail)
     VALUES ($1, $2, $3, 'runtime', $4::JSONB)`,
    [projectId, eventType, artifactKey, JSON.stringify(detail)],
  );
}

async function storeEmbedding(db, projectId, judgmentId, content) {
  await db.query(
    `INSERT INTO memory_embeddings (project_id, judgment_id, content, embedding)
     VALUES ($1, $2, $3, $4::VECTOR)
     ON CONFLICT (judgment_id) DO UPDATE SET content = excluded.content, embedding = excluded.embedding`,
    [projectId, judgmentId, content, vectorLiteral(deterministicEmbedding(content))],
  );
}

async function semanticRecall(db, projectId, query) {
  const vector = vectorLiteral(deterministicEmbedding(query));
  const result = await db.query(
    `SELECT judgment_id, content, embedding <=> $2::VECTOR AS distance
     FROM memory_embeddings
     WHERE project_id = $1
     ORDER BY embedding <=> $2::VECTOR
     LIMIT 3`,
    [projectId, vector],
  );
  return result.rows;
}

async function readState(db, project) {
  const [sources, judgments, revisions, evidenceLinks, handoff, auditEvents] = await Promise.all([
    db.query(`SELECT source_key, event_type, content, occurred_at
              FROM source_events WHERE project_id = $1 ORDER BY occurred_at`, [project.id]),
    db.query(`SELECT j.decision_key, j.title, j.status, j.authority, j.rationale, j.reversal_condition,
                     j.valid_at, j.superseded_at, replacement.decision_key AS superseded_by_key
              FROM judgments j
              LEFT JOIN judgments replacement ON replacement.id = j.superseded_by
              WHERE j.project_id = $1 ORDER BY j.created_at`, [project.id]),
    db.query(`SELECT r.revision_key, r.proposal, r.required_evidence, r.status, r.created_at, r.resolved_at,
                     j.decision_key AS active_decision_key
              FROM proposed_revisions r
              JOIN judgments j ON j.id = r.active_judgment_id
              WHERE r.project_id = $1 ORDER BY r.created_at`, [project.id]),
    db.query(`SELECT s.source_key, e.relation, j.decision_key, r.revision_key
              FROM evidence_links e
              JOIN source_events s ON s.id = e.source_event_id
              LEFT JOIN judgments j ON j.id = e.judgment_id
              LEFT JOIN proposed_revisions r ON r.id = e.proposed_revision_id
              WHERE e.project_id = $1 ORDER BY e.created_at`, [project.id]),
    db.query(`SELECT active_frame, updated_at FROM handoffs WHERE project_id = $1`, [project.id]),
    db.query(`SELECT event_type, artifact_key, detail, created_at
              FROM audit_events WHERE project_id = $1 ORDER BY created_at DESC LIMIT 20`, [project.id]),
  ]);

  return createRuntimeSnapshot({
    projectSlug: project.slug,
    sources: sources.rows,
    judgments: judgments.rows,
    proposedRevisions: revisions.rows,
    evidenceLinks: evidenceLinks.rows,
    handoff: handoff.rows[0] ?? null,
    auditEvents: auditEvents.rows,
  });
}

async function saveTrace(projectSlug, action, payload) {
  if (!process.env.ARTIFACT_BUCKET) return;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.ARTIFACT_BUCKET,
    Key: `synthetic-runs/${projectSlug}/${new Date().toISOString()}-${action}.json`,
    Body: JSON.stringify(payload, null, 2),
    ContentType: "application/json",
  }));
}

async function executeAction(db, project, body) {
  const action = body.action;
  if (action === "initialize_demo") {
    const source = await recordSource(db, project.id, {
      sourceKey: "S-001",
      eventType: "human_commitment",
      actor: "Project owner",
      content: "Do not use KOL-heavy launch promotion without evidence of conversion fit.",
      authority: "high",
    });
    const judgment = await db.query(
      `INSERT INTO judgments
         (project_id, decision_key, title, status, authority, rationale, reversal_condition)
       VALUES ($1, 'D-001', 'Avoid KOL-heavy launch promotion', 'confirmed', 'high', $2, $3)
       ON CONFLICT (project_id, decision_key) DO UPDATE SET title = excluded.title
       RETURNING id, decision_key`,
      [project.id,
       "Current budget and channel-fit evidence do not justify a KOL-heavy launch.",
       "Reopen only if attributable conversion evidence demonstrates KOL fit."],
    );
    await db.query(
      `INSERT INTO evidence_links (project_id, source_event_id, judgment_id, relation)
       SELECT $1, $2, $3, 'confirmed_by'
       WHERE NOT EXISTS (
         SELECT 1 FROM evidence_links
         WHERE source_event_id = $2 AND judgment_id = $3 AND relation = 'confirmed_by'
       )`,
      [project.id, source.id, judgment.rows[0].id],
    );
    await storeEmbedding(db, project.id, judgment.rows[0].id,
      "Avoid KOL-heavy launch promotion. KOL launch requires attributable conversion evidence.");
    await db.query(
      `UPSERT INTO handoffs (project_id, active_frame, updated_at)
       VALUES ($1, 'D-001 is confirmed and protected by a conversion-evidence reversal condition.', now())`,
      [project.id],
    );
    await audit(db, project.id, "judgment_confirmed", "D-001", { source: source.source_key });
    return readState(db, project);
  }

  if (action === "resume") {
    await audit(db, project.id, "agent_resumed", "handoff", { agent: body.agent ?? "Agent B" });
    return readState(db, project);
  }

  if (action === "request_revision") {
    const active = await db.query(
      `SELECT id, decision_key, title, reversal_condition
       FROM judgments
       WHERE project_id = $1 AND decision_key = $2 AND status = 'confirmed'`,
      [project.id, body.decisionKey],
    );
    if (!active.rows[0]) throw new Error("An active confirmed judgment is required for a revision proposal.");

    const judgment = active.rows[0];
    const source = await recordSource(db, project.id, {
      sourceKey: body.sourceKey ?? `S-${Date.now()}`,
      eventType: "revision_request",
      actor: body.actor ?? "Agent B",
      content: body.request,
      authority: body.authority ?? "medium",
    });
    const recalled = await semanticRecall(db, project.id, body.request);
    const revision = await db.query(
      `INSERT INTO proposed_revisions
         (project_id, revision_key, active_judgment_id, request_source_id, proposal, required_evidence, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, revision_key`,
      [project.id, body.revisionKey ?? `P-${Date.now()}`, judgment.id, source.id, body.proposal,
       judgment.reversal_condition],
    );
    await db.query(
      `INSERT INTO evidence_links (project_id, source_event_id, proposed_revision_id, relation)
       VALUES ($1, $2, $3, 'triggered')`,
      [project.id, source.id, revision.rows[0].id],
    );
    await audit(db, project.id, "revision_proposed", revision.rows[0].revision_key, {
      protectedDecision: judgment.decision_key,
      recalled,
    });
    return { revisionKey: revision.rows[0].revision_key, recalled, status: "pending" };
  }

  if (action === "apply_evidence") {
    const revision = await db.query(
      `SELECT r.id, r.revision_key, r.active_judgment_id, r.proposal, r.required_evidence,
              j.decision_key, j.title, j.authority
       FROM proposed_revisions r
       JOIN judgments j ON j.id = r.active_judgment_id
       WHERE r.project_id = $1 AND r.revision_key = $2 AND r.status = 'pending'`,
      [project.id, body.revisionKey],
    );
    if (!revision.rows[0]) throw new Error("A pending revision is required before evidence can apply a change.");
    if (classifyRevision({ hasQualifyingEvidence: Boolean(body.qualifyingEvidence) }) !== "apply") {
      throw new Error("Qualifying evidence is required before a protected judgment can be superseded.");
    }

    const pending = revision.rows[0];
    const source = await recordSource(db, project.id, {
      sourceKey: body.sourceKey ?? `S-${Date.now()}`,
      eventType: "qualifying_evidence",
      actor: body.actor ?? "External evidence",
      content: body.qualifyingEvidence,
      authority: body.authority ?? "high",
    });
    const nextKey = body.nextDecisionKey ?? `${pending.decision_key}-rev`;
    const next = await db.query(
      `INSERT INTO judgments
         (project_id, decision_key, title, status, authority, rationale, reversal_condition)
       VALUES ($1, $2, $3, 'confirmed', $4, $5, $6)
       RETURNING id, decision_key`,
      [project.id, nextKey, body.title ?? `Revision of ${pending.title}`, pending.authority,
       body.rationale ?? pending.proposal, body.nextReversalCondition ?? "Reopen if conversion evidence weakens."],
    );
    await db.query(
      `UPDATE judgments SET status = 'superseded', superseded_at = now(), superseded_by = $2
       WHERE id = $1`,
      [pending.active_judgment_id, next.rows[0].id],
    );
    await db.query(
      `UPDATE proposed_revisions SET status = 'applied', applied_judgment_id = $2, resolved_at = now()
       WHERE id = $1`,
      [pending.id, next.rows[0].id],
    );
    await db.query(
      `INSERT INTO evidence_links (project_id, source_event_id, judgment_id, relation)
       VALUES ($1, $2, $3, 'confirmed_by')`,
      [project.id, source.id, next.rows[0].id],
    );
    await storeEmbedding(db, project.id, next.rows[0].id, `${body.title ?? pending.title}. ${body.rationale ?? pending.proposal}`);
    await db.query(
      `UPSERT INTO handoffs (project_id, active_frame, updated_at)
       VALUES ($1, $2, now())`,
      [project.id, `Current confirmed judgment: ${next.rows[0].decision_key}`],
    );
    await audit(db, project.id, "judgment_superseded", next.rows[0].decision_key, {
      superseded: pending.decision_key,
      evidenceSource: source.source_key,
    });
    return { status: "applied", superseded: pending.decision_key, current: next.rows[0].decision_key };
  }

  throw new Error(`Unsupported action: ${action}`);
}

export function createHandler({ acquireClient = client, persistTrace = saveTrace, writeToken = process.env.RUNTIME_WRITE_TOKEN } = {}) {
  return async function handler(event) {
    if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") return response(204, {});
    const method = event.requestContext?.http?.method ?? event.httpMethod ?? "GET";
    const projectSlug = event.queryStringParameters?.project ?? "demo-launch";

    if (method !== "GET" && method !== "POST") return response(405, { error: "Method not allowed" });
    if (method === "POST" && !hasValidWriteToken(event, writeToken)) {
      return response(401, { error: "Invalid runtime write token" });
    }

    const db = await acquireClient();
    try {
      if (method === "GET") {
        const project = await findProject(db, projectSlug);
        if (!project) return response(404, { error: "Project not found" });
        return response(200, await readState(db, project));
      }

      const body = parseBody(event);
      const project = body.action === "initialize_demo"
        ? await ensureProject(db, projectSlug)
        : await findProject(db, projectSlug);
      if (!project) return response(404, { error: "Project not found; initialize the demo first" });
      await db.query("BEGIN");
      const result = await executeAction(db, project, body);
      await db.query("COMMIT");
      await persistTrace(project.slug, body.action, result);
      return response(200, result);
    } catch (error) {
      await db.query("ROLLBACK").catch(() => {});
      return response(400, { error: error instanceof Error ? error.message : "Runtime error" });
    } finally {
      db.release();
    }
  };
}

export const handler = createHandler();
