-- Create Admin User for Everest Food Truck
-- Run this in Supabase SQL Editor

-- Step 1: Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2: Create admin user with bcrypt hashed password
-- Email: admin@everesthoward.com
-- Password: admin123 (CHANGE THIS AFTER FIRST LOGIN!)

INSERT INTO admin_users (email, password_hash)
VALUES (
  'admin@everesthoward.com',
  crypt('admin123', gen_salt('bf'))
);

-- Verify the admin was created
SELECT id, email, created_at FROM admin_users;

