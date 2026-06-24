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
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

export default function StudentLessons() {
  const [view, setView] = useState<"upcoming" | "history">("upcoming");
  const [selectedDate, setSelectedDate] = useState("");

  const lessons = [
    {
      id: 1,
      date: "2025-12-20",
      time: "09:00",
      duration: 90,
      instructor: "Adebayo Ogunlesi",
      topic: "Highway Driving",
      status: "scheduled" as const,
    },
    {
      id: 2,
      date: "2025-12-22",
      time: "14:00",
      duration: 90,
      instructor: "Adebayo Ogunlesi",
      topic: "Reverse Parking",
      status: "scheduled" as const,
    },
    {
      id: 3,
      date: "2025-12-18",
      time: "10:00",
      duration: 90,
      instructor: "Adebayo Ogunlesi",
      topic: "Steering Control",
      status: "completed" as const,
    },
    {
      id: 4,
      date: "2025-12-16",
      time: "11:00",
      duration: 90,
      instructor: "Adebayo Ogunlesi",
      topic: "Parking Practice",
      status: "completed" as const,
    },
  ];

  const filtered = lessons.filter((l) => {
    const matchesDate = !selectedDate || l.date === selectedDate;
    const matchesView =
      view === "upcoming"
        ? l.status === "scheduled"
        : l.status !== "scheduled";
    return matchesDate && matchesView;
  });

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
            {filtered.map((lesson) => (
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
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Badge variant="success">
                          <CheckCircle className="mr-1 h-3 w-3" /> Completed
                        </Badge>
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
