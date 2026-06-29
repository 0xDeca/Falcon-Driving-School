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
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Loader2,
  Car,
  BookOpen,
  IdCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAdminDashboard } from "@/hooks/use-admin-data";

const statCards = [
  { label: "Students", key: "totalStudents", icon: Users, change: "+12%", trend: "up" },
  { label: "Instructors", key: "activeInstructors", icon: UserCheck, change: "+3%", trend: "up" },
  { label: "Revenue", key: "totalRevenue", icon: DollarSign, change: "+8.2%", trend: "up", format: true },
  { label: "Vehicles", key: "totalVehicles", icon: Car, sub: "availableVehicles", subLabel: "available" },
  { label: "Courses", key: "totalCourses", icon: BookOpen },
  { label: "Lessons", key: "upcomingLessons", icon: Calendar, change: "+5%", trend: "up" },
  { label: "Pending Certs", key: "pendingCertificates", icon: Award, change: "-2%", trend: "down" },
  { label: "Driving Licenses", key: "pendingLicenses", icon: IdCard, change: "pending" },
];

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
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search here..."
              aria-label="Search"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-600 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Welcome</p>
              <p className="text-sm font-semibold text-primary">Admin</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <span className="text-sm font-bold text-accent">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                const rawValue = data[stat.key as keyof typeof data] as number;
                const value = stat.format ? formatCurrency(rawValue) : rawValue;
                const subValue = stat.sub ? (data[stat.sub as keyof typeof data] as number) : null;
                return (
                  <div key={stat.key} className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <p className="text-xl font-bold text-primary">{value}</p>
                        {subValue !== null && (
                          <span className="text-xs text-gray-400">
                            ({subValue} {stat.subLabel})
                          </span>
                        )}
                        {stat.change && !stat.sub && (
                          <span className={`flex items-center text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                            {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                            {stat.change}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-accent" />
                  </div>
                );
              })}
            </div>

            {/* Charts + Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Revenue Overview
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                      This Year
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary/30" />
                      Last Year
                    </span>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400 text-sm">Revenue chart will be displayed here</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-primary flex items-center gap-2 mb-6">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  Recent Activity
                </h3>
                <div className="space-y-0">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="h-2 w-2 mt-2 rounded-full bg-accent shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary">{activity.action}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-between p-6 pb-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Recent Payments
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-400">No recent payments</td></tr>
                    ) : (
                        recentPayments.map((payment: any, i: number) => (
                          <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-6">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                  {(payment.students?.users?.name?.charAt(0) ?? payment.students?.users?.email?.charAt(0) ?? "?").toUpperCase()}
                                </div>
                                <span className="font-medium text-primary">{payment.students?.users?.name || payment.students?.users?.email?.split("@")[0] || `Student #${i + 1}`}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 font-semibold text-primary">{formatCurrency(payment.amount)}</td>
                          <td className="py-3.5 px-6 text-gray-500">{payment.payment_method || "—"}</td>
                          <td className="py-3.5 px-6">
                            <Badge variant={payment.status === "completed" ? "success" : "warning"} className="text-xs">
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <button className="text-gray-300 hover:text-gray-500 transition-colors">→</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom row: Categories + Progress */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-primary flex items-center gap-2 mb-6">
                  <Award className="h-5 w-5 text-accent" />
                  Certificates
                </h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{data.pendingCertificates}</p>
                    <p className="text-sm text-gray-500 mt-1">Pending Approval</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-primary flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-accent" />
                  Enrollment Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600">Students</span>
                      <span className="font-semibold text-primary">{data.totalStudents}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (data.totalStudents / 50) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600">Instructors</span>
                      <span className="font-semibold text-primary">{data.activeInstructors}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40 rounded-full" style={{ width: `${Math.min(100, (data.activeInstructors / 10) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600">Lessons Scheduled</span>
                      <span className="font-semibold text-primary">{data.upcomingLessons}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-traffic-amber rounded-full" style={{ width: `${Math.min(100, (data.upcomingLessons / 100) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
