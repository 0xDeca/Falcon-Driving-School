"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, UserPlus, Download, Mail, Phone, MoreVertical, Eye, Edit, Ban } from "lucide-react";

export default function AdminStudents() {
  const [search, setSearch] = useState("");

  const students = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "0800 000 0001", course: "Automatic Driving", status: "active" as const, enrollmentDate: "2025-10-01" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "0800 000 0002", course: "Manual Driving", status: "active" as const, enrollmentDate: "2025-10-15" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "0800 000 0003", course: "Defensive Driving", status: "active" as const, enrollmentDate: "2025-11-01" },
    { id: 4, name: "Jane Ade", email: "jane@example.com", phone: "0800 000 0004", course: "Automatic Driving", status: "active" as const, enrollmentDate: "2025-11-10" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Student Management</h1>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button variant="gold">
                <UserPlus className="mr-2 h-4 w-4" /> Add Student
              </Button>
            </div>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Course</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Enrolled</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-primary">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.course}</td>
                      <td className="py-3 px-4">
                        <Badge variant={student.status === "active" ? "success" : "destructive"}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.enrollmentDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Ban className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
