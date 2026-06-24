import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Car } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Instructors - Falcon Driving School",
  description: "Meet our certified driving instructors with years of experience in driver education and road safety.",
};

const instructors = [
  {
    name: "Adebayo Ogunlesi",
    title: "Chief Instructor",
    experience: "15 years",
    certification: "Certified Driving Instructor (FRSC)",
    specialties: ["Defensive Driving", "Advanced Maneuvers", "Corporate Training"],
    bio: "With over 15 years of experience, Adebayo is our most senior instructor. He has trained hundreds of students and developed our comprehensive curriculum.",
  },
  {
    name: "Ngozi Eze",
    title: "Senior Instructor",
    experience: "10 years",
    certification: "Certified Driving Instructor (FRSC)",
    specialties: ["Automatic Transmission", "Student Confidence", "Road Test Prep"],
    bio: "Ngozi specializes in helping nervous students build confidence behind the wheel. Her patient approach has earned her numerous student referrals.",
  },
  {
    name: "Chidi Okonkwo",
    title: "Instructor",
    experience: "8 years",
    certification: "Certified Driving Instructor (FRSC)",
    specialties: ["Manual Transmission", "Defensive Driving", "Highway Driving"],
    bio: "Chidi is our manual transmission expert. He has a passion for teaching proper clutch control and gear management.",
  },
  {
    name: "Folake Adeleke",
    title: "Instructor",
    experience: "7 years",
    certification: "Certified Driving Instructor (FRSC)",
    specialties: ["Refresher Courses", "Parking Techniques", "Traffic Rules"],
    bio: "Folake excels at refresher courses and helping experienced drivers update their skills. She is known for her clear explanations.",
  },
  {
    name: "Emeka Okafor",
    title: "Instructor",
    experience: "6 years",
    certification: "Certified Driving Instructor (FRSC)",
    specialties: ["Corporate Training", "Fleet Assessment", "Safety Protocols"],
    bio: "Emeka leads our corporate training division, providing fleet driver training for organizations across Nigeria.",
  },
  {
    name: "Zainab Abdullah",
    title: "Instructor",
    experience: "5 years",
    certification: "Certified Driving Instructor (FRSC)",
    specialties: ["Beginner Drivers", "License Assistance", "Road Safety"],
    bio: "Zainab is our dedicated beginner instructor, helping first-time drivers master the basics with patience and expertise.",
  },
];

export default function InstructorsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Instructors</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Meet our team of certified, experienced driving professionals
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, i) => (
              <Card key={i} className="group hover:shadow-lg transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
                      <Car className="h-10 w-10 text-accent" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-primary">{instructor.name}</h3>
                    <p className="text-sm text-accent font-medium">{instructor.title}</p>
                  </div>
                  <div className="flex justify-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-accent" />
                      {instructor.experience}
                    </span>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center">
                    {instructor.certification}
                  </Badge>
                  <p className="text-sm text-gray-600 text-center">{instructor.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {instructor.specialties.map((specialty, j) => (
                      <Badge key={j} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Learn from the Best</h2>
          <p className="text-gray-300">Join Falcon Driving School and get expert instruction from certified professionals.</p>
          <Link href="/auth/register">
            <Button variant="gold" size="xl" className="text-base">Enroll Now</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
