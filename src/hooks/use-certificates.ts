"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "./use-user";

export function useStudentCertificates() {
  const { user, profile, loading: userLoading } = useUser();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!profile) { setLoading(false); return; }

    const fetch = async () => {
      const studentId = (profile as { id: string }).id;
      const [certsRes, recsRes] = await Promise.all([
        supabase
          .from("certificates")
          .select("*, courses(*)")
          .eq("student_id", studentId),
        supabase
          .from("certificate_recommendations")
          .select("*, instructors!inner(*, users(*))")
          .eq("student_id", studentId),
      ]);
      setCertificates(certsRes.data ?? []);
      setRecommendations(recsRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, [profile, userLoading]);

  const approved = certificates.length;
  const pending = recommendations.filter((r) => r.status === "pending").length;

  return { certificates, recommendations, loading, approved, pending };
}
