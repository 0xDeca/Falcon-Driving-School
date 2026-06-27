"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, UserPlus, Save, X, Star, Trash2, Loader2, Ban, CheckCircle } from "lucide-react";
import { useAdminInstructors } from "@/hooks/use-admin-data";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminInstructors() {
  const { instructors, loading } = useAdminInstructors();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", certification: "", experience: "", bio: "" });
  const [editForm, setEditForm] = useState<any>({});

  const filtered = instructors.filter((i: any) =>
    (i.users?.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const createInstructor = async () => {
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: addForm.email, password: addForm.password, role: "instructor",
          certification: addForm.certification, years_experience: parseInt(addForm.experience) || 0, bio: addForm.bio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Instructor created");
      setShowAdd(false);
      setAddForm({ name: "", email: "", password: "", certification: "", experience: "", bio: "" });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startEdit = (inst: any) => {
    setEditing(inst.id);
    setEditForm({
      certification: inst.certification ?? "",
      years_experience: inst.years_experience ?? 0,
      bio: inst.bio ?? "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const { error } = await supabase.from("instructors").update({
        certification: editForm.certification,
        years_experience: parseInt(editForm.years_experience) || 0,
        bio: editForm.bio,
      }).eq("id", editing);
      if (error) throw error;
      toast.success("Instructor updated");
      setEditing(null);
    } catch { toast.error("Failed to update"); }
  };

  const deleteInstructor = async (id: string) => {
    if (!confirm("Delete this instructor permanently?")) return;
    try {
      const { error } = await supabase.from("instructors").delete().eq("id", id);
      if (error) throw error;
      toast.success("Instructor deleted");
    } catch { toast.error("Failed to delete"); }
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
              <h1 className="text-2xl lg:text-3xl font-bold text-primary">Instructor Management</h1>
              <p className="text-sm text-gray-500 mt-1">{instructors.length} total instructors</p>
            </div>
            <Button variant="gold" onClick={() => setShowAdd(!showAdd)}>
              <UserPlus className="mr-2 h-4 w-4" /> Add Instructor
            </Button>
          </div>

          {showAdd && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Add New Instructor</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Certification</Label>
                    <Input placeholder="e.g. Certified Driving Instructor" value={addForm.certification} onChange={(e) => setAddForm({ ...addForm, certification: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Years Experience</Label>
                    <Input type="number" value={addForm.experience} onChange={(e) => setAddForm({ ...addForm, experience: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea rows={2} value={addForm.bio} onChange={(e) => setAddForm({ ...addForm, bio: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <Button variant="gold" onClick={createInstructor} disabled={!addForm.email || !addForm.password}>
                    <UserPlus className="mr-2 h-4 w-4" /> Create Instructor
                  </Button>
                  <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by email..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400 py-8">No instructors found</div>
            ) : (
              filtered.map((inst: any) => (
                <Card key={inst.id}>
                  {editing === inst.id ? (
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Editing: {inst.users?.email}</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="gold" onClick={saveEdit}><Save className="mr-1 h-3 w-3" /> Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="mr-1 h-3 w-3" /></Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Certification</Label>
                          <Input value={editForm.certification} onChange={(e) => setEditForm({ ...editForm, certification: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Years Experience</Label>
                          <Input type="number" value={editForm.years_experience} onChange={(e) => setEditForm({ ...editForm, years_experience: parseInt(e.target.value) || 0 })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Bio</Label>
                        <Textarea rows={2} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                            <span className="font-bold text-accent text-sm">
                              {(inst.users?.email?.[0] ?? "?").toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary">{inst.users?.email ?? "Unknown"}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{inst.certification || "Certified"}</Badge>
                              <Badge variant="outline" className="text-xs">{inst.years_experience || 0}yrs</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      {inst.bio && <p className="text-sm text-gray-500 mt-3">{inst.bio}</p>}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star className="h-4 w-4 text-accent" />
                          {inst.students_count ?? 0} students
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => startEdit(inst)}>
                            <Save className="mr-1 h-3 w-3" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteInstructor(inst.id)}>
                            <Trash2 className="mr-1 h-3 w-3 text-red-500" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
