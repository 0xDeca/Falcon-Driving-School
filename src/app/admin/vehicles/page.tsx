"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Car, Plus, Edit, Loader2 } from "lucide-react";
import { useAdminVehicles } from "@/hooks/use-admin-data";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminVehicles() {
  const { vehicles, loading } = useAdminVehicles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    model: "",
    plate_number: "",
    transmission_type: "automatic",
    status: "available",
    insurance_expiry: "",
    maintenance_schedule: "",
  });

  const handleSave = async () => {
    try {
      await supabase.from("vehicles").insert([{
        name: form.name,
        model: form.model,
        plate_number: form.plate_number,
        transmission_type: form.transmission_type,
        status: form.status,
        insurance_expiry: form.insurance_expiry || null,
        maintenance_schedule: form.maintenance_schedule,
      }]);
      toast.success("Vehicle saved");
      setShowAddForm(false);
      setForm({ name: "", model: "", plate_number: "", transmission_type: "automatic", status: "available", insurance_expiry: "", maintenance_schedule: "" });
    } catch {
      toast.error("Failed to save vehicle");
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Vehicle Management</h1>
            <Button variant="gold" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle Name</Label>
                      <Input placeholder="e.g., Toyota Corolla" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Model Year</Label>
                      <Input placeholder="e.g., 2023" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Plate Number</Label>
                      <Input placeholder="e.g., ABC-123XY" value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Transmission</Label>
                      <select className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm" value={form.transmission_type} onChange={(e) => setForm({ ...form, transmission_type: e.target.value })}>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Insurance Expiry</Label>
                      <Input type="date" value={form.insurance_expiry} onChange={(e) => setForm({ ...form, insurance_expiry: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="available">Available</option>
                        <option value="maintenance">In Maintenance</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance Schedule</Label>
                    <Input placeholder="e.g., Every 5000 km" value={form.maintenance_schedule} onChange={(e) => setForm({ ...form, maintenance_schedule: e.target.value })} />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gold" onClick={handleSave}>Save Vehicle</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {vehicles.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400 py-8">No vehicles found</div>
            ) : (
              vehicles.map((vehicle: any) => (
                <Card key={vehicle.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                          <Car className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">{vehicle.name}</h3>
                          <p className="text-sm text-gray-500">{vehicle.plate_number}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{vehicle.transmission_type}</Badge>
                            <Badge variant="outline" className="text-xs">{vehicle.model}</Badge>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          vehicle.status === "available" ? "success" :
                          vehicle.status === "maintenance" ? "warning" : "destructive"
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Insurance: {vehicle.insurance_expiry ?? "N/A"}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit</Button>
                      </div>
                    </div>
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
