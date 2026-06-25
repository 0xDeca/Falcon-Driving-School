"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  Award,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAdminDashboard } from "@/hooks/use-admin-data";

export default function AdminDashboard() {
  const { data, loading, error } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center text-red-500">
          Failed to load dashboard data.
        </div>
      </div>
    );
  }

  const recentPayments = data.recentPayments ?? [];

  const activities = [
    { action: "New enrollment", detail: `${data.totalStudents} total students enrolled`, time: "System update" },
    { action: "Revenue collected", detail: `${formatCurrency(data.totalRevenue)} total revenue`, time: "System update" },
    { action: "Upcoming lessons", detail: `${data.upcomingLessons} lessons scheduled`, time: "System update" },
    { action: "Pending certificates", detail: `${data.pendingCertificates} awaiting approval`, time: "System update" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{data.totalStudents}</p>
                    <p className="text-sm text-gray-500">Enrolled Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{data.activeInstructors}</p>
                    <p className="text-sm text-gray-500">Active Instructors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <DollarSign className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(data.totalRevenue)}</p>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{data.upcomingLessons}</p>
                    <p className="text-sm text-gray-500">Upcoming Lessons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{data.pendingCertificates}</p>
                    <p className="text-sm text-gray-500">Pending Approvals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPayments.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No recent payments</p>
                  ) : (
                    recentPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <p className="font-medium text-primary">{payment.student_name || payment.student_id || "Student"}</p>
                          <p className="text-sm text-gray-500">{payment.method}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatCurrency(payment.amount)}</p>
                          <Badge variant={payment.status === "completed" ? "success" : "warning"}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Certificates Awaiting Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.pendingCertificates === 0 ? (
                    <p className="text-gray-400 text-center py-4">No pending certificates</p>
                  ) : (
                    <p className="text-gray-500 text-center py-4">{data.pendingCertificates} certificate(s) pending review</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-gray-400">Revenue chart will be displayed here</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="h-2 w-2 mt-2 rounded-full bg-accent" />
                      <div>
                        <p className="text-sm font-medium text-primary">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.detail}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
