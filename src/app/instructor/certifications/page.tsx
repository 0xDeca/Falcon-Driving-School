"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/layout/sidebar";
import { Award, ThumbsUp, ThumbsDown } from "lucide-react";
import toast from "react-hot-toast";

const eligibleStudents = [
  { id: 1, name: "John Doe", course: "Automatic Driving", lessonsCompleted: 24, totalLessons: 24, progress: 100 },
  { id: 2, name: "Jane Ade", course: "Defensive Driving", lessonsCompleted: 16, totalLessons: 16, progress: 100 },
];

export default function InstructorCertifications() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [recommendation, setRecommendation] = useState<"recommended" | "not_recommended" | "">("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !recommendation) {
      toast.error("Please complete all required fields");
      return;
    }
    toast.success("Certification recommendation submitted for admin review!");
    setSelectedStudent("");
    setRecommendation("");
    setRemarks("");
  };

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
                      <option key={s.id} value={s.name}>{s.name} - {s.course}</option>
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

                <Button type="submit" variant="gold" className="w-full" size="lg">
                  Submit Recommendation
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
