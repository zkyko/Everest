-- ============================================
-- FIX: Menu Item Foreign Key Constraint
-- ============================================
-- This makes menu_item_id optional in order_items
-- because order_items stores a snapshot of the item data
-- (name, price, description) and doesn't need the FK
-- to be enforced strictly.

-- Make menu_item_id nullable
ALTER TABLE order_items 
ALTER COLUMN menu_item_id DROP NOT NULL;

-- Add a comment explaining why
COMMENT ON COLUMN order_items.menu_item_id IS 
'Optional reference to menu_items. Order items store snapshots of item data at time of order, so the FK is for reference only.';

