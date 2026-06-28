"use client";

import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";

export default function InstructorDashboard() {
  const { user, profile, loading: userLoading } = useUser();

  const [stats, setStats] = useState({
    assignedStudents: 0,
    todayLessons: 0,
    upcomingLessons: 0,
    pendingEvaluations: 0,
  });
  const [todayLessons, setTodayLessons] = useState<any[]>([]);
  const [pendingEvals, setPendingEvals] = useState<any[]>([]);
  const [myStudents, setMyStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user || !profile) {
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const instructorId = (profile as any).id;

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000 - 1);
        const weekEnd = new Date(todayStart.getTime() + 7 * 86400000 - 1);

        // Fetch all lessons for this instructor with student data
        const { data: allLessons, error: lessonsError } = await supabase
          .from("lessons")
          .select("*, enrollments!inner(*, students!inner(*, users(*)), courses(*))")
          .eq("instructor_id", instructorId);

        if (lessonsError) throw lessonsError;

        const lessons = allLessons || [];

        // Count distinct students
        const studentMap = new Map();
        lessons.forEach((l: any) => {
          const sid = l.enrollments?.student_id;
          if (sid && !studentMap.has(sid)) {
            studentMap.set(sid, {
              id: sid,
              name: l.enrollments?.students?.users?.email ?? "Unknown",
              course: l.enrollments?.courses?.name ?? "Unknown",
              email: l.enrollments?.students?.users?.email ?? "",
            });
          }
        });

        // Today's lessons
        const today = lessons.filter((l: any) => {
          const d = new Date(l.scheduled_date);
          return d >= todayStart && d <= todayEnd;
        });

        // Upcoming lessons (next 7 days after today)
        const upcoming = lessons.filter((l: any) => {
          const d = new Date(l.scheduled_date);
          return d > todayEnd && d <= weekEnd;
        });

        // Get evaluations to find pending ones
        const lessonIds = lessons.map((l: any) => l.id);
        const { data: evals } = await supabase
          .from("lesson_evaluations")
          .select("lesson_id")
          .in("lesson_id", lessonIds);

        const evaluatedIds = new Set((evals || []).map((e: any) => e.lesson_id));
        const pending = lessons.filter(
          (l: any) => !evaluatedIds.has(l.id) && new Date(l.scheduled_date) <= now
        );

        setStats({
          assignedStudents: studentMap.size,
          todayLessons: today.length,
          upcomingLessons: upcoming.length,
          pendingEvaluations: pending.length,
        });

        setTodayLessons(
          today.map((l: any) => ({
            id: l.id,
            time: new Date(l.scheduled_date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
            student: l.enrollments?.students?.users?.name ?? l.enrollments?.students?.users?.email ?? "Student",
            topic: l.enrollments?.courses?.name ?? "Driving Lesson",
            status: l.attendance_status,
          }))
        );

        setPendingEvals(
          pending.slice(0, 5).map((l: any) => ({
            id: l.id,
            student: l.enrollments?.students?.users?.name ?? l.enrollments?.students?.users?.email ?? "Student",
            date: l.scheduled_date,
            topic: l.enrollments?.courses?.name ?? "Driving Lesson",
          }))
        );

        setMyStudents(Array.from(studentMap.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, profile, userLoading]);

  if (loading || userLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="instructor" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="instructor" />
        <div className="flex-1 flex items-center justify-center text-red-500">Error: {error}</div>
      </div>
    );
  }

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
                        <Link href={`/instructor/lessons`}>
                          <Button variant="outline" size="sm">Start</Button>
                        </Link>
                        <Badge variant="warning">Scheduled</Badge>
                      </div>
                    </div>
                  ))}
                  {todayLessons.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No lessons scheduled for today</p>
                  )}
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
                  {pendingEvals.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No pending evaluations</p>
                  )}
                </div>
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
                    {myStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-primary">{student.name}</td>
                        <td className="py-3 px-4 text-gray-600">{student.course}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div className="h-full bg-accent rounded-full" style={{ width: `0%` }} />
                            </div>
                            <span className="text-xs text-gray-500">0%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">N/A</td>
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
