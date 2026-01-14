'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Search,
    MoreHorizontal,
    Clock,
    Briefcase,
    Layers,
    Bell
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '@/components/UI';
import { Project } from '@/types';
import MapView from '@/components/MapView';

const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Amazon Rainforest Monitoring',
        client: 'GreenEarth NGO',
        startDate: '2024-03-20',
        deadline: '2024-05-04',
        status: 'Active',
        progress: 30,
        type: 'NDVI',
        selectedIndices: ['NDVI', 'NDWI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[-60.5, -3.2], [-60.5, -3.8], [-59.8, -3.8], [-59.8, -3.2], [-60.5, -3.2]]] },
            properties: {}
        }
    },
    {
        id: '2',
        name: 'Iowa Corn Yield Prediction',
        client: 'AgriCorp Global',
        startDate: '2024-03-15',
        deadline: '2024-04-10',
        status: 'Canceled',
        progress: 60,
        type: 'EVI',
        selectedIndices: ['NVI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[-95.5, 41.7], [-95.5, 41.3], [-94.9, 41.3], [-94.9, 41.7], [-95.5, 41.7]]] },
            properties: {}
        }
    },
    {
        id: '3',
        name: 'Sahara Desert Boundary Study',
        client: 'United Nations Env',
        startDate: '2024-03-01',
        deadline: '2024-04-01',
        status: 'Completed',
        progress: 100,
        type: 'Custom',
        selectedIndices: ['NDVI', 'NDWI', 'NVI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[2.5, 25.2], [2.5, 24.6], [3.2, 24.6], [3.2, 25.2], [2.5, 25.2]]] },
            properties: {}
        }
    },
    {
        id: '4',
        name: 'California Vineyard Hydration',
        client: 'Napa Valley Vintners',
        startDate: '2024-03-20',
        deadline: '2024-05-20',
        status: 'Pending',
        progress: 50,
        type: 'SAVI',
        selectedIndices: ['NDWI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[-122.5, 38.5], [-122.5, 38.2], [-122.2, 38.2], [-122.2, 38.5], [-122.5, 38.5]]] },
            properties: {}
        }
    },
    {
        id: '5',
        name: 'Urban Expansion Tokyo',
        client: 'City Planning Dept',
        startDate: '2024-04-01',
        deadline: '2024-06-01',
        status: 'Active',
        progress: 45,
        type: 'NDVI',
        selectedIndices: ['NDVI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[139.7, 35.7], [139.7, 35.6], [139.8, 35.6], [139.8, 35.7], [139.7, 35.7]]] },
            properties: {}
        }
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [projects, setProjects] = React.useState<Project[]>(mockProjects);

    // Load projects from localStorage on mount
    React.useEffect(() => {
        const stored = localStorage.getItem('verdify_projects');
        if (stored) {
            try {
                const storedProjects = JSON.parse(stored);
                // Merge stored projects with mock projects (avoid duplicates by ID)
                const merged = [...storedProjects, ...mockProjects.filter(mp => !storedProjects.find((sp: Project) => sp.id === mp.id))];
                setProjects(merged);
            } catch (e) {
                console.error('Failed to parse stored projects:', e);
            }
        }
    }, []);

    const handleNewAnalysis = () => {
        router.push('/dashboard/new-analysis');
    };

    const handleViewProject = (id: string) => {
        const project = projects.find(p => p.id === id);
        if (project) {
            const geojsonParam = project.geojson ? encodeURIComponent(JSON.stringify(project.geojson)) : '';
            const indicesParam = project.selectedIndices ? encodeURIComponent(JSON.stringify(project.selectedIndices)) : '';

            if (project.geojson) {
                router.push(`/dashboard/results?id=${id}&name=${encodeURIComponent(project.name)}&geojson=${geojsonParam}&indices=${indicesParam}&status=${project.status}`);
            } else {
                router.push(`/dashboard/results?id=${id}&name=${encodeURIComponent(project.name)}&status=${project.status}`);
            }
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Dashboard</h1>
                        <p className="text-slate-500 text-sm">Welcome back, monitor your active satellite analysis jobs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Last 30 Days</span>
                        </Button>
                        <Button onClick={handleNewAnalysis} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span>New Analysis</span>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Briefcase className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="flex items-center text-emerald-600 text-xs font-bold">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                +5.02%
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Active Analysis</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">42</h3>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-rose-50 rounded-lg">
                                <Bell className="w-5 h-5 text-rose-600" />
                            </div>
                            <span className="flex items-center text-rose-600 text-xs font-bold">
                                <ArrowDownRight className="w-3 h-3 mr-1" />
                                -3.58%
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">System Alerts</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">12</h3>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Clock className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className="flex items-center text-rose-600 text-xs font-bold">
                                <ArrowDownRight className="w-3 h-3 mr-1" />
                                -12.5%
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Total Compute Time</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">168h 40m</h3>
                    </Card>
                </div>

                {/* Main Grid: Projects Table and Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-slate-900">Recent Analysis Projects</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter projects..."
                                    className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-950 w-64"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 font-semibold text-slate-600">Project Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Type</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Start Date</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Progress</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => handleViewProject(project.id)}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">
                                                        <MapView className="w-full h-full" isWizard={false} initialGeoJSON={project.geojson || null} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{project.name}</p>
                                                        <p className="text-xs text-slate-500">{project.client}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="info">{project.type}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{project.startDate}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={
                                                    project.status === 'Active' ? 'success' :
                                                        project.status === 'Completed' ? 'neutral' :
                                                            project.status === 'Canceled' ? 'danger' : 'warning'
                                                }>
                                                    {project.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 min-w-[120px]">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={project.progress} />
                                                    <span className="text-[10px] font-bold text-slate-500">{project.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 group-hover:text-slate-600">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Showing 1-5 of 12 projects</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8">Previous</Button>
                                <Button variant="outline" size="sm" className="h-8">Next</Button>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h2 className="font-bold text-slate-900 mb-4">Recent Alerts</h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'Analysis Complete',
                                        desc: 'Urban Expansion Tokyo finished processing successfully.',
                                        priority: 'Low',
                                        projectId: '5',
                                        projectName: 'Urban Expansion Tokyo'
                                    },
                                    {
                                        title: 'Cloud Cover Threshold',
                                        desc: 'Amazon Rainforest Monitoring has 85% cloud cover, analysis paused.',
                                        priority: 'High',
                                        projectId: '1',
                                        projectName: 'Amazon Rainforest Monitoring'
                                    },
                                    {
                                        title: 'New Granules Available',
                                        desc: 'Sentinel-2 L2A updated for California Vineyard area.',
                                        priority: 'Medium',
                                        projectId: '4',
                                        projectName: 'California Vineyard Hydration'
                                    }
                                ].map((alert, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-xl border border-slate-100 hover:shadow-sm hover:border-indigo-200 transition-all cursor-pointer"
                                        onClick={() => alert.projectId && handleViewProject(alert.projectId)}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-2 h-2 rounded-full ${alert.priority === 'High' ? 'bg-rose-500' : alert.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                            <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{alert.desc}</p>
                                        {alert.projectName && (
                                            <p className="text-[10px] text-indigo-600 mt-1 font-medium">→ {alert.projectName}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-indigo-600">View All Notifications</Button>
                        </Card>

                        <Card className="p-6 bg-slate-900 text-white border-none">
                            <h2 className="font-bold mb-1">Storage Usage</h2>
                            <p className="text-slate-400 text-xs mb-4">Standard Enterprise Tier (2TB)</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>1.4 TB Used</span>
                                    <span className="text-slate-400">70%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full w-[70%]" />
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-100 text-xs py-2 rounded-lg">Upgrade Storage</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
