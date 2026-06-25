"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Role, Student, Instructor } from "@/types";

interface UseUserReturn {
  user: User | null;
  role: Role | null;
  profile: Student | Instructor | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<Student | Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authUser) {
        setUser(null);
        setRole(null);
        setProfile(null);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      if (userError) throw userError;

      setUser(userData);
      setRole(userData.role);

      if (userData.role === "student") {
        const { data } = await supabase
          .from("students")
          .select("*, users(*)")
          .eq("user_id", authUser.id)
          .single();
        setProfile(data);
      } else if (userData.role === "instructor") {
        const { data } = await supabase
          .from("instructors")
          .select("*, users(*)")
          .eq("user_id", authUser.id)
          .single();
        setProfile(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { user, role, profile, loading, error, refresh: fetchData };
}
