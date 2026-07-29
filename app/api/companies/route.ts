import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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

  const { data: companies, error } = await supabase
    .from("companies")
    .select("id, canonical_name, domain, status")
    .eq("workspace_id", profile.workspace_id)
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ companies });
}

export async function POST(request: NextRequest) {
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

  const body = await request.json();

  if (!body?.canonical_name || !body?.domain) {
    return NextResponse.json(
      { error: "canonical_name and domain required" },
      { status: 400 }
    );
  }

  const slug = body.canonical_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const { data: company, error } = await supabase
    .from("companies")
    .insert({
      workspace_id: profile.workspace_id,
      canonical_name: body.canonical_name,
      slug,
      domain: body.domain,
      legal_name: body.legal_name || null,
      description: body.description || null,
      headquarters: body.headquarters || null,
      founded_year: body.founded_year || null,
      status: body.status || "active",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ company }, { status: 201 });
}
