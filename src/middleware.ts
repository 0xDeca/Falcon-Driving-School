import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes by role
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  instructor: ["/instructor"],
  student: ["/student"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/instructors") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/blog")
  ) {
    return NextResponse.next();
  }

  // Check for access token
  const accessToken = request.cookies.get("accessToken")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Determine required role from path
  for (const [role, prefixes] of Object.entries(ROLE_ROUTES)) {
    if (prefixes.some((p) => pathname.startsWith(p))) {
      // Verify token with API (lightweight check)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/auth/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          const loginUrl = new URL("/auth/login", request.url);
          loginUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginUrl);
        }

        const data = await res.json();
        const userRole = data.data?.role || data?.role;

        if (userRole !== role) {
          // Redirect to appropriate dashboard
          const dashboardMap: Record<string, string> = {
            admin: "/admin/dashboard",
            instructor: "/instructor/dashboard",
            student: "/student/dashboard",
          };
          return NextResponse.redirect(new URL(dashboardMap[userRole] || "/", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
