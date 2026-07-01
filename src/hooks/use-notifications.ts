"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";
import { useUser } from "./use-user";

export function useNotifications() {
  const { user, loading: userLoading } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications();
      setNotifications(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!userLoading) fetch();
  }, [user, userLoading, fetch]);

  const markAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const deleteNotification = async (id: string) => {
    await api.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, loading, error, unreadCount, markAsRead, deleteNotification, refresh: fetch };
}
