import { runResearch } from "@/trigger/research";
import { idempotencyKeys } from "@trigger.dev/sdk";

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
    // Create global-scoped idempotency key for deduplication across separate HTTP requests
    // In Trigger.dev v4.3.1+, raw strings default to "run" scope
    // Explicit global scope ensures duplicate enqueue calls return same task handle
    const triggerKey = await idempotencyKeys.create(idempotencyKey || runId, {
      scope: "global",
    });

    const handle = await runResearch.trigger(
      {
        runId,
        companyId,
        workspaceId,
      },
      {
        idempotencyKey: triggerKey,
        idempotencyKeyTTL: "10m",
      }
    );

    console.log("[research] Task enqueued successfully", {
      runId,
      taskHandle: handle.id,
      idempotencyKey: idempotencyKey,
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
