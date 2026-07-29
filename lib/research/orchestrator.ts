import { createClient } from "@/lib/supabase/server";

export type ResearchRunStatus =
  | "queued"
  | "running"
  | "review_required"
  | "completed"
  | "failed"
  | "cancelled";

export async function createResearchRun(
  workspaceId: string,
  companyId: string,
  thesisOpportunityId: string | null,
  userId: string
) {
  const supabase = await createClient();
  const idempotencyKey = `${workspaceId}-${companyId}-${thesisOpportunityId}-${Date.now()}`;

  const { data, error } = await supabase
    .from("research_runs")
    .insert({
      workspace_id: workspaceId,
      company_id: companyId,
      thesis_opportunity_id: thesisOpportunityId,
      status: "queued",
      idempotency_key: idempotencyKey,
      requested_by: userId,
    })
    .select()
    .single();

  if (error) throw error;

  // In production, this would enqueue a Trigger.dev task
  // For now, return run ID and caller must implement async execution
  return data;
}

export async function updateResearchRunStatus(
  runId: string,
  status: ResearchRunStatus,
  failureReason?: string
) {
  const supabase = await createClient();

  const update: Record<string, unknown> = {
    status,
    ...(status === "running" && { started_at: new Date().toISOString() }),
    ...(status === "completed" && {
      completed_at: new Date().toISOString(),
    }),
    ...(status === "failed" && {
      completed_at: new Date().toISOString(),
      failure_reason: failureReason,
    }),
  };

  const { error } = await supabase
    .from("research_runs")
    .update(update)
    .eq("id", runId);

  if (error) throw error;
}

export async function getResearchRun(runId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("research_runs")
    .select(
      `
      id, status, progress, created_at, started_at, completed_at,
      companies(canonical_name),
      thesis_opportunities(title),
      provider_runs(provider, status, completed_at, latency_ms)
    `
    )
    .eq("id", runId)
    .single();

  if (error) throw error;

  return data;
}

export async function recordProviderRun(
  researchRunId: string,
  provider: string,
  operation: string,
  status: "pending" | "running" | "completed" | "failed" | "skipped",
  metadata?: {
    latency_ms?: number;
    error_code?: string;
    error_message?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from("provider_runs").insert({
    research_run_id: researchRunId,
    provider,
    operation,
    status,
    ...(metadata?.latency_ms && { latency_ms: metadata.latency_ms }),
    ...(metadata?.error_code && { error_code: metadata.error_code }),
    ...(metadata?.error_message && {
      error_message: metadata.error_message,
    }),
    ...(status === "running" && { started_at: new Date().toISOString() }),
    ...(["completed", "failed", "skipped"].includes(status) && {
      completed_at: new Date().toISOString(),
    }),
  });

  if (error) throw error;
}
