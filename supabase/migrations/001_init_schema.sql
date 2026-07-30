-- Kae Thesis Radar Schema

-- Workspaces
CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- User profiles (linked to auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  full_name text,
  role text CHECK (role IN ('analyst', 'admin')) DEFAULT 'analyst',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Thesis opportunities (public seed data)
CREATE TABLE thesis_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text,
  description text,
  buyer text,
  business_model text,
  founder_fit text,
  why_now text,
  watchout text,
  regulatory_level text CHECK (regulatory_level IN ('Low', 'Medium', 'High')),
  market_density text,
  primary_source_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Companies
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  canonical_name text NOT NULL,
  slug text NOT NULL,
  domain text,
  legal_name text,
  description text,
  headquarters text,
  founded_year integer,
  status text CHECK (status IN ('active', 'acquired', 'defunct', 'unknown')) DEFAULT 'active',
  primary_thesis_id uuid REFERENCES thesis_opportunities(id),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(workspace_id, slug)
);

-- Company aliases (alternate names)
CREATE TABLE company_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  alias text NOT NULL,
  alias_type text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Research runs (async job tracking)
CREATE TABLE research_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  thesis_opportunity_id uuid REFERENCES thesis_opportunities(id),
  status text CHECK (status IN ('queued', 'running', 'review_required', 'completed', 'failed', 'cancelled')) DEFAULT 'queued',
  progress integer DEFAULT 0,
  methodology_version text DEFAULT '1.0.0',
  idempotency_key text,
  requested_by uuid REFERENCES auth.users(id),
  started_at timestamptz,
  completed_at timestamptz,
  failure_reason text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(workspace_id, idempotency_key)
);

-- Provider runs (per-provider execution tracking)
CREATE TABLE provider_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id uuid NOT NULL REFERENCES research_runs(id) ON DELETE CASCADE,
  provider text NOT NULL,
  operation text,
  status text CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')) DEFAULT 'pending',
  attempt integer DEFAULT 1,
  request_fingerprint text,
  latency_ms integer,
  credits_used integer,
  error_code text,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Sources (canonical URLs with deduplication)
CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_url text NOT NULL UNIQUE,
  domain text,
  title text,
  publisher text,
  source_type text,
  source_tier integer CHECK (source_tier IN (1, 2, 3, 4)),
  published_at timestamptz,
  first_seen_at timestamptz DEFAULT now() NOT NULL,
  last_seen_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Source snapshots (immutable content per research run)
CREATE TABLE source_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  research_run_id uuid NOT NULL REFERENCES research_runs(id) ON DELETE CASCADE,
  content_hash text,
  extracted_text text,
  raw_payload_path text,
  retrieved_at timestamptz NOT NULL DEFAULT now(),
  extraction_provider text,
  immutable boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Claims (extracted facts with verification status)
CREATE TABLE claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id uuid NOT NULL REFERENCES research_runs(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  claim_type text,
  statement text NOT NULL,
  value_json jsonb,
  claim_status text CHECK (claim_status IN ('verified', 'supported', 'inferred', 'disputed', 'unknown')) DEFAULT 'unknown',
  confidence real,
  materiality text,
  effective_date date,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Claim sources (many-to-many: claims to source_snapshots)
CREATE TABLE claim_sources (
  claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  source_snapshot_id uuid NOT NULL REFERENCES source_snapshots(id) ON DELETE CASCADE,
  supporting_excerpt text,
  support_type text CHECK (support_type IN ('supports', 'contradicts', 'contextual')),
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (claim_id, source_snapshot_id)
);

-- Scorecards (versioned scores per research run)
CREATE TABLE scorecards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id uuid NOT NULL REFERENCES research_runs(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  rubric_version text DEFAULT '1.0.0',
  score_json jsonb,
  total_score real,
  machine_recommendation text,
  analyst_recommendation text,
  override_reason text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Analyst notes
CREATE TABLE analyst_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  research_run_id uuid REFERENCES research_runs(id) ON DELETE SET NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id),
  body text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Diligence questions
CREATE TABLE diligence_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id uuid NOT NULL REFERENCES research_runs(id) ON DELETE CASCADE,
  question text NOT NULL,
  category text,
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status text CHECK (status IN ('open', 'answered', 'resolved')) DEFAULT 'open',
  answer text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Audit events
CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_profiles_workspace ON profiles(workspace_id);
CREATE INDEX idx_companies_workspace ON companies(workspace_id);
CREATE INDEX idx_companies_slug ON companies(workspace_id, slug);
CREATE INDEX idx_research_runs_workspace ON research_runs(workspace_id);
CREATE INDEX idx_research_runs_company ON research_runs(company_id);
CREATE INDEX idx_research_runs_status ON research_runs(status);
CREATE INDEX idx_provider_runs_research ON provider_runs(research_run_id);
CREATE INDEX idx_sources_domain ON sources(domain);
CREATE INDEX idx_source_snapshots_research ON source_snapshots(research_run_id);
CREATE INDEX idx_claims_research ON claims(research_run_id);
CREATE INDEX idx_claims_company ON claims(company_id);
CREATE INDEX idx_claim_sources_claim ON claim_sources(claim_id);
CREATE INDEX idx_scorecards_research ON scorecards(research_run_id);
CREATE INDEX idx_analyst_notes_workspace ON analyst_notes(workspace_id);
CREATE INDEX idx_analyst_notes_company ON analyst_notes(company_id);
CREATE INDEX idx_diligence_research ON diligence_questions(research_run_id);
CREATE INDEX idx_audit_events_workspace ON audit_events(workspace_id);

-- RLS Policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE thesis_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyst_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE diligence_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Workspaces: only visible to workspace members
CREATE POLICY "Users can view their workspace"
  ON workspaces FOR SELECT
  USING (id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Profiles: only visible within workspace
CREATE POLICY "Users can view workspace profiles"
  ON profiles FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Thesis opportunities: public (seed data)
CREATE POLICY "Thesis opportunities are readable"
  ON thesis_opportunities FOR SELECT
  USING (true);

-- Companies: workspace-scoped
CREATE POLICY "Users can view workspace companies"
  ON companies FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create companies in workspace"
  ON companies FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Company aliases: inherit from company
CREATE POLICY "Users can view company aliases"
  ON company_aliases FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

-- Research runs: workspace-scoped
CREATE POLICY "Users can view workspace research runs"
  ON research_runs FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create research runs"
  ON research_runs FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update research runs"
  ON research_runs FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Provider runs: inherit from research run
CREATE POLICY "Users can view provider runs"
  ON provider_runs FOR SELECT
  USING (research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Service role can create provider runs (workspace-scoped)"
  ON provider_runs FOR INSERT
  WITH CHECK (research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

-- Sources: shared across all (deduplication)
CREATE POLICY "Sources are readable"
  ON sources FOR SELECT
  USING (true);

-- Source snapshots: scoped to research run access
CREATE POLICY "Users can view snapshots from accessible runs"
  ON source_snapshots FOR SELECT
  USING (research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

-- Claims: workspace-scoped
CREATE POLICY "Users can view claims from accessible runs"
  ON claims FOR SELECT
  USING (research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

-- Claim sources: inherit from claim
CREATE POLICY "Users can view claim sources"
  ON claim_sources FOR SELECT
  USING (claim_id IN (SELECT id FROM claims WHERE research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()))));

-- Scorecards: workspace-scoped
CREATE POLICY "Users can view scorecards"
  ON scorecards FOR SELECT
  USING (research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Users can update scorecards"
  ON scorecards FOR UPDATE
  USING (research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

-- Analyst notes: workspace-scoped
CREATE POLICY "Users can view workspace notes"
  ON analyst_notes FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create notes"
  ON analyst_notes FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()) AND author_id = auth.uid());

CREATE POLICY "Users can update own notes"
  ON analyst_notes FOR UPDATE
  USING (author_id = auth.uid());

-- Diligence questions: inherit from research run
CREATE POLICY "Users can view diligence questions"
  ON diligence_questions FOR SELECT
  USING (research_run_id IN (SELECT id FROM research_runs WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())));

-- Audit events: workspace-scoped
CREATE POLICY "Users can view workspace audit events"
  ON audit_events FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Service role can insert audit events (workspace-scoped)"
  ON audit_events FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
