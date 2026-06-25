import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { certificateId } = await request.json();

    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("*, students!inner(*, users(*)), courses(*), instructors!inner(*, users(*))")
      .eq("id", certificateId)
      .single();

    if (error || !certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Generate certificate number if not exists
    const certNumber = certificate.certificate_number || 
      `FDS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Update certificate with generated number
    if (!certificate.certificate_number) {
      await supabase
        .from("certificates")
        .update({ certificate_number: certNumber })
        .eq("id", certificateId);
    }

    // Return the data needed for client-side PDF generation
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
