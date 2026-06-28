import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

const SUBDOMAINS = {
  admin: "admin",
  staff: "staff",
} as const;

function getSubdomain(hostname: string): string | null {
  for (const sub of Object.values(SUBDOMAINS)) {
    if (hostname.startsWith(`${sub}.`)) return sub;
  }
  return null;
}

function rewrite404(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/404";
  return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase env vars not configured - skipping auth middleware");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const hostname = request.nextUrl.hostname;
  const subdomain = getSubdomain(hostname);

  // Allow API routes through
  if (pathname.startsWith("/api")) {
    return NextResponse.next({ request });
  }

  // Subdomain-based isolation (when user has a custom domain)
  if (subdomain === "staff") {
    if (pathname.startsWith("/admin") || pathname.startsWith("/student") || pathname === "/auth/admin-login" || pathname === "/auth/register") {
      return rewrite404(request);
    }
  }

  if (subdomain === "admin") {
    if (pathname.startsWith("/instructor") || pathname.startsWith("/student") || pathname === "/auth/register") {
      return rewrite404(request);
    }
  }

  // Protected routes
  const isProtectedRoute =
    pathname.startsWith("/student") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin");

  const isAuthRoute = pathname.startsWith("/auth") && !pathname.startsWith("/auth/admin-login");
  const isAdminAuthRoute = pathname.startsWith("/auth/admin-login");

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    if (pathname.startsWith("/admin")) {
      url.pathname = "/auth/admin-login";
    } else if (subdomain === "staff") {
      url.pathname = "/auth/login";
    } else {
      url.pathname = "/auth/login";
    }
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    const { data: roleData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = roleData?.role;
    if (role) {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  if (isAdminAuthRoute && user) {
    const { data: roleData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = roleData?.role;
    if (role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/${role || "student"}/dashboard`;
    return NextResponse.redirect(url);
  }

  if (user && isProtectedRoute) {
    const { data: roleData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = roleData?.role;

    if (pathname.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}/dashboard`;
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/instructor") && role !== "instructor") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}/dashboard`;
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/student") && role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
