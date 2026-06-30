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
    .select("id")
    .eq("id", userId)
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
    .insert({ user_id: userId, phone });

  if (studentError) {
    return NextResponse.json({ error: studentError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
