import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { certificateId } = await request.json();

    const supabase = getServiceSupabase();
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("*, students!inner(*, users(*)), courses(*)")
      .eq("id", certificateId)
      .single();

    if (error || !certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const certNumber = certificate.certificate_number || 
      `FDS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (!certificate.certificate_number) {
      await supabase
        .from("certificates")
        .update({ certificate_number: certNumber })
        .eq("id", certificateId);
    }

    return NextResponse.json({
      studentName: certificate.students?.users?.email?.split("@")[0] || "Student",
      courseName: certificate.courses?.name || "Course",
      certificateNumber: certNumber,
      completionDate: certificate.completion_date,
      institutionName: "Falcon Driving School",
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
