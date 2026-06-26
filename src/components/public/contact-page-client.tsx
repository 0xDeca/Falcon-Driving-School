"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Instagram, MapPin, ArrowRight } from "lucide-react";

export function ContactPageClient() {
  return (
    <>
      <section className="bg-surface-dark text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Let&rsquo;s get you on the road. Call, WhatsApp, message us on Instagram, or stop by the office. We respond fast.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <a href="tel:+2348028955522" className="block border border-border rounded-3xl p-8 text-center space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all bg-card group">
              <Phone className="h-8 w-8 text-traffic-green mx-auto" />
              <h3 className="font-semibold text-lg">Call or WhatsApp</h3>
              <p className="text-traffic-green font-medium">0802-895-5522</p>
              <span className="text-sm text-muted-foreground group-hover:text-traffic-green transition-colors inline-flex items-center gap-1">
                Call now <ArrowRight className="h-3 w-3" />
              </span>
            </a>

            <a href="https://wa.me/2348028955522" target="_blank" rel="noopener noreferrer" className="block border border-border rounded-3xl p-8 text-center space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all bg-card group">
              <MessageCircle className="h-8 w-8 text-traffic-green mx-auto" />
              <h3 className="font-semibold text-lg">WhatsApp chat</h3>
              <p className="text-sm text-muted-foreground">Send us a message</p>
              <span className="text-sm text-muted-foreground group-hover:text-traffic-green transition-colors inline-flex items-center gap-1">
                Open WhatsApp <ArrowRight className="h-3 w-3" />
              </span>
            </a>

            <a href="https://instagram.com/falcondrivingschoolng" target="_blank" rel="noopener noreferrer" className="block border border-border rounded-3xl p-8 text-center space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all bg-card group">
              <Instagram className="h-8 w-8 text-traffic-green mx-auto" />
              <h3 className="font-semibold text-lg">Instagram</h3>
              <p className="text-sm text-muted-foreground">@falcondrivingschoolng</p>
              <span className="text-sm text-muted-foreground group-hover:text-traffic-green transition-colors inline-flex items-center gap-1">
                Follow us <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          </div>

          <div className="bg-muted rounded-3xl p-10 text-center space-y-4 mb-16">
            <MapPin className="h-8 w-8 text-traffic-amber mx-auto" />
            <h2 className="text-2xl font-bold">Visit the office</h2>
            <p className="text-muted-foreground text-lg">Suite B8, AYM Shafa Petrol Station, Wuye, Abuja</p>
            <p className="text-sm text-muted-foreground">Drop in for a chat, see our vehicles and sit in our simulator before you sign up.</p>
          </div>

          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready when you are.</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register">
                <Button className="rounded-full bg-traffic-red text-white hover:bg-traffic-red/90 px-8 py-6 text-base">
                  Create your account
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" className="rounded-full px-8 py-6 text-base">
                  Browse courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
