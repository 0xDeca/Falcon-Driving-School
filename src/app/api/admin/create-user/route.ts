import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, password, role, name, phone, certification, years_experience, bio } = await request.json();
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name, phone, role },
    });
    if (authError) throw authError;
    if (!authUser?.user) throw new Error("Failed to create user");

    const userId = authUser.user.id;

    const { error: userError } = await adminClient.from("users").insert({ id: userId, email, role });
    if (userError) throw userError;

    if (role === "student") {
      const { error: studentError } = await adminClient.from("students").insert({ user_id: userId, phone });
      if (studentError) throw studentError;
    } else if (role === "instructor") {
      const { error: instructorError } = await adminClient.from("instructors").insert({
        user_id: userId, certification: certification || null, years_experience: years_experience || 0, bio: bio || null,
      });
      if (instructorError) throw instructorError;
    }

    return NextResponse.json({ success: true, user: { id: userId, email, role } });
  } catch (err: any) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: err.message || "Failed to create user" }, { status: 500 });
  }
}
