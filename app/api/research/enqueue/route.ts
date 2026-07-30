import { createClient } from "@/lib/supabase/server";
import { createResearchRun } from "@/lib/research/orchestrator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { companyId, thesisOpportunityId } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID required" },
        { status: 400 }
      );
    }

    // CHECK TRIGGER.dev AVAILABILITY FIRST, BEFORE CREATING RUNS
    // This prevents orphaned queued records when Trigger.dev is unavailable
    if (!process.env.TRIGGER_SECRET_KEY) {
      return NextResponse.json(
        { error: "Research provider unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Create or fetch idempotent research run
    // Returns existing run if already queued/running, or creates new one
    const run = await createResearchRun(
      profile.workspace_id,
      companyId,
      thesisOpportunityId || null,
      user.id
    );

    // Enqueue Trigger.dev task
    try {
      const { enqueueResearch } = await import("@/lib/trigger/research");
      const result = await enqueueResearch(
        run.id,
        companyId,
        profile.workspace_id,
        run.idempotency_key
      );

      if (!result.success) {
        // Trigger.dev unavailable after DB insertion
        // Mark run as failed to avoid orphaned queued records
        const { updateResearchRunStatus } = await import(
          "@/lib/research/orchestrator"
        );
        await updateResearchRunStatus(
          run.id,
          "failed",
          "enqueue_failed: Trigger.dev not configured"
        );

        return NextResponse.json(
          { error: "Research execution unavailable" },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          runId: run.id,
          status: run.status,
          taskHandle: result.taskHandle,
          note: "Research task enqueued. Use /api/research/[runId]/progress to poll for updates.",
        },
        { status: 202 }
      );
    } catch (error) {
      // Trigger.dev network/auth failure after DB insertion
      // Mark run as failed to avoid orphaned queued records
      const { updateResearchRunStatus } = await import(
        "@/lib/research/orchestrator"
      );
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      await updateResearchRunStatus(
        run.id,
        "failed",
        `enqueue_failed: ${errorMsg}`
      );

      console.error("[research] Failed to enqueue task:", error);
      return NextResponse.json(
        { error: "Research execution failed. Please try again later." },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("[research/enqueue]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
