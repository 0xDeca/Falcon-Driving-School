"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Award, Download, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const certificates = [
  {
    id: "CERT-001",
    number: "FDS-2025-ABC123",
    course: "Automatic Driving Lessons",
    status: "approved" as const,
    completionDate: "2025-12-20",
    generatedAt: "2025-12-22",
  },
  {
    id: "CERT-002",
    number: "FDS-2025-DEF456",
    course: "Defensive Driving",
    status: "pending" as const,
    completionDate: null,
    generatedAt: null,
  },
];

const statusConfig = {
  in_progress: { label: "In Progress", variant: "warning" as const },
  pending: { label: "Pending Approval", variant: "warning" as const },
  approved: { label: "Approved", variant: "success" as const },
  rejected: { label: "Rejected", variant: "destructive" as const },
};

export default function StudentCertificates() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            My Certificates
          </h1>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">2</p>
                <p className="text-sm text-gray-500">Total Courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">1</p>
                <p className="text-sm text-gray-500">Certificates Earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">1</p>
                <p className="text-sm text-gray-500">Pending Approval</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {certificates.map((cert) => {
              const status = statusConfig[cert.status];
              return (
                <Card key={cert.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                          <Award className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">
                            {cert.course}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Certificate #: {cert.number}
                          </p>
                          {cert.completionDate && (
                            <p className="text-xs text-gray-400">
                              Completed: {formatDate(cert.completionDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {cert.status === "approved" && (
                          <Button variant="gold" size="sm">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
