"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, UserPlus, Eye, Edit, Star, Award } from "lucide-react";

export default function AdminInstructors() {
  const [search, setSearch] = useState("");

  const instructors = [
    { id: 1, name: "Adebayo Ogunlesi", email: "adebayo@falcon.com", certification: "FRSC Certified", experience: "15 years", students: 24, status: "active" as const },
    { id: 2, name: "Ngozi Eze", email: "ngozi@falcon.com", certification: "FRSC Certified", experience: "10 years", students: 18, status: "active" as const },
    { id: 3, name: "Chidi Okonkwo", email: "chidi@falcon.com", certification: "FRSC Certified", experience: "8 years", students: 15, status: "active" as const },
    { id: 4, name: "Folake Adeleke", email: "folake@falcon.com", certification: "FRSC Certified", experience: "7 years", students: 12, status: "active" as const },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Instructor Management</h1>
            <Button variant="gold">
              <UserPlus className="mr-2 h-4 w-4" /> Add Instructor
            </Button>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search instructors..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {instructors.map((instructor) => (
              <Card key={instructor.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                        <span className="font-bold text-accent">{instructor.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{instructor.name}</h3>
                        <p className="text-sm text-gray-500">{instructor.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">{instructor.certification}</Badge>
                          <Badge variant="outline" className="text-xs">{instructor.experience}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge variant={instructor.status === "active" ? "success" : "destructive"}>{instructor.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-accent" />
                      {instructor.students} students
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Eye className="mr-1 h-3 w-3" /> View</Button>
                      <Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit</Button>
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
