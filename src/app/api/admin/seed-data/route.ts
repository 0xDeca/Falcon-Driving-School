import { NextResponse } from "next/server";
import { createServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

const COURSES = [
  { name: "2-Week Beginners Course", description: "Vehicle control, virtual simulation, traffic rules, and basic driving maneuvers.", duration_hours: 16, price: 95000, requirements: "Must be 18 years or older." },
  { name: "2-Week Beginners Course + Learners Permit & 5yr Drivers License", description: "Everything in the Beginners Course plus Learners Permit and Drivers License processing.", duration_hours: 16, price: 145000, requirements: "Must be 18 years or older. Valid identification documents." },
  { name: "1-Week Refresher Course", description: "For experienced drivers refreshing skills or preparing for a road test.", duration_hours: 8, price: 75000, requirements: "Valid driver's license required." },
  { name: "1-Week Defensive Driving Course", description: "Hazard awareness, accident prevention, and defensive driving techniques.", duration_hours: 8, price: 75000, requirements: "Valid driver's license. Minimum 1 year driving experience." },
  { name: "3-Week Training Course", description: "Extended training program with deeper road practice and advanced maneuvers.", duration_hours: 24, price: 115000, requirements: "Must be 18 years or older." },
  { name: "3-Week Training Course + Learners Permit & 5yr Drivers License", description: "Extended training plus Learners Permit and Drivers License processing.", duration_hours: 24, price: 165000, requirements: "Must be 18 years or older." },
  { name: "Special Training + Learners Permit & 5yr Drivers License", description: "Instructor comes to your house or office. Includes Learners Permit and Drivers License.", duration_hours: 16, price: 265000, requirements: "Must be 18 years or older. Abuja residents only." },
  { name: "Executive Training + Learners Permit & 5yr Drivers License", description: "Premium concierge training.", duration_hours: 24, price: 350000, requirements: "Must be 18 years or older. Abuja residents only." },
];

const VEHICLES = [
  { name: "Toyota Corolla", model: "2023", plate_number: "FDS-001-A", transmission_type: "automatic", insurance_expiry: "2027-06-30", maintenance_schedule: "Monthly", status: "available" },
  { name: "Honda Civic", model: "2023", plate_number: "FDS-002-A", transmission_type: "automatic", insurance_expiry: "2027-06-30", maintenance_schedule: "Monthly", status: "available" },
  { name: "Toyota Yaris", model: "2023", plate_number: "FDS-003-A", transmission_type: "manual", insurance_expiry: "2027-06-30", maintenance_schedule: "Monthly", status: "available" },
  { name: "Suzuki Swift", model: "2023", plate_number: "FDS-004-A", transmission_type: "manual", insurance_expiry: "2027-06-30", maintenance_schedule: "Monthly", status: "available" },
  { name: "Mercedes-Benz A-Class", model: "2024", plate_number: "FDS-005-A", transmission_type: "automatic", insurance_expiry: "2027-06-30", maintenance_schedule: "Monthly", status: "available" },
];

export async function POST() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: caller } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admin = getServiceSupabase();
    const results: any = { courses: 0, vehicles: 0 };

    for (const course of COURSES) {
      const { data: existing } = await admin.from("courses").select("id").eq("name", course.name).maybeSingle();
      if (!existing) {
        await admin.from("courses").insert({ ...course, archived: false });
        results.courses++;
      }
    }

    for (const vehicle of VEHICLES) {
      const { data: existing } = await admin.from("vehicles").select("id").eq("plate_number", vehicle.plate_number).maybeSingle();
      if (!existing) {
        await admin.from("vehicles").insert(vehicle);
        results.vehicles++;
      }
    }

    return NextResponse.json({ success: true, created: results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
