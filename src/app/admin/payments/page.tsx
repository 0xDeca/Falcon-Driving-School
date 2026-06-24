"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { CreditCard, Download, Search, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const transactions = [
  { id: "TXN-1234567890", student: "John Doe", amount: 150000, method: "OPay", status: "completed" as const, date: "2025-12-19", reference: "PAY-001" },
  { id: "TXN-0987654321", student: "Sarah Smith", amount: 180000, method: "Card", status: "completed" as const, date: "2025-12-18", reference: "PAY-002" },
  { id: "TXN-1122334455", student: "Mike Johnson", amount: 120000, method: "Bank Transfer", status: "pending" as const, date: "2025-12-17", reference: "PAY-003" },
  { id: "TXN-5544332211", student: "Jane Ade", amount: 90000, method: "OPay", status: "refunded" as const, date: "2025-12-16", reference: "PAY-004" },
];

export default function AdminPayments() {
  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">Payment Management</h1>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-primary">{transactions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{transactions.filter(t => t.status === "pending").length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500">Refunded</p>
                <p className="text-2xl font-bold text-red-600">{transactions.filter(t => t.status === "refunded").length}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Transaction ID</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Method</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-xs font-mono text-gray-600">{tx.id}</td>
                      <td className="py-3 px-4 font-medium text-primary">{tx.student}</td>
                      <td className="py-3 px-4 font-bold">{formatCurrency(tx.amount)}</td>
                      <td className="py-3 px-4 text-gray-600">{tx.method}</td>
                      <td className="py-3 px-4">
                        <Badge variant={tx.status === "completed" ? "success" : tx.status === "pending" ? "warning" : "destructive"}>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{tx.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {tx.status === "pending" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          {tx.status === "completed" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RotateCcw className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
