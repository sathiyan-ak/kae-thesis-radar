import { runResearch } from "@/trigger/research";

export async function enqueueResearch(
  runId: string,
  companyId: string,
  workspaceId: string,
  idempotencyKey?: string
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
    // Idempotency options: Trigger.dev deduplicates repeated calls with same key within TTL
    // Key format: workspace:company:thesis:methodology ensures uniqueness per research config
    const triggerIdempotencyKey = idempotencyKey || runId;

    const handle = await runResearch.trigger(
      {
        runId,
        companyId,
        workspaceId,
      },
      {
        idempotencyKey: triggerIdempotencyKey,
        idempotencyKeyTTL: "10m",
      }
    );

    console.log("[research] Task enqueued successfully", {
      runId,
      taskHandle: handle.id,
      idempotencyKey: triggerIdempotencyKey,
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
