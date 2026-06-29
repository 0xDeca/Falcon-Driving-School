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

  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return NextResponse.next({ request });
  }

  const originalPath = request.nextUrl.pathname;
  const hostname = request.nextUrl.hostname;
  const subdomain = getSubdomain(hostname);

  // Allow API routes through
  if (originalPath.startsWith("/api")) {
    return NextResponse.next({ request });
  }

  // Determine effective pathname after subdomain rewriting
  let effectivePath = originalPath;
  let needsRewrite = false;

  if (subdomain === "admin" && !originalPath.startsWith("/admin")) {
    effectivePath = `/admin${originalPath}`;
    needsRewrite = true;
  } else if (subdomain === "staff" && !originalPath.startsWith("/instructor")) {
    effectivePath = `/instructor${originalPath}`;
    needsRewrite = true;
  }

  // Subdomain-based isolation
  if (subdomain === "staff") {
    if (originalPath.startsWith("/admin") || originalPath.startsWith("/student") || originalPath === "/auth/admin-login" || originalPath === "/auth/register") {
      return rewrite404(request);
    }
  }

  if (subdomain === "admin") {
    if (originalPath.startsWith("/instructor") || originalPath.startsWith("/student") || originalPath === "/auth/register") {
      return rewrite404(request);
    }
  }

  // Protected routes check
  const isProtectedRoute =
    effectivePath.startsWith("/student") ||
    effectivePath.startsWith("/instructor") ||
    effectivePath.startsWith("/admin");

  const isAuthRoute = effectivePath.startsWith("/auth") && !effectivePath.startsWith("/auth/admin-login");
  const isAdminAuthRoute = effectivePath.startsWith("/auth/admin-login");

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    if (effectivePath.startsWith("/admin")) {
      url.pathname = "/auth/admin-login";
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
      .select("role, suspended")
      .eq("id", user.id)
      .single();

    if (roleData?.suspended) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    const role = roleData?.role;

    if (effectivePath.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}/dashboard`;
      return NextResponse.redirect(url);
    }

    if (effectivePath.startsWith("/instructor") && role !== "instructor") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}/dashboard`;
      return NextResponse.redirect(url);
    }

    if (effectivePath.startsWith("/student") && role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // Apply subdomain rewrite if needed (after all auth checks pass)
  if (needsRewrite) {
    const url = request.nextUrl.clone();
    if (subdomain === "admin") {
      url.pathname = `/admin${originalPath}`;
    } else if (subdomain === "staff") {
      url.pathname = `/instructor${originalPath}`;
    }
    return NextResponse.rewrite(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
