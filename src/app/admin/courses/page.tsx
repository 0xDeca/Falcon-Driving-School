"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { BookOpen, Plus, Edit, Archive, DollarSign, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { COURSES_DATA } from "@/types";

export default function AdminCourses() {
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Course Name</Label>
                      <Input placeholder="e.g., Advanced Driving" />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input placeholder="e.g., 6 weeks" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (Hours)</Label>
                      <Input type="number" placeholder="24" />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (NGN)</Label>
                      <Input type="number" placeholder="150000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Course description" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <Textarea placeholder="Prerequisites" rows={2} />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gold">Save Course</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES_DATA.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <BookOpen className="h-5 w-5 text-accent" />
                    </div>
                    <Badge variant="success">Active</Badge>
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
                    <Button variant="outline" size="sm" className="flex-1">
                      <Archive className="mr-1 h-4 w-4" /> Archive
                    </Button>
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
