import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <span className="text-lg font-bold text-primary">F</span>
              </div>
              <span className="text-lg font-bold">Falcon Driving School</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nigeria&apos;s premier driving school committed to producing safe, confident, and responsible drivers through professional training.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Courses", href: "/courses" },
                { label: "Pricing", href: "/pricing" },
                { label: "Instructors", href: "/instructors" },
                { label: "Blog", href: "/blog" },
                { label: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-accent text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5 text-accent" />
                <span>123 Ibrahim Babangida Way, Abuja, Nigeria</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+2348000000000" className="hover:text-accent">0800 000 0000</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:info@falcondrivingschool.com" className="hover:text-accent">info@falcondrivingschool.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Office Hours</h4>
              <p className="text-sm text-gray-300">Mon - Fri: 7am - 6pm</p>
              <p className="text-sm text-gray-300">Saturday: 8am - 4pm</p>
              <p className="text-sm text-gray-300">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Falcon Driving School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
