-- Harden system-owned tables: provider_runs, audit_events
-- Drop authenticated INSERT policies and revoke privileges
-- Ensures only service-role can write these tables

-- Drop unsafe authenticated INSERT policies (added in 001)
DROP POLICY IF EXISTS "Service role can create provider runs (workspace-scoped)" ON provider_runs;
DROP POLICY IF EXISTS "Service role can insert audit events (workspace-scoped)" ON audit_events;

-- Revoke write privileges from public (anon) and authenticated roles
REVOKE INSERT, UPDATE, DELETE ON TABLE provider_runs FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE audit_events FROM anon, authenticated;

-- Ensure service role can still write (it bypasses RLS anyway)
GRANT INSERT ON TABLE provider_runs TO service_role;
GRANT INSERT ON TABLE audit_events TO service_role;

-- Add partial unique index to prevent duplicate queued/running jobs
-- (if not already added in 001)
CREATE UNIQUE INDEX IF NOT EXISTS idx_research_runs_idempotency_active
  ON research_runs(workspace_id, idempotency_key)
  WHERE status IN ('queued', 'running');
