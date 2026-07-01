import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const res = await fetch(`${API_URL}/admin/seed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ courses: COURSES, vehicles: VEHICLES }),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json.message || "Failed to seed data" }, { status: res.status });
    }
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
