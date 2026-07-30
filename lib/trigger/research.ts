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
    // Call the task with idempotency options
    // Trigger.dev returns existing handle when same key is reused within TTL
    const handle = await runResearch.trigger(
      {
        runId,
        companyId,
        workspaceId,
      },
      {
        idempotencyKey: idempotencyKey || runId,
        idempotencyKeyTTL: "10m",
      }
    );

    console.log("[research] Task enqueued successfully", {
      runId,
      taskHandle: handle.id,
      idempotencyKey,
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
