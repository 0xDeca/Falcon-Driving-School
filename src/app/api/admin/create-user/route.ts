import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${authHeader}` } },
    });

    const { data: { user }, error: authError } = await tempClient.auth.getUser(authHeader);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: caller } = await tempClient.from("users").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, password, role, name, phone, certification, years_experience, bio } = await request.json();
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

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

    const { error: userError } = await adminClient.from("users").insert({ id: userId, email, name: name || null, role });
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
