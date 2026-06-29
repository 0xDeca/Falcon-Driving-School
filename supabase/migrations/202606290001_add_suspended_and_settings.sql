-- Add suspended column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name TEXT DEFAULT 'Falcon Driving School',
  email TEXT DEFAULT 'info@falcondrivingschool.com',
  phone TEXT DEFAULT '0800 000 0000',
  address TEXT DEFAULT '123 Ibrahim Babangida Way, Abuja, Nigeria',
  currency TEXT DEFAULT 'NGN',
  lesson_reminder_hours TEXT DEFAULT '24',
  cancellation_notice TEXT DEFAULT '24',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (public.is_admin());

-- Update users RLS policy for suspended column
DROP POLICY IF EXISTS "Users can update own record" ON users;
CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id AND suspended = FALSE) WITH CHECK (auth.uid() = id AND suspended = FALSE);

-- Index for suspended users
CREATE INDEX IF NOT EXISTS idx_users_suspended ON users(suspended);
