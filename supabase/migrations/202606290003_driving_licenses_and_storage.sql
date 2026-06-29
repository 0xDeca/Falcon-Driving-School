-- Driving licenses table for student uploads
CREATE TABLE IF NOT EXISTS driving_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  admin_notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);

ALTER TABLE driving_licenses ENABLE ROW LEVEL SECURITY;

-- Students can view their own license
CREATE POLICY "Students can view own license" ON driving_licenses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students WHERE id = driving_licenses.student_id AND user_id = auth.uid())
  );

-- Students can insert own license
CREATE POLICY "Students can insert own license" ON driving_licenses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM students WHERE id = driving_licenses.student_id AND user_id = auth.uid())
  );

-- Admins can manage all licenses
CREATE POLICY "Admins can manage licenses" ON driving_licenses
  FOR ALL USING (public.is_admin());

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_driving_licenses_student_id ON driving_licenses(student_id);
CREATE INDEX IF NOT EXISTS idx_driving_licenses_status ON driving_licenses(status);

-- OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone')),
  target TEXT NOT NULL,
  code TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Users can view own OTPs
CREATE POLICY "Users can view own otps" ON otp_codes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own OTP
CREATE POLICY "Users can insert own otp" ON otp_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cleanup expired OTPs
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_type ON otp_codes(user_id, type);
