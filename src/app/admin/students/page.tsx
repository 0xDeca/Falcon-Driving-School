"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, UserPlus, Download, Eye, Edit, Ban, Loader2 } from "lucide-react";
import { useAdminStudents } from "@/hooks/use-admin-data";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const { students, loading } = useAdminStudents();

  const filteredStudents = students.filter((s: any) =>
    (s.name ?? s.users?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.email ?? s.users?.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = async (studentId: string) => {
    try {
      await supabase
        .from("enrollments")
        .update({ status: "cancelled" })
        .eq("student_id", studentId);
      toast.success("Student suspended successfully");
    } catch {
      toast.error("Failed to suspend student");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name,Email,Phone,Course,Status,Enrolled"];
    const rows = students.map((s: any) =>
      [
        s.name ?? s.users?.name ?? "",
        s.email ?? s.users?.email ?? "",
        s.phone ?? "",
        s.enrollments?.[0]?.courses?.name ?? "",
        s.enrollments?.[0]?.status ?? s.status ?? "active",
        s.enrollment_date ?? s.created_at ?? "",
      ].join(",")
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Student Management</h1>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportCSV}>
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
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">No students found</td>
                    </tr>
                  ) : (
                    filteredStudents.map((student: any) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-primary">{student.name ?? student.users?.name ?? "Unknown"}</p>
                            <p className="text-xs text-gray-500">{student.email ?? student.users?.email ?? ""}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {student.enrollments?.[0]?.courses?.name ?? "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={(student.enrollments?.[0]?.status ?? "active") === "active" ? "success" : "destructive"}>
                            {student.enrollments?.[0]?.status ?? "active"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {student.enrollment_date ?? student.created_at?.split("T")[0] ?? "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleSuspend(student.id)}>
                              <Ban className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
