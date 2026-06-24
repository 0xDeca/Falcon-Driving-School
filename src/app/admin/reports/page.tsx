"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/sidebar";
import { Download, TrendingUp, Users, DollarSign, Calendar, Award } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminReports() {
  const monthlyData = [
    { month: "Jan", revenue: 350000, students: 15, lessons: 120 },
    { month: "Feb", revenue: 420000, students: 18, lessons: 145 },
    { month: "Mar", revenue: 380000, students: 16, lessons: 138 },
    { month: "Apr", revenue: 450000, students: 20, lessons: 160 },
    { month: "May", revenue: 520000, students: 22, lessons: 175 },
    { month: "Jun", revenue: 480000, students: 19, lessons: 155 },
  ];

  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalStudents = monthlyData.reduce((sum, m) => sum + m.students, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Reports</h1>
            <Button variant="gold">
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
                    <p className="text-sm text-gray-500">6-Month Revenue</p>
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
                    <p className="text-sm text-gray-500">New Students (6mo)</p>
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
                    <p className="text-2xl font-bold text-primary">893</p>
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
                    <p className="text-2xl font-bold text-primary">95%</p>
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
                    {monthlyData.map((m, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-primary">{m.month}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatCurrency(m.revenue)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{m.students}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{m.lessons}</td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {formatCurrency(Math.round(m.revenue / m.students))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-4 text-primary">Total</td>
                      <td className="py-3 px-4 text-right text-primary">{formatCurrency(totalRevenue)}</td>
                      <td className="py-3 px-4 text-right text-primary">{totalStudents}</td>
                      <td className="py-3 px-4 text-right text-primary">893</td>
                      <td className="py-3 px-4 text-right text-primary">
                        {formatCurrency(Math.round(totalRevenue / totalStudents))}
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
