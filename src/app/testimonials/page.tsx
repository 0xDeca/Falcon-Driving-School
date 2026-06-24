import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { TESTIMONIALS_DATA } from "@/types";

export const metadata: Metadata = {
  title: "Testimonials - Falcon Driving School",
  description: "Read what our students say about their experience at Falcon Driving School.",
};

export default function TestimonialsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Testimonials</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Hear from our graduates about their journey with Falcon Driving School
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <Card key={testimonial.id} className="group hover:shadow-lg transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                      <span className="text-xl font-bold text-accent">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-center italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="text-center">
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.course}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Join Our Successful Students</h2>
          <p className="text-gray-300">Start your driving journey with Falcon Driving School today.</p>
          <Link href="/auth/register">
            <Button variant="gold" size="xl" className="text-base">Enroll Now</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
