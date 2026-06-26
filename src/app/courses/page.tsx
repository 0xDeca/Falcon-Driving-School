import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COURSES_DATA } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Car, Clock, CheckCircle, Banknote, CreditCard, ExternalLink } from "lucide-react";

export default function CoursesPage() {
  const trainingCourses = COURSES_DATA.filter(c => c.id <= 4);
  const advancedCourses = COURSES_DATA.filter(c => c.id > 4);

  return (
    <>
      <section className="bg-surface-dark text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Courses &amp; pricing</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Pick the programme that fits your goals. All courses include certified instruction, modern training vehicles, and simulator practice. Licensing add-ons handle your Learners Permit and 5-year Drivers License.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Training Programmes</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {trainingCourses.map((course) => (
              <div key={course.id} className="border border-border rounded-3xl p-7 space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all bg-card">
                <h3 className="text-lg font-semibold">{course.name}</h3>
                <p className="text-sm text-muted-foreground">{course.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-xl font-bold text-traffic-green">{formatCurrency(course.price)}</p>
                  </div>
                  <Link href="/auth/register">
                    <Button variant="outline" className="rounded-full border-traffic-green text-traffic-green hover:bg-traffic-green hover:text-white">
                      Enroll now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-8">Advanced Training Programmes</h2>
          <p className="text-sm text-muted-foreground mb-6">Includes concierge options</p>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {advancedCourses.map((course) => (
              <div key={course.id} className="border border-border rounded-3xl p-7 space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all bg-card">
                <h3 className="text-lg font-semibold">{course.name}</h3>
                <p className="text-sm text-muted-foreground">{course.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-xl font-bold text-traffic-green">{formatCurrency(course.price)}</p>
                  </div>
                  <Link href="/auth/register">
                    <Button className="rounded-full bg-traffic-green text-white hover:bg-traffic-green/90">
                      Enroll now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Payment options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-border rounded-3xl p-8 space-y-4 bg-card">
              <Banknote className="h-8 w-8 text-traffic-green" />
              <h3 className="text-lg font-semibold">Bank transfer</h3>
              <p className="text-sm text-muted-foreground">Send to Moniepoint MFB.</p>
              <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">Moniepoint MFB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account</span>
                  <span className="font-medium">8028955522</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">Falcon Driving School Ltd</span>
                </div>
              </div>
              <a
                href="https://wa.me/2348028955522"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full rounded-full">
                  <ExternalLink className="mr-2 h-4 w-4" /> Send receipt on WhatsApp
                </Button>
              </a>
            </div>

            <div className="border border-border rounded-3xl p-8 space-y-4 bg-card">
              <CreditCard className="h-8 w-8 text-traffic-green" />
              <h3 className="text-lg font-semibold">Pay online</h3>
              <p className="text-sm text-muted-foreground">
                Sign in, pick a course, and complete enrollment online. You&rsquo;ll see your status update in your dashboard.
              </p>
              <Link href="/auth/register">
                <Button className="w-full rounded-full bg-traffic-green text-white hover:bg-traffic-green/90">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
