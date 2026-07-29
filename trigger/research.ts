import { task, logger } from "@trigger.dev/sdk";
import { createClient } from "@/lib/supabase/server";
import { updateResearchRunStatus, recordProviderRun } from "@/lib/research/orchestrator";
import { RESEARCH_STAGES } from "@/lib/research/stages";

export const runResearch = task({
  id: "run-research",
  run: async (payload: { runId: string; companyId: string; workspaceId: string }) => {
    logger.info("Research task started", { runId: payload.runId });

    const supabase = await createClient();

    try {
      // Mark run as started
      await updateResearchRunStatus(payload.runId, "running");

      // Execute research stages
      for (const stage of RESEARCH_STAGES) {
        try {
          logger.info("Stage starting", { stage: stage.name });

          await recordProviderRun(
            payload.runId,
            stage.name,
            `stage_${stage.id}`,
            "running"
          );

          // Call real provider
          // For now, simulate with realistic latency
          const latency = Math.random() * 3000 + 1000; // 1-4s per stage
          await new Promise((resolve) => setTimeout(resolve, latency));

          await recordProviderRun(
            payload.runId,
            stage.name,
            `stage_${stage.id}`,
            "completed",
            { latency_ms: Math.round(latency) }
          );

          logger.info("Stage completed", { stage: stage.name });
        } catch (error) {
          logger.error("Stage failed", {
            stage: stage.name,
            error: error instanceof Error ? error.message : "Unknown error",
          });

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
          throw error;
        }

        // Update progress
        const progress = Math.round(
          ((RESEARCH_STAGES.indexOf(stage) + 1) / RESEARCH_STAGES.length) * 100
        );
        await supabase
          .from("research_runs")
          .update({ progress })
          .eq("id", payload.runId);
      }

      // Mark run as complete (pending review)
      await updateResearchRunStatus(payload.runId, "review_required");

      logger.info("Research task completed successfully", { runId: payload.runId });
      return { success: true, runId: payload.runId };
    } catch (error) {
      logger.error("Research task failed", {
        runId: payload.runId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      await updateResearchRunStatus(
        payload.runId,
        "failed",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  },
});
