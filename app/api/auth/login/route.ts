import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Log login to audit trail
  await supabase
    .from("audit_events")
    .insert({
      event_type: "user_login",
      user_email: email,
      metadata: {
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
        timestamp: new Date().toISOString(),
      },
    });

  // Create session cookie
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("demo_user", email, {
    httpOnly: true,
    maxAge: 86400 * 7, // 7 days
    path: "/",
  });

  return response;
}
