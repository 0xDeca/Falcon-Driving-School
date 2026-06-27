import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

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
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected routes
  const isProtectedRoute =
    pathname.startsWith("/student") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin");

  // Auth routes (login, register, etc.)
  const isAuthRoute = pathname.startsWith("/auth") && !pathname.startsWith("/auth/admin-login");
  const isAdminAuthRoute = pathname.startsWith("/auth/admin-login");

  // Public routes
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/instructors") ||
    pathname.startsWith("/gallery") ||
    pathname.startsWith("/reviews") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images");

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.startsWith("/admin") ? "/auth/admin-login" : "/auth/login";
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

  // Admin login: only admins can view, others get redirected
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
    // Non-admin users on admin login → redirect to their own dashboard
    const url = request.nextUrl.clone();
    url.pathname = `/${role || "student"}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Role-based access
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
