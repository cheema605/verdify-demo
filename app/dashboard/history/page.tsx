'use client';

import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from '@/components/UI';
import { Search, Filter, Download, MoreVertical, Shield } from 'lucide-react';
import { Project } from '@/types';

const defaultMockLogs = [
    { id: 101, user: 'Toby B.', action: 'Created Analysis', target: 'Iowa Corn Yield', time: '2 hours ago', type: 'System' },
    { id: 102, user: 'Sarah J.', action: 'Exported GeoTIFF', target: 'Amazon Monitoring', time: '5 hours ago', type: 'Action' },
    { id: 104, user: 'Admin', action: 'Changed MFA Policy', target: 'Security Settings', time: '2 days ago', type: 'Security' },
    { id: 105, user: 'Kevin H.', action: 'Commented on Result', target: 'Napa Vineyard', time: '3 days ago', type: 'Collab' },
];

export default function HistoryPage() {
    const [logs, setLogs] = useState(defaultMockLogs);

    useEffect(() => {
        // Load projects from localStorage to create dynamic logs
        const stored = localStorage.getItem('verdify_projects');
        if (stored) {
            try {
                const projects: Project[] = JSON.parse(stored);
                // Create creation logs for each project
                const projectLogs = projects.map((p, index) => ({
                    id: index + 1000,
                    user: 'You',
                    action: 'Created Analysis',
                    target: p.name,
                    time: new Date(p.startDate).toLocaleDateString(),
                    type: 'System'
                }));

                // Merge with mock logs
                setLogs([...projectLogs, ...defaultMockLogs]);
            } catch (e) {
                console.error('Failed to parse projects for history:', e);
            }
        }
    }, []);

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project History & Audit</h1>
                        <p className="text-slate-500 text-sm">Review activity logs and collaborative annotations across all analysis projects.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Log
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Card>
                            <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search logs by user, project, or event..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-slate-600">Event</th>
                                            <th className="px-6 py-4 font-bold text-slate-600">User</th>
                                            <th className="px-6 py-4 font-bold text-slate-600">Project / Target</th>
                                            <th className="px-6 py-4 font-bold text-slate-600">Timestamp</th>
                                            <th className="px-6 py-4 font-bold text-slate-600">Category</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50/80">
                                                <td className="px-6 py-4 font-medium text-slate-900">{log.action}</td>
                                                <td className="px-6 py-4 text-slate-600">{log.user}</td>
                                                <td className="px-6 py-4 text-slate-600 underline underline-offset-4 decoration-slate-200">{log.target}</td>
                                                <td className="px-6 py-4 text-slate-500">{log.time}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={log.type === 'Security' ? 'danger' : log.type === 'Billing' ? 'warning' : 'neutral'}>
                                                        {log.type}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><MoreVertical className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">

                        <Card className="p-6 bg-indigo-600 text-white">
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Compliance Status
                            </h3>
                            <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
                                Your account activity is being monitored for ISO 27001 compliance. All data exports are logged.
                            </p>
                            <div className="flex items-center justify-between bg-indigo-700/50 p-3 rounded-lg text-[10px] font-bold">
                                <span>GDPR/DPA</span>
                                <span className="text-emerald-300">COMPLIANT</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
