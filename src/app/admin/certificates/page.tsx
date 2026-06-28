"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Award, CheckCircle, XCircle, Download, Eye, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminCertificates() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [pendingCerts, setPendingCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from("certificate_recommendations")
          .select("*, students!inner(*, users!inner(*)), courses(*), instructors!inner(*, users!inner(*))")
          .eq("status", "pending")
          .order("created_at", { ascending: false });
        setPendingCerts(data ?? []);
      } catch { /* handled */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/certificates/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId: id }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      setPendingCerts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Certificate approved");
    } catch {
      toast.error("Failed to approve certificate");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch("/api/certificates/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId: id }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      setPendingCerts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Certificate rejected");
    } catch {
      toast.error("Failed to reject certificate");
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
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">Certification Approval</h1>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-yellow-600">{pendingCerts.length}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-green-600">-</p>
                <p className="text-sm text-gray-500">Approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-red-600">-</p>
                <p className="text-sm text-gray-500">Rejected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">-</p>
                <p className="text-sm text-gray-500">Total Issued</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {pendingCerts.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No pending certificate recommendations</p>
            ) : (
              pendingCerts.map((cert: any) => (
                <Card key={cert.id} className="border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                          <Award className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">{cert.students?.users?.email ?? "Unknown"}</h3>
                          <p className="text-sm text-gray-500">{cert.courses?.name ?? "N/A"}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                            <span>Instructor: {cert.instructors?.users?.email ?? "N/A"}</span>
                            <span>Lessons: {cert.lessons_completed ?? "N/A"}</span>
                            <span>Avg Score: {cert.avg_score ?? "N/A"}%</span>
                            <span>Date: {cert.created_at?.split("T")[0] ?? "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}>
                          <Eye className="mr-1 h-4 w-4" /> Review
                        </Button>
                        <Button variant="gold" size="sm" onClick={() => handleApprove(cert.id)}>
                          <CheckCircle className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(cert.id)}>
                          <XCircle className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>

                    {selectedCert === cert.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-primary mb-2">Review Details</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Attendance Rate: <strong>{cert.attendance_rate ?? "N/A"}%</strong></p>
                              <p className="text-gray-500">All Evaluations Completed: <strong>{cert.evaluations_completed ? "Yes" : "No"}</strong></p>
                            </div>
                            <div>
                              <p className="text-gray-500">Instructor Recommendation: <strong>{cert.instructor_recommendation ?? "Recommended"}</strong></p>
                              <p className="text-gray-500">Payment Status: <strong>{cert.payment_status ?? "Completed"}</strong></p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Admin Comments</label>
                          <Textarea placeholder="Add comments (optional)" rows={2} />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="gold" size="sm" onClick={() => handleApprove(cert.id)}>
                            <CheckCircle className="mr-1 h-4 w-4" /> Confirm Approval
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleReject(cert.id)}>
                            <XCircle className="mr-1 h-4 w-4" /> Reject with Comments
                          </Button>
                        </div>
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
