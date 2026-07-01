import { NextResponse } from "next/server";
import { createServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, target } = await request.json();
    if (!type || !target) {
      return NextResponse.json({ error: "type (email|phone) and target are required" }, { status: 400 });
    }
    if (!["email", "phone"].includes(type)) {
      return NextResponse.json({ error: "type must be 'email' or 'phone'" }, { status: 400 });
    }

    const serviceClient = getServiceSupabase();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await serviceClient.from("otp_codes").insert({
      user_id: user.id, type, target, code: otp, expires_at: expiresAt,
    });
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, message: `OTP sent to ${target}` });
  } catch (err: any) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: err.message || "Failed to send OTP" }, { status: 500 });
  }
}
