import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      lesson_id, student_id, instructor_id,
      steering_score, parking_score, reverse_parking_score,
      road_awareness_score, confidence_score,
      strengths_text, improvements_text, comments_text,
      skills_covered, recommendation
    } = body;

    // Create lesson evaluation
    const { data: evaluation, error: evalError } = await supabase
      .from("lesson_evaluations")
      .insert([{
        lesson_id,
        steering_score,
        parking_score,
        reverse_parking_score,
        road_awareness_score,
        confidence_score,
        strengths_text,
        improvements_text,
        comments_text,
      }])
      .select()
      .single();

    if (evalError) throw evalError;

    // Update lesson attendance to present
    await supabase
      .from("lessons")
      .update({ attendance_status: "present", end_time: new Date().toISOString() })
      .eq("id", lesson_id);

    // Send notification to student
    const { data: enrollment } = await supabase
      .from("lessons")
      .select("enrollments!inner(*, students!inner(*))")
      .eq("id", lesson_id)
      .single();

    // Create notification for student about evaluation
    if (enrollment) {
      const studentUserId = (enrollment.enrollments as any)?.students?.user_id;
      if (studentUserId) {
        await supabase.from("notifications").insert([{
          user_id: studentUserId,
          type: "lesson",
          message: "Your lesson evaluation has been submitted. Check your progress dashboard for details.",
        }]);
      }
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    console.error("Evaluation submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit evaluation" },
      { status: 500 }
    );
  }
}
