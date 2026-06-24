"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/layout/sidebar";
import { PROGRESS_METRICS } from "@/types";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Award,
} from "lucide-react";

export default function StudentProgress() {
  const overallProgress = 75;

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
                <span>18 of 24 lessons completed</span>
                <span>6 lessons remaining</span>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold text-primary">
            Skill Assessments
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PROGRESS_METRICS.map((metric) => (
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
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Strengths</p>
                  <p className="text-sm text-green-600">
                    Excellent steering control, good road awareness, confident
                    highway driving.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Areas for Improvement
                  </p>
                  <p className="text-sm text-yellow-600">
                    Reverse parking needs practice. Work on confidence during
                    parallel parking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
