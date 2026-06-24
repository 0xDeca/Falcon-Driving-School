"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

export default function InstructorDashboard() {
  const stats = {
    assignedStudents: 12,
    todayLessons: 3,
    upcomingLessons: 8,
    pendingEvaluations: 2,
  };

  const todayLessons = [
    { id: 1, time: "09:00", student: "John Doe", topic: "Highway Driving", status: "scheduled" as const },
    { id: 2, time: "11:00", student: "Sarah Smith", topic: "Parking Practice", status: "scheduled" as const },
    { id: 3, time: "14:00", student: "Mike Johnson", topic: "Reverse Parking", status: "scheduled" as const },
  ];

  const pendingEvals = [
    { id: 1, student: "Jane Ade", date: "2025-12-18", topic: "Steering Control" },
    { id: 2, student: "Paul Eze", date: "2025-12-17", topic: "Road Awareness" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="instructor" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            Instructor Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.assignedStudents}</p>
                  <p className="text-sm text-gray-500">Assigned Students</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.todayLessons}</p>
                  <p className="text-sm text-gray-500">Today&apos;s Lessons</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.upcomingLessons}</p>
                  <p className="text-sm text-gray-500">Next 7 Days</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.pendingEvaluations}</p>
                  <p className="text-sm text-gray-500">Pending Evaluations</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  Today&apos;s Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-primary">{lesson.student}</p>
                          <p className="text-sm text-gray-500">{lesson.topic} - {lesson.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Start</Button>
                        <Badge variant="warning">Scheduled</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/instructor/lessons">
                  <Button variant="outline" className="w-full mt-4">View All Lessons</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Pending Evaluations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingEvals.map((evalItem) => (
                    <div key={evalItem.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-yellow-800">{evalItem.student}</p>
                          <p className="text-xs text-yellow-600">{evalItem.topic} - {formatDate(evalItem.date)}</p>
                        </div>
                      </div>
                      <Link href={`/instructor/evaluations`}>
                        <Button variant="gold" size="sm">Evaluate</Button>
                      </Link>
                    </div>
                  ))}
                </div>
                {pendingEvals.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No pending evaluations</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                My Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Course</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Progress</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Next Lesson</th>
                      <th className="text-left py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {["John Doe", "Sarah Smith", "Mike Johnson", "Jane Ade"].map((student, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-primary">{student}</td>
                        <td className="py-3 px-4 text-gray-600">Automatic Driving</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${65 + i * 8}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{65 + i * 8}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">Dec 20, 9:00 AM</td>
                        <td className="py-3 px-4">
                          <Link href={`/instructor/students`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
