"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Bell, CheckCircle, Trash2, Info, AlertCircle, Award, CreditCard, Calendar, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  lesson: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100" },
  payment: { icon: CreditCard, color: "text-green-500", bg: "bg-green-100" },
  certificate: { icon: Award, color: "text-accent", bg: "bg-accent/10" },
  system: { icon: Info, color: "text-gray-500", bg: "bg-gray-100" },
};

export default function StudentNotifications() {
  const { notifications, loading, error, unreadCount, markAsRead, deleteNotification } = useNotifications();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">
              Notifications
            </h1>
            <Badge variant="secondary">
              {unreadCount} unread
            </Badge>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification: any) => {
                const config = (typeConfig[notification.type] || typeConfig.system)!;
                const Icon = config.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`transition-colors ${
                      !notification.is_read ? "border-accent/50 bg-accent/5" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.is_read ? "font-medium text-primary" : "text-gray-600"}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
