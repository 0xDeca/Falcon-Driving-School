"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { CreditCard, Download, Search, CheckCircle, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminPayments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from("payments")
          .select("*, students!inner(*, users(*))")
          .order("created_at", { ascending: false });
        setTransactions(data ?? []);
      } catch { /* handled */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const totalRevenue = transactions
    .filter((t: any) => t.status === "completed")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const handleApprove = async (id: string) => {
    try {
      await supabase.from("payments").update({ status: "completed" }).eq("id", id);
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
      toast.success("Payment approved");
    } catch {
      toast.error("Failed to approve payment");
    }
  };

  const handleRefund = async (id: string) => {
    if (!confirm("Refund this payment?")) return;
    try {
      await supabase.from("payments").update({ status: "refunded" }).eq("id", id);
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: "refunded" } : t)));
      toast.success("Payment refunded");
    } catch {
      toast.error("Failed to refund payment");
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
                <p className="text-2xl font-bold text-yellow-600">{transactions.filter((t: any) => t.status === "pending").length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500">Refunded</p>
                <p className="text-2xl font-bold text-red-600">{transactions.filter((t: any) => t.status === "refunded").length}</p>
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
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map((tx: any) => (
                      <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-xs font-mono text-gray-600">{tx.id.slice(0, 16)}...</td>
                        <td className="py-3 px-4 font-medium text-primary">{tx.students?.users?.name ?? tx.students?.users?.email?.split("@")[0] ?? "Unknown"}</td>
                        <td className="py-3 px-4 font-bold">{formatCurrency(tx.amount)}</td>
                        <td className="py-3 px-4 text-gray-600">{tx.payment_method}</td>
                        <td className="py-3 px-4">
                          <Badge variant={tx.status === "completed" ? "success" : tx.status === "pending" ? "warning" : "destructive"}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{tx.created_at?.split("T")[0]}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            {tx.status === "pending" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleApprove(tx.id)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {tx.status === "completed" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRefund(tx.id)}>
                                <RotateCcw className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
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
