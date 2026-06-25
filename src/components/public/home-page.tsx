"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Award,
  Users,
  Car,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { COURSES_DATA, TESTIMONIALS_DATA, FAQ_DATA } from "@/types";
import { formatCurrency, truncateText } from "@/lib/utils";
import toast from "react-hot-toast";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      <div className="absolute inset-0 bg-[url('/images/hero/pattern.svg')] opacity-10" />
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <Badge variant="secondary" className="text-xs uppercase tracking-wider">
              Nigeria&apos;s Trusted Driving School
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Learn to Drive with{" "}
              <span className="text-accent">Confidence</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              Professional driving instruction from certified experts. Master the road
              with Nigeria&apos;s most trusted driving school.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register">
                <Button variant="gold" size="xl" className="text-base">
                  Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  variant="outline"
                  size="xl"
                  className="text-base border-white/30 text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="xl"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-accent/30 flex items-center justify-center">
                  <Car className="h-32 w-32 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Users, value: "5,000+", label: "Students Trained" },
    { icon: Award, value: "98%", label: "Pass Rate" },
    { icon: Car, value: "15+", label: "Training Vehicles" },
    { icon: Shield, value: "10+", label: "Years Experience" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Driving Programs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of driving programs designed for every skill level
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES_DATA.slice(0, 6).map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Car className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-600">{truncateText(course.description, 120)}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-primary">{course.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-bold text-accent">{formatCurrency(course.price)}</p>
                  </div>
                </div>
                <Link href="/auth/register">
                  <Button variant="gold" className="w-full">
                    Enroll Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/courses">
            <Button variant="outline" size="lg">
              View All Programs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Hear from our graduates about their experience at Falcon Driving School
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {TESTIMONIALS_DATA.map((testimonial) => (
                  <div key={testimonial.id} className="min-w-full px-4">
                    <Card className="bg-white/10 border-white/20 text-white">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="flex justify-center gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 fill-accent text-accent"
                            />
                          ))}
                        </div>
                        <p className="text-lg italic text-gray-200">
                          &ldquo;{testimonial.text}&rdquo;
                        </p>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-gray-400">{testimonial.course}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() =>
                setCurrent((prev) =>
                  prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary hover:bg-accent/90"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setCurrent((prev) =>
                  prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary hover:bg-accent/90"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS_DATA.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === current ? "bg-accent w-6" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent! We'll get back to you shortly.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Get In Touch
            </h2>
            <p className="text-gray-600">
              Ready to start your driving journey? Contact us today!
            </p>
            <div className="space-y-4">
              {[
                { icon: Phone, info: "0800 000 0000", sub: "Call us anytime" },
                { icon: Mail, info: "info@falcondrivingschool.com", sub: "Email us" },
                { icon: MapPin, info: "123 Ibrahim Babangida Way, Abuja", sub: "Visit our office" },
                { icon: Clock, info: "Mon-Fri: 7am-6pm, Sat: 8am-4pm", sub: "Office hours" },
              ].map(({ icon: Icon, info, sub }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{info}</p>
                    <p className="text-sm text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                placeholder="0800 000 0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <Textarea
                placeholder="How can we help you?"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Ready to Start Your Driving Journey?
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Join thousands of confident drivers who trusted Falcon Driving School for their training.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/auth/register">
            <Button variant="gold" size="xl" className="text-base">
              Enroll Now
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="xl"
              className="text-base border-white/30 text-white hover:bg-white/10"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CoursesSection />
      <TestimonialsSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
