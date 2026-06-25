"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "./use-user";

export function useStudentPayments() {
  const { user, profile, loading: userLoading } = useUser();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!profile) { setLoading(false); return; }

    const fetch = async () => {
      const studentId = (profile as { id: string }).id;
      const { data } = await supabase
        .from("payments")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });
      setPayments(data ?? []);
      setLoading(false);
    };
    fetch();
  }, [profile, userLoading]);

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const outstanding = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return { payments, loading, totalPaid, outstanding };
}
