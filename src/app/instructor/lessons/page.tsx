"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import { Calendar, Clock, MapPin, Play, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

export default function InstructorLessons() {
  const { user, profile, loading: userLoading } = useUser();
  const [date, setDate] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      setError(null);
      const instructorId = (profile as any).id;

      const { data, error: lessonsError } = await supabase
        .from("lessons")
        .select("*, enrollments!inner(*, students!inner(*, users(*)), courses(*))")
        .eq("instructor_id", instructorId)
        .order("scheduled_date", { ascending: false });

      if (lessonsError) throw lessonsError;

      setLessons(
        (data || []).map((l: any) => ({
          id: l.id,
          date: l.scheduled_date,
          time: new Date(l.scheduled_date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
          student: l.enrollments?.students?.users?.name ?? l.enrollments?.students?.users?.email ?? "Unknown",
          topic: l.enrollments?.courses?.name ?? "Driving Lesson",
          duration: l.duration_minutes,
          status: l.attendance_status,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    if (!user || !profile) { setLoading(false); return; }
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, userLoading]);

  const handleStartLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ start_time: new Date().toISOString(), attendance_status: "present" })
        .eq("id", lessonId);
      if (error) throw error;
      toast.success("Lesson started!");
      fetchLessons();
    } catch (err) {
      toast.error("Failed to start lesson");
    }
  };

  const handleMarkPresent = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ attendance_status: "present" })
        .eq("id", lessonId);
      if (error) throw error;
      toast.success("Marked as present");
      fetchLessons();
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  const handleMarkAbsent = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ attendance_status: "absent" })
        .eq("id", lessonId);
      if (error) throw error;
      toast.success("Marked as absent");
      fetchLessons();
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  const filtered = lessons.filter((l) => !date || l.date?.startsWith(date));

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
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Lesson Management</h1>
            <div className="w-full lg:w-64">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-8">No lessons found</p>
            )}
            {filtered.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Calendar className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{lesson.student}</h3>
                        <p className="text-sm text-gray-500">{lesson.topic}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {formatDate(lesson.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {lesson.time} ({lesson.duration} min)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.status === "scheduled" ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleMarkPresent(lesson.id)}>
                            <CheckCircle className="mr-1 h-4 w-4" /> Mark Present
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleMarkAbsent(lesson.id)}>
                            <XCircle className="mr-1 h-4 w-4" /> Mark Absent
                          </Button>
                          <Button variant="gold" size="sm" onClick={() => handleStartLesson(lesson.id)}>
                            <Play className="mr-1 h-4 w-4" /> Start Lesson
                          </Button>
                        </>
                      ) : lesson.status === "present" ? (
                        <Badge variant="success">Completed</Badge>
                      ) : (
                        <Badge variant="destructive">Absent</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
