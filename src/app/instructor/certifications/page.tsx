"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/layout/sidebar";
import { Award, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

export default function InstructorCertifications() {
  const { user, profile, loading: userLoading } = useUser();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [recommendation, setRecommendation] = useState<"recommended" | "not_recommended" | "">("");
  const [remarks, setRemarks] = useState("");
  const [eligibleStudents, setEligibleStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (!user || !profile) { setLoading(false); return; }

    const fetchEligible = async () => {
      try {
        setLoading(true);
        const instructorId = (profile as any).id;

        // Get all lessons by this instructor with enrollment/student/course data
        const { data: lessons, error } = await supabase
          .from("lessons")
          .select("*, enrollments!inner(*, students!inner(*, users(*)), courses(*))")
          .eq("instructor_id", instructorId);

        if (error) throw error;

        // Get completed lesson counts per student
        const completedCounts = new Map<string, number>();
        const studentInfo = new Map<string, any>();

        (lessons || []).forEach((l: any) => {
          const sid = l.enrollments?.student_id;
          if (!sid) return;

          if (!studentInfo.has(sid)) {
            studentInfo.set(sid, {
              id: sid,
              name: l.enrollments?.students?.users?.name ?? l.enrollments?.students?.users?.email ?? "Unknown",
              course: l.enrollments?.courses?.name ?? "Unknown",
              totalLessons: Math.ceil((l.enrollments?.courses?.duration_hours ?? 24) / 1.5),
            });
          }

          if (l.attendance_status === "present") {
            completedCounts.set(sid, (completedCounts.get(sid) || 0) + 1);
          }
        });

        // Filter to students who have completed all their lessons
        const eligible = Array.from(studentInfo.entries())
          .filter(([sid, info]) => {
            const completed = completedCounts.get(sid) || 0;
            return completed >= info.totalLessons;
          })
          .map(([sid, info]) => ({
            ...info,
            lessonsCompleted: completedCounts.get(sid) || 0,
            progress: 100,
          }));

        setEligibleStudents(eligible);
      } catch (err) {
        toast.error("Failed to load eligible students");
      } finally {
        setLoading(false);
      }
    };

    fetchEligible();
  }, [user, profile, userLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !recommendation) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const instructorId = (profile as any).id;

      const { error } = await supabase.from("certificate_recommendations").insert([{
        student_id: selectedStudent,
        instructor_id: instructorId,
        status: "pending",
        remarks: `${recommendation === "recommended" ? "Recommended" : "Not Recommended"} - ${remarks}`,
      }]);

      if (error) throw error;

      toast.success("Certification recommendation submitted for admin review!");
      setSelectedStudent("");
      setRecommendation("");
      setRemarks("");
    } catch (err) {
      toast.error("Failed to submit recommendation");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="instructor" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            Certification Recommendations
          </h1>

          {eligibleStudents.length > 0 && (
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-4">Students Eligible for Certification</h3>
                <div className="space-y-3">
                  {eligibleStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-primary">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.course}</p>
                      </div>
                      <Badge variant="success">{student.lessonsCompleted}/{student.totalLessons} Lessons</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {eligibleStudents.length === 0 && (
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <p className="text-center text-gray-500 py-4">No students currently eligible for certification</p>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Certification Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Student *</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                  >
                    <option value="">Select a student</option>
                    {eligibleStudents.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} - {s.course}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Recommendation *</Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setRecommendation("recommended")}
                      className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                        recommendation === "recommended"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <ThumbsUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-medium text-green-700">Recommended</p>
                      <p className="text-xs text-green-600">Student is ready for certification</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecommendation("not_recommended")}
                      className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                        recommendation === "not_recommended"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <ThumbsDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="font-medium text-red-700">Not Recommended</p>
                      <p className="text-xs text-red-600">Student needs more training</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea
                    placeholder="Provide detailed remarks about the student's readiness..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" variant="gold" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Recommendation"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
