-- Comprehensive Menu Data for Everest Food Truck
-- Run this in Supabase SQL Editor after running SUPABASE_SCHEMA.sql

-- Clear existing data (optional - uncomment if you want fresh start)
-- DELETE FROM order_item_modifiers;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM modifier_options;
-- DELETE FROM modifier_groups;
-- DELETE FROM menu_items;
-- DELETE FROM menu_categories;

-- Insert Menu Categories
INSERT INTO menu_categories (name, display_order, is_active) VALUES
('Momos', 1, true),
('Chow Mein', 2, true),
('Nepali Food', 3, true),
('Indian Food', 4, true),
('Appetizers', 5, true),
('Desserts', 6, true),
('Drinks', 7, true);

-- Get category IDs for reference (you'll need these for the next inserts)
-- Run this query to see the generated UUIDs:
-- SELECT id, name FROM menu_categories ORDER BY display_order;

-- For simplicity, we'll use a different approach: insert items by looking up category by name
-- Insert Momos
INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Momo', 'Steamed chicken dumplings served with authentic Nepalese sauce', 12.99, true, 1 
FROM menu_categories WHERE name = 'Momos';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Fried Momo', 'Crispy fried chicken dumplings - customer favorite!', 13.99, true, 2 
FROM menu_categories WHERE name = 'Momos';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Veg Momo', 'Steamed vegetable dumplings with fresh veggies', 11.99, true, 3 
FROM menu_categories WHERE name = 'Momos';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Veg Chilli Momo', 'Vegetable momos tossed in spicy chilli sauce', 12.99, true, 4 
FROM menu_categories WHERE name = 'Momos';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Jhol Momo', 'Chicken dumplings in flavorful broth', 13.99, true, 5 
FROM menu_categories WHERE name = 'Momos';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Chilli Momo', 'Chicken momos tossed in spicy Indo-Chinese sauce', 13.99, true, 6 
FROM menu_categories WHERE name = 'Momos';

-- Insert Chow Mein
INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Chow Mein', '6 oz noodles with fresh vegetables and 3 oz chicken', 12.99, true, 1 
FROM menu_categories WHERE name = 'Chow Mein';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Veg Chow Mein', 'Stir-fried noodles with mixed vegetables', 11.99, true, 2 
FROM menu_categories WHERE name = 'Chow Mein';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Sukuti Chow Mein', 'Chow mein with dried spiced buffalo meat - authentic Nepali style', 14.99, true, 3 
FROM menu_categories WHERE name = 'Chow Mein';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Egg Chow Mein', 'Vegetable chow mein with scrambled eggs', 11.99, true, 4 
FROM menu_categories WHERE name = 'Chow Mein';

-- Insert Nepali Food
INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chatpate', 'Spicy and sour Nepali street snack with puffed rice', 6.99, true, 1 
FROM menu_categories WHERE name = 'Nepali Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Thuppa', 'Traditional Nepali noodle soup with chicken', 12.99, true, 2 
FROM menu_categories WHERE name = 'Nepali Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Veg Thuppa', 'Hearty vegetable noodle soup - 3 oz', 10.99, true, 3 
FROM menu_categories WHERE name = 'Nepali Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chilli Chicken', 'Indo-Nepali style spicy chicken - 6 oz', 12.99, true, 4 
FROM menu_categories WHERE name = 'Nepali Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Sekuwa', 'Grilled marinated chicken - traditional Nepali BBQ', 14.99, true, 5 
FROM menu_categories WHERE name = 'Nepali Food';

-- Insert Indian Food
INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Curry', 'Authentic Nepali style chicken curry with aromatic spices', 13.99, true, 1 
FROM menu_categories WHERE name = 'Indian Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Paneer Tikka Masala', 'Marinated paneer in rich spiced gravy', 13.99, true, 2 
FROM menu_categories WHERE name = 'Indian Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Dal (Lentil Soup)', 'Traditional lentil soup with spices', 8.99, true, 3 
FROM menu_categories WHERE name = 'Indian Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Chicken Fried Rice', 'Fried rice with chicken and fresh vegetables', 12.99, true, 4 
FROM menu_categories WHERE name = 'Indian Food';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Veg Fried Rice', 'Fried rice with mixed vegetables', 11.99, true, 5 
FROM menu_categories WHERE name = 'Indian Food';

-- Insert Appetizers
INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Samosa (2 pcs)', 'Crispy pastry filled with spiced potatoes and peas', 5.99, true, 1 
FROM menu_categories WHERE name = 'Appetizers';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Vegetable Pakora', 'Mixed vegetable fritters - crispy and delicious', 7.99, true, 2 
FROM menu_categories WHERE name = 'Appetizers';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Papad', 'Crispy lentil crackers', 2.99, true, 3 
FROM menu_categories WHERE name = 'Appetizers';

-- Insert Desserts
INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Gulab Jamun (2 pcs)', 'Traditional Indian sweet - milky dough fried and soaked in fragrant syrup', 3.99, true, 1 
FROM menu_categories WHERE name = 'Desserts';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Ras Malai (2 pcs)', 'Soft cheese discs soaked in sweet milk, garnished with pistachios', 3.99, true, 2 
FROM menu_categories WHERE name = 'Desserts';

-- Insert Drinks
INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Mango Lassi', 'Traditional Indian drink with mango and yogurt', 3.99, true, 1 
FROM menu_categories WHERE name = 'Drinks';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Milk Tea (Chai)', 'Black tea with milk and sugar, infused with cardamom', 3.50, true, 2 
FROM menu_categories WHERE name = 'Drinks';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Black Tea', 'Brewed black tea - robust and flavorful', 3.50, true, 3 
FROM menu_categories WHERE name = 'Drinks';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Can Coke', 'Classic Coca-Cola', 1.85, true, 4 
FROM menu_categories WHERE name = 'Drinks';

INSERT INTO menu_items (category_id, name, description, price, is_available, display_order) 
SELECT id, 'Bottled Water', 'Clear, refreshing bottled water', 1.00, true, 5 
FROM menu_categories WHERE name = 'Drinks';

-- Add sample modifier group (Spice Level) to Chicken Momo
-- First, get the Chicken Momo item ID and insert modifier group
INSERT INTO modifier_groups (menu_item_id, name, is_required, display_order)
SELECT id, 'Spice Level', true, 1
FROM menu_items WHERE name = 'Chicken Momo' LIMIT 1;

-- Add spice level options
INSERT INTO modifier_options (modifier_group_id, name, price_adjustment, display_order)
SELECT mg.id, 'Mild', 0.00, 1
FROM modifier_groups mg
JOIN menu_items mi ON mg.menu_item_id = mi.id
WHERE mi.name = 'Chicken Momo' AND mg.name = 'Spice Level';

INSERT INTO modifier_options (modifier_group_id, name, price_adjustment, display_order)
SELECT mg.id, 'Medium', 0.00, 2
FROM modifier_groups mg
JOIN menu_items mi ON mg.menu_item_id = mi.id
WHERE mi.name = 'Chicken Momo' AND mg.name = 'Spice Level';

INSERT INTO modifier_options (modifier_group_id, name, price_adjustment, display_order)
SELECT mg.id, 'Hot', 0.00, 3
FROM modifier_groups mg
JOIN menu_items mi ON mg.menu_item_id = mi.id
WHERE mi.name = 'Chicken Momo' AND mg.name = 'Spice Level';

INSERT INTO modifier_options (modifier_group_id, name, price_adjustment, display_order)
SELECT mg.id, 'Extra Hot', 0.00, 4
FROM modifier_groups mg
JOIN menu_items mi ON mg.menu_item_id = mi.id
WHERE mi.name = 'Chicken Momo' AND mg.name = 'Spice Level';

-- Success! Your menu is now populated
-- View your menu with this query:
SELECT 
  mc.name as category,
  mi.name as item,
  mi.description,
  mi.price,
  mi.is_available
FROM menu_categories mc
LEFT JOIN menu_items mi ON mc.id = mi.category_id
WHERE mc.is_active = true
ORDER BY mc.display_order, mi.display_order;
