"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/layout/sidebar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import { useStudentLessons } from "@/hooks/use-student-data";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Award,
  Loader2,
} from "lucide-react";

interface Metric {
  name: string;
  score: number;
}

export default function StudentProgress() {
  const { profile, loading: userLoading } = useUser();
  const { lessons, loading: lessonsLoading, error: lessonsError } = useStudentLessons();
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [evalLoading, setEvalLoading] = useState(true);
  const [evalError, setEvalError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading || lessonsLoading || !profile || lessons.length === 0) {
      if (!userLoading && !lessonsLoading && profile && lessons.length === 0) {
        setEvalLoading(false);
      }
      return;
    }

    const fetchEvals = async () => {
      try {
        const lessonIds = lessons.map((l: any) => l.id);
        const { data } = await supabase
          .from("lesson_evaluations")
          .select("*")
          .in("lesson_id", lessonIds);
        setEvaluations(data ?? []);
      } catch (err) {
        setEvalError(err instanceof Error ? err.message : "Error loading evaluations");
      } finally {
        setEvalLoading(false);
      }
    };
    fetchEvals();
  }, [profile, userLoading, lessons, lessonsLoading]);

  const completedCount = lessons.filter(
    (l: any) => l.status === "present" || l.status === "absent"
  ).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 75;

  const calcAvg = (field: string): number => {
    if (evaluations.length === 0) return 0;
    const total = evaluations.reduce((sum: number, e: any) => sum + (Number(e[field]) || 0), 0);
    return Math.round((total / evaluations.length) * 10);
  };

  const metrics: Metric[] = [
    { name: "Steering Control", score: calcAvg("steering_score") },
    { name: "Parking", score: calcAvg("parking_score") },
    { name: "Reverse Parking", score: calcAvg("reverse_parking_score") },
    { name: "Traffic Signs", score: calcAvg("road_awareness_score") },
    { name: "Road Safety", score: calcAvg("road_awareness_score") },
    { name: "Highway Driving", score: calcAvg("confidence_score") },
    { name: "Defensive Driving", score: Math.round(
      (calcAvg("steering_score") + calcAvg("parking_score") + calcAvg("reverse_parking_score") + calcAvg("road_awareness_score") + calcAvg("confidence_score")) / 5
    )},
  ];

  const allStrengths = evaluations
    .map((e: any) => e.strengths_text)
    .filter(Boolean)
    .join(" ");
  const allImprovements = evaluations
    .map((e: any) => e.improvements_text)
    .filter(Boolean)
    .join(" ");

  const loading = userLoading || lessonsLoading || evalLoading;

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

  if (lessonsError || evalError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-500">{lessonsError || evalError}</p>
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
            My Progress
          </h1>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    Overall Course Progress
                  </h2>
                  <p className="text-sm text-gray-500">
                    Automatic Driving Lessons
                  </p>
                </div>
                <span className="text-3xl font-bold text-accent">
                  {overallProgress}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-4" />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{completedCount} of {totalLessons} lessons completed</span>
                <span>{totalLessons - completedCount} lessons remaining</span>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold text-primary">
            Skill Assessments
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-primary">
                      {metric.name}
                    </span>
                    <span
                      className={`font-bold ${
                        metric.score >= 80
                          ? "text-green-500"
                          : metric.score >= 60
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {metric.score}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={metric.score} className="h-3" />
                    <div
                      className={`absolute top-0 left-0 h-3 rounded-full ${
                        metric.score >= 80
                          ? "bg-green-500"
                          : metric.score >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${metric.score}%`,
                        opacity: 0,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Instructor Feedback Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allStrengths ? (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Strengths</p>
                    <p className="text-sm text-green-600">{allStrengths}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Strengths</p>
                    <p className="text-sm text-green-600">
                      No feedback recorded yet.
                    </p>
                  </div>
                </div>
              )}
              {allImprovements ? (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Areas for Improvement
                    </p>
                    <p className="text-sm text-yellow-600">{allImprovements}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Areas for Improvement
                    </p>
                    <p className="text-sm text-yellow-600">
                      No feedback recorded yet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
