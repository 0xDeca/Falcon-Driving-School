-- Falcon Driving School Database Schema
-- PostgreSQL with Row Level Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')) DEFAULT 'student',
  suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students profile
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  profile_photo_url TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id),
  UNIQUE(phone)
);

-- Instructors profile
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certification TEXT,
  years_experience INTEGER DEFAULT 0,
  bio TEXT,
  UNIQUE(user_id)
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  requirements TEXT,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  UNIQUE(student_id, course_id)
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT,
  plate_number TEXT UNIQUE NOT NULL,
  transmission_type TEXT CHECK (transmission_type IN ('automatic', 'manual')),
  insurance_expiry DATE,
  maintenance_schedule TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'retired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id),
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 90,
  attendance_status TEXT DEFAULT 'scheduled' CHECK (attendance_status IN ('scheduled', 'present', 'absent', 'cancelled')),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lesson evaluations
CREATE TABLE IF NOT EXISTS lesson_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  steering_score INTEGER CHECK (steering_score >= 1 AND steering_score <= 10),
  parking_score INTEGER CHECK (parking_score >= 1 AND parking_score <= 10),
  reverse_parking_score INTEGER CHECK (reverse_parking_score >= 1 AND reverse_parking_score <= 10),
  road_awareness_score INTEGER CHECK (road_awareness_score >= 1 AND road_awareness_score <= 10),
  confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
  strengths_text TEXT,
  improvements_text TEXT,
  comments_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  payment_method TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificate recommendations
CREATE TABLE IF NOT EXISTS certificate_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  completion_date DATE NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category_id UUID REFERENCES blog_categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
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

-- Coupons / Discounts
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_amount DECIMAL(10,2),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON contact_messages
  FOR SELECT USING (public.is_admin());

-- Indexes for performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_suspended ON users(suspended);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_instructors_user_id ON instructors(user_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_lessons_enrollment_id ON lessons(enrollment_id);
CREATE INDEX idx_lessons_instructor_id ON lessons(instructor_id);
CREATE INDEX idx_lessons_scheduled_date ON lessons(scheduled_date);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificate_recommendations_student_id ON certificate_recommendations(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- Row Level Security

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function that bypasses RLS (used by admin policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
$$;

-- Users policies
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own record" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id AND suspended = FALSE) WITH CHECK (auth.uid() = id AND suspended = FALSE);
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (public.is_admin());

-- Students policies
CREATE POLICY "Students can view own profile" ON students
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can insert own profile" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students can update own profile" ON students
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Instructors can view assigned students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN lessons l ON l.enrollment_id = e.id
      WHERE e.student_id = students.id AND l.instructor_id = (SELECT id FROM instructors WHERE user_id = auth.uid())
    )
  );
CREATE POLICY "Admins can manage all students" ON students
  FOR ALL USING (public.is_admin());

-- Instructors policies
CREATE POLICY "Instructors can view own profile" ON instructors
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Instructors can insert own profile" ON instructors
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Instructors can update own profile" ON instructors
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage instructors" ON instructors
  FOR ALL USING (public.is_admin());

-- Enrollments policies
CREATE POLICY "Students can view own enrollments" ON enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students WHERE id = enrollments.student_id AND user_id = auth.uid())
  );
CREATE POLICY "Students can insert own enrollments" ON enrollments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM students WHERE id = enrollments.student_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage enrollments" ON enrollments
  FOR ALL USING (public.is_admin());

-- Lessons policies
CREATE POLICY "Students can view own lessons" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN students s ON s.id = e.student_id
      WHERE e.id = lessons.enrollment_id AND s.user_id = auth.uid()
    )
  );
CREATE POLICY "Instructors can view own lessons" ON lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM instructors WHERE id = lessons.instructor_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage all lessons" ON lessons
  FOR ALL USING (public.is_admin());

-- Lesson evaluations policies
CREATE POLICY "Instructors can manage own evaluations" ON lesson_evaluations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM lessons WHERE id = lesson_evaluations.lesson_id AND instructor_id = (SELECT id FROM instructors WHERE user_id = auth.uid()))
  );
CREATE POLICY "Admins can manage evaluations" ON lesson_evaluations
  FOR ALL USING (public.is_admin());

-- Payments policies
CREATE POLICY "Students can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students WHERE id = payments.student_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage payments" ON payments
  FOR ALL USING (public.is_admin());

-- Certificates policies
CREATE POLICY "Students can view own certificates" ON certificates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students WHERE id = certificates.student_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage certificates" ON certificates
  FOR ALL USING (public.is_admin());

-- Certificate recommendations policies
CREATE POLICY "Instructors can manage own recommendations" ON certificate_recommendations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE id = certificate_recommendations.instructor_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage recommendations" ON certificate_recommendations
  FOR ALL USING (public.is_admin());

-- Coupons policies
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (public.is_admin());
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert default admin user (run after creating first user)
-- INSERT INTO users (id, email, role) VALUES ('admin-uuid', 'admin@falcondrivingschool.com', 'admin');

-- Insert blog categories
INSERT INTO blog_categories (name, slug) VALUES
  ('Driving Tips', 'driving-tips'),
  ('Road Safety', 'road-safety'),
  ('Driver Licensing', 'driver-licensing'),
  ('Traffic Rules', 'traffic-rules'),
  ('Student Success Stories', 'student-success-stories'),
  ('Falcon Updates', 'falcon-updates')
ON CONFLICT (slug) DO NOTHING;

-- Insert default courses
INSERT INTO courses (name, description, duration_hours, price, requirements) VALUES
  ('Automatic Driving Lessons', 'Master driving with automatic transmission vehicles.', 24, 150000, 'Must be 18 years or older. Valid learner''s permit required.'),
  ('Manual Driving Lessons', 'Learn to drive manual transmission vehicles.', 32, 180000, 'Must be 18 years or older. Valid learner''s permit required.'),
  ('Defensive Driving', 'Advanced techniques to anticipate hazards and react safely.', 16, 120000, 'Valid driver''s license. Minimum 1 year driving experience.'),
  ('Refresher Courses', 'Perfect for licensed drivers who need to rebuild confidence.', 12, 90000, 'Valid driver''s license required.'),
  ('Corporate Driving Training', 'Fleet driver training for organizations.', 20, 350000, 'Corporate account required. Minimum 5 employees.'),
  ('Driver License Assistance', 'End-to-end support through the licensing process.', 16, 100000, 'Must be 18 years or older. Valid identification documents.')
ON CONFLICT DO NOTHING;
