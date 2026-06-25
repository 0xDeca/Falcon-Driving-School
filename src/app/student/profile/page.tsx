"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/sidebar";
import { User, Camera, Save, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function StudentProfile() {
  const { user, profile, loading: userLoading, refresh } = useUser();
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: (profile as any)?.full_name || user?.email?.split("@")[0] || "Student",
        email: user?.email || "",
        phone: (profile as any)?.phone || "",
        address: (profile as any)?.address || "",
      });
    }
  }, [user, profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const studentId = (profile as any)?.id;
      if (studentId) {
        const { error: studentError } = await supabase
          .from("students")
          .update({
            phone: profileData.phone,
            address: profileData.address,
          })
          .eq("id", studentId);
        if (studentError) throw studentError;
      }
      toast.success("Profile updated successfully!");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) {
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
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            My Profile
          </h1>

          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
                    <User className="h-10 w-10 text-accent" />
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-primary">
                  {profileData.fullName}
                </h2>
                <p className="text-sm text-gray-500">Student</p>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input value={profileData.email} disabled />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <Input
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="gold"
                  className="w-full mt-4"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
