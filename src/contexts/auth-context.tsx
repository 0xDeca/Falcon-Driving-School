"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";
import type { User } from "@/types";

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = api.getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const userData = await api.getProfile();
      setUser(userData);
    } catch {
      api.clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string, rememberMe = false) => {
    const userData = await api.login(email, password, rememberMe);
    setUser(userData);
    return userData;
  };

  const register = async (data: RegisterData) => {
    const userData = await api.register(data);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
