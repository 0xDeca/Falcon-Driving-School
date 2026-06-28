"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, Mail, Phone, User, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";

export default function InstructorStudents() {
  const { user, profile, loading: userLoading } = useUser();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user || !profile) { setLoading(false); return; }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const instructorId = (profile as any).id;

        const { data: lessons, error: lessonsError } = await supabase
          .from("lessons")
          .select("enrollments!inner(student_id, students!inner(*, users(*)), courses(name))")
          .eq("instructor_id", instructorId);

        if (lessonsError) throw lessonsError;

        const studentMap = new Map();
        (lessons || []).forEach((l: any) => {
          const sid = l.enrollments?.student_id;
          if (sid && !studentMap.has(sid)) {
            const studentData = l.enrollments?.students;
            studentMap.set(sid, {
              id: sid,
              name: studentData?.users?.email ?? "Unknown",
              email: studentData?.users?.email ?? "",
              phone: studentData?.phone ?? "",
              course: l.enrollments?.courses?.name ?? "Unknown",
              progress: 0,
              nextLesson: "",
            });
          }
        });

        setStudents(Array.from(studentMap.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user, profile, userLoading]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

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
                            <div className="h-full bg-accent rounded-full" style={{ width: `0%` }} />
                          </div>
                          <span className="text-xs text-gray-500">0%</span>
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
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-8">No students found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
