import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicDemoRoute =
    pathname === "/" || pathname === "/app" || pathname.startsWith("/app/");

  if (publicDemoRoute) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getSession();
  const demoUser = request.cookies.get("demo_user")?.value;

  // Check if authenticated: Supabase session OR demo_user cookie
  const isAuthenticated = !!data.session || !!demoUser;

  const requiresAuth = false;

  // The /app routes are a public, seeded work-sample demo. Auth endpoints remain
  // available, but the demo surface must not fall back to a login placeholder.
  if (!isAuthenticated && requiresAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
