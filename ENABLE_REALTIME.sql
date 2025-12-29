-- Enable Realtime for Everest Food Truck
-- Run this in Supabase SQL Editor

-- Enable realtime for orders table (so kitchen/admin see new orders instantly)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable realtime for order_items table (to see order details)
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;

-- Enable realtime for order_item_modifiers table (to see modifiers)
ALTER PUBLICATION supabase_realtime ADD TABLE order_item_modifiers;

-- Verify realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

