"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { BookOpen, Plus, Edit2, Archive, DollarSign, Clock, Loader2, Save, X, Tag, Trash2, Check, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAdminCourses } from "@/hooks/use-admin-data";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const EMPTY_COURSE = { name: "", description: "", duration: "", duration_hours: 0, price: 0, requirements: "" };
const EMPTY_COUPON = { code: "", description: "", discount_type: "percentage", discount_value: 0, max_uses: 0, min_amount: 0, expires_at: "", course_id: "" };

export default function AdminCourses() {
  const { courses, loading, refetch } = useAdminCourses();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [editForm, setEditForm] = useState<any>({});
  const [showCouponForm, setShowCouponForm] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON);

  const fetchCoupons = useCallback(async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data ?? []);
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const saveCourse = async () => {
    try {
      const { error } = await supabase.from("courses").insert([{ ...courseForm, status: "active" }]);
      if (error) throw error;
      toast.success("Course created");
      setShowAddForm(false);
      setCourseForm(EMPTY_COURSE);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const startEdit = (course: any) => {
    setEditing(course.id);
    setEditForm({ ...course });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const { error } = await supabase.from("courses").update(editForm).eq("id", editing);
      if (error) throw error;
      toast.success("Course updated");
      setEditing(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({});
  };

  const archiveCourse = async (id: string) => {
    try {
      const { error } = await supabase.from("courses").update({ archived: true }).eq("id", id);
      if (error) throw error;
      toast.success("Course archived");
      refetch();
    } catch { toast.error("Failed to archive"); }
  };

  const saveCoupon = async () => {
    try {
      const { error } = await supabase.from("coupons").insert([{
        ...couponForm,
        max_uses: couponForm.max_uses || null,
        min_amount: couponForm.min_amount || null,
        expires_at: couponForm.expires_at || null,
      }]);
      if (error) throw error;
      toast.success("Coupon created");
      setShowCouponForm(null);
      setCouponForm(EMPTY_COUPON);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "Failed to create coupon");
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch { toast.error("Failed to delete"); }
  };

  const toggleCoupon = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase.from("coupons").update({ is_active: active }).eq("id", id);
      if (error) throw error;
      fetchCoupons();
    } catch { toast.error("Failed to toggle"); }
  };

  const courseCoupons = (courseId: string) => coupons.filter((c: any) => c.course_id === courseId || !c.course_id);

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
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary">Course Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage courses, prices, and discount coupons</p>
            </div>
            <Button variant="gold" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader><CardTitle className="text-lg">New Course</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Course Name</Label>
                      <Input value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration Label</Label>
                      <Input placeholder="e.g. 6 weeks" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (Hours)</Label>
                      <Input type="number" value={courseForm.duration_hours || ""} onChange={(e) => setCourseForm({ ...courseForm, duration_hours: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (NGN)</Label>
                      <Input type="number" value={courseForm.price || ""} onChange={(e) => setCourseForm({ ...courseForm, price: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <Textarea rows={2} value={courseForm.requirements} onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })} />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gold" onClick={saveCourse}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-1 gap-6">
            {courses.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No courses found</div>
            ) : (
              courses.map((course: any) => (
                <Card key={course.id}>
                  {editing === course.id ? (
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">Editing: {course.name}</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="gold" onClick={saveEdit}><Save className="mr-1 h-4 w-4" /> Save</Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}><X className="mr-1 h-4 w-4" /> Cancel</Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration Label</Label>
                          <Input value={editForm.duration || ""} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Hours</Label>
                          <Input type="number" value={editForm.duration_hours || ""} onChange={(e) => setEditForm({ ...editForm, duration_hours: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Price (NGN)</Label>
                          <Input type="number" value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Archived</Label>
                          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={editForm.archived ? "true" : "false"} onChange={(e) => setEditForm({ ...editForm, archived: e.target.value === "true" })}>
                            <option value="false">Active</option>
                            <option value="true">Archived</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea rows={2} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Requirements</Label>
                        <Textarea rows={2} value={editForm.requirements || ""} onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })} />
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                            <BookOpen className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary">{course.name}</h3>
                            <p className="text-xs text-gray-500">{course.duration} &middot; {course.duration_hours}h</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-accent">{formatCurrency(course.price)}</span>
                          <Badge variant={course.archived ? "secondary" : "success"}>{course.archived ? "archived" : "active"}</Badge>
                        </div>
                      </div>

                      {course.description && (
                        <p className="text-sm text-gray-600">{course.description}</p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(course)}>
                          <Edit2 className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setShowCouponForm(showCouponForm === course.id ? null : course.id); setCouponForm({ ...EMPTY_COUPON, course_id: course.id }); }}>
                          <Tag className="mr-1 h-4 w-4" /> Coupons
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => archiveCourse(course.id)} disabled={course.archived}>
                          <Archive className="mr-1 h-4 w-4" /> Archive
                        </Button>
                      </div>

                      {showCouponForm === course.id && (
                        <div className="border-t pt-4 mt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold flex items-center gap-1">
                              <Tag className="h-4 w-4" /> Coupons
                            </h4>
                          </div>

                          {courseCoupons(course.id).length > 0 && (
                            <div className="space-y-2">
                              {courseCoupons(course.id).map((c: any) => (
                                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-sm">{c.code}</span>
                                      <Badge variant={c.discount_type === "percentage" ? "warning" : "default"}>
                                        {c.discount_type === "percentage" ? `${c.discount_value}%` : formatCurrency(c.discount_value)} off
                                      </Badge>
                                      <Badge variant={c.is_active ? "success" : "secondary"}>{c.is_active ? "active" : "disabled"}</Badge>
                                    </div>
                                    {c.description && <p className="text-xs text-gray-500 mt-1">{c.description}</p>}
                                    <div className="text-xs text-gray-400 mt-1">
                                      Used {c.current_uses}/{c.max_uses || "∞"} &middot;
                                      {c.expires_at ? ` Expires ${new Date(c.expires_at).toLocaleDateString()}` : " No expiry"}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => toggleCoupon(c.id, !c.is_active)} className="p-1.5 rounded hover:bg-gray-200 text-gray-500">
                                      {c.is_active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4 text-green-600" />}
                                    </button>
                                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded hover:bg-red-100 text-red-500">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="border rounded-lg p-4 bg-white space-y-3">
                            <h5 className="text-sm font-medium">New Coupon</h5>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Code</Label>
                                <Input placeholder="e.g. SAVE10" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Type</Label>
                                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={couponForm.discount_type} onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}>
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="fixed">Fixed (NGN)</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Value</Label>
                                <Input type="number" value={couponForm.discount_value || ""} onChange={(e) => setCouponForm({ ...couponForm, discount_value: parseFloat(e.target.value) || 0 })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Max Uses</Label>
                                <Input type="number" placeholder="Unlimited" value={couponForm.max_uses || ""} onChange={(e) => setCouponForm({ ...couponForm, max_uses: parseInt(e.target.value) || 0 })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Expires</Label>
                                <Input type="date" value={couponForm.expires_at?.split("T")[0] || ""} onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value ? new Date(e.target.value).toISOString() : "" })} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Description (optional)</Label>
                              <Input value={couponForm.description} onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })} />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="gold" onClick={saveCoupon} disabled={!couponForm.code || !couponForm.discount_value}>
                                <Plus className="mr-1 h-4 w-4" /> Add Coupon
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setShowCouponForm(null)}>Close</Button>
                            </div>
                          </div>
                        </div>
                      )}
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
