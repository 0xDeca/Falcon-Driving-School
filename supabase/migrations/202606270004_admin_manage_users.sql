-- Allow admins to insert/update/delete users (was SELECT-only)
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (public.is_admin());
