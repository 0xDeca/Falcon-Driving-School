-- Create coupons table for course discounts
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

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_course_id ON coupons(course_id);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));
