'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Download,
    Share2,
    Settings,
    ArrowLeft,
    Info,
    Calendar,
    AlertTriangle,
    FileDown,
    FileJson,
    FileSpreadsheet,
    FileType,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/UI';
import MapView from '@/components/MapView';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const mockChartData = [
    { date: 'Jan 23', value: 0.42 },
    { date: 'Feb 23', value: 0.45 },
    { date: 'Mar 23', value: 0.58 },
    { date: 'Apr 23', value: 0.72 },
    { date: 'May 23', value: 0.85 },
    { date: 'Jun 23', value: 0.82 },
    { date: 'Jul 23', value: 0.75 },
    { date: 'Aug 23', value: 0.68 },
    { date: 'Sep 23', value: 0.55 },
    { date: 'Oct 23', value: 0.48 },
    { date: 'Nov 23', value: 0.35 },
    { date: 'Dec 23', value: 0.32 },
];

function ResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [projectGeoJSON, setProjectGeoJSON] = useState<GeoJSON.Feature | null>(null);
    const [projectName, setProjectName] = useState('Iowa Field Survey 2024');
    const [projectStatus, setProjectStatus] = useState<string>('Completed');
    const [availableMetrics, setAvailableMetrics] = useState<string[]>(['NDVI']);
    const [selectedMetric, setSelectedMetric] = useState<string>('NDVI');

    // Different data for each metric
    const metricData = {
        NDVI: [
            { date: 'Jan 23', value: 0.42 },
            { date: 'Feb 23', value: 0.45 },
            { date: 'Mar 23', value: 0.58 },
            { date: 'Apr 23', value: 0.72 },
            { date: 'May 23', value: 0.85 },
            { date: 'Jun 23', value: 0.82 },
            { date: 'Jul 23', value: 0.75 },
            { date: 'Aug 23', value: 0.68 },
            { date: 'Sep 23', value: 0.55 },
            { date: 'Oct 23', value: 0.48 },
            { date: 'Nov 23', value: 0.35 },
            { date: 'Dec 23', value: 0.32 },
        ],
        NDWI: [
            { date: 'Jan 23', value: 0.15 },
            { date: 'Feb 23', value: 0.18 },
            { date: 'Mar 23', value: 0.25 },
            { date: 'Apr 23', value: 0.35 },
            { date: 'May 23', value: 0.45 },
            { date: 'Jun 23', value: 0.38 },
            { date: 'Jul 23', value: 0.32 },
            { date: 'Aug 23', value: 0.28 },
            { date: 'Sep 23', value: 0.22 },
            { date: 'Oct 23', value: 0.19 },
            { date: 'Nov 23', value: 0.17 },
            { date: 'Dec 23', value: 0.14 },
        ],
        NVI: [
            { date: 'Jan 23', value: 0.38 },
            { date: 'Feb 23', value: 0.42 },
            { date: 'Mar 23', value: 0.52 },
            { date: 'Apr 23', value: 0.65 },
            { date: 'May 23', value: 0.78 },
            { date: 'Jun 23', value: 0.75 },
            { date: 'Jul 23', value: 0.70 },
            { date: 'Aug 23', value: 0.62 },
            { date: 'Sep 23', value: 0.50 },
            { date: 'Oct 23', value: 0.44 },
            { date: 'Nov 23', value: 0.32 },
            { date: 'Dec 23', value: 0.28 },
        ]
    };

    // Parse URL params on mount
    useEffect(() => {
        const name = searchParams?.get('name');
        const geojsonParam = searchParams?.get('geojson');
        const status = searchParams?.get('status');
        const indicesParam = searchParams?.get('indices');

        if (name) {
            setProjectName(decodeURIComponent(name));
        }

        if (status) {
            setProjectStatus(status);
        }

        if (indicesParam) {
            try {
                const indices = JSON.parse(decodeURIComponent(indicesParam));
                setAvailableMetrics(indices);
                if (indices.length > 0) {
                    setSelectedMetric(indices[0]); // Set first available as default
                }
            } catch (e) {
                console.error('Failed to parse indices from URL:', e);
            }
        }

        if (geojsonParam) {
            try {
                const parsed = JSON.parse(decodeURIComponent(geojsonParam));
                setProjectGeoJSON(parsed);
            } catch (e) {
                console.error('Failed to parse GeoJSON from URL:', e);
            }
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 duration-500">
            {/* Top Controls */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                    <div className="h-6 w-px bg-slate-200" />
                    <div>
                        <h1 className="text-sm font-bold text-slate-900">{projectName}</h1>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Jan 2023 - Dec 2023 | Sentinel-2 L2A
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" /> Share
                    </Button>
                    <Button variant="primary" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Export Results
                    </Button>
                </div>
            </div>

            {/* Main Content: Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Map */}
                <div className="flex-1 relative">
                    <MapView className="w-full h-full" isWizard={false} initialGeoJSON={projectGeoJSON} />

                    {/* Status Overlays */}
                    {projectStatus === 'Pending' && (
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-20">
                            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Waiting for Satellite Data</h3>
                                <p className="text-sm text-slate-600 text-center leading-relaxed">
                                    This analysis is queued and waiting for the next satellite pass over your area of interest.
                                    Data acquisition can take up to <span className="font-bold text-slate-900">48 hours</span> depending on orbital patterns and cloud coverage.
                                </p>
                                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <p className="text-xs text-amber-900 text-center">
                                        You'll receive an email notification when processing begins.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {projectStatus === 'Canceled' && (
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-20">
                            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
                                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-rose-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Analysis Cancelled</h3>
                                <p className="text-sm text-slate-600 text-center leading-relaxed mb-4">
                                    This analysis was cancelled and will not be processed. Common reasons include:
                                </p>
                                <ul className="text-xs text-slate-600 space-y-2 mb-6">
                                    <li className="flex items-start gap-2">
                                        <span className="text-rose-500 mt-0.5">•</span>
                                        <span>Excessive cloud coverage in the selected time period</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-rose-500 mt-0.5">•</span>
                                        <span>User requested cancellation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-rose-500 mt-0.5">•</span>
                                        <span>Payment or quota limits reached</span>
                                    </li>
                                </ul>
                                <Button
                                    onClick={() => router.push('/dashboard/new-analysis')}
                                    className="w-full"
                                >
                                    Start New Analysis
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Map Overlay Stats - Only show for completed */}
                    {projectStatus === 'Completed' && (
                        <div className="absolute top-6 left-6 z-10 w-64 space-y-3">
                            <Card className="p-4 bg-white/90 backdrop-blur border-none shadow-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mean {selectedMetric}</span>
                                    <Badge variant="success">
                                        {selectedMetric === 'NDVI' ? '+12%' : selectedMetric === 'NDWI' ? '+8%' : '+15%'}
                                    </Badge>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-900">
                                        {metricData[selectedMetric as keyof typeof metricData]
                                            ? metricData[selectedMetric as keyof typeof metricData][metricData[selectedMetric as keyof typeof metricData].length - 1].value
                                            : '0.00'}
                                    </span>
                                    <span className="text-xs text-slate-500 mb-1">Index Value</span>
                                </div>
                            </Card>
                            <Card className="p-4 bg-white/90 backdrop-blur border-none shadow-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {selectedMetric === 'NDWI' ? 'Water Stress' : 'Biomass Health'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[85%]" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-900">Optimal</span>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Right Side: Analysis Panels */}
                <div className="w-[450px] bg-slate-50 border-l border-slate-200 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="p-6 space-y-6">
                        {/* Chart Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Temporal Trend Analysis</h3>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedMetric}
                                        onChange={(e) => setSelectedMetric(e.target.value)}
                                        className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                    >
                                        {availableMetrics.map(metric => (
                                            <option key={metric} value={metric}>{metric}</option>
                                        ))}
                                    </select>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <Card className="p-4 bg-white">
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={metricData[selectedMetric as keyof typeof metricData] || metricData.NDVI}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                                labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#6366f1"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </section>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-white">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Max Value</p>
                                <p className="text-xl font-bold text-slate-900">0.85</p>
                                <div className="flex items-center text-emerald-600 text-[10px] font-bold mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    +4.2% Peak
                                </div>
                            </Card>
                            <Card className="p-4 bg-white">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Standard Dev</p>
                                <p className="text-xl font-bold text-slate-900">0.12</p>
                                <div className="text-[10px] text-slate-500 mt-1">High Stability</div>
                            </Card>
                        </div>

                        {/* Data Downloads */}
                        <section>
                            <h3 className="font-bold text-slate-900 text-sm mb-4">Derived Assets</h3>
                            <div className="space-y-2">
                                {[
                                    { name: 'Analysis Result Map', size: '142 MB', type: 'GeoTIFF', icon: FileType },
                                    { name: 'Full Statistics Report', size: '1.2 MB', type: 'JSON', icon: FileJson },
                                    { name: 'Raw Sample Data', size: '4.5 MB', type: 'CSV', icon: FileSpreadsheet }
                                ].map((file) => (
                                    <div key={file.name} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-indigo-200 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded group-hover:bg-indigo-50 transition-colors">
                                                <file.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">{file.name}</p>
                                                <p className="text-[10px] text-slate-500">{file.type} • {file.size}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <FileDown className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Quality Warning */}
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                            <div>
                                <p className="text-[11px] font-bold text-amber-900">Atmospheric Correction Notice</p>
                                <p className="text-[10px] text-amber-800/80 leading-relaxed mt-1">
                                    Results for Dec 23 show higher noise levels due to atmospheric particulates. Sen2Cor v2.11 applied.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-6 border-t border-slate-200 bg-white">
                        <Button className="w-full gap-2">
                            <Info className="w-4 h-4" /> Generate AI Insights
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
            <ResultsContent />
        </Suspense>
    );
}
