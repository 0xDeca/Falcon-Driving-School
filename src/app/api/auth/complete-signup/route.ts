import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { phone, userId } = body;

  if (!phone?.trim() || !userId) {
    return NextResponse.json({ error: "Phone and userId are required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existingUser } = await serviceClient
    .from("users")
    .select("id, email, name, role")
    .eq("id", userId)
    .maybeSingle();

  if (!existingUser) {
    const { data: authUser } = await serviceClient.auth.admin.getUserById(userId);
    if (!authUser?.user) {
      return NextResponse.json({ error: "Auth user not found" }, { status: 500 });
    }
    const { error: insertError } = await serviceClient
      .from("users")
      .insert({
        id: userId,
        email: authUser.user.email,
        name: authUser.user.user_metadata?.full_name || null,
        role: "student",
      });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
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
    .insert({ user_id: userId, phone });

  if (studentError) {
    return NextResponse.json({ error: studentError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
