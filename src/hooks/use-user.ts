"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api-client";
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
  const { user: authUser, loading: authLoading, refreshUser } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<Student | Instructor | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setRole(null);
      setProfile(null);
      setProfileLoading(false);
      setError(null);
      return;
    }
    try {
      setProfileLoading(true);
      setError(null);
      setRole(currentUser.role);

      if (currentUser.role === "student") {
        const p = await api.get<Student>("/students/me");
        setProfile(p);
      } else if (currentUser.role === "instructor") {
        const p = await api.get<Instructor>("/instructors/me");
        setProfile(p);
      } else {
        setProfile(null);
      }
    } catch (err) {
      if ((err as any)?.statusCode !== 401) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    fetchProfile(authUser);
  }, [authUser, authLoading, fetchProfile]);

  const refresh = useCallback(async () => {
    setProfileLoading(true);
    try {
      await refreshUser();
    } catch {
      setProfileLoading(false);
      return;
    }
    const token = api.getAccessToken();
    if (token) {
      const userData = await api.getProfile();
      await fetchProfile(userData);
    } else {
      await fetchProfile(null);
    }
  }, [refreshUser, fetchProfile]);

  return {
    user: authUser,
    role,
    profile,
    loading: authLoading || profileLoading,
    error,
    refresh,
  };
}
