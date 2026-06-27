-- Fix circular RLS recursion between students/enrollments/lessons
-- Created: 2026-06-27

-- Security definer functions to break RLS circular chains

-- Returns student IDs owned by the current user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.current_user_student_ids()
RETURNS TABLE (id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.students WHERE user_id = auth.uid();
$$;

-- Returns instructor ID for the current user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.current_instructor_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.instructors WHERE user_id = auth.uid();
$$;

-- Checks if a student belongs to the current user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.user_owns_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.students WHERE id = p_student_id AND user_id = auth.uid());
$$;

-- Checks if a certificate belongs to the current user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.user_owns_certificate(p_certificate_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.certificates c
    JOIN public.students s ON s.id = c.student_id
    WHERE c.id = p_certificate_id AND s.user_id = auth.uid()
  );
$$;

-- Fix STUDENTS - Instructor policy (was querying enrollments which queries back to students)
DROP POLICY IF EXISTS "Instructors can view assigned students" ON students;
CREATE POLICY "Instructors can view assigned students" ON students
  FOR SELECT USING (
    public.current_instructor_id() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM lessons l
      WHERE l.instructor_id = public.current_instructor_id()
      AND EXISTS (
        SELECT 1 FROM enrollments e
        WHERE e.id = l.enrollment_id AND e.student_id = students.id
      )
    )
  );

-- Fix ENROLLMENTS - Student policy (was querying students which triggers recursion)
DROP POLICY IF EXISTS "Students can view own enrollments" ON enrollments;
CREATE POLICY "Students can view own enrollments" ON enrollments
  FOR SELECT USING (public.user_owns_student(enrollments.student_id));

-- Fix ENROLLMENTS - Student insert policy (same issue)
DROP POLICY IF EXISTS "Students can insert own enrollments" ON enrollments;
CREATE POLICY "Students can insert own enrollments" ON enrollments
  FOR INSERT WITH CHECK (public.user_owns_student(enrollments.student_id));

-- Fix LESSONS - Student policy (was querying enrollments JOIN students)
DROP POLICY IF EXISTS "Students can view own lessons" ON lessons;
CREATE POLICY "Students can view own lessons" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.id = lessons.enrollment_id
      AND public.user_owns_student(e.student_id)
    )
  );

-- Fix CERTIFICATES - Student policy (was querying students directly)
DROP POLICY IF EXISTS "Students can view own certificates" ON certificates;
CREATE POLICY "Students can view own certificates" ON certificates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.current_user_student_ids() WHERE id = certificates.student_id)
  );

-- Fix PAYMENTS - Student policy (was querying students)
DROP POLICY IF EXISTS "Students can view own payments" ON payments;
CREATE POLICY "Students can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.current_user_student_ids() WHERE id = payments.student_id)
  );
