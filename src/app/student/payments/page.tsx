"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { CreditCard, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

const paymentHistory = [
  {
    id: "PAY-001",
    transactionId: "TXN-1234567890",
    amount: 150000,
    currency: "NGN",
    method: "OPay Transfer",
    status: "completed" as const,
    date: "2025-12-01",
  },
  {
    id: "PAY-002",
    transactionId: "TXN-0987654321",
    amount: 30000,
    currency: "NGN",
    method: "Bank Transfer",
    status: "completed" as const,
    date: "2025-11-15",
  },
  {
    id: "PAY-003",
    transactionId: "TXN-1122334455",
    amount: 50000,
    currency: "NGN",
    method: "Debit Card",
    status: "pending" as const,
    date: "2025-12-19",
  },
];

export default function StudentPayments() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            Payments
          </h1>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(180000)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Outstanding</p>
                <p className="text-2xl font-bold text-accent">
                  {formatCurrency(50000)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <Badge variant="success" className="text-sm">Good Standing</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                Make a Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-primary">OPay Transfer</h3>
                  <p className="text-sm text-gray-500">
                    Account: Falcon Driving School
                  </p>
                  <p className="text-sm text-gray-500">
                    Account Number: 1234567890
                  </p>
                  <p className="text-sm text-gray-500">Bank: OPay</p>
                </div>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-primary">Card Payment</h3>
                  <p className="text-sm text-gray-500">
                    Pay securely with your debit or credit card
                  </p>
                  <Button variant="gold" className="w-full">
                    Pay with Card
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          payment.status === "completed"
                            ? "bg-green-100"
                            : payment.status === "pending"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                        }`}
                      >
                        {payment.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : payment.status === "pending" ? (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.method} - {payment.transactionId}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(payment.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "success"
                            : payment.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                      {payment.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
