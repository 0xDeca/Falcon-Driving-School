-- ============================================================
-- Falcon Driving School — Supabase Storage Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create buckets (if not already created via Dashboard)
-- You can also create them in Dashboard > Storage > Create Bucket

-- Buckets needed:
--    profile-images   → Student profile photos
--    instructor-images → Instructor profile photos
--    vehicle-images   → Vehicle photos
--    licences         → Student driving license uploads
--    certificates     → Certificate PDFs
--    documents        → General documents

-- 2. Bucket-level RLS Policies
-- Each bucket needs policies controlling who can read/write.

-- === profile-images (public read, authenticated write) ===
CREATE POLICY "Anyone can view profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- === instructor-images (public read, admin/instructor write) ===
CREATE POLICY "Anyone can view instructor images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'instructor-images');

CREATE POLICY "Admins and instructors can upload instructor images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'instructor-images'
    AND (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    )
  );

CREATE POLICY "Admins and instructors can update own instructor images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'instructor-images'
    AND (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    )
  );

-- === vehicle-images (public read, admin write) ===
CREATE POLICY "Anyone can view vehicle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');

CREATE POLICY "Admins can manage vehicle images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-images'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update vehicle images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'vehicle-images'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- === licences (public read, student write own) ===
CREATE POLICY "Anyone can view licences"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'licences');

CREATE POLICY "Students can upload own licence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'licences'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Students can update own licence"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'licences'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- === certificates (public read, admin write) ===
CREATE POLICY "Anyone can view certificates"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

CREATE POLICY "Admins can manage certificates"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'certificates'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update certificates"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'certificates'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- === documents (authenticated read, authenticated write) ===
CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

-- 3. Public bucket configuration
-- Make these buckets public in Dashboard > Storage > {bucket} > Make Public:
--    profile-images
--    instructor-images
--    vehicle-images
--    licences
--    certificates

-- Alternative: set public via SQL (requires supabase_functions extension)
-- UPDATE storage.buckets SET public = true WHERE id IN (
--   'profile-images', 'instructor-images', 'vehicle-images',
--   'licences', 'certificates'
-- );
