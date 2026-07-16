import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Protects the founder-only /studio workspace (Phase B: Content Operating
 * System). This only checks that a Supabase session exists - membership in
 * the `founders` table is checked separately (and redundantly, by design)
 * in lib/auth/founder.ts, since that check needs a DB round trip that's
 * cheaper to do once per page load in a Server Component than on every
 * middleware invocation including static assets.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isStudioRoute = pathname.startsWith("/studio");
  const isLoginRoute = pathname.startsWith("/studio/login");

  if (isStudioRoute && !isLoginRoute && !user) {
    const loginUrl = new URL("/studio/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/studio/:path*"],
};
