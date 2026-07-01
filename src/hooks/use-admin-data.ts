"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";

interface AdminDashboardData {
  totalStudents: number; activeInstructors: number; totalRevenue: number;
  upcomingLessons: number; pendingCertificates: number; recentPayments: any[];
  totalVehicles: number; availableVehicles: number; totalCourses: number; pendingLicenses: number;
}

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const dashboard = await api.getAdminDashboard();
        setData(dashboard);
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
    try {
      const data = await api.getStudents({ sortBy: "enrollment_date", sortOrder: "desc" });
      setStudents(data ?? []);
    } catch {
      setStudents([]);
    }
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
    try {
      const data = await api.getInstructors({ sortBy: "created_at", sortOrder: "desc" });
      setInstructors(data ?? []);
    } catch {
      setInstructors([]);
    }
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
    try {
      const data = await api.getCourses({ sortBy: "created_at", sortOrder: "asc" });
      setCourses(data ?? []);
    } catch {
      setCourses([]);
    }
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
      try {
        const data = await api.getVehicles({ sortBy: "created_at", sortOrder: "desc" });
        setVehicles(data ?? []);
      } catch {
        setVehicles([]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { vehicles, loading };
}
