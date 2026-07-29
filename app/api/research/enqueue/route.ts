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

    // Create research run
    const run = await createResearchRun(
      profile.workspace_id,
      companyId,
      thesisOpportunityId || null,
      user.id
    );

    // Attempt to enqueue Trigger.dev task
    // If TRIGGER_API_KEY not configured, task will not execute
    // Research run will remain in "queued" state
    try {
      const { enqueueResearch } = await import("@/lib/trigger/research");
      const enqueuedSuccessfully = await enqueueResearch(
        run.id,
        companyId,
        profile.workspace_id
      );

      if (!enqueuedSuccessfully) {
        console.warn(
          `[research] Run ${run.id} created but not enqueued - TRIGGER_API_KEY not configured`
        );
      }
    } catch (error) {
      console.error("[research] Failed to enqueue task:", error);
      // Continue anyway - research run is created, task execution optional
    }

    return NextResponse.json(
      {
        runId: run.id,
        status: run.status,
        note: "Research task enqueued. Use /api/research/[runId]/progress to poll for updates."
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("[research/enqueue]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
