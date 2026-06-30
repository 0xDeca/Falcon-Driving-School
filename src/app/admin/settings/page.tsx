"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/layout/sidebar";
import { Settings, Save, Bell, Shield, DollarSign, Loader2, Database } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const DEFAULT_SETTINGS = {
  school_name: "Falcon Driving School",
  email: "info@falcondrivingschool.com",
  phone: "0800 000 0000",
  address: "123 Ibrahim Babangida Way, Abuja, Nigeria",
  currency: "NGN",
  lesson_reminder_hours: "24",
  cancellation_notice: "24",
};

function SeedDataButton() {
  const [seeding, setSeeding] = useState(false);
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed-data", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Seed failed");
      toast.success(`Seeded ${json.created?.courses ?? 0} courses, ${json.created?.vehicles ?? 0} vehicles`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSeeding(false);
    }
  };
  return (
    <Button variant="outline" onClick={handleSeed} disabled={seeding}>
      <Database className="mr-2 h-4 w-4" /> {seeding ? "Seeding..." : "Seed Courses & Vehicles"}
    </Button>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from("settings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (data) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch { /* use defaults */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .limit(1)
        .maybeSingle();
      const settingsId = existing?.id ?? crypto.randomUUID();
      const { error } = await supabase
        .from("settings")
        .upsert({ id: settingsId, ...settings, updated_at: new Date().toISOString() });
      if (error) throw error;
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
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
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-accent" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={settings.school_name} onChange={(e) => setSettings({ ...settings, school_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <select className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lesson Reminder (hours before)</Label>
                  <Input type="number" value={settings.lesson_reminder_hours} onChange={(e) => setSettings({ ...settings, lesson_reminder_hours: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Cancellation Notice (hours)</Label>
                  <Input type="number" value={settings.cancellation_notice} onChange={(e) => setSettings({ ...settings, cancellation_notice: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="gold" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save All Settings"}
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-accent" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Populate courses and vehicles from the landing page data. This is safe to re-run &mdash; existing data won&apos;t be duplicated.</p>
              <SeedDataButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
