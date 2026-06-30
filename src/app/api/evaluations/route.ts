import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      lesson_id, student_id, instructor_id,
      steering_score, parking_score, reverse_parking_score,
      road_awareness_score, confidence_score,
      strengths_text, improvements_text, comments_text,
      recommendation
    } = body;

    if (!lesson_id || !student_id || !instructor_id || !recommendation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scores = [steering_score, parking_score, reverse_parking_score, road_awareness_score, confidence_score];
    for (const score of scores) {
      if (score != null && (typeof score !== "number" || score < 1 || score > 10)) {
        return NextResponse.json({ error: "Scores must be between 1 and 10" }, { status: 400 });
      }
    }

    const supabase = getServiceSupabase();

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

    await supabase
      .from("lessons")
      .update({ attendance_status: "present", end_time: new Date().toISOString() })
      .eq("id", lesson_id);

    const { data: lesson } = await supabase
      .from("lessons")
      .select("enrollments!inner(*)")
      .eq("id", lesson_id)
      .single();

    if (lesson) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("students!inner(user_id)")
        .eq("id", (lesson.enrollments as any).id)
        .single();

      if (enrollment) {
        const studentUserId = (enrollment.students as any)?.user_id;
        if (studentUserId) {
          await supabase.from("notifications").insert([{
            user_id: studentUserId,
            type: "lesson",
            message: "Your lesson evaluation has been submitted. Check your progress dashboard for details.",
          }]);
        }
      }
    }

    if (recommendation === "recommend_certificate") {
      await supabase.from("certificate_recommendations").insert([{
        student_id,
        instructor_id,
        status: "pending",
        remarks: strengths_text || "Recommended for certification",
      }]);
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
