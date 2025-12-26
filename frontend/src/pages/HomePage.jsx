import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Star, Instagram, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const HomePage = () => {
    const [status, setStatus] = useState({
        isOpen: true,
        kitchenLoad: 'LOW',
        estimatedTime: '12-15 min'
    });

    useEffect(() => {
        // Fetch real status from API
        const fetchStatus = async () => {
            try {
                const response = await api.get('/metrics/volume');
                const loadState = response.data?.load_state || 'LOW';
                setStatus(prev => ({
                    ...prev,
                    kitchenLoad: loadState,
                    estimatedTime: loadState === 'LOW' ? '12-15 min' : loadState === 'MEDIUM' ? '18-22 min' : '25-30 min'
                }));
            } catch (error) {
                console.log('Using default status');
            }
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const getLoadColor = (load) => {
        switch (load) {
            case 'LOW': return 'status-badge low';
            case 'MEDIUM': return 'status-badge medium';
            case 'HIGH': return 'status-badge high';
            default: return 'status-badge low';
        }
    };

    const popularItems = [
        { name: "Chicken Chow Mein", description: "6 oz noodles, fresh vegetables, 3 oz chicken", price: 12.99, id: 'chow-mein' },
        { name: "Chicken Momo", description: "Traditional Nepalese dumplings", price: 12.99, id: 'momo' },
        { name: "Chatpate", description: "Nepali amilo piro chat pat", price: 6.99, id: 'chatpate' },
        { name: "Chicken Curry", description: "Farm fresh chicken, authentic Nepali style", price: 13.99, id: 'curry' }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Status Bar - Sticky */}
            <div className="sticky top-0 z-50 bg-bg-surface border-b border-border">
                <div className="content-padding py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-status-low' : 'bg-status-very-high'}`} />
                            <span className="text-sm font-semibold">{status.isOpen ? 'Open' : 'Closed'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="text-text-muted">Kitchen:</span>
                            <span className={getLoadColor(status.kitchenLoad)}>
                                {status.kitchenLoad}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Clock size={14} />
                            <span>{status.estimatedTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-primary text-text-light content-padding py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold mb-3 text-text-light">Everest</h1>
                    <p className="text-lg mb-8 opacity-90">Authentic Nepalese Street Food</p>
                    <div className="flex flex-col gap-3">
                        <Link to="/menu" className="btn-accent">
                            Order Takeout
                            <ChevronRight size={20} />
                        </Link>
                        <Link to="/menu" className="btn-secondary bg-white/10 border-white/20 text-text-light hover:bg-white/20">
                            View Menu
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Location & Hours */}
            <div className="content-padding py-6 bg-bg-surface border-b border-border">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={24} className="text-accent" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-semibold mb-1">1310 West Howard Lane</h3>
                        <p className="text-sm text-text-muted mb-2">Austin, TX 78728</p>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock size={14} className="text-text-dim" />
                            <span className="text-sm text-text-muted">Open until 12:00 AM</span>
                        </div>
                        <p className="text-xs text-text-dim mt-2">Pickup only — no dine-in reservations</p>
                    </div>
                </div>
            </div>

            {/* Popular Items */}
            <div className="content-padding py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Popular Items</h2>
                    <Link to="/menu" className="text-sm text-accent font-semibold flex items-center gap-1">
                        See All
                        <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {popularItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card"
                        >
                            <div className="aspect-square bg-bg-elevated rounded-lg mb-3 flex items-center justify-center">
                                <span className="text-3xl">🍜</span>
                            </div>
                            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-text-muted line-clamp-2 mb-3">{item.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">${item.price}</span>
                                <Link
                                    to="/menu"
                                    className="w-8 h-8 rounded-lg bg-primary text-text-light flex items-center justify-center hover:bg-primary-dark transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="content-padding py-8 bg-bg-elevated mt-auto">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-6">
                        <a href="#" className="text-text-muted hover:text-primary transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="text-text-muted hover:text-primary transition-colors">
                            <Star size={20} />
                        </a>
                        <a href="tel:+1234567890" className="text-text-muted hover:text-primary transition-colors">
                            <Phone size={20} />
                        </a>
                    </div>
                    <p className="text-center text-xs text-text-dim">
                        Powered by Everest Food Truck OS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
