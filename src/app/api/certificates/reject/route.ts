import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { recommendationId, adminComment } = await request.json();

    const supabase = getSupabase();

    const { error } = await supabase
      .from("certificate_recommendations")
      .update({ 
        status: "rejected",
        remarks: adminComment || "Certificate request rejected by admin"
      })
      .eq("id", recommendationId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Certificate rejection error:", error);
    return NextResponse.json(
      { error: "Failed to reject certificate" },
      { status: 500 }
    );
  }
}
