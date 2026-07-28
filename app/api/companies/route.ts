import { NextResponse } from "next/server";
import { companies } from "@/lib/companies";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ mode: "local", companies });

  const { data, error } = await supabase.from("screened_companies").select("*").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ mode: "supabase", companies: data });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const body = await request.json();
  if (!body?.name || !body?.thesis_id || typeof body?.total_score !== "number") {
    return NextResponse.json({ error: "name, thesis_id and total_score are required." }, { status: 400 });
  }

  const { data, error } = await supabase.from("screened_companies").upsert({
    name: body.name,
    website: body.website ?? null,
    thesis_id: body.thesis_id,
    recommendation: body.recommendation ?? "Monitor",
    total_score: body.total_score,
    score_breakdown: body.score_breakdown ?? {},
    evidence: body.evidence ?? [],
    risks: body.risks ?? [],
    diligence_questions: body.diligence_questions ?? [],
    analyst_notes: body.analyst_notes ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "name,thesis_id" }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ company: data }, { status: 201 });
}
