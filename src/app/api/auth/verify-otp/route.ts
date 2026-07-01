import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { userId, type, code } = await request.json();
    if (!userId || !type || !code) {
      return NextResponse.json({ error: "userId, type, and code are required" }, { status: 400 });
    }

    const serviceClient = getServiceSupabase();

    const { data: otp, error: fetchError } = await serviceClient
      .from("otp_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("type", type)
      .eq("code", code)
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!otp) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    if (new Date(otp.expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP code has expired" }, { status: 400 });
    }

    if (otp.attempts >= 5) {
      return NextResponse.json({ error: "Too many attempts. Request a new OTP." }, { status: 429 });
    }

    const { error: updateError } = await serviceClient
      .from("otp_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", otp.id);
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: err.message || "Failed to verify OTP" }, { status: 500 });
  }
}
