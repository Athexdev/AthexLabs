import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '../components/Button';
import { Plus, Server, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnalyticsCharts } from '../components/AnalyticsCharts';

export const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/cloud/accounts/');
            setAccounts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <AnalyticsCharts />
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cloud Accounts</h2>
                <Link to="/connect">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Connect Cloud
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-slate-400">Loading accounts...</div>
            ) : accounts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-xl dark:bg-slate-900 dark:border-slate-800">
                    <Server className="w-12 h-12 text-slate-400 mx-auto mb-4 dark:text-slate-600" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2 dark:text-white">No accounts connected</h3>
                    <p className="text-slate-600 mb-6 dark:text-slate-400">Connect your AWS, GCP, or Azure accounts to get started.</p>
                    <Link to="/connect">
                        <Button variant="secondary">Connect Account</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account) => (
                        <div key={account.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${account.cloud_provider === 'aws' ? 'bg-orange-500/10 text-orange-500' :
                                    account.cloud_provider === 'gcp' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-sky-500/10 text-sky-500'
                                    }`}>
                                    {account.cloud_provider}
                                </span>
                                <span className="text-slate-500 text-xs">{new Date(account.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-white">{account.account_name}</h3>
                            <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <Link to={`/resources/${account.id}`}>
                                    <Button variant="secondary" className="text-sm py-1.5">View Resources</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
