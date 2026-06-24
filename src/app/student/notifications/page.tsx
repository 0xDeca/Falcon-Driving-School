"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Bell, CheckCircle, Trash2, Info, AlertCircle, Award, CreditCard, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "lesson",
    message: "Reminder: You have a Highway Driving lesson tomorrow at 9:00 AM",
    isRead: false,
    createdAt: "2025-12-19T10:00:00",
  },
  {
    id: 2,
    type: "payment",
    message: "Payment of ₦30,000 received successfully. Transaction ID: TXN-0987654321",
    isRead: false,
    createdAt: "2025-12-15T14:30:00",
  },
  {
    id: 3,
    type: "certificate",
    message: "Your Defensive Driving certificate is ready for download!",
    isRead: true,
    createdAt: "2025-12-10T09:00:00",
  },
  {
    id: 4,
    type: "lesson",
    message: "Lesson evaluation submitted for your Steering Control session",
    isRead: true,
    createdAt: "2025-12-08T16:00:00",
  },
];

const typeConfig = {
  lesson: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100" },
  payment: { icon: CreditCard, color: "text-green-500", bg: "bg-green-100" },
  certificate: { icon: Award, color: "text-accent", bg: "bg-accent/10" },
  system: { icon: Info, color: "text-gray-500", bg: "bg-gray-100" },
};

export default function StudentNotifications() {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

          <div className="space-y-3">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type as keyof typeof typeConfig] || typeConfig.system;
              const Icon = config.icon;
              return (
                <Card
                  key={notification.id}
                  className={`transition-colors ${
                    !notification.isRead ? "border-accent/50 bg-accent/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.isRead ? "font-medium text-primary" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
