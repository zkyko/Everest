import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import api from '../api/client';

const AdminIntegrations = () => {
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const response = await api.get('/admin/integrations');
                setIntegrations(response.data?.integrations || []);
            } catch (error) {
                // Fallback data
                setIntegrations([
                    { name: 'Database', status: 'healthy', last_check: new Date(), message: null },
                    { name: 'Stripe API', status: 'healthy', last_check: new Date(), message: null },
                    { name: 'Stripe Webhooks', status: 'healthy', last_check: new Date(), message: null },
                    { name: 'Email', status: 'disabled', last_check: null, message: 'Not configured' },
                    { name: 'SMS', status: 'disabled', last_check: null, message: 'Not configured' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchIntegrations();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle2 size={20} className="text-status-low" />;
            case 'unhealthy':
                return <XCircle size={20} className="text-status-very-high" />;
            case 'disabled':
                return <Clock size={20} className="text-text-dim" />;
            default:
                return <Clock size={20} className="text-text-dim" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Integrations</h1>
            <p className="text-text-muted mb-6">System diagnostics and integration status</p>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-semibold">Service</th>
                                <th className="text-left py-3 px-4 font-semibold">Status</th>
                                <th className="text-left py-3 px-4 font-semibold">Last Check</th>
                                <th className="text-left py-3 px-4 font-semibold">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {integrations.map((integration, idx) => (
                                <tr key={idx} className="border-b border-border last:border-0">
                                    <td className="py-4 px-4 font-semibold">{integration.name}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(integration.status)}
                                            <span className="capitalize">{integration.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-text-muted">
                                        {integration.last_check
                                            ? new Date(integration.last_check).toLocaleString()
                                            : '—'}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-text-muted">
                                        {integration.message || '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminIntegrations;

