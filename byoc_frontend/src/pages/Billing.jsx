import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CreditCard, Download, FileText, AlertCircle } from 'lucide-react';

export const Billing = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await api.get('/billing/invoices/');
                setInvoices(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-500/10 text-green-500';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500';
            case 'overdue': return 'bg-red-500/10 text-red-500';
            default: return 'bg-slate-800 text-slate-400';
        }
    };

    const handleDownload = async (invoiceId) => {
        try {
            const response = await api.get(`/billing/invoices/${invoiceId}/download/`, {
                responseType: 'blob', // Important for handling binary data
            });

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download failed', err);
            alert('Failed to download invoice');
        }
    };

    if (loading) return <div className="text-slate-400">Loading billing info...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 dark:text-white">
                <CreditCard className="w-8 h-8 text-blue-500 dark:text-blue-400" /> Billing & Invoices
            </h2>

            {/* Billing Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-xl dark:bg-slate-900 dark:border-slate-800">
                    <h3 className="text-slate-500 text-xs uppercase font-semibold mb-2 dark:text-slate-400">Current Balance</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">$85.20</p>
                    <span className="text-xs text-yellow-600 mt-2 flex items-center gap-1 dark:text-yellow-500">
                        <AlertCircle className="w-3 h-3" /> Payment due by Feb 15
                    </span>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-xl dark:bg-slate-900 dark:border-slate-800">
                    <h3 className="text-slate-500 text-xs uppercase font-semibold mb-2 dark:text-slate-400">Last Payment</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">$120.50</p>
                    <span className="text-xs text-green-600 mt-2 dark:text-green-500">Paid on Jan 15, 2024</span>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/50">
                    <div>
                        <h3 className="text-slate-500 text-xs uppercase font-semibold mb-1 dark:text-slate-400">Payment Method</h3>
                        <p className="text-slate-900 font-medium flex items-center gap-2 dark:text-white">
                            <span className="bg-slate-100 p-1 rounded dark:bg-white/10">VISA</span> **** 4242
                        </p>
                    </div>
                    <div className="text-blue-500 text-sm hover:underline dark:text-blue-400">Manage</div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-8 dark:bg-slate-900 dark:border-slate-800">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between dark:border-slate-800">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Invoice History</h3>
                    <button className="text-sm text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">Download All</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase dark:bg-slate-950 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Invoice ID</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 text-slate-900 font-mono text-sm flex items-center gap-2 dark:text-white">
                                        <FileText className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                                        {inv.invoice_id}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm dark:text-slate-400">{inv.issue_date}</td>
                                    <td className="px-6 py-4 text-slate-900 font-medium dark:text-white">${inv.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDownload(inv.invoice_id)}
                                            className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-full transition-colors dark:hover:text-white dark:hover:bg-slate-700/50"
                                            title="Download PDF"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
