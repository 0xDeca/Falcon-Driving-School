"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CheckCircle, XCircle, Clock, ExternalLink, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminDrivingLicenses() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchLicenses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("driving_licenses")
      .select("*, students!inner(*, users(*))")
      .order("uploaded_at", { ascending: false });
    setLicenses(data ?? []);
    setLoading(false);
  };

  useState(() => { fetchLicenses(); });

  const verifyLicense = async (id: string, status: "verified" | "rejected") => {
    try {
      const { error } = await supabase
        .from("driving_licenses")
        .update({
          status,
          admin_notes: adminNotes || null,
          verified_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      toast.success(`License ${status}`);
      setSelected(null);
      setAdminNotes("");
      fetchLicenses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const filtered = licenses.filter((l: any) =>
    l.students?.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.students?.users?.email?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary">Driving Licenses</h1>
              <p className="text-sm text-gray-500 mt-1">{licenses.length} total submissions</p>
            </div>
          </div>

          {selected && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-primary">
                      {selected.students?.users?.name || selected.students?.users?.email}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted {new Date(selected.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      selected.status === "verified" ? "success" :
                      selected.status === "rejected" ? "destructive" : "warning"
                    }
                  >
                    {selected.status}
                  </Badge>
                </div>

                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={selected.image_url}
                    alt="Driving License"
                    className="w-full object-contain max-h-96"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Admin Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Optional notes about this license..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="gold"
                    onClick={() => verifyLicense(selected.id, "verified")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => verifyLicense(selected.id, "rejected")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button variant="ghost" onClick={() => { setSelected(null); setAdminNotes(""); }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <div className="p-4 border-b">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name or email..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Uploaded</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={4} className="py-8 text-center text-gray-400">No license submissions</td></tr>
                  ) : (
                    filtered.map((l: any) => (
                      <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium">{l.students?.users?.name || l.students?.users?.email?.split("@")[0]}</span>
                          <span className="text-gray-400 ml-2">{l.students?.users?.email}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(l.uploaded_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              l.status === "verified" ? "success" :
                              l.status === "rejected" ? "destructive" : "warning"
                            }
                          >
                            {l.status === "pending" && <Clock className="h-3 w-3 mr-1 inline" />}
                            {l.status === "verified" && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                            {l.status === "rejected" && <XCircle className="h-3 w-3 mr-1 inline" />}
                            {l.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => { setSelected(l); setAdminNotes(l.admin_notes || ""); }}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
