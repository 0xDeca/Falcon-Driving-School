import Link from "next/link";
import { MapPin, Phone, Instagram } from "lucide-react";

const footerLinks = {
  explore: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/gallery", label: "Gallery" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ],
  portals: [
    { href: "/auth/login", label: "Student sign in" },
    { href: "/auth/register", label: "Create account" },
  ],
};

function TrafficLightLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex flex-col gap-[3px] rounded-md bg-surface-dark p-1.5 shadow-inner">
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-red transition-all group-hover:shadow-[0_0_8px_#DC2626]" />
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-amber transition-all group-hover:shadow-[0_0_8px_#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-green transition-all group-hover:shadow-[0_0_8px_#15803D]" />
      </div>
      <span className="display text-lg font-bold tracking-tight text-white">
        Falcon<span className="text-traffic-green">.</span>
      </span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-darker text-white/80">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <TrafficLightLogo />
          <p className="mt-4 text-sm text-white/60 max-w-xs">
            Helping people in Abuja become confident, safe, licensed drivers.
          </p>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.explore.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-traffic-green transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold mb-3">Portals</h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.portals.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-traffic-green transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold mb-3">Reach us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-traffic-amber shrink-0" />
              <span>Suite B8, AYM Shafa Petrol Station, Wuye, Abuja</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-traffic-green shrink-0" />
              <a href="tel:+2348028955522" className="hover:text-white transition-colors">
                0802-895-5522
              </a>
            </li>
            <li className="flex gap-2">
              <Instagram className="mt-0.5 h-4 w-4 text-traffic-red shrink-0" />
              <a
                href="https://instagram.com/falcondrivingschoolng"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                @falcondrivingschoolng
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-5 text-xs text-white/50 flex flex-wrap justify-between gap-3">
          <span>&copy; 2026 Falcon Driving School Ltd. All rights reserved. Abuja, Nigeria</span>
        </div>
      </div>
    </footer>
  );
}
