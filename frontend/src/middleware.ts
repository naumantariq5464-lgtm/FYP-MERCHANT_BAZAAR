import { NextRequest, NextResponse } from "next/server";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "localhost:3000";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // ── Subdomain detection ─────────────────────────────────────────────────
  // In production: nauman.merchantbazaar.com → slug = "nauman"
  // In development: localhost:3000 → no subdomain (use query param for testing)
  const isSubdomain =
    hostname !== BASE_DOMAIN &&
    hostname.endsWith(`.${BASE_DOMAIN.split(":")[0]}`);

  if (isSubdomain) {
    const slug = hostname.split(".")[0];
    // Rewrite internally to /storefront/[slug]/...
    const url = request.nextUrl.clone();
    url.pathname = `/storefront/${slug}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Protected route guards ───────────────────────────────────────────────
  const token = request.cookies.get("mb_token")?.value;

  // Dashboard routes require seller auth
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Admin dashboard requires token
  if (pathname.startsWith("/admin/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect logged-in users away from login/signup pages
  if (token && (pathname === "/login" || pathname === "/signup")) {
    // If token has role info, redirect accordingly
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
      if (payloadJson.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } catch {
      // Fallback
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
