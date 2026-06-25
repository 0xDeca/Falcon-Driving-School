"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/layout/sidebar";
import { FileText, Star, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

const skillsList = [
  "Steering Control",
  "Parking",
  "Reverse Parking",
  "Road Awareness",
  "Traffic Signs",
  "Highway Driving",
  "Defensive Driving",
  "Night Driving",
];

export default function InstructorEvaluations() {
  const { user, profile, loading: userLoading } = useUser();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState<"pass" | "needs_improvement" | "">("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (!user || !profile) { setLoading(false); return; }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const instructorId = (profile as any).id;

        const { data: lessons, error } = await supabase
          .from("lessons")
          .select("enrollments!inner(student_id, students!inner(*, users(*)))")
          .eq("instructor_id", instructorId);

        if (error) throw error;

        const studentMap = new Map();
        (lessons || []).forEach((l: any) => {
          const sid = l.enrollments?.student_id;
          const studentData = l.enrollments?.students;
          if (sid && !studentMap.has(sid)) {
            studentMap.set(sid, {
              id: sid,
              name: studentData?.users?.name ?? studentData?.users?.email ?? "Unknown",
            });
          }
        });

        setStudents(Array.from(studentMap.values()));
      } catch (err) {
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
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

      // Find the latest lesson for this student with this instructor
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("id")
        .eq("instructor_id", instructorId)
        .eq("enrollments.student_id", selectedStudent)
        .order("scheduled_date", { ascending: false })
        .limit(1)
        .single();

      if (!lessonData) {
        toast.error("No lesson found for this student");
        return;
      }

      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonData.id,
          student_id: selectedStudent,
          instructor_id: instructorId,
          steering_score: scores["Steering Control"] || 0,
          parking_score: scores["Parking"] || 0,
          reverse_parking_score: scores["Reverse Parking"] || 0,
          road_awareness_score: scores["Road Awareness"] || 0,
          confidence_score: scores["Confidence"] || 0,
          strengths_text: strengths,
          improvements_text: improvements,
          comments_text: comments,
          skills_covered: skills,
          recommendation,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit evaluation");

      toast.success("Evaluation submitted successfully!");
      setSelectedStudent("");
      setScores({});
      setSkills([]);
      setStrengths("");
      setImprovements("");
      setComments("");
      setRecommendation("");
    } catch (err) {
      toast.error("Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  const scoreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
            Lesson Evaluation
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Lesson Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Student *</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      required
                    >
                      <option value="">Select student</option>
                      {students.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lesson Date *</Label>
                    <Input type="date" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Skills Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skillsList.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        setSkills((prev) =>
                          prev.includes(skill)
                            ? prev.filter((s) => s !== skill)
                            : [...prev, skill]
                        )
                      }
                      className={`p-3 rounded-lg text-sm font-medium border transition-colors ${
                        skills.includes(skill)
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Performance Scores (1-10)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Steering Control",
                    "Parking",
                    "Reverse Parking",
                    "Road Awareness",
                    "Confidence",
                  ].map((metric) => (
                    <div key={metric} className="space-y-2">
                      <Label>{metric} *</Label>
                      <div className="flex gap-1">
                        {scoreOptions.map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() =>
                              setScores((prev) => ({ ...prev, [metric]: score }))
                            }
                            className={`h-8 w-8 rounded text-xs font-medium transition-colors ${
                              scores[metric] === score
                                ? "bg-accent text-primary"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Strengths</Label>
                  <Textarea
                    placeholder="What did the student do well?"
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Areas for Improvement</Label>
                  <Textarea
                    placeholder="What needs more practice?"
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Additional Comments</Label>
                  <Textarea
                    placeholder="Any other observations..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Recommendation *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRecommendation("pass")}
                    className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                      recommendation === "pass"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700">Pass</p>
                    <p className="text-xs text-green-600">Student performed well</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommendation("needs_improvement")}
                    className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                      recommendation === "needs_improvement"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="font-medium text-yellow-700">Needs Improvement</p>
                    <p className="text-xs text-yellow-600">More practice required</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Evaluation"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
