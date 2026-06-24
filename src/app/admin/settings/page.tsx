"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/layout/sidebar";
import { Settings, Save, Bell, Shield, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    schoolName: "Falcon Driving School",
    email: "info@falcondrivingschool.com",
    phone: "0800 000 0000",
    address: "123 Ibrahim Babangida Way, Abuja, Nigeria",
    currency: "NGN",
    lessonReminderHours: "24",
    cancellationNotice: "24",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

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
                  <Input value={settings.schoolName} onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })} />
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
                  <Input type="number" value={settings.lessonReminderHours} onChange={(e) => setSettings({ ...settings, lessonReminderHours: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Cancellation Notice (hours)</Label>
                  <Input type="number" value={settings.cancellationNotice} onChange={(e) => setSettings({ ...settings, cancellationNotice: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="gold" size="lg" className="w-full" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
