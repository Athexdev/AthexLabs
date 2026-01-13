import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, Activity } from 'lucide-react';

export const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/activity/logs/');
                setLogs(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div className="text-slate-400">Loading activity...</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-8 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 dark:text-white">
                <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Activity History
            </h3>

            <div className="space-y-4">
                {logs.length === 0 ? (
                    <p className="text-slate-500 text-sm">No activity recorded yet.</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-950/50 dark:border-slate-800/50">
                            <div className="mt-1">
                                <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200">{log.action}</h4>
                                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">{log.details}</p>
                                <span className="text-xs text-slate-400 mt-2 block dark:text-slate-600">
                                    {new Date(log.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
