import { task } from "@trigger.dev/sdk/v3";
import { createClient } from "@/lib/supabase/server";
import { updateResearchRunStatus, recordProviderRun } from "@/lib/research/orchestrator";
import { RESEARCH_STAGES } from "@/lib/research/stages";

export const runResearch = task({
  id: "run-research",
  run: async (payload: { runId: string; companyId: string; workspaceId: string }) => {
    const supabase = await createClient();

    try {
      // Mark run as started
      await updateResearchRunStatus(payload.runId, "running");

      // Execute research stages
      for (const stage of RESEARCH_STAGES) {
        try {
          await recordProviderRun(
            payload.runId,
            stage.name,
            `stage_${stage.id}`,
            "running"
          );

          // Simulate stage execution
          // In production, each stage would call real providers
          await new Promise((resolve) => setTimeout(resolve, 100));

          await recordProviderRun(
            payload.runId,
            stage.name,
            `stage_${stage.id}`,
            "completed",
            { latency_ms: 100 }
          );
        } catch (error) {
          await recordProviderRun(
            payload.runId,
            stage.name,
            `stage_${stage.id}`,
            "failed",
            {
              error_message: error instanceof Error ? error.message : "Unknown error",
              error_code: "STAGE_FAILED",
            }
          );
        }

        // Update progress
        const progress = Math.round((RESEARCH_STAGES.indexOf(stage) / RESEARCH_STAGES.length) * 100);
        await supabase
          .from("research_runs")
          .update({ progress })
          .eq("id", payload.runId);
      }

      // Mark run as complete (pending review)
      await updateResearchRunStatus(payload.runId, "review_required");

      return { success: true, runId: payload.runId };
    } catch (error) {
      await updateResearchRunStatus(
        payload.runId,
        "failed",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  },
});

export async function enqueueResearch(
  runId: string,
  companyId: string,
  workspaceId: string
) {
  // If Trigger.dev is not configured, log warning and return false
  if (!process.env.TRIGGER_API_KEY) {
    console.warn("[research] TRIGGER_API_KEY not configured - research will not execute");
    return false;
  }

  try {
    await runResearch.trigger({ runId, companyId, workspaceId });
    return true;
  } catch (error) {
    console.error("[research] Failed to enqueue:", error);
    throw error;
  }
}
