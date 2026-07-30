import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // DEPRECATED ENDPOINT
  // Synchronous research is no longer supported.
  // Migrate to POST /api/research/enqueue for durable async execution via Trigger.dev.
  // See: https://github.com/yourusername/kae-thesis-radar/blob/main/docs/api.md#research-enqueue
  return NextResponse.json(
    {
      error: "Endpoint deprecated",
      message:
        "Synchronous research at POST /api/research is no longer supported. Use POST /api/research/enqueue instead.",
      migration_guide:
        "POST /api/research/enqueue accepts {companyId, thesisOpportunityId} and returns 202 Accepted with {runId, taskHandle}.",
    },
    { status: 410 }
  );
}
