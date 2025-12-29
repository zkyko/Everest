-- Comprehensive Menu Data for Everest Food Truck
-- Run this in Supabase SQL Editor after running SUPABASE_SCHEMA.sql

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM order_item_modifiers;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM modifier_options;
-- DELETE FROM modifier_groups;
-- DELETE FROM menu_items;
-- DELETE FROM menu_categories;

-- Insert Menu Categories
INSERT INTO menu_categories (id, name, name_np, description, display_order, is_active) VALUES
('cat-momos', 'Momos', 'मोमो', 'Traditional Nepalese dumplings - steamed, fried, or in soup', 1, true),
('cat-chowmein', 'Chow Mein', 'चाउमिन', 'Stir-fried noodles with vegetables and your choice of protein', 2, true),
('cat-nepali', 'Nepali Food', 'नेपाली खाना', 'Authentic Nepalese dishes', 3, true),
('cat-indian', 'Indian Food', 'भारतीय खाना', 'Traditional Indian curries and dishes', 4, true),
('cat-appetizers', 'Appetizers', 'एपेटाइजर', 'Start your meal with these delicious starters', 5, true),
('cat-desserts', 'Desserts', 'मिठाई', 'Sweet endings to your meal', 6, true),
('cat-drinks', 'Drinks', 'पेय पदार्थ', 'Beverages and refreshments', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Menu Items

-- MOMOS
INSERT INTO menu_items (id, category_id, name, name_np, description, price, is_available, display_order, image_url) VALUES
('item-chicken-momo', 'cat-momos', 'Chicken Momo', 'कुखुरा मोमो', 'Steamed chicken dumplings served with authentic Nepalese sauce', 12.99, true, 1, NULL),
('item-chicken-fried-momo', 'cat-momos', 'Chicken Fried Momo', 'फ्राइड कुखुरा मोमो', 'Crispy fried chicken dumplings - customer favorite!', 13.99, true, 2, NULL),
('item-veg-momo', 'cat-momos', 'Veg Momo', 'तरकारी मोमो', 'Steamed vegetable dumplings with fresh veggies', 11.99, true, 3, NULL),
('item-veg-chilli-momo', 'cat-momos', 'Veg Chilli Momo', 'भेज चिल्ली मोमो', 'Vegetable momos tossed in spicy chilli sauce', 12.99, true, 4, NULL),
('item-chicken-jhol-momo', 'cat-momos', 'Chicken Jhol Momo', 'कुखुरा झोल मोमो', 'Chicken dumplings in flavorful broth', 13.99, true, 5, NULL),
('item-chicken-chilli-momo', 'cat-momos', 'Chicken Chilli Momo', 'कुखुरा चिल्ली मोमो', 'Chicken momos tossed in spicy Indo-Chinese sauce', 13.99, true, 6, NULL)
ON CONFLICT (id) DO NOTHING;

-- CHOW MEIN
INSERT INTO menu_items (id, category_id, name, name_np, description, price, is_available, display_order, image_url) VALUES
('item-chicken-chowmein', 'cat-chowmein', 'Chicken Chow Mein', 'कुखुरा चाउमिन', '6 oz noodles with fresh vegetables and 3 oz chicken', 12.99, true, 1, NULL),
('item-veg-chowmein', 'cat-chowmein', 'Veg Chow Mein', 'तरकारी चाउमिन', 'Stir-fried noodles with mixed vegetables', 11.99, true, 2, NULL),
('item-sukuti-chowmein', 'cat-chowmein', 'Sukuti Chow Mein', 'सुकुटी चाउमिन', 'Chow mein with dried spiced buffalo meat - authentic Nepali style', 14.99, true, 3, NULL),
('item-egg-chowmein', 'cat-chowmein', 'Egg Chow Mein', 'अण्डा चाउमिन', 'Vegetable chow mein with scrambled eggs', 11.99, true, 4, NULL)
ON CONFLICT (id) DO NOTHING;

-- NEPALI FOOD
INSERT INTO menu_items (id, category_id, name, name_np, description, price, is_available, display_order, image_url) VALUES
('item-chatpate', 'cat-nepali', 'Chatpate', 'चटपटे', 'Spicy and sour Nepali street snack with puffed rice', 6.99, true, 1, NULL),
('item-chicken-thuppa', 'cat-nepali', 'Chicken Thuppa', 'कुखुरा थुप्पा', 'Traditional Nepali noodle soup with chicken', 12.99, true, 2, NULL),
('item-veg-thuppa', 'cat-nepali', 'Veg Thuppa', 'तरकारी थुप्पा', 'Hearty vegetable noodle soup - 3 oz', 10.99, true, 3, NULL),
('item-chilli-chicken', 'cat-nepali', 'Chilli Chicken', 'चिल्ली चिकन', 'Indo-Nepali style spicy chicken - 6 oz', 12.99, true, 4, NULL),
('item-sekuwa', 'cat-nepali', 'Chicken Sekuwa', 'कुखुरा सेकुवा', 'Grilled marinated chicken - traditional Nepali BBQ', 14.99, true, 5, NULL)
ON CONFLICT (id) DO NOTHING;

-- INDIAN FOOD
INSERT INTO menu_items (id, category_id, name, name_np, description, price, is_available, display_order, image_url) VALUES
('item-chicken-curry', 'cat-indian', 'Chicken Curry', 'कुखुरा करी', 'Authentic Nepali style chicken curry with aromatic spices', 13.99, true, 1, NULL),
('item-paneer-tikka', 'cat-indian', 'Paneer Tikka Masala', 'पनीर टिक्का मसाला', 'Marinated paneer in rich spiced gravy', 13.99, true, 2, NULL),
('item-dal', 'cat-indian', 'Dal (Lentil Soup)', 'दाल', 'Traditional lentil soup with spices', 8.99, true, 3, NULL),
('item-chicken-fried-rice', 'cat-indian', 'Chicken Fried Rice', 'कुखुरा फ्राइड राइस', 'Fried rice with chicken and fresh vegetables', 12.99, true, 4, NULL),
('item-veg-fried-rice', 'cat-indian', 'Veg Fried Rice', 'तरकारी फ्राइड राइस', 'Fried rice with mixed vegetables', 11.99, true, 5, NULL)
ON CONFLICT (id) DO NOTHING;

-- APPETIZERS
INSERT INTO menu_items (id, category_id, name, name_np, description, price, is_available, display_order, image_url) VALUES
('item-samosa', 'cat-appetizers', 'Samosa (2 pcs)', 'समोसा', 'Crispy pastry filled with spiced potatoes and peas', 5.99, true, 1, NULL),
('item-pakora', 'cat-appetizers', 'Vegetable Pakora', 'तरकारी पकौडा', 'Mixed vegetable fritters - crispy and delicious', 7.99, true, 2, NULL),
('item-papad', 'cat-appetizers', 'Papad', 'पापड', 'Crispy lentil crackers', 2.99, true, 3, NULL)
ON CONFLICT (id) DO NOTHING;

-- DESSERTS
INSERT INTO menu_items (id, category_id, name, name_np, description, price, is_available, display_order, image_url) VALUES
('item-gulab-jamun', 'cat-desserts', 'Gulab Jamun (2 pcs)', 'गुलाब जामुन', 'Traditional Indian sweet - milky dough fried and soaked in fragrant syrup', 3.99, true, 1, NULL),
('item-ras-malai', 'cat-desserts', 'Ras Malai (2 pcs)', 'रस मलाई', 'Soft cheese discs soaked in sweet milk, garnished with pistachios', 3.99, true, 2, NULL)
ON CONFLICT (id) DO NOTHING;

-- DRINKS
INSERT INTO menu_items (id, category_id, name, name_np, description, price, is_available, display_order, image_url) VALUES
('item-mango-lassi', 'cat-drinks', 'Mango Lassi', 'आँप लस्सी', 'Traditional Indian drink with mango and yogurt', 3.99, true, 1, NULL),
('item-milk-tea', 'cat-drinks', 'Milk Tea (Chai)', 'दूध चिया', 'Black tea with milk and sugar, infused with cardamom', 3.50, true, 2, NULL),
('item-black-tea', 'cat-drinks', 'Black Tea', 'कालो चिया', 'Brewed black tea - robust and flavorful', 3.50, true, 3, NULL),
('item-coke', 'cat-drinks', 'Can Coke', 'कोक', 'Classic Coca-Cola', 1.85, true, 4, NULL),
('item-water', 'cat-drinks', 'Bottled Water', 'पानी', 'Clear, refreshing bottled water', 1.00, true, 5, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert Modifier Groups
INSERT INTO modifier_groups (id, name, name_np, description, is_required, min_selections, max_selections, display_order) VALUES
('mod-spice', 'Spice Level', 'मसाला स्तर', 'How spicy would you like it?', true, 1, 1, 1),
('mod-extras', 'Add Extras', 'थप', 'Add extra items to your order', false, 0, 5, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert Modifier Options for Spice Level
INSERT INTO modifier_options (id, modifier_group_id, name, name_np, price_modifier, is_available, display_order) VALUES
('spice-mild', 'mod-spice', 'Mild', 'हल्का', 0.00, true, 1),
('spice-medium', 'mod-spice', 'Medium', 'मध्यम', 0.00, true, 2),
('spice-hot', 'mod-spice', 'Hot', 'तातो', 0.00, true, 3),
('spice-extra-hot', 'mod-spice', 'Extra Hot', 'अति तातो', 0.00, true, 4)
ON CONFLICT (id) DO NOTHING;

-- Insert Modifier Options for Extras
INSERT INTO modifier_options (id, modifier_group_id, name, name_np, price_modifier, is_available, display_order) VALUES
('extra-rice', 'mod-extras', 'Extra Rice', 'थप भात', 2.00, true, 1),
('extra-meat', 'mod-extras', 'Extra Meat', 'थप मासु', 3.50, true, 2),
('extra-veggies', 'mod-extras', 'Extra Vegetables', 'थप तरकारी', 2.00, true, 3),
('extra-sauce', 'mod-extras', 'Extra Sauce', 'थप चटनी', 1.00, true, 4),
('extra-spicy-sauce', 'mod-extras', 'Extra Spicy Sauce', 'थप तातो चटनी', 1.00, true, 5)
ON CONFLICT (id) DO NOTHING;

-- Link modifier groups to menu items that need them
-- Momos
INSERT INTO menu_item_modifiers (menu_item_id, modifier_group_id) VALUES
('item-chicken-momo', 'mod-spice'),
('item-chicken-momo', 'mod-extras'),
('item-chicken-fried-momo', 'mod-spice'),
('item-chicken-fried-momo', 'mod-extras'),
('item-veg-momo', 'mod-spice'),
('item-veg-momo', 'mod-extras'),
('item-veg-chilli-momo', 'mod-spice'),
('item-chicken-jhol-momo', 'mod-spice'),
('item-chicken-chilli-momo', 'mod-spice')
ON CONFLICT DO NOTHING;

-- Chow Mein
INSERT INTO menu_item_modifiers (menu_item_id, modifier_group_id) VALUES
('item-chicken-chowmein', 'mod-spice'),
('item-chicken-chowmein', 'mod-extras'),
('item-veg-chowmein', 'mod-spice'),
('item-veg-chowmein', 'mod-extras'),
('item-sukuti-chowmein', 'mod-spice'),
('item-sukuti-chowmein', 'mod-extras'),
('item-egg-chowmein', 'mod-spice')
ON CONFLICT DO NOTHING;

-- Nepali Food
INSERT INTO menu_item_modifiers (menu_item_id, modifier_group_id) VALUES
('item-chatpate', 'mod-spice'),
('item-chicken-thuppa', 'mod-spice'),
('item-veg-thuppa', 'mod-spice'),
('item-chilli-chicken', 'mod-spice'),
('item-sekuwa', 'mod-spice')
ON CONFLICT DO NOTHING;

-- Indian Food
INSERT INTO menu_item_modifiers (menu_item_id, modifier_group_id) VALUES
('item-chicken-curry', 'mod-spice'),
('item-chicken-curry', 'mod-extras'),
('item-paneer-tikka', 'mod-spice'),
('item-paneer-tikka', 'mod-extras'),
('item-dal', 'mod-spice'),
('item-chicken-fried-rice', 'mod-spice'),
('item-chicken-fried-rice', 'mod-extras'),
('item-veg-fried-rice', 'mod-spice'),
('item-veg-fried-rice', 'mod-extras')
ON CONFLICT DO NOTHING;

-- Verification Query (run this to check your menu)
-- SELECT 
--   mc.name as category,
--   mi.name as item,
--   mi.price,
--   mi.is_available
-- FROM menu_categories mc
-- LEFT JOIN menu_items mi ON mc.id = mi.category_id
-- WHERE mc.is_active = true
-- ORDER BY mc.display_order, mi.display_order;

