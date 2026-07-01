"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Password reset email sent!");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span className="text-xl font-bold text-accent">F</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Reset Password
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {sent
              ? "Check your email for reset instructions"
              : "Enter your email to receive reset instructions"}
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Mail className="h-12 w-12 text-accent" />
              </div>
              <p className="text-gray-600">
                We&apos;ve sent a password reset link to{" "}
                <strong className="text-primary">{email}</strong>
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="text-center text-sm text-gray-500">
                <Link href="/auth/login" className="text-accent hover:text-accent/80">
                  <ArrowLeft className="inline h-3 w-3 mr-1" /> Back to Sign In
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
