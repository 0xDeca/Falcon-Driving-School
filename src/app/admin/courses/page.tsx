"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { BookOpen, Plus, Edit, Archive, DollarSign, Clock, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAdminCourses } from "@/hooks/use-admin-data";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminCourses() {
  const { courses, loading } = useAdminCourses();
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    duration_hours: 0,
    price: 0,
    requirements: "",
  });

  const handleSave = async () => {
    try {
      await supabase.from("courses").insert([form]);
      toast.success("Course saved");
      setShowAddForm(false);
      setForm({ name: "", description: "", duration: "", duration_hours: 0, price: 0, requirements: "" });
    } catch {
      toast.error("Failed to save course");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await supabase.from("courses").update({ status: "archived" }).eq("id", id);
      toast.success("Course archived");
    } catch {
      toast.error("Failed to archive course");
    }
  };

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
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Course Management</h1>
            <Button variant="gold" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">New Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Course Name</Label>
                      <Input placeholder="e.g., Advanced Driving" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input placeholder="e.g., 6 weeks" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (Hours)</Label>
                      <Input type="number" placeholder="24" value={form.duration_hours || ""} onChange={(e) => setForm({ ...form, duration_hours: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (NGN)</Label>
                      <Input type="number" placeholder="150000" value={form.price || ""} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Course description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <Textarea placeholder="Prerequisites" rows={2} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gold" onClick={handleSave}>Save Course</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-8">No courses found</div>
            ) : (
              courses.map((course: any) => (
                <Card key={course.id}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <BookOpen className="h-5 w-5 text-accent" />
                      </div>
                      <Badge variant={(course.status ?? "active") === "active" ? "success" : "secondary"}>
                        {course.status ?? "active"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-primary">{course.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" /> {course.duration}
                      </span>
                      <span className="font-bold text-accent">{formatCurrency(course.price)}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleArchive(course.id)}>
                        <Archive className="mr-1 h-4 w-4" /> Archive
                      </Button>
                    </div>
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
