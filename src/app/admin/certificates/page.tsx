"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Award, CheckCircle, XCircle, Download, Eye } from "lucide-react";

export default function AdminCertificates() {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  const pendingCerts = [
    { id: 1, student: "John Doe", course: "Automatic Driving", instructor: "Adebayo Ogunlesi", date: "2025-12-18", lessonsCompleted: 24, avgScore: 85 },
    { id: 2, student: "Jane Ade", course: "Defensive Driving", instructor: "Chidi Okonkwo", date: "2025-12-17", lessonsCompleted: 16, avgScore: 78 },
    { id: 3, student: "Paul Eze", course: "Manual Driving", instructor: "Ngozi Eze", date: "2025-12-15", lessonsCompleted: 32, avgScore: 82 },
  ];

  const handleApprove = (id: number) => {
    // Will integrate with Supabase + PDF generation
    alert(`Certificate ${id} approved! PDF will be generated.`);
  };

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
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-sm text-gray-500">Approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-sm text-gray-500">Rejected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">17</p>
                <p className="text-sm text-gray-500">Total Issued</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {pendingCerts.map((cert) => (
              <Card key={cert.id} className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{cert.student}</h3>
                        <p className="text-sm text-gray-500">{cert.course}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                          <span>Instructor: {cert.instructor}</span>
                          <span>Lessons: {cert.lessonsCompleted}</span>
                          <span>Avg Score: {cert.avgScore}%</span>
                          <span>Date: {cert.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" /> Review
                      </Button>
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => handleApprove(cert.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button variant="destructive" size="sm">
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
                            <p className="text-gray-500">Attendance Rate: <strong>95%</strong></p>
                            <p className="text-gray-500">All Evaluations Completed: <strong>Yes</strong></p>
                          </div>
                          <div>
                            <p className="text-gray-500">Instructor Recommendation: <strong>Recommended</strong></p>
                            <p className="text-gray-500">Payment Status: <strong>Completed</strong></p>
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
                        <Button variant="destructive" size="sm">
                          <XCircle className="mr-1 h-4 w-4" /> Reject with Comments
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
