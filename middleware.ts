import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: Phase 2 - Implement Supabase auth check
  // For now, allow all requests to pass through
  // In production, this will:
  // 1. Check for valid session token
  // 2. Redirect unauthenticated users to /login
  // 3. Redirect authenticated users away from /login

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
