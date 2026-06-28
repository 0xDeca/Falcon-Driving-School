"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Award, Download, FileText, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useStudentCertificates } from "@/hooks/use-certificates";
import jsPDF from "jspdf";

const statusConfig: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "secondary" }> = {
  pending: { label: "Pending Approval", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const downloadPDF = async (cert: any) => {
  const doc = new jsPDF();
  doc.setFontSize(24);
  doc.text("CERTIFICATE OF COMPLETION", 105, 40, { align: "center" });
  doc.setFontSize(16);
  doc.text("Falcon Driving School", 105, 60, { align: "center" });
  doc.setFontSize(14);
  doc.text("This certifies that", 105, 85, { align: "center" });
  doc.setFontSize(18);
  doc.text(cert.students?.full_name ?? cert.students?.users?.email ?? "Student", 105, 100, { align: "center" });
  doc.setFontSize(14);
  doc.text("has successfully completed the", 105, 115, { align: "center" });
  doc.text(cert.courses?.name || "Course", 105, 130, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Certificate #: ${cert.certificate_number}`, 105, 155, { align: "center" });
  doc.text(`Date: ${new Date(cert.completion_date).toLocaleDateString()}`, 105, 165, { align: "center" });
  doc.text("Falcon Driving School - Abuja, Nigeria", 105, 185, { align: "center" });
  doc.save(`certificate-${cert.certificate_number}.pdf`);
};

export default function StudentCertificates() {
  const { certificates, recommendations, loading, approved, pending } = useStudentCertificates();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const allItems = [
    ...certificates.map((c: any) => ({
      id: c.id,
      number: c.certificate_number,
      course: c.courses?.name || "Course",
      status: "approved" as const,
      completionDate: c.completion_date,
      generatedAt: c.generated_at,
      raw: c,
    })),
    ...recommendations
      .filter((r: any) => r.status !== "approved")
      .map((r: any) => ({
        id: r.id,
        number: "",
        course: "Course",
        status: r.status as "pending" | "rejected",
        completionDate: null,
        generatedAt: null,
        raw: null,
      })),
  ];

  const handleDownload = async (cert: any) => {
    setDownloadingId(cert.id);
    try {
      downloadPDF(cert.raw);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-primary">{allItems.length}</p>
                <p className="text-sm text-gray-500">Total Courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{approved}</p>
                <p className="text-sm text-gray-500">Certificates Earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{pending}</p>
                <p className="text-sm text-gray-500">Pending Approval</p>
              </CardContent>
            </Card>
          </div>

          {allItems.length > 0 ? (
            <div className="space-y-4">
              {allItems.map((cert: any) => {
                const status = (statusConfig[cert.status as keyof typeof statusConfig] || statusConfig.pending)!;
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
                              Certificate #: {cert.number || "N/A"}
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
                            <Button
                              variant="gold"
                              size="sm"
                              onClick={() => handleDownload(cert)}
                              disabled={downloadingId === cert.id}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              {downloadingId === cert.id ? "..." : "Download PDF"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No certificates yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
