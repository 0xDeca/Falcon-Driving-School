-- Prevent duplicate phone numbers across students
ALTER TABLE students ADD CONSTRAINT unique_phone UNIQUE (phone);
