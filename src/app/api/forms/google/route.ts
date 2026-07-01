import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, source } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    const serviceClient = getServiceSupabase();

    const { error } = await serviceClient.from("contact_messages").insert({
      name, email, phone: phone || null,
      message: message || `Submitted via ${source || "Google Form"}`,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Form submission error:", err);
    return NextResponse.json({ error: err.message || "Failed to save submission" }, { status: 500 });
  }
}
