import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/Button';
import { ArrowLeft, Box } from 'lucide-react';

export const Resources = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get(`/cloud/${id}/resources/`);
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, [id]);

    const handleAction = async (resourceId, action) => {
        try {
            // Optimistic update could go here, but let's wait for server for now
            const res = await api.post(`/cloud/${id}/resources/${resourceId}/action/`, { action });
            if (res.data.success) {
                // Update local state
                setData(prev => ({
                    ...prev,
                    resources: prev.resources.map(r =>
                        r.id === resourceId ? { ...r, status: res.data.new_status } : r
                    )
                }));
            }
        } catch (err) {
            console.error("Action failed", err);
            alert("Failed to perform action");
        }
    };

    if (loading) return <div className="text-slate-400">Loading resources...</div>;
    if (!data) return <div className="text-red-400">Failed to load resources.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => navigate(-1)} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{data.account}</h2>
                    <p className="text-slate-500 uppercase text-sm dark:text-slate-400">{data.provider}</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase dark:bg-slate-950 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Resource ID</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {data.resources.map((resource) => (
                            <tr key={resource.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 text-slate-900 font-mono text-sm dark:text-white">{resource.id}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Box className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                        {resource.type}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.status === 'running' ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                        {resource.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {resource.status === 'running' ? (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    className="h-8 px-2 text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                                    onClick={() => handleAction(resource.id, 'stop')}
                                                >
                                                    Stop
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="h-8 px-2 text-xs"
                                                    onClick={() => handleAction(resource.id, 'reboot')}
                                                >
                                                    Reboot
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="secondary"
                                                className="h-8 px-2 text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                                                onClick={() => handleAction(resource.id, 'start')}
                                            >
                                                Start
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
