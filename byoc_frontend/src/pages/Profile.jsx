import React, { useState } from 'react';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { Save, User, Lock } from 'lucide-react';
import { ActivityLogs } from '../components/ActivityLogs';

export const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (formData.new_password && formData.new_password !== formData.confirm_password) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            await api.put('/me/update/', formData);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 dark:text-white">Profile Settings</h2>

            <div className="bg-white border border-slate-200 rounded-xl p-6 dark:bg-slate-900 dark:border-slate-800">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status.message && (
                        <div className={`p-4 rounded-lg text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm uppercase font-semibold border-b border-slate-200 pb-2 dark:text-slate-400 dark:border-slate-800">
                            <User className="w-4 h-4" /> Basic Info
                        </div>
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="username"
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm uppercase font-semibold border-b border-slate-200 pb-2 dark:text-slate-400 dark:border-slate-800">
                            <Lock className="w-4 h-4" /> Change Password
                        </div>
                        <Input
                            label="Current Password"
                            name="current_password"
                            type="password"
                            value={formData.current_password}
                            onChange={handleChange}
                            placeholder="Required to set new password"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="New Password"
                                name="new_password"
                                type="password"
                                value={formData.new_password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                            />
                            <Input
                                label="Confirm New Password"
                                name="confirm_password"
                                type="password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Re-enter new password"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>

            <ActivityLogs />
        </div>
    );
};
