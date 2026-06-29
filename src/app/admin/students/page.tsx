"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Search, UserPlus, Download, Save, X, Ban, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { useAdminStudents } from "@/hooks/use-admin-data";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminStudents() {
  const { students, loading, refetch } = useAdminStudents();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ studentId: string; userId: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [editForm, setEditForm] = useState<any>({});

  const filtered = students.filter((s: any) =>
    (s.users?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.users?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const createStudent = async () => {
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addForm, role: "student" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Student created");
      setShowAdd(false);
      setAddForm({ name: "", email: "", password: "", phone: "" });
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startEdit = (s: any) => {
    setEditing(s.id);
    setEditForm({
      name: s.users?.name ?? "",
      email: s.users?.email ?? "",
      phone: s.phone ?? "",
      enrollment_status: s.enrollments?.[0]?.status ?? "active",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const student = students.find((s: any) => s.id === editing);
      if (student?.user_id) {
        await supabase.from("users").update({ name: editForm.name }).eq("id", student.user_id);
      }
      await supabase.from("students").update({ phone: editForm.phone }).eq("id", editing);
      if (editForm.enrollment_status) {
        const enrollmentId = students.find((s: any) => s.id === editing)?.enrollments?.[0]?.id;
        if (enrollmentId) {
          await supabase.from("enrollments").update({ status: editForm.enrollment_status }).eq("id", enrollmentId);
        }
      }
      toast.success("Student updated");
      setEditing(null);
      refetch();
    } catch { toast.error("Failed to update"); }
  };

  const toggleSuspend = async (studentId: string, userId: string, currentlySuspended: boolean) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ suspended: !currentlySuspended })
        .eq("id", userId);
      if (error) throw error;
      toast.success(currentlySuspended ? "Student restored" : "Student suspended");
      refetch();
    } catch { toast.error("Failed to update status"); }
  };

  const deleteStudent = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(deleteConfirm.userId);
      if (authError) throw authError;
      toast.success("Student deleted permanently");
      setDeleteConfirm(null);
      refetch();
    } catch { toast.error("Failed to delete student"); }
    finally { setDeleting(false); }
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
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary">Student Management</h1>
              <p className="text-sm text-gray-500 mt-1">{students.length} total students</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => {
                const csv = "Name,Email,Phone,Status\n" + students.map((s: any) =>
                  `${s.users?.name ?? s.users?.email?.split("@")[0] ?? ""},${s.users?.email ?? ""},${s.phone ?? ""},${s.users?.suspended ? "suspended" : s.enrollments?.[0]?.status ?? "active"}`
                ).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "students.csv";
                a.click();
              }}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button variant="gold" onClick={() => setShowAdd(!showAdd)}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Student
              </Button>
            </div>
          </div>

          {showAdd && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Add New Student</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="gold" onClick={createStudent} disabled={!addForm.email || !addForm.password}>
                    <UserPlus className="mr-2 h-4 w-4" /> Create Student
                  </Button>
                  <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <div className="p-4 border-b">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name or email..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Course</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Enrolled</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-gray-400">No students found</td></tr>
                  ) : (
                    filtered.map((s: any) => (
                      <tr key={s.id} className={`border-b border-gray-100 hover:bg-gray-50 ${s.users?.suspended ? "bg-red-50/50" : ""}`}>
                        {editing === s.id ? (
                          <>
                            <td className="py-3 px-4">
                              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                            </td>
                            <td className="py-3 px-4">
                              <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                            </td>
                            <td className="py-3 px-4">
                              <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                            </td>
                            <td className="py-3 px-4 text-gray-500">{s.enrollments?.[0]?.courses?.name ?? "N/A"}</td>
                            <td className="py-3 px-4 text-gray-500">{s.enrollment_date ?? "N/A"}</td>
                            <td className="py-3 px-4">
                              <select className="text-xs border rounded px-2 py-1" value={editForm.enrollment_status} onChange={(e) => setEditForm({ ...editForm, enrollment_status: e.target.value })}>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveEdit}>
                                  <Save className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4 font-medium">{s.users?.name ?? s.users?.email?.split("@")[0] ?? "N/A"}</td>
                            <td className="py-3 px-4 text-gray-600">{s.users?.email ?? "N/A"}</td>
                            <td className="py-3 px-4 text-gray-600">{s.phone ?? "—"}</td>
                            <td className="py-3 px-4 text-gray-600">{s.enrollments?.[0]?.courses?.name ?? "—"}</td>
                            <td className="py-3 px-4 text-gray-600">{s.enrollment_date ?? "—"}</td>
                            <td className="py-3 px-4">
                              {s.users?.suspended ? (
                                <Badge variant="destructive">Suspended</Badge>
                              ) : (
                                <Badge variant={s.enrollments?.[0]?.status === "active" ? "success" : "secondary"}>
                                  {s.enrollments?.[0]?.status ?? "active"}
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(s)}>
                                  <Save className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"
                                  onClick={() => toggleSuspend(s.id, s.user_id, s.users?.suspended)}>
                                  {s.users?.suspended
                                    ? <CheckCircle className="h-4 w-4 text-green-600" />
                                    : <Ban className="h-4 w-4 text-red-500" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"
                                  onClick={() => setDeleteConfirm({ studentId: s.id, userId: s.user_id, name: s.users?.name || s.users?.email })}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => !deleting && setDeleteConfirm(null)}
        onConfirm={deleteStudent}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will permanently remove their account, enrollments, payments, and all associated data. This action cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
