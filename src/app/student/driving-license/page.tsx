"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Upload, Loader2, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function StudentDrivingLicense() {
  const { profile, loading: userLoading } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchLicense = useCallback(async () => {
    const studentId = (profile as any)?.id;
    if (!studentId) { setLoading(false); return; }
    const { data } = await supabase
      .from("driving_licenses")
      .select("*")
      .eq("student_id", studentId)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setLicense(data);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    if (profile) fetchLicense();
  }, [profile, fetchLicense]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const studentId = (profile as any)?.id;
    if (!file || !studentId) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `licenses/${studentId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("student-files")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("driving_licenses")
        .insert({ student_id: studentId, image_url: publicUrl });
      if (insertError) throw insertError;

      toast.success("License uploaded for verification");
      fetchLicense();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  if (userLoading || loading) {
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
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">Driving License</h1>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Your Driving License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {license ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">License submitted for verification</span>
                    </div>
                    <Badge
                      variant={
                        license.status === "verified" ? "success" :
                        license.status === "rejected" ? "destructive" : "warning"
                      }
                    >
                      {license.status === "pending" && <Clock className="h-3 w-3 mr-1 inline" />}
                      {license.status === "verified" && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                      {license.status === "rejected" && <XCircle className="h-3 w-3 mr-1 inline" />}
                      {license.status}
                    </Badge>
                  </div>

                  {license.image_url && (
                    <div className="rounded-lg overflow-hidden border">
                      <img
                        src={license.image_url}
                        alt="Driving License"
                        className="w-full object-contain max-h-96"
                      />
                    </div>
                  )}

                  {license.admin_notes && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">Admin Notes:</p>
                      <p className="text-sm text-yellow-700 mt-1">{license.admin_notes}</p>
                    </div>
                  )}

                  {license.status === "rejected" && (
                    <Button variant="gold" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? "Uploading..." : "Re-upload License"}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No driving license uploaded yet.</p>
                  <Button
                    variant="gold"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload License"}
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleUpload}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
