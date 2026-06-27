-- Fix RLS infinite recursion and add missing policies
-- Created: 2026-06-27

-- 1. Helper function that bypasses RLS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
$$;

-- 2. Fix USERS policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (public.is_admin());

-- Allow users to insert their own record during registration
DROP POLICY IF EXISTS "Users can insert own record" ON users;
CREATE POLICY "Users can insert own record" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own record
DROP POLICY IF EXISTS "Users can update own record" ON users;
CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. Fix STUDENTS policies
DROP POLICY IF EXISTS "Admins can view all students" ON students;
CREATE POLICY "Admins can manage all students" ON students
  FOR ALL USING (public.is_admin());

-- Allow students to insert their own profile during registration
DROP POLICY IF EXISTS "Students can insert own profile" ON students;
CREATE POLICY "Students can insert own profile" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow students to update their own profile
DROP POLICY IF EXISTS "Students can update own profile" ON students;
CREATE POLICY "Students can update own profile" ON students
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Fix ENROLLMENTS policies
DROP POLICY IF EXISTS "Admins can manage enrollments" ON enrollments;
CREATE POLICY "Admins can manage enrollments" ON enrollments
  FOR ALL USING (public.is_admin());

-- Allow students to insert their own enrollments
DROP POLICY IF EXISTS "Students can insert own enrollments" ON enrollments;
CREATE POLICY "Students can insert own enrollments" ON enrollments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM students WHERE id = enrollments.student_id AND user_id = auth.uid())
  );

-- 5. Fix LESSONS policies
DROP POLICY IF EXISTS "Admins can view all lessons" ON lessons;
CREATE POLICY "Admins can manage all lessons" ON lessons
  FOR ALL USING (public.is_admin());

-- 6. Fix PAYMENTS policies
DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
CREATE POLICY "Admins can manage payments" ON payments
  FOR ALL USING (public.is_admin());

-- 7. Fix INSTRUCTOR policies (were missing entirely)
DROP POLICY IF EXISTS "Instructors can view own profile" ON instructors;
CREATE POLICY "Instructors can view own profile" ON instructors
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Instructors can insert own profile" ON instructors;
CREATE POLICY "Instructors can insert own profile" ON instructors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Instructors can update own profile" ON instructors;
CREATE POLICY "Instructors can update own profile" ON instructors
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage instructors" ON instructors;
CREATE POLICY "Admins can manage instructors" ON instructors
  FOR ALL USING (public.is_admin());

-- 8. Fix LESSON EVALUATIONS policies (were missing entirely)
DROP POLICY IF EXISTS "Instructors can manage own evaluations" ON lesson_evaluations;
CREATE POLICY "Instructors can manage own evaluations" ON lesson_evaluations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM lessons WHERE id = lesson_evaluations.lesson_id AND instructor_id = (SELECT id FROM instructors WHERE user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Admins can manage evaluations" ON lesson_evaluations;
CREATE POLICY "Admins can manage evaluations" ON lesson_evaluations
  FOR ALL USING (public.is_admin());

-- 9. Fix CERTIFICATES policies (were missing entirely)
DROP POLICY IF EXISTS "Students can view own certificates" ON certificates;
CREATE POLICY "Students can view own certificates" ON certificates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students WHERE id = certificates.student_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage certificates" ON certificates;
CREATE POLICY "Admins can manage certificates" ON certificates
  FOR ALL USING (public.is_admin());

-- 10. Fix CERTIFICATE RECOMMENDATIONS policies (were missing entirely)
DROP POLICY IF EXISTS "Instructors can manage own recommendations" ON certificate_recommendations;
CREATE POLICY "Instructors can manage own recommendations" ON certificate_recommendations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE id = certificate_recommendations.instructor_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage recommendations" ON certificate_recommendations;
CREATE POLICY "Admins can manage recommendations" ON certificate_recommendations
  FOR ALL USING (public.is_admin());
