import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth middleware — protects routes that require authentication.
 *
 * Currently, the directory, events, and jobs pages are publicly readable.
 * Protected routes (profile editing, RSVP, mentorship requests) will
 * require a valid Supabase session once auth is fully wired up.
 */
export function proxy(_request: NextRequest) {
  // DEMO MODE: all routes are public — no auth wall
  // When Supabase auth is wired up, restore the protected route logic below
  return NextResponse.next();

  /*
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/", "/directory", "/events", "/jobs",
    "/auth", "/auth/callback",
    "/api/alumni", "/api/events", "/api/jobs",
  ];

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) return NextResponse.next();

  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  if (!hasAuthCookie) {
    const signInUrl = new URL("/auth", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
