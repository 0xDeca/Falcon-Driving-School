"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import { Calendar, Clock, MapPin, Play, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function InstructorLessons() {
  const [date, setDate] = useState("");

  const lessons = [
    { id: 1, date: "2025-12-20", time: "09:00", student: "John Doe", topic: "Highway Driving", duration: 90, status: "scheduled" as const },
    { id: 2, date: "2025-12-20", time: "11:00", student: "Sarah Smith", topic: "Parking Practice", duration: 90, status: "scheduled" as const },
    { id: 3, date: "2025-12-20", time: "14:00", student: "Mike Johnson", topic: "Reverse Parking", duration: 90, status: "scheduled" as const },
    { id: 4, date: "2025-12-18", time: "10:00", student: "Jane Ade", topic: "Steering Control", duration: 90, status: "completed" as const },
  ];

  const filtered = lessons.filter((l) => !date || l.date === date);

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
                          <Button variant="outline" size="sm">
                            <CheckCircle className="mr-1 h-4 w-4" /> Mark Present
                          </Button>
                          <Button variant="outline" size="sm">
                            <XCircle className="mr-1 h-4 w-4" /> Mark Absent
                          </Button>
                          <Button variant="gold" size="sm">
                            <Play className="mr-1 h-4 w-4" /> Start Lesson
                          </Button>
                        </>
                      ) : (
                        <Badge variant="success">Completed</Badge>
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
