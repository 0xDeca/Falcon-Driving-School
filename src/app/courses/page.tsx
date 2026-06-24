import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { COURSES_DATA } from "@/types";
import { formatCurrency, truncateText } from "@/lib/utils";
import { Car, Shield, RefreshCw, Building2, FileCheck, Clock, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Driving Courses - Falcon Driving School",
  description: "Explore our comprehensive driving programs including automatic, manual, defensive driving, refresher courses, corporate training, and license assistance.",
};

const iconMap: Record<string, React.ElementType> = {
  Car, Shield, RefreshCw, Building2, FileCheck,
};

export default function CoursesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Driving Programs</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Comprehensive training programs designed for every skill level and need
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COURSES_DATA.map((course) => {
              const Icon = iconMap[course.icon] || Car;
              return (
                <Card key={course.id} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="text-gray-600">Duration: <strong>{course.duration}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-accent" />
                        <span className="text-gray-600">Requirements: {truncateText(course.requirements, 60)}</span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      {course.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-2xl font-bold text-accent">{formatCurrency(course.price)}</span>
                      <Link href="/auth/register">
                        <Button variant="gold">Enroll Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Not Sure Which Course is Right for You?</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Contact us for a free consultation and we&apos;ll help you choose the perfect program.
          </p>
          <Link href="/contact">
            <Button variant="gold" size="xl" className="text-base">Contact Us</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
