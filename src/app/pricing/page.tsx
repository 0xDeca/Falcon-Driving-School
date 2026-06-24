import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COURSES_DATA } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, CreditCard, Banknote, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing - Falcon Driving School",
  description: "Compare our driving course packages and pricing. Flexible payment options including OPay, bank transfer, and card payments.",
};

const paymentMethods = [
  { icon: CreditCard, name: "Debit/Credit Cards", description: "Visa, Mastercard" },
  { icon: Smartphone, name: "OPay", description: "Instant transfer" },
  { icon: Banknote, name: "Bank Transfer", description: "Direct deposit" },
  { icon: Banknote, name: "Cash", description: "At our office" },
];

export default function PricingPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Pricing</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Transparent pricing with no hidden fees. Quality driver education at affordable rates.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-4 px-4 text-primary font-semibold">Program</th>
                  <th className="text-center py-4 px-4 text-primary font-semibold">Duration</th>
                  <th className="text-center py-4 px-4 text-primary font-semibold">Hours</th>
                  <th className="text-center py-4 px-4 text-primary font-semibold">Price</th>
                  <th className="text-center py-4 px-4 text-primary font-semibold">Installment</th>
                  <th className="text-center py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {COURSES_DATA.map((course, i) => (
                  <tr key={course.id} className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="py-4 px-4 font-medium text-primary">{course.name}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{course.duration}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{course.duration_hours}h</td>
                    <td className="py-4 px-4 text-center font-bold text-accent">{formatCurrency(course.price)}</td>
                    <td className="py-4 px-4 text-center text-gray-600">
                      From {formatCurrency(Math.round(course.price * 0.3))}/mo
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link href="/auth/register">
                        <Button variant="gold" size="sm">Enroll</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Payment Methods</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <Card key={i}>
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-primary">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-12 text-center space-y-4">
            <h3 className="text-xl font-semibold text-primary">Flexible Payment Plans</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer installment payment plans for most courses. Pay as low as 30% upfront and spread the
              remaining balance across your training period. Contact us for details.
            </p>
            <Link href="/contact">
              <Button variant="outline">Learn About Payment Plans</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-gray-300">Enroll today and take the first step toward becoming a confident driver.</p>
          <Link href="/auth/register">
            <Button variant="gold" size="xl" className="text-base">Enroll Now</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
