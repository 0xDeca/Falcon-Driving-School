"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

function TrafficLightLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex flex-col gap-[3px] rounded-md bg-surface-dark p-1.5 shadow-inner">
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-red transition-all group-hover:shadow-[0_0_8px_#EF4444]" />
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-amber transition-all group-hover:shadow-[0_0_8px_#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-green transition-all group-hover:shadow-[0_0_8px_#22C55E]" />
      </div>
      <span className="display text-lg font-bold tracking-tight text-foreground">
        Falcon<span className="text-traffic-green">.</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <TrafficLightLogo />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-9 px-4 py-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link href="/auth/register">
            <Button className="rounded-full bg-traffic-green text-white hover:bg-traffic-green/90 shadow px-5">
              Get started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden rounded-full p-2 hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-muted-foreground hover:text-foreground py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link
                href="/auth/login"
                className="block text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-full bg-traffic-green text-white hover:bg-traffic-green/90">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
