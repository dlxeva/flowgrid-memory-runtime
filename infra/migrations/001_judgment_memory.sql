-- FlowGrid Memory Runtime: synthetic hackathon schema.
-- This schema stores authorized judgments separately from proposed revisions.

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug STRING NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS source_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects (id),
  source_key STRING NOT NULL,
  event_type STRING NOT NULL,
  actor STRING NOT NULL,
  content STRING NOT NULL,
  authority STRING NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  UNIQUE (project_id, source_key)
);

CREATE TABLE IF NOT EXISTS judgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects (id),
  decision_key STRING NOT NULL,
  title STRING NOT NULL,
  status STRING NOT NULL CHECK (status IN ('confirmed', 'superseded')),
  authority STRING NOT NULL,
  rationale STRING NOT NULL,
  reversal_condition STRING NOT NULL,
  valid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  superseded_at TIMESTAMPTZ NULL,
  superseded_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, decision_key)
);

CREATE TABLE IF NOT EXISTS proposed_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects (id),
  revision_key STRING NOT NULL,
  active_judgment_id UUID NOT NULL REFERENCES judgments (id),
  request_source_id UUID NOT NULL REFERENCES source_events (id),
  proposal STRING NOT NULL,
  required_evidence STRING NOT NULL,
  status STRING NOT NULL CHECK (status IN ('pending', 'applied', 'discarded')),
  applied_judgment_id UUID NULL REFERENCES judgments (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ NULL,
  UNIQUE (project_id, revision_key)
);

CREATE TABLE IF NOT EXISTS evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects (id),
  source_event_id UUID NOT NULL REFERENCES source_events (id),
  judgment_id UUID NULL REFERENCES judgments (id),
  proposed_revision_id UUID NULL REFERENCES proposed_revisions (id),
  relation STRING NOT NULL CHECK (relation IN ('triggered', 'supports', 'confirmed_by', 'invalidates')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (judgment_id IS NOT NULL OR proposed_revision_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS handoffs (
  project_id UUID PRIMARY KEY REFERENCES projects (id),
  active_frame STRING NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects (id),
  event_type STRING NOT NULL,
  artifact_key STRING NOT NULL,
  actor STRING NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memory_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects (id),
  judgment_id UUID NOT NULL REFERENCES judgments (id),
  content STRING NOT NULL,
  embedding VECTOR(8) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (judgment_id)
);

CREATE INDEX IF NOT EXISTS judgments_project_status_idx ON judgments (project_id, status);
CREATE INDEX IF NOT EXISTS revisions_project_status_idx ON proposed_revisions (project_id, status);
CREATE INDEX IF NOT EXISTS audit_events_project_created_idx ON audit_events (project_id, created_at DESC);

-- Enable this once on the CockroachDB Cloud cluster before applying the index.
-- SET CLUSTER SETTING feature.vector_index.enabled = true;
CREATE VECTOR INDEX IF NOT EXISTS memory_embeddings_project_embedding_idx
  ON memory_embeddings (project_id, embedding vector_l2_ops);
