-- Add paid column to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT false;

-- Seed courses from COURSES_DATA
INSERT INTO courses (name, description, duration_hours, price, requirements, archived) VALUES
  ('2-Week Beginners Course', 'Vehicle control, virtual simulation, traffic rules, and basic driving maneuvers.', 16, 95000, 'Must be 18 years or older.', false),
  ('2-Week Beginners Course + Learners Permit & 5yr Drivers License', 'Everything in the Beginners Course plus Learners Permit and Drivers License processing.', 16, 145000, 'Must be 18 years or older. Valid identification documents.', false),
  ('1-Week Refresher Course', 'For experienced drivers refreshing skills or preparing for a road test.', 8, 75000, 'Valid driver''s license required.', false),
  ('1-Week Defensive Driving Course', 'Hazard awareness, accident prevention, and defensive driving techniques.', 8, 75000, 'Valid driver''s license. Minimum 1 year driving experience.', false),
  ('3-Week Training Course', 'Extended training program with deeper road practice and advanced maneuvers.', 24, 115000, 'Must be 18 years or older.', false),
  ('3-Week Training Course + Learners Permit & 5yr Drivers License', 'Extended training plus Learners Permit and Drivers License processing.', 24, 165000, 'Must be 18 years or older.', false),
  ('Special Training + Learners Permit & 5yr Drivers License', 'Instructor comes to your house or office. Includes Learners Permit and Drivers License.', 16, 265000, 'Must be 18 years or older. Abuja residents only.', false),
  ('Executive Training + Learners Permit & 5yr Drivers License', 'Premium concierge training. Instructor comes to your house or office. Includes Learners Permit and Drivers License.', 24, 350000, 'Must be 18 years or older. Abuja residents only.', false)
ON CONFLICT DO NOTHING;

-- Seed default vehicles
INSERT INTO vehicles (name, model, plate_number, transmission_type, insurance_expiry, maintenance_schedule, status) VALUES
  ('Toyota Corolla', '2023', 'FDS-001-A', 'automatic', '2027-06-30', 'Monthly', 'available'),
  ('Honda Civic', '2023', 'FDS-002-A', 'automatic', '2027-06-30', 'Monthly', 'available'),
  ('Toyota Yaris', '2023', 'FDS-003-A', 'manual', '2027-06-30', 'Monthly', 'available'),
  ('Suzuki Swift', '2023', 'FDS-004-A', 'manual', '2027-06-30', 'Monthly', 'available'),
  ('Mercedes-Benz A-Class', '2024', 'FDS-005-A', 'automatic', '2027-06-30', 'Monthly', 'available')
ON CONFLICT DO NOTHING;
