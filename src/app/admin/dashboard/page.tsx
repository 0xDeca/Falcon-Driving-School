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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const metrics = {
    totalStudents: 245,
    activeInstructors: 12,
    totalRevenue: 4500000,
    upcomingLessons: 48,
    pendingCertificates: 3,
  };

  const recentPayments = [
    { id: 1, student: "John Doe", amount: 150000, method: "OPay", status: "completed" as const, date: "2025-12-19" },
    { id: 2, student: "Sarah Smith", amount: 180000, method: "Card", status: "completed" as const, date: "2025-12-18" },
    { id: 3, student: "Mike Johnson", amount: 120000, method: "Transfer", status: "pending" as const, date: "2025-12-17" },
    { id: 4, student: "Jane Ade", amount: 90000, method: "OPay", status: "completed" as const, date: "2025-12-16" },
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
                    <p className="text-2xl font-bold text-primary">{metrics.totalStudents}</p>
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
                    <p className="text-2xl font-bold text-primary">{metrics.activeInstructors}</p>
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
                    <p className="text-2xl font-bold text-primary">{formatCurrency(metrics.totalRevenue)}</p>
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
                    <p className="text-2xl font-bold text-primary">{metrics.upcomingLessons}</p>
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
                    <p className="text-2xl font-bold text-primary">{metrics.pendingCertificates}</p>
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
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-primary">{payment.student}</p>
                        <p className="text-sm text-gray-500">{payment.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatCurrency(payment.amount)}</p>
                        <Badge variant={payment.status === "completed" ? "success" : "warning"}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                  {[
                    { id: 1, name: "John Doe", course: "Automatic Driving", instructor: "Adebayo Ogunlesi" },
                    { id: 2, name: "Jane Ade", course: "Defensive Driving", instructor: "Chidi Okonkwo" },
                    { id: 3, name: "Paul Eze", course: "Manual Driving", instructor: "Ngozi Eze" },
                  ].map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                      <div>
                        <p className="font-medium text-yellow-800">{cert.name}</p>
                        <p className="text-sm text-yellow-600">{cert.course} - Recommended by {cert.instructor}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-green-500 text-white text-xs font-medium hover:bg-green-600">
                          Approve
                        </button>
                        <button className="px-3 py-1 rounded bg-red-500 text-white text-xs font-medium hover:bg-red-600">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
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
                  {[
                    { action: "New enrollment", detail: "Sarah Smith enrolled in Manual Driving", time: "2 hours ago" },
                    { action: "Payment received", detail: "₦150,000 from John Doe via OPay", time: "3 hours ago" },
                    { action: "Certificate approved", detail: "Jane Ade - Defensive Driving", time: "5 hours ago" },
                    { action: "New instructor added", detail: "Zainab Abdullah joined the team", time: "1 day ago" },
                  ].map((activity, i) => (
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
