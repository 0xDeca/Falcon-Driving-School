"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  BarChart3,
  CreditCard,
  Award,
  Bell,
  LogOut,
  Users,
  BookOpen,
  Car,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role: "student" | "instructor" | "admin";
}

const NAV_ITEMS = {
  student: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/student/profile", icon: User },
    { label: "Lessons", href: "/student/lessons", icon: Calendar },
    { label: "Progress", href: "/student/progress", icon: BarChart3 },
    { label: "Payments", href: "/student/payments", icon: CreditCard },
    { label: "Certificates", href: "/student/certificates", icon: Award },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
  ],
  instructor: [
    { label: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/instructor/students", icon: Users },
    { label: "Lessons", href: "/instructor/lessons", icon: Calendar },
    { label: "Evaluations", href: "/instructor/evaluations", icon: FileText },
    { label: "Certifications", href: "/instructor/certifications", icon: Award },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Instructors", href: "/admin/instructors", icon: User },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Vehicles", href: "/admin/vehicles", icon: Car },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Certificates", href: "/admin/certificates", icon: Award },
    { label: "Assessments", href: "/admin/assessments", icon: BarChart3 },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = NAV_ITEMS[role];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-primary">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
          <span className="text-sm font-bold text-primary">F</span>
        </div>
        <span className="font-semibold text-white">Falcon School</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-primary"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
