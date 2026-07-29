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

    // Enqueue Trigger.dev task - required for research execution
    try {
      const { enqueueResearch } = await import("@/lib/trigger/research");
      const result = await enqueueResearch(
        run.id,
        companyId,
        profile.workspace_id
      );

      if (!result.success) {
        return NextResponse.json(
          {
            error: "Research execution is not configured",
            reason: result.reason,
          },
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
