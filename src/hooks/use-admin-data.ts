"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface AdminDashboardData {
  totalStudents: number;
  activeInstructors: number;
  totalRevenue: number;
  upcomingLessons: number;
  pendingCertificates: number;
  recentPayments: any[];
}

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [studentsRes, instructorsRes, paymentsRes, lessonsRes, certsRes] = await Promise.all([
          supabase.from("students").select("id", { count: "exact" }),
          supabase.from("instructors").select("id", { count: "exact" }),
          supabase.from("payments").select("*").eq("status", "completed"),
          supabase.from("lessons").select("id", { count: "exact" }).gte("scheduled_date", new Date().toISOString()),
          supabase.from("certificate_recommendations").select("id", { count: "exact" }).eq("status", "pending"),
        ]);

        const revenue = (paymentsRes.data ?? []).reduce(
          (sum: number, p: any) => sum + Number(p.amount), 0
        );

        setData({
          totalStudents: studentsRes.count ?? 0,
          activeInstructors: instructorsRes.count ?? 0,
          totalRevenue: revenue,
          upcomingLessons: lessonsRes.count ?? 0,
          pendingCertificates: certsRes.count ?? 0,
          recentPayments: (paymentsRes.data ?? []).slice(0, 10),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, loading, error };
}

export function useAdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("students")
      .select("*, users(*), enrollments(*, courses(*))")
      .order("enrollment_date", { ascending: false });
    setStudents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { students, loading, refetch: fetch };
}

export function useAdminInstructors() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("instructors")
      .select("*, users(*)")
      .order("created_at", { ascending: false });
    setInstructors(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { instructors, loading, refetch: fetch };
}

export function useAdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });
    setCourses(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { courses, loading, refetch: fetch };
}

export function useAdminVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      setVehicles(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { vehicles, loading };
}
