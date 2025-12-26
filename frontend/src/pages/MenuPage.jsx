import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { toast } from '../utils/toast';

const MenuPage = ({ addToCart }) => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(0);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const response = await api.get('/menu');
                if (response.data && response.data.categories) {
                    setMenu(response.data.categories);
                }
            } catch (e) {
                // Fallback mock data
                setMenu([
                    {
                        id: '1',
                        name: 'Nepalese Food Items',
                        items: [
                            { id: '1', name: 'Chicken Chow Mein', description: '6 ounces of spaghetti noodles onion chopped garlic ginger fresh vegetables, 3 ounces of chicken customer choice.', price: 12.99, is_available: true },
                            { id: '2', name: 'Chicken Momo', description: 'Chicken dumplings.', price: 12.99, is_available: true },
                            { id: '3', name: 'Chicken Jhol Momo', description: 'Traditional Nepalese dumplings filled with chicken in a flavorful broth.', price: 12.99, is_available: true },
                            { id: '4', name: 'Veg Momos', description: 'Steamed dumplings filled with vegetables.', price: 11.99, is_available: true },
                            { id: '5', name: 'Mix Buff Sukuti & Fried Chicken Momo (5 pcs)', description: 'Buff suki chow mein with 5 pieces of fried chicken momo.', price: 15.99, is_available: true },
                        ]
                    },
                    {
                        id: '2',
                        name: 'Indian Food',
                        items: [
                            { id: '6', name: 'Chicken Curry', description: 'Farm fresh chicken, made with authentic Nepali style, and chef recipe.', price: 13.99, is_available: true },
                            { id: '7', name: 'Paneer Tikka Masala', description: 'Paneer marinated with authentic herbs, yogurt, spices, and a vegan dish.', price: 13.00, is_available: true },
                            { id: '8', name: 'Goat Curry with Side Basmati Rice', description: 'Tender goat in a rich and flavorful curry served with basmati rice.', price: 15.99, is_available: true },
                        ]
                    },
                    {
                        id: '3',
                        name: 'Snacks',
                        items: [
                            { id: '9', name: 'Chatpate', description: 'Nepali amilo piro chat pat.', price: 6.99, is_available: true },
                            { id: '10', name: 'Samosa', description: 'Nepali and Indian is a famous vegan dish, is come with mint chutney.', price: 5.99, is_available: true },
                        ]
                    },
                    {
                        id: '4',
                        name: 'Drinks',
                        items: [
                            { id: '11', name: 'Chiya', description: 'Himalayan tea, milk cloves ginger black paper cardamom cinnamon, and sugar.', price: 3.50, is_available: true },
                        ]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const handleAddToCart = (item) => {
        if (!item.is_available) {
            toast.error('This item is currently unavailable');
            return;
        }
        addToCart(item);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <div className="text-text-muted">Loading menu...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-bg-surface border-b border-border">
                <div className="content-padding py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold">Menu</h1>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {menu.map((cat, idx) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(idx)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                                    activeCategory === idx
                                        ? 'bg-primary text-text-light'
                                        : 'bg-bg-elevated text-text-main hover:bg-border'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-grow content-padding py-6 pb-32">
                {menu[activeCategory]?.items && menu[activeCategory].items.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {menu[activeCategory].items.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card flex items-start gap-4"
                            >
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-base">{item.name}</h3>
                                        {idx < 2 && (
                                            <span className="flex items-center gap-1 text-xs text-accent">
                                                <Star size={12} fill="currentColor" />
                                                Popular
                                            </span>
                                        )}
                                        {!item.is_available && (
                                            <span className="text-xs bg-status-very-high/10 text-status-very-high px-2 py-0.5 rounded">
                                                Sold Out
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="text-sm text-text-muted mb-3 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-primary">
                                            ${parseFloat(item.price).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            disabled={!item.is_available}
                                            className="w-10 h-10 rounded-lg bg-primary text-text-light flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-text-muted">
                        <p>No items in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
