-- Student Registration Form (compulsory after signup)
CREATE TABLE IF NOT EXISTS student_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  surname TEXT NOT NULL,
  other_names TEXT NOT NULL,
  nin TEXT NOT NULL,
  lga_of_origin TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  state_origin TEXT NOT NULL,
  address TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  mother_maiden_name TEXT NOT NULL,
  next_of_kin TEXT NOT NULL,
  next_of_kin_phone TEXT NOT NULL,
  phone TEXT NOT NULL,
  driven_before BOOLEAN NOT NULL DEFAULT false,
  experienced_driver BOOLEAN,
  last_drove TEXT,
  require_license BOOLEAN NOT NULL DEFAULT true,
  preferred_lesson_time TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id)
);

ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;

-- Students can view their own registration
CREATE POLICY "Students can view own registration"
  ON student_registrations
  FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- Students can insert their own registration
CREATE POLICY "Students can insert own registration"
  ON student_registrations
  FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- Students can update their own registration
CREATE POLICY "Students can update own registration"
  ON student_registrations
  FOR UPDATE
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON student_registrations
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Admins can update any registration
CREATE POLICY "Admins can update any registration"
  ON student_registrations
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
