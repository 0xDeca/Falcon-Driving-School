import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.json();
  const { phone } = body;

  if (!phone?.trim()) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey!, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existingUser } = await serviceClient
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingUser) {
    return NextResponse.json({ error: "User record not found" }, { status: 500 });
  }

  const { data: dupPhone } = await serviceClient
    .from("students")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (dupPhone) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  const { error: studentError } = await serviceClient
    .from("students")
    .insert({
      user_id: user.id,
      phone,
    });

  if (studentError) {
    return NextResponse.json({ error: studentError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
