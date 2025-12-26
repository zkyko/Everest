import React, { useState, useEffect } from 'react';
import { CheckCircle2, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/client';

const AdminPayments = () => {
    const [status, setStatus] = useState({
        connected: true,
        mode: 'test',
        lastPayment: null,
        lastWebhook: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await api.get('/admin/payments');
                setStatus(response.data || status);
            } catch (error) {
                console.log('Using default status');
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Payments</h1>

            <div className="card mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Stripe Status</h2>
                    <div className="flex items-center gap-2">
                        {status.connected ? (
                            <CheckCircle2 size={24} className="text-status-low" />
                        ) : (
                            <AlertCircle size={24} className="text-status-very-high" />
                        )}
                        <span className="font-semibold">{status.connected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                </div>
                <div className="mb-4">
                    <span className="text-sm text-text-muted">Mode: </span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        status.mode === 'test' ? 'bg-status-medium/10 text-status-medium' : 'bg-status-low/10 text-status-low'
                    }`}>
                        {status.mode === 'test' ? 'Test' : 'Live'}
                    </span>
                </div>
                <button
                    onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                    className="btn-secondary flex items-center gap-2"
                >
                    <ExternalLink size={18} />
                    Open Stripe Dashboard
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="font-semibold mb-2">Last Payment Received</h3>
                    {status.lastPayment ? (
                        <div className="text-sm text-text-muted">
                            <div>${status.lastPayment.amount}</div>
                            <div>{new Date(status.lastPayment.date).toLocaleString()}</div>
                        </div>
                    ) : (
                        <div className="text-sm text-text-muted">No payments yet</div>
                    )}
                </div>

                <div className="card">
                    <h3 className="font-semibold mb-2">Last Webhook Received</h3>
                    {status.lastWebhook ? (
                        <div className="text-sm text-text-muted">
                            <div>{status.lastWebhook.type}</div>
                            <div>{new Date(status.lastWebhook.date).toLocaleString()}</div>
                        </div>
                    ) : (
                        <div className="text-sm text-text-muted">No webhooks yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;

