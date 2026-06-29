import { NextResponse } from "next/server";
import { getServiceSupabase, createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: caller } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, password, role, name, phone, certification, years_experience, bio } = await request.json();
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 });
    }

    const adminClient = getServiceSupabase();

    if (phone && role === "student") {
      const { data: existing } = await adminClient.from("students").select("id").eq("phone", phone).maybeSingle();
      if (existing) return NextResponse.json({ error: "Phone number already in use" }, { status: 409 });
    }

    const { data: authUser, error: createError } = await adminClient.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name, phone, role },
    });
    if (createError) throw createError;
    if (!authUser?.user) throw new Error("Failed to create user");

    const userId = authUser.user.id;

    const { error: userError } = await adminClient.from("users").upsert({ id: userId, email, name: name || null, role }, { onConflict: "id" });
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
