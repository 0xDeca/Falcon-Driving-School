"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  CreditCard,
  Bell,
  User,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { PROGRESS_METRICS } from "@/types";
import { useUser } from "@/hooks/use-user";
import { useStudentDashboard } from "@/hooks/use-student-data";

export default function StudentDashboard() {
  const { user, profile, loading: userLoading } = useUser();
  const { stats, upcomingLessons, loading, error } = useStudentDashboard();

  if (loading || userLoading) {
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                Student Dashboard
              </h1>
              <p className="text-gray-500">
                Welcome back, {user?.email?.split("@")[0] || "Student"}!
              </p>
            </div>
            <Link href="/student/notifications">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {(stats?.unreadNotifications ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white text-xs">
                    {stats?.unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats?.upcomingLessonsCount ?? 0}</p>
                  <p className="text-sm text-gray-500">Upcoming Lessons</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats?.completedLessonsCount ?? 0}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats?.progress ?? 0}%</p>
                  <p className="text-sm text-gray-500">Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-primary">{stats?.instructorName ?? "Not Assigned"}</p>
                  <p className="text-sm text-gray-500">Your Instructor</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingLessons.length > 0 ? (
                    upcomingLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-primary">{lesson.topic}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(lesson.date)} at {lesson.time}
                            </p>
                            <p className="text-xs text-gray-400">{lesson.duration} min</p>
                          </div>
                        </div>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming lessons</p>
                  )}
                  <Link href="/student/lessons">
                    <Button variant="outline" className="w-full mt-2">
                      View All Lessons
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Course Completion</span>
                  <span className="font-bold text-primary">{stats?.progress ?? 0}%</span>
                </div>
                <Progress value={stats?.progress ?? 0} className="h-3" />
                <div className="space-y-3 mt-4">
                  {PROGRESS_METRICS.slice(0, 4).map((metric) => (
                    <div key={metric.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{metric.name}</span>
                        <span className="font-medium">{metric.score}%</span>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                    </div>
                  ))}
                </div>
                <Link href="/student/progress">
                  <Button variant="outline" className="w-full mt-2">
                    View Full Progress
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.paymentStatus === "completed" ? (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium text-green-800">All Payments Completed</p>
                        <p className="text-sm text-green-600">No outstanding fees</p>
                      </div>
                    </div>
                    <Badge variant="success">Current</Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-800">Outstanding Balance</p>
                        <p className="text-sm text-yellow-600">Please complete your payment</p>
                      </div>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                )}
                <Link href="/student/payments">
                  <Button variant="outline" className="w-full">
                    View Payment History
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Certificate Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-accent" />
                    <div>
                      <p className="font-medium text-primary">
                        {stats?.certificateEligible ? "Eligible for Certificate" : "Certificate Pending"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {stats?.certificateEligible
                          ? "Your instructor will review and recommend"
                          : "Complete all lessons to become eligible"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={stats?.certificateEligible ? "secondary" : "warning"}>
                    {stats?.certificateEligible ? "In Progress" : "Not Eligible"}
                  </Badge>
                </div>
                <Link href="/student/certificates">
                  <Button variant="outline" className="w-full">
                    View Certificates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
