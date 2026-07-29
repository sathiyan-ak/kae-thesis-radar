import { runResearch } from "@/trigger/research";

export async function enqueueResearch(
  runId: string,
  companyId: string,
  workspaceId: string
) {
  // If Trigger.dev is not configured, return unavailable
  if (!process.env.TRIGGER_SECRET_KEY) {
    return {
      success: false,
      reason: "TRIGGER_SECRET_KEY not configured",
      runStays: "queued",
    };
  }

  try {
    // Call the task directly - Trigger.dev SDK handles execution
    const handle = await runResearch.trigger({
      runId,
      companyId,
      workspaceId,
    });

    console.log("[research] Task enqueued successfully", {
      runId,
      taskHandle: handle.id,
    });

    return {
      success: true,
      taskHandle: handle.id,
    };
  } catch (error) {
    console.error("[research] Failed to enqueue:", error);
    throw error;
  }
}
