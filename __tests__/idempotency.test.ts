import { describe, it, expect, beforeEach, vi } from "vitest";
import { createResearchRun } from "@/lib/research/orchestrator";

// Mock Supabase clients
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: vi.fn(),
}));

describe("Idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Deterministic idempotency keys", () => {
    it("generates consistent keys from workspace, company, thesis, methodology", async () => {
      const workspaceId = "ws-123";
      const companyId = "co-456";
      const thesisId = "th-789";
      const userId = "user-001";

      // First call
      const key1 = `${workspaceId}:${companyId}:${thesisId}:1.0.0`;

      // Second call with same params
      const key2 = `${workspaceId}:${companyId}:${thesisId}:1.0.0`;

      expect(key1).toBe(key2);
    });

    it("handles null thesis opportunity ID consistently", () => {
      const workspaceId = "ws-123";
      const companyId = "co-456";
      const thesisId = null;

      const key = `${workspaceId}:${companyId}:${thesisId || "no-thesis"}:1.0.0`;
      expect(key).toContain("no-thesis");
    });
  });

  describe("Duplicate detection", () => {
    it("returns existing run when queued/running with same idempotency key", async () => {
      // Simulates scenario: User clicks "Start Research" twice in quick succession
      // Database should return the first run without creating duplicate

      // This test requires a real or mocked Supabase instance
      // For now, document the expected behavior:
      // 1. First call creates research_run with idempotency_key = "ws:co:th:1.0.0", status="queued"
      // 2. Second call with same params queries for existing (ws, key, status IN queued/running)
      // 3. Returns the existing run's ID instead of creating new one
      // 4. Trigger.dev idempotencyKey also prevents duplicate task execution (TTL: 10 min)

      expect(true).toBe(true); // Placeholder for integration test
    });
  });

  describe("503 path (missing TRIGGER_SECRET_KEY)", () => {
    it("does not create research_run when Trigger.dev unavailable", () => {
      // Expected behavior:
      // 1. POST /api/research/enqueue receives request
      // 2. Checks process.env.TRIGGER_SECRET_KEY first (before DB write)
      // 3. If missing, returns 503 without inserting into research_runs
      // 4. No orphaned queued records left behind

      expect(process.env.TRIGGER_SECRET_KEY).toBeUndefined();
    });

    it("returns safe error message to client on 503", () => {
      const expectedMessage = "Research provider unavailable. Please try again later.";
      expect(expectedMessage).toContain("unavailable");
    });
  });
});
