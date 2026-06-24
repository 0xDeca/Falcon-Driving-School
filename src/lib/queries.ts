import { supabase } from "./supabase";
import type { Role } from "@/types";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(): Promise<Role | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  return data?.role ?? null;
}

export async function getStudentProfile(userId: string) {
  const { data } = await supabase
    .from("students")
    .select("*, users(*)")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function getInstructorProfile(userId: string) {
  const { data } = await supabase
    .from("instructors")
    .select("*, users(*)")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function getEnrollments(studentId: string) {
  const { data } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", studentId);
  return data ?? [];
}

export async function getUpcomingLessons(studentId: string) {
  const { data } = await supabase
    .from("lessons")
    .select("*, enrollments!inner(*), instructors!inner(*, users(*))")
    .eq("enrollments.student_id", studentId)
    .gte("scheduled_date", new Date().toISOString())
    .order("scheduled_date", { ascending: true })
    .limit(10);
  return data ?? [];
}

export async function getLessonHistory(studentId: string) {
  const { data } = await supabase
    .from("lessons")
    .select("*, lesson_evaluations(*), instructors!inner(*, users(*))")
    .eq("enrollments.student_id", studentId)
    .order("scheduled_date", { ascending: false });
  return data ?? [];
}

export async function getNotifications(userId: string) {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getPayments(studentId: string) {
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCertificates(studentId: string) {
  const { data } = await supabase
    .from("certificates")
    .select("*, courses(*)")
    .eq("student_id", studentId);
  return data ?? [];
}

export async function getCertificateRecommendations(studentId: string) {
  const { data } = await supabase
    .from("certificate_recommendations")
    .select("*, instructors!inner(*, users(*))")
    .eq("student_id", studentId);
  return data ?? [];
}
