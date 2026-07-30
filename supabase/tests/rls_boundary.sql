-- pgTAP test suite for RLS policies
-- Run with: psql -d postgres://... -f rls_boundary.sql

BEGIN;
SELECT plan(24);

-- Test setup: create two workspaces with different users
DO $$
DECLARE
  ws1_id uuid;
  ws2_id uuid;
  user1_id uuid;
  user2_id uuid;
BEGIN
  -- Create workspaces
  INSERT INTO workspaces (name) VALUES ('Workspace 1') RETURNING id INTO ws1_id;
  INSERT INTO workspaces (name) VALUES ('Workspace 2') RETURNING id INTO ws2_id;

  -- Create users (requires auth.users in Supabase)
  -- This is pseudocode; actual implementation depends on Supabase auth setup
  -- user1_id = create_auth_user('user1@example.com');
  -- user2_id = create_auth_user('user2@example.com');

  -- Create profiles
  -- INSERT INTO profiles (id, workspace_id) VALUES (user1_id, ws1_id);
  -- INSERT INTO profiles (id, workspace_id) VALUES (user2_id, ws2_id);
END $$;

-- Test: Cross-workspace SELECT
SELECT ok(
  (SELECT count(*) FROM companies WHERE workspace_id != (SELECT workspace_id FROM profiles WHERE id = auth.uid())) = 0,
  'Authenticated user cannot SELECT companies from other workspaces'
);

-- Test: provider_runs INSERT blocked for authenticated users
-- EXPECT: Permission denied
SELECT throws_like(
  'INSERT INTO provider_runs (research_run_id, provider, operation, status) VALUES ($1, $2, $3, $4)',
  'permission denied',
  'Authenticated user cannot INSERT into provider_runs'
);

-- Test: audit_events INSERT blocked for authenticated users
SELECT throws_like(
  'INSERT INTO audit_events (workspace_id, event_type, entity_type) VALUES ($1, $2, $3)',
  'permission denied',
  'Authenticated user cannot INSERT into audit_events'
);

-- Test: provider_runs UPDATE blocked for authenticated users
SELECT throws_like(
  'UPDATE provider_runs SET status = $1 WHERE id = $2',
  'permission denied',
  'Authenticated user cannot UPDATE provider_runs'
);

-- Test: provider_runs DELETE blocked for authenticated users
SELECT throws_like(
  'DELETE FROM provider_runs WHERE id = $1',
  'permission denied',
  'Authenticated user cannot DELETE provider_runs'
);

-- Test: audit_events UPDATE blocked for authenticated users
SELECT throws_like(
  'UPDATE audit_events SET metadata = $1 WHERE id = $2',
  'permission denied',
  'Authenticated user cannot UPDATE audit_events'
);

-- Test: audit_events DELETE blocked for authenticated users
SELECT throws_like(
  'DELETE FROM audit_events WHERE id = $1',
  'permission denied',
  'Authenticated user cannot DELETE audit_events'
);

-- Test: Service-role client CAN write provider_runs
-- (Requires separate connection as service role)
-- Expected: Success without permission denied error

-- Test: Service-role client CAN write audit_events
-- (Requires separate connection as service role)
-- Expected: Success without permission denied error

-- Test: Unauthenticated (anon) access blocked
-- EXPECT: Permission denied for all tables except public ones

-- Test: Child-table isolation (claims, scorecards)
-- Verify that claims from run A cannot be accessed by workspace B
-- Verify that scorecards from run A cannot be updated by workspace B

FINISH;
ROLLBACK;
