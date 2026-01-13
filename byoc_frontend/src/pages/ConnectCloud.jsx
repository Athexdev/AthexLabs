import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowLeft } from 'lucide-react';

export const ConnectCloud = () => {
    const [provider, setProvider] = useState('aws');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cloud/connect/', {
                cloud_provider: provider,
                account_name: name
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to connect cloud account');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <div className="bg-white border border-slate-200 rounded-xl p-8 dark:bg-slate-900 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 dark:text-white">Connect New Cloud Account</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cloud Provider</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['aws', 'gcp', 'azure'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setProvider(p)}
                                    className={`p-4 rounded-lg border text-center uppercase font-bold transition-all ${provider === p
                                        ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-blue-500/50'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        id="name"
                        label="Account Name (Alias)"
                        placeholder="e.g. Production AWS"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full">
                        Connect Account
                    </Button>
                </form>
            </div>
        </div>
    );
};
