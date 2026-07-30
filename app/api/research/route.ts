import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { companies } from "@/lib/companies";
import { thesisById } from "@/lib/thesis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // DEPRECATED: This endpoint performs synchronous research.
  // Use /api/research/enqueue for durable async execution instead.
  // Kept only for backward compatibility with demo seed data.

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    const thesisId = typeof body.thesisId === "string" ? body.thesisId : "";
    const opportunity = thesisById[thesisId];

    if (!companyName || !opportunity) {
      return NextResponse.json({ error: "Company name and a valid Kae opportunity are required." }, { status: 400 });
    }

    // SSRF validation: reject localhost, private IPs, metadata endpoints
    if (website) {
      const url = new URL(website.startsWith("http") ? website : `https://${website}`);
      const hostname = url.hostname.toLowerCase();
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname.match(/^::ffff:127\.\d+\.\d+\.\d+$/) ||
        hostname.match(/^169\.254\./) ||
        hostname.match(/^10\./) ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./) ||
        hostname.match(/^192\.168\./) ||
        hostname.includes("metadata") ||
        hostname.includes("169.254.169.254")
      ) {
        return NextResponse.json({ error: "Invalid URL: private or restricted IP range" }, { status: 400 });
      }
    }

    // Demo mode: only support seeded companies without Tavily
    const seed = companies.find((item) => item.name.toLowerCase() === companyName.toLowerCase() || item.slug === companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    if (!seed) {
      // New company requested but no Tavily API key - cannot execute
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "Live research requires TAVILY_API_KEY. Use /api/research/enqueue for async execution." }, { status: 503 });
      }
      // If we reach here, Tavily would execute. But we no longer do synchronous calls.
      return NextResponse.json({ error: "Synchronous research is deprecated. Use POST /api/research/enqueue instead." }, { status: 410 });
    }

    // Return seeded demo company only
    return NextResponse.json({
      mode: "seed",
      companyName: seed.name,
      website: seed.website,
      thesisId,
      generatedAt: new Date().toISOString(),
      summary: `${seed.oneLiner} This is a local demonstration screen using the retained seed evidence; use POST /api/research/enqueue for live research.`,
      recommendation: seed.recommendation,
      totalScore: seed.totalScore,
      scores: seed.scores,
      signals: seed.evidence,
      risks: seed.risks,
      diligenceQuestions: seed.diligenceQuestions,
      evidence: seed.sourceUrls.map((url, index) => ({ title: index === 0 ? `${seed.name} primary source` : "Kae public opportunity source", url, content: seed.evidence[index] ?? seed.oneLiner })),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected research error" }, { status: 500 });
  }
}
