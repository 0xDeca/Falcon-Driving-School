"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/sidebar";
import { Download, TrendingUp, Users, DollarSign, Calendar, Award, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminReports() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [paymentsRes, studentsRes, lessonsRes] = await Promise.all([
        supabase.from("payments").select("amount, created_at, status").eq("status", "completed"),
        supabase.from("students").select("created_at"),
        supabase.from("lessons").select("id", { count: "exact" }),
      ]);

      const payments = paymentsRes.data ?? [];
      const students = studentsRes.data ?? [];
      const totalLessons = lessonsRes.count ?? 0;

      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const now = new Date();
      const data = months.slice(0, now.getMonth() + 1).map((month, i) => {
        const monthPayments = payments.filter((p: any) => {
          const d = new Date(p.created_at);
          return d.getMonth() === i && d.getFullYear() === now.getFullYear();
        });
        const revenue = monthPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        const monthStudents = students.filter((s: any) => {
          const d = new Date(s.created_at);
          return d.getMonth() === i && d.getFullYear() === now.getFullYear();
        });
        return {
          month,
          revenue,
          students: monthStudents.length,
          lessons: Math.round(totalLessons / (now.getMonth() + 1)),
        };
      });

      setMonthlyData(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalStudents = monthlyData.reduce((sum, m) => sum + m.students, 0);
  const totalLessons = monthlyData.reduce((sum, m) => sum + m.lessons, 0);

  const handleExportPDF = () => {
    toast.success("PDF export triggered");
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Reports</h1>
            <Button variant="gold" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                    <p className="text-sm text-gray-500">YTD Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{totalStudents}</p>
                    <p className="text-sm text-gray-500">New Students (YTD)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{totalLessons}</p>
                    <p className="text-sm text-gray-500">Total Lessons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">-</p>
                    <p className="text-sm text-gray-500">Pass Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Monthly Revenue Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Month</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">New Students</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Lessons Conducted</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Avg Per Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">No data available</td>
                      </tr>
                    ) : (
                      monthlyData.map((m, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-primary">{m.month}</td>
                          <td className="py-3 px-4 text-right font-bold">{formatCurrency(m.revenue)}</td>
                          <td className="py-3 px-4 text-right text-gray-600">{m.students}</td>
                          <td className="py-3 px-4 text-right text-gray-600">{m.lessons}</td>
                          <td className="py-3 px-4 text-right text-gray-600">
                            {m.students > 0 ? formatCurrency(Math.round(m.revenue / m.students)) : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-4 text-primary">Total</td>
                      <td className="py-3 px-4 text-right text-primary">{formatCurrency(totalRevenue)}</td>
                      <td className="py-3 px-4 text-right text-primary">{totalStudents}</td>
                      <td className="py-3 px-4 text-right text-primary">{totalLessons}</td>
                      <td className="py-3 px-4 text-right text-primary">
                        {totalStudents > 0 ? formatCurrency(Math.round(totalRevenue / totalStudents)) : "N/A"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
