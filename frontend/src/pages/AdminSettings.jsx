import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../api/client';
import { toast } from '../utils/toast';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        kitchenLoad: 'LOW',
        deliveryTraffic: 'OFF',
        avgPrepTime: 15,
        pickupBuffer: 5,
        hours: '1:00 PM – 12:00 AM',
        isClosed: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/admin/settings');
                setSettings(response.data || settings);
            } catch (error) {
                console.log('Using default settings');
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            toast.success('Settings saved!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <div className="space-y-6">
                {/* Kitchen Load */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Kitchen Load</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Walk-in Traffic</label>
                            <select
                                value={settings.kitchenLoad}
                                onChange={(e) => setSettings({ ...settings, kitchenLoad: e.target.value })}
                                className="input-field"
                            >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Delivery Traffic</label>
                            <select
                                value={settings.deliveryTraffic}
                                onChange={(e) => setSettings({ ...settings, deliveryTraffic: e.target.value })}
                                className="input-field"
                            >
                                <option value="OFF">OFF</option>
                                <option value="LIGHT">LIGHT</option>
                                <option value="HEAVY">HEAVY</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Prep Defaults */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Prep Defaults</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Avg Prep Time (minutes)</label>
                            <input
                                type="number"
                                value={settings.avgPrepTime}
                                onChange={(e) => setSettings({ ...settings, avgPrepTime: parseInt(e.target.value) })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Pickup Buffer (minutes)</label>
                            <input
                                type="number"
                                value={settings.pickupBuffer}
                                onChange={(e) => setSettings({ ...settings, pickupBuffer: parseInt(e.target.value) })}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Business Info */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Business Info</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Hours</label>
                            <input
                                type="text"
                                value={settings.hours}
                                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                                className="input-field"
                                placeholder="1:00 PM – 12:00 AM"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isClosed"
                                checked={settings.isClosed}
                                onChange={(e) => setSettings({ ...settings, isClosed: e.target.checked })}
                                className="w-5 h-5 rounded accent-primary"
                            />
                            <label htmlFor="isClosed" className="font-semibold">
                                Currently Closed
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                >
                    {saving ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;

