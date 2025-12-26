import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ items, removeItem, updateQuantity, total, clearCart }) => {
    const navigate = useNavigate();

    // Group items by ID and count quantities
    const groupedItems = useMemo(() => {
        const grouped = {};
        items.forEach((item, idx) => {
            const key = item.id || item.cartId || idx;
            if (!grouped[key]) {
                grouped[key] = {
                    ...item,
                    quantity: 1,
                    indices: [idx]
                };
            } else {
                grouped[key].quantity += 1;
                grouped[key].indices.push(idx);
            }
        });
        return Object.values(grouped);
    }, [items]);

    const EmptyState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <div className="w-20 h-20 rounded-full bg-bg-elevated flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-text-dim" />
            </div>
            <h2 className="mb-2 font-bold">Your Cart is Empty</h2>
            <p className="text-sm text-text-muted mb-8 max-w-[280px]">
                Start adding delicious items from our menu
            </p>
            <button
                onClick={() => navigate('/menu')}
                className="btn-primary"
            >
                Browse Menu
            </button>
        </motion.div>
    );

    const handleQuantityChange = (item, change) => {
        if (change < 0) {
            if (item.indices.length > 0) {
                removeItem(item.indices[0]);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="content-padding pt-12 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Cart</h1>
                        <p className="text-xs text-text-muted mt-1">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="text-sm text-danger font-semibold"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="flex-grow content-padding flex flex-col gap-4 pb-32">
                {items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <AnimatePresence>
                        {groupedItems.map((item, idx) => (
                            <motion.div
                                key={item.id || item.cartId || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="card flex items-center gap-4"
                            >
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                                    {item.description && (
                                        <p className="text-xs text-text-muted line-clamp-1 mb-2">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-primary">
                                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item, -1)}
                                                className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => navigate('/menu')}
                                                className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                                title="Add more from menu"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        item.indices.forEach(idx => removeItem(idx));
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-text-dim hover:text-danger transition-colors flex-shrink-0"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {items.length > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="content-padding pb-32 pt-6"
                >
                    <div className="card bg-bg-surface">
                        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                            <Clock size={16} />
                            <span>Estimated pickup: 12-15 min</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                            <span className="text-lg font-semibold">Subtotal</span>
                            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary"
                        >
                            Proceed to Checkout
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Cart;
