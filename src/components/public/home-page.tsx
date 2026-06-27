"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Clock, BadgeCheck, Cpu, CalendarRange, ShieldCheck } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative isolate min-h-[92vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative z-10 container py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium text-white/90 border border-white/15">
          <span className="h-1.5 w-1.5 rounded-full bg-traffic-green" />
          Now enrolling &mdash; Abuja
        </span>
        <h1 className="mt-5 display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95] max-w-4xl">
          FALCON
          <br />
          DRIVING <span className="text-traffic-green">SCHOOL</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/80">
          We help people in Abuja become confident, capable drivers &mdash; with modern vehicles, certified instructors and a programme that actually fits your schedule.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/auth/register">
            <Button className="rounded-full bg-traffic-green text-white hover:bg-traffic-green/90 hover:scale-[1.03] hover:shadow-[0_0_28px_var(--tw-shadow-color)] shadow px-7 h-12 text-base transition-all">
              Sign up
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="rounded-full border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:scale-[1.03] px-7 h-12 text-base transition-all">
              View courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    { icon: Car, title: "Automatic & Manual Lessons", description: "Learn on the transmission you'll actually drive. Both options available with modern, well-maintained training cars.", bg: "#DC2626" },
    { icon: Clock, title: "Flexible Lesson Time", description: "Mornings, evenings, weekends — book lessons around work, school or your business. No rigid timetables.", bg: "#F59E0B" },
    { icon: BadgeCheck, title: "Licensing Program", description: "We handle your Learners Permit and 5-year Drivers License processing end-to-end. You focus on driving.", bg: "#15803D" },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <p className="text-sm font-semibold uppercase tracking-widest text-traffic-green">Our services</p>
        <h2 className="mt-3 display text-3xl md:text-5xl font-bold max-w-2xl">Everything you need to get on the road.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="group h-full rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-foreground/20">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `color-mix(in oklab, ${s.bg} 15%, transparent)` }}>
                  <Icon className="h-6 w-6" style={{ color: s.bg }} />
                </div>
                <h3 className="mt-5 display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const features = [
    { icon: Car, title: "Modern training cars", description: "Clean, safe vehicles that match what you'll drive after the program." },
    { icon: Cpu, title: "Virtual simulation", description: "Practice tricky scenarios safely before they ever happen on the road." },
    { icon: CalendarRange, title: "Flexible scheduling", description: "We work around your life — not the other way around." },
    { icon: ShieldCheck, title: "Certified instructors", description: "Experienced, patient, and accredited to teach in Nigeria." },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface-dark text-white">
      <div className="container grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-traffic-amber">Why choose us</p>
          <h2 className="mt-3 display text-3xl md:text-5xl font-bold leading-tight">A smarter, safer way to learn how to drive.</h2>
          <p className="mt-5 text-white/70 text-lg max-w-xl">
            We combine real-world road training with virtual simulation, defensive driving theory and one-on-one coaching. You won&rsquo;t just pass a test &mdash; you&rsquo;ll actually drive well.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 h-full transition-all hover:border-traffic-green/60 hover:bg-white/10">
                <Icon className="h-6 w-6 text-traffic-green" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-white/70">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container text-center max-w-5xl">
        <h2 className="display text-3xl md:text-5xl font-bold">Get started today.</h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Modern car training, virtual simulation and a schedule that fits your life. Sign up in two minutes and pick the programme that matches you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/auth/register">
            <Button className="rounded-full bg-traffic-red text-white hover:bg-traffic-red/90 hover:scale-[1.03] hover:shadow-[0_0_28px_var(--tw-shadow-color)] shadow px-7 h-12 transition-all">
              Create your account
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="rounded-full px-7 h-12 hover:scale-[1.03] transition-all">
              Browse courses
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
      <ServicesSection />
      <WhyChooseUsSection />
      <CTASection />
    </>
  );
}
