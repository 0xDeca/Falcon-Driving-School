"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Car, Plus, Edit, Wrench } from "lucide-react";

export default function AdminVehicles() {
  const [showAddForm, setShowAddForm] = useState(false);

  const vehicles = [
    { id: 1, name: "Toyota Corolla", model: "2023", plateNumber: "ABC-123XY", transmission: "Automatic", status: "available" as const, insuranceExpiry: "2026-06-30" },
    { id: 2, name: "Honda Civic", model: "2023", plateNumber: "DEF-456XY", transmission: "Manual", status: "available" as const, insuranceExpiry: "2026-06-30" },
    { id: 3, name: "Toyota Camry", model: "2022", plateNumber: "GHI-789XY", transmission: "Automatic", status: "maintenance" as const, insuranceExpiry: "2026-03-15" },
    { id: 4, name: "Mazda 3", model: "2023", plateNumber: "JKL-012XY", transmission: "Manual", status: "available" as const, insuranceExpiry: "2026-09-20" },
  ];

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
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle Name</Label>
                      <Input placeholder="e.g., Toyota Corolla" />
                    </div>
                    <div className="space-y-2">
                      <Label>Model Year</Label>
                      <Input placeholder="e.g., 2023" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Plate Number</Label>
                      <Input placeholder="e.g., ABC-123XY" />
                    </div>
                    <div className="space-y-2">
                      <Label>Transmission</Label>
                      <select className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm">
                        <option>Automatic</option>
                        <option>Manual</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Insurance Expiry</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm">
                        <option>Available</option>
                        <option>In Maintenance</option>
                        <option>Retired</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance Schedule</Label>
                    <Input placeholder="e.g., Every 5000 km" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gold">Save Vehicle</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Car className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{vehicle.name}</h3>
                        <p className="text-sm text-gray-500">{vehicle.plateNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{vehicle.transmission}</Badge>
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
                    <span className="text-xs text-gray-500">Insurance: {vehicle.insuranceExpiry}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
