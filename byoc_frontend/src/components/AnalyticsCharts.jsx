import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AnalyticsCharts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/dashboard/analytics/');
                setData(res.data.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-slate-500 text-sm animate-pulse">Loading analytics...</div>;
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Cost Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
                <h3 className="text-slate-400 text-sm uppercase font-semibold mb-2">Total Estimated Cost</h3>
                <p className="text-4xl text-white font-bold">${data.total_cost}</p>
                <span className="text-xs text-slate-500 mt-2">Current Month</span>
            </div>

            {/* Cost History Chart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl col-span-1 lg:col-span-1">
                <h3 className="text-white font-semibold mb-4">Cost Trend</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.cost_history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Resource Distribution */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="text-white font-semibold mb-4">Resource Distribution</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.resource_distribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.resource_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                        {data.resource_distribution.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-1 text-xs text-slate-400">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
