import { createClient } from "@/lib/supabase/server";
import { getResearchRun } from "@/lib/research/orchestrator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user can access this run
    const { data: run } = await supabase
      .from("research_runs")
      .select("workspace_id, status, progress")
      .eq("id", runId)
      .single();

    if (!run) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check workspace access
    const { data: profile } = await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", user.id)
      .single();

    if (profile?.workspace_id !== run.workspace_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get detailed run info
    const runData = await getResearchRun(runId);

    return NextResponse.json(runData);
  } catch (error) {
    console.error("[research/progress]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
