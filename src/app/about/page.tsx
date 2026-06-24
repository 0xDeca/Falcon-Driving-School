import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Eye, Target, Heart, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Falcon Driving School",
  description: "Learn about Falcon Driving School's history, mission, and commitment to producing safe, confident drivers in Nigeria.",
};

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every lesson emphasizes safety protocols and defensive driving techniques.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards of instruction and customer service.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear communication, honest feedback, and no hidden fees.",
  },
  {
    icon: Target,
    title: "Precision",
    description: "Structured curriculum designed for optimal learning outcomes.",
  },
  {
    icon: Heart,
    title: "Patience",
    description: "Our instructors are trained to work with students of all skill levels.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a community of safe, responsible drivers across Nigeria.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Falcon Driving School</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Nigeria&apos;s most trusted driving school, committed to producing safe and confident drivers since 2014.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2014, Falcon Driving School began with a simple mission: to reduce road accidents in Nigeria
                through quality driver education. What started as a small operation with two instructors has grown into
                one of Nigeria&apos;s premier driving schools, with a fleet of modern vehicles and a team of certified
                professionals.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Over the past decade, we have trained over 5,000 students, achieving a remarkable 98% pass rate.
                Our commitment to excellence and student success has earned us a reputation as the driving school
                of choice for individuals and corporations alike.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center">
              <Award className="h-20 w-20 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
              <p className="text-gray-600">
                To provide accessible, high-quality driver education that empowers individuals with the
                skills, knowledge, and confidence to navigate roads safely and responsibly.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Our Vision</h2>
              <p className="text-gray-600">
                To be Nigeria&apos;s benchmark for driver education, creating a generation of defensive,
                courteous, and skilled drivers who contribute to safer roads for everyone.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Card key={i}>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-primary text-lg">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Ready to Join Us?</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Take the first step towards becoming a confident, skilled driver.
          </p>
          <Link href="/auth/register">
            <Button variant="gold" size="xl" className="text-base">Enroll Now</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
