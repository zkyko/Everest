import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Package, CreditCard, Settings, Activity, X, Menu as MenuIcon
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/orders', label: 'Orders', icon: Package },
        { path: '/admin/payments', label: 'Payments', icon: CreditCard },
        { path: '/admin/integrations', label: 'Integrations', icon: Activity },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
        { path: '/admin/menu', label: 'Menu', icon: MenuIcon },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-bg-main">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: sidebarOpen ? 0 : -280 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-bg-surface border-r border-border z-40 lg:relative lg:z-auto lg:translate-x-0"
            >
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">Everest Admin</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <nav className="p-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                                    active
                                        ? 'bg-primary text-text-light'
                                        : 'text-text-main hover:bg-bg-elevated'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </motion.aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">
                <div className="lg:hidden p-4 border-b border-border bg-bg-surface sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center"
                    >
                        <MenuIcon size={20} />
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;

