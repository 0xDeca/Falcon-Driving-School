"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { useStudentLessons } from "@/hooks/use-student-data";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function StudentLessons() {
  const { lessons, loading, error } = useStudentLessons();
  const [view, setView] = useState<"upcoming" | "history">("upcoming");
  const [selectedDate, setSelectedDate] = useState("");
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const lessonsWithTime = lessons.map((l: any) => ({
    ...l,
    time: formatTime(l.date),
  }));

  const filtered = lessonsWithTime.filter((l: any) => {
    const lessonDate = l.date?.split("T")[0];
    const matchesDate = !selectedDate || lessonDate === selectedDate;
    const matchesView =
      view === "upcoming"
        ? l.status === "scheduled"
        : l.status !== "scheduled";
    return matchesDate && matchesView;
  });

  const handleReschedule = async (lessonId: string) => {
    if (!newDate) {
      toast.error("Please select a new date");
      return;
    }
    setActionLoading(lessonId);
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ scheduled_date: newDate })
        .eq("id", lessonId);
      if (error) throw error;
      toast.success("Lesson rescheduled successfully");
      setReschedulingId(null);
      setNewDate("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reschedule");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (lessonId: string) => {
    if (!window.confirm("Are you sure you want to cancel this lesson?")) return;
    setActionLoading(lessonId);
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ attendance_status: "cancelled" })
        .eq("id", lessonId);
      if (error) throw error;
      toast.success("Lesson cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setActionLoading(null);
    }
  };

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
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            My Lessons
          </h1>

          <div className="flex flex-wrap gap-4">
            <Button
              variant={view === "upcoming" ? "gold" : "outline"}
              onClick={() => setView("upcoming")}
            >
              <Calendar className="mr-2 h-4 w-4" /> Upcoming
            </Button>
            <Button
              variant={view === "history" ? "gold" : "outline"}
              onClick={() => setView("history")}
            >
              <Clock className="mr-2 h-4 w-4" /> History
            </Button>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                className="pl-10"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            {selectedDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate("")}
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {filtered.map((lesson: any) => (
              <Card key={lesson.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Calendar className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">
                          {lesson.topic}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(lesson.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.time} ({lesson.duration} min)
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lesson.instructor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {lesson.status === "scheduled" ? (
                        <>
                          <Badge variant="warning">Scheduled</Badge>
                          {reschedulingId === lesson.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="datetime-local"
                                className="w-48"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                              />
                              <Button
                                variant="gold"
                                size="sm"
                                onClick={() => handleReschedule(lesson.id)}
                                disabled={actionLoading === lesson.id}
                              >
                                {actionLoading === lesson.id ? "..." : "Confirm"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReschedulingId(null);
                                  setNewDate("");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReschedulingId(lesson.id)}
                                disabled={actionLoading === lesson.id}
                              >
                                Reschedule
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancel(lesson.id)}
                                disabled={actionLoading === lesson.id}
                              >
                                {actionLoading === lesson.id ? "..." : "Cancel"}
                              </Button>
                            </>
                          )}
                        </>
                      ) : lesson.status === "present" ? (
                        <Badge variant="success">
                          <CheckCircle className="mr-1 h-3 w-3" /> Completed
                        </Badge>
                      ) : lesson.status === "cancelled" ? (
                        <Badge variant="destructive">Cancelled</Badge>
                      ) : (
                        <Badge variant="secondary">Absent</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">No lessons found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
