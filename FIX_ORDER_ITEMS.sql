-- Fix Order Items Insert Issues
-- Run this in Supabase SQL Editor

-- 1. Check if order_items table exists and has correct schema
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- 2. Disable RLS on order_items (since we use SERVICE_ROLE_KEY)
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- 3. Disable RLS on orders (for clean inserts)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- 4. Disable RLS on order_item_modifiers
ALTER TABLE order_item_modifiers DISABLE ROW LEVEL SECURITY;

-- 5. Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('orders', 'order_items', 'order_item_modifiers');

-- Expected output: rowsecurity should be 'false' for all three tables

