"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Pricing", href: "/pricing" },
  { label: "Instructors", href: "/instructors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-bold text-accent">F</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-primary">Falcon</span>
            <span className="text-lg text-gray-600"> Driving School</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+2348000000000" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
            <Phone className="h-4 w-4" />
            <span>0800 000 0000</span>
          </a>
          <Link href="/auth/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="gold" size="sm">Enroll Now</Button>
          </Link>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-16 z-50 bg-white lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container mx-auto flex flex-col gap-4 p-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-medium text-gray-700 py-2 border-b border-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/register" className="w-full">
              <Button variant="gold" className="w-full">Enroll Now</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
