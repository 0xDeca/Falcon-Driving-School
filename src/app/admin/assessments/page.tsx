"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, Star, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminAssessments() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await (supabase as any)
          .from("lesson_evaluations")
          .select("*, lessons!inner(*, enrollments!inner(*, students!inner(*, users!inner(*))), instructors!inner(*, users!inner(*)))")
          .order("created_at", { ascending: false });
        setEvaluations(data ?? []);
      } catch { /* handled */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const avg = (e: any) => {
    const scores = [e.steering_score, e.parking_score, e.reverse_parking_score, e.road_awareness_score, e.confidence_score];
    const valid = scores.filter((s) => s != null);
    return valid.length ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1) : "N/A";
  };

  const filtered = evaluations.filter((e: any) =>
    (e.lessons?.enrollments?.students?.users?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (e.lessons?.instructors?.users?.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Assessments</h1>
            <p className="text-sm text-gray-500 mt-1">{evaluations.length} total evaluations</p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by student or instructor email..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-8">No evaluations found</div>
            ) : (
              filtered.map((e: any) => (
                <Card key={e.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-primary">
                          {e.lessons?.enrollments?.students?.users?.email ?? "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Instructor: {e.lessons?.instructors?.users?.email ?? "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold">{avg(e)}</span>
                          <span className="text-xs text-gray-400">/10</span>
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {new Date(e.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-500">Steering</span>
                        <span className="font-medium">{e.steering_score ?? "—"}/10</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-500">Parking</span>
                        <span className="font-medium">{e.parking_score ?? "—"}/10</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-500">Reverse</span>
                        <span className="font-medium">{e.reverse_parking_score ?? "—"}/10</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-500">Road Awareness</span>
                        <span className="font-medium">{e.road_awareness_score ?? "—"}/10</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 rounded px-2 py-1 col-span-2">
                        <span className="text-gray-500">Confidence</span>
                        <span className="font-medium">{e.confidence_score ?? "—"}/10</span>
                      </div>
                    </div>

                    {(e.strengths_text || e.improvements_text) && (
                      <div className="text-xs space-y-1 border-t pt-2">
                        {e.strengths_text && (
                          <p><span className="text-green-600 font-medium">Strengths:</span> {e.strengths_text}</p>
                        )}
                        {e.improvements_text && (
                          <p><span className="text-amber-600 font-medium">To improve:</span> {e.improvements_text}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
