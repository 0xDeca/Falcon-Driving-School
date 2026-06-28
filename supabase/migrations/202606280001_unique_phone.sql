-- Prevent duplicate phone numbers across students
-- Note: UNIQUE(phone) is already defined in supabase-schema.sql
-- This ensures the constraint exists if the schema was modified
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_phone' AND conrelid = 'students'::regclass
  ) THEN
    ALTER TABLE students ADD CONSTRAINT unique_phone UNIQUE (phone);
  END IF;
END $$;
