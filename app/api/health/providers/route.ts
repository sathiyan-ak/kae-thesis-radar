import { registry } from "@/lib/providers/registry";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const health = await registry.getHealth();

    return NextResponse.json({
      providers: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
