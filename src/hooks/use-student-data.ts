"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "./use-user";
import type { Lesson } from "@/types";

interface DashboardStats {
  upcomingLessonsCount: number;
  completedLessonsCount: number;
  totalLessons: number;
  progress: number;
  instructorName: string | null;
  paymentStatus: string;
  certificateEligible: boolean;
  unreadNotifications: number;
}

interface UpcomingLesson {
  id: string;
  date: string;
  time: string;
  duration: number;
  instructor: string;
  topic: string;
}

export function useStudentDashboard() {
  const { user, profile, loading: userLoading } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingLessons, setUpcomingLessons] = useState<UpcomingLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user || !profile) {
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        
        const studentId = (profile as { id: string }).id;
        
        // Get enrollments with course data
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("*, courses(*)")
          .eq("student_id", studentId)
          .eq("status", "active");
        
        const enrollment = enrollments?.[0];
        const totalLessons = (enrollment?.courses as { duration_hours?: number })?.duration_hours ?? 0;
        
        // Get lessons
        const { data: allLessons } = await supabase
          .from("lessons")
          .select("*, instructors!inner(*, users(*))")
          .eq("enrollments.student_id", studentId);
        
        const now = new Date().toISOString();
        const upcoming = (allLessons ?? []).filter(
          (l: Lesson) => l.scheduled_date >= now && l.attendance_status === "scheduled"
        );
        const completed = (allLessons ?? []).filter(
          (l: Lesson) => l.attendance_status === "present" || l.attendance_status === "absent"
        );
        
        // Get notifications
        const { data: notifs } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_read", false);
        
        // Get payments
        const { data: payments } = await supabase
          .from("payments")
          .select("*")
          .eq("student_id", studentId);
        
        const hasOutstanding = (payments ?? []).some(
          (p: { status: string }) => p.status === "pending"
        );
        
        // Get certificate recommendations
        const { data: certRecs } = await supabase
          .from("certificate_recommendations")
          .select("*")
          .eq("student_id", studentId);
        
        const hasPendingRec = (certRecs ?? []).some(
          (r: { status: string }) => r.status === "pending"
        );

        const progress = totalLessons > 0 
          ? Math.round((completed.length / totalLessons) * 100) 
          : 0;

        setStats({
          upcomingLessonsCount: upcoming.length,
          completedLessonsCount: completed.length,
          totalLessons,
          progress: Math.min(progress, 100),
          instructorName: null, // Will need a lookup
          paymentStatus: hasOutstanding ? "pending" : "completed",
          certificateEligible: !hasPendingRec,
          unreadNotifications: notifs?.length ?? 0,
        });

        setUpcomingLessons(
          upcoming.slice(0, 5).map((l: Lesson) => ({
            id: l.id,
            date: l.scheduled_date,
            time: new Date(l.scheduled_date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
            duration: l.duration_minutes,
            instructor: (l.instructors as { users?: { email?: string } })?.users?.email ?? "Assigned Instructor",
            topic: "Driving Lesson",
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, profile, userLoading]);

  return { stats, upcomingLessons, loading, error };
}

// useStudentLessons hook
export function useStudentLessons() {
  const { user, profile, loading: userLoading } = useUser();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!profile) { setLoading(false); return; }

    const fetch = async () => {
      try {
        const studentId = (profile as { id: string }).id;
        const { data } = await supabase
          .from("lessons")
          .select("*, instructors!inner(*, users(*)), lesson_evaluations(*)")
          .eq("enrollments.student_id", studentId)
          .order("scheduled_date", { ascending: false });
        
        setLessons((data ?? []).map((l: any) => ({
          id: l.id,
          date: l.scheduled_date,
          topic: "Driving Lesson",
          instructor: l.instructors?.users?.email ?? "Instructor",
          duration: l.duration_minutes,
          status: l.attendance_status,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [profile, userLoading]);

  return { lessons, loading, error };
}
