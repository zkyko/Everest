import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, ChevronLeft, Shield, Mountain } from 'lucide-react';
import api from '../api/client';
import { toast } from '../utils/toast';

const AdminLogin = ({ setIsAdmin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/admin/auth/login', { email, password });
            if (response.data.access_token) {
                localStorage.setItem('adminToken', response.data.access_token);
                setIsAdmin(true);
                toast.success('Login successful!');
                navigate('/admin');
            }
        } catch (err) {
            // Fallback for demo
            if (email === 'admin@everest.com' && password === 'admin123') {
                localStorage.setItem('adminToken', 'mock-token');
                setIsAdmin(true);
                toast.success('Login successful!');
                navigate('/admin');
            } else {
                const errorMsg = err.response?.data?.detail || 'Authentication failed. Please check your credentials.';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen content-padding pt-12">
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="w-10 h-10 bg-bg-surface rounded-full flex items-center justify-center mb-8 hover:bg-bg-elevated transition-colors"
            >
                <ChevronLeft size={20} />
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mb-12"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent-purple/20 rounded-3xl flex items-center justify-center mb-6">
                    <Shield size={40} className="text-primary" />
                </div>
                <h1 className="mb-3 text-center">Admin Access</h1>
                <p className="text-text-muted text-sm text-center max-w-[280px]">
                    Elevate your operations. Login to Command Center.
                </p>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-danger/10 border-2 border-danger/30 text-danger p-4 rounded-2xl mb-8 flex items-center gap-3"
                >
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span className="text-sm font-bold">{error}</span>
                </motion.div>
            )}

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleLogin}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-3">
                    <label className="text-xs uppercase font-black text-text-dim tracking-widest ml-1">
                        Email / Callsign
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@everest.com"
                            className="input-field pl-12"
                            required
                            autoComplete="email"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-xs uppercase font-black text-text-dim tracking-widest ml-1">
                        Password / Keycode
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-field pl-12"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary py-5 mt-4"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Authenticating...
                        </>
                    ) : (
                        <>
                            <Shield size={20} />
                            Initiate Login
                        </>
                    )}
                </motion.button>
            </motion.form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pb-12 pt-12 text-center"
            >
                <div className="inline-flex items-center gap-2 text-[10px] text-text-dim uppercase tracking-widest font-black">
                    <Mountain size={12} />
                    Secure Terminal • V1.0.0
                </div>
                <p className="text-xs text-text-muted mt-4">
                    Demo: admin@everest.com / admin123
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
