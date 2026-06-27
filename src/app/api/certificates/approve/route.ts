import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { recommendationId, adminComment } = await request.json();

    const supabase = getServerSupabase();

    // Get the recommendation
    const { data: rec, error: recError } = await supabase
      .from("certificate_recommendations")
      .select("*, students(*), courses(*)")
      .eq("id", recommendationId)
      .single();

    if (recError || !rec) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
    }

    // Update recommendation status to approved
    const { error: updateError } = await supabase
      .from("certificate_recommendations")
      .update({ 
        status: "approved",
        remarks: adminComment || rec.remarks
      })
      .eq("id", recommendationId);

    if (updateError) throw updateError;

    // Create the certificate
    const certNumber = `FDS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const { error: certError } = await supabase
      .from("certificates")
      .insert([{
        student_id: rec.student_id,
        course_id: rec.students?.course_id,
        certificate_number: certNumber,
        completion_date: new Date().toISOString().split("T")[0],
      }]);

    if (certError) throw certError;

    // Create notification for student
    const { data: student } = await supabase
      .from("students")
      .select("user_id")
      .eq("id", rec.student_id)
      .single();

    if (student) {
      await supabase.from("notifications").insert([{
        user_id: student.user_id,
        type: "certificate",
        message: "Your certificate has been approved! You can now download it from your portal.",
      }]);
    }

    return NextResponse.json({ success: true, certificateNumber: certNumber });
  } catch (error) {
    console.error("Certificate approval error:", error);
    return NextResponse.json(
      { error: "Failed to approve certificate" },
      { status: 500 }
    );
  }
}
