import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Clock,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    ChevronRight,
    Loader2,
    TrendingUp,
    Activity,
    RefreshCw,
    UtensilsCrossed
} from 'lucide-react';
import api from '../api/client';
import { toast } from '../utils/toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [metrics, setMetrics] = useState({
        activeOrders: 0,
        totalSales: 0,
        prepTime: "14m",
        loadState: 'LOW'
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [ordersRes, volumeRes] = await Promise.all([
                api.get('/admin/orders').catch(() => ({ data: [] })),
                api.get('/metrics/volume').catch(() => ({ data: { load_state: 'LOW' } }))
            ]);
            const ordersData = ordersRes.data || [];
            setOrders(ordersData);
            setMetrics(prev => ({
                ...prev,
                activeOrders: ordersData.filter(o => o.status !== 'COMPLETED').length || 0,
                loadState: volumeRes.data?.load_state || 'LOW'
            }));
        } catch (err) {
            // Fallback mock data for demo
            const mockOrders = [
                { id: '101', customer_name: 'Sarah J.', items: [{ quantity: 2 }], total_amount: 32.50, status: 'NEW' },
                { id: '102', customer_name: 'Mike R.', items: [{ quantity: 1 }], total_amount: 14.50, status: 'PREP' },
                { id: '103', customer_name: 'Jane C.', items: [{ quantity: 3 }], total_amount: 48.00, status: 'READY' }
            ];
            setOrders(mockOrders);
            setMetrics(prev => ({
                ...prev,
                activeOrders: mockOrders.filter(o => o.status !== 'COMPLETED').length
            }));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
        toast.info('Refreshing orders...');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return { text: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/30' };
            case 'PREP': return { text: 'text-accent-blue', bg: 'bg-accent-blue/20', border: 'border-accent-blue/30' };
            case 'READY': return { text: 'text-success', bg: 'bg-success/20', border: 'border-success/30' };
            case 'COMPLETED': return { text: 'text-text-muted', bg: 'bg-bg-surface', border: 'border-white/5' };
            default: return { text: 'text-text-muted', bg: 'bg-bg-surface', border: 'border-white/5' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'NEW': return <Package size={16} />;
            case 'PREP': return <Clock size={16} />;
            case 'READY': return <CheckCircle2 size={16} />;
            default: return <Package size={16} />;
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-32">
            <div className="content-padding pt-12 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl mb-1">Command Center</h1>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Everest South Congress</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="w-10 h-10 bg-bg-surface rounded-full flex items-center justify-center"
                        >
                            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        </motion.button>
                        <Activity className="text-success animate-pulse" size={20} />
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-3 mb-6">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/admin/menu')}
                        className="flex-1 bg-gradient-to-r from-primary/20 to-accent-purple/20 border border-primary/30 rounded-xl p-4 flex items-center gap-3 hover:from-primary/30 hover:to-accent-purple/30 transition-all"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <UtensilsCrossed size={24} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold">Manage Menu</p>
                            <p className="text-xs text-text-muted">Add, edit, update prices</p>
                        </div>
                        <ChevronRight size={20} className="text-text-dim ml-auto" />
                    </motion.button>
                </div>
            </div>

            {/* Stats Cards - Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto px-6 pb-6 no-scrollbar">
                {[
                    { label: "Active", value: metrics.activeOrders, icon: <Package size={18} />, color: 'text-primary' },
                    { label: "Load", value: metrics.loadState, icon: <BarChart3 size={18} />, color: 'text-accent-blue' },
                    { label: "Prep", value: metrics.prepTime, icon: <Clock size={18} />, color: 'text-warning' },
                    { label: "Sales", value: "$1.2k", icon: <TrendingUp size={18} />, color: 'text-success' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="min-w-[140px] card flex flex-col gap-3 bg-gradient-to-br from-bg-card to-bg-elevated"
                    >
                        <div className={`${stat.color}`}>{stat.icon}</div>
                        <div className="text-2xl font-black">{stat.value}</div>
                        <div className="text-[10px] text-text-dim uppercase font-bold tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Orders List */}
            <div className="content-padding mt-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm uppercase font-black tracking-widest text-text-dim">Live Pipeline</h2>
                    <span className="text-xs text-text-muted">{orders.length} orders</span>
                </div>

                <AnimatePresence>
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => {
                            const statusColors = getStatusColor(order.status);
                            const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1;
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    whileHover={{ scale: 1.01 }}
                                    className={`card flex items-center justify-between ${statusColors.bg} border-2 ${statusColors.border}`}
                                >
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className={`w-12 h-12 rounded-xl ${statusColors.bg} flex items-center justify-center ${statusColors.text}`}>
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-base font-bold mb-1">
                                                #{String(order.id).slice(-6)} • {order.customer_name || 'Guest'}
                                            </h3>
                                            <p className="text-xs text-text-muted">
                                                {itemCount} {itemCount === 1 ? 'item' : 'items'} • ${parseFloat(order.total_amount || 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-black uppercase tracking-widest ${statusColors.text} badge ${statusColors.bg}`}>
                                            {order.status}
                                        </span>
                                        <ChevronRight size={18} className="text-text-dim" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {orders.length === 0 && (
                    <div className="card text-center py-12">
                        <Package size={48} className="text-text-dim mx-auto mb-4" />
                        <p className="text-text-muted">No active orders</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
