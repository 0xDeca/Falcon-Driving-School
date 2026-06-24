"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, Mail, Phone, User, Eye } from "lucide-react";

const students = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "0800 000 0001", course: "Automatic Driving", progress: 80, nextLesson: "Dec 20, 9:00 AM" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "0800 000 0002", course: "Manual Driving", progress: 65, nextLesson: "Dec 20, 11:00 AM" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "0800 000 0003", course: "Defensive Driving", progress: 45, nextLesson: "Dec 20, 2:00 PM" },
  { id: 4, name: "Jane Ade", email: "jane@example.com", phone: "0800 000 0004", course: "Automatic Driving", progress: 90, nextLesson: "Dec 22, 10:00 AM" },
];

export default function InstructorStudents() {
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="instructor" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">My Students</h1>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filtered.map((student) => (
              <Card key={student.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                        <User className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{student.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {student.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {student.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{student.course}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{student.progress}%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View Progress
                      </Button>
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
