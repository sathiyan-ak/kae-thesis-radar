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
        profile.workspace_id
      );

      if (!result.success) {
        // This should be rare since we checked TRIGGER_SECRET_KEY above
        // but handle gracefully without deleting the run
        return NextResponse.json(
          {
            error: "Research execution failed",
            reason: result.reason,
          },
          { status: 500 }
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
      console.error("[research] Failed to enqueue task:", error);
      return NextResponse.json(
        { error: "Failed to enqueue research task" },
        { status: 500 }
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
