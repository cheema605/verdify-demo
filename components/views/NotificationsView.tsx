
import React from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/context/ProjectContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Card, Badge, Button } from '@/components/UI';
import { Bell, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { generateNotifications } from '@/lib/notifications';

export default function NotificationsView() {
    const router = useRouter();
    const { currentWorkspace } = useWorkspace();
    const { getProjectsByWorkspace, projects: allProjects } = useProject();

    const projects = currentWorkspace ? getProjectsByWorkspace(currentWorkspace.id) : [];
    const notifications = generateNotifications(projects);

    const handleNotificationClick = (notif: any) => {
        if (notif.projectId) {
            const project = allProjects.find(p => p.id === notif.projectId);
            if (project) {
                const geojsonParam = project.geojson ? encodeURIComponent(JSON.stringify(project.geojson)) : '';
                const indicesParam = project.selectedIndices ? encodeURIComponent(JSON.stringify(project.selectedIndices)) : '';

                if (project.geojson) {
                    router.push(`/dashboard/results?id=${project.id}&name=${encodeURIComponent(project.name)}&geojson=${geojsonParam}&indices=${indicesParam}&status=${project.status}`);
                } else {
                    router.push(`/dashboard/results?id=${project.id}&name=${encodeURIComponent(project.name)}&status=${project.status}`);
                }
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <Button variant="outline" size="sm">Mark all as read</Button>
            </div>

            <div className="grid gap-4">
                {notifications.length === 0 ? (
                    <p className="text-slate-500">No notifications found.</p>
                ) : (
                    notifications.map((notif) => (
                        <Card
                            key={notif.id}
                            className={`p-4 flex gap-4 items-start ${notif.projectId ? 'cursor-pointer hover:shadow-lg hover:border-indigo-200 transition-all' : ''}`}
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <div className={`p-2 rounded-lg shrink-0 ${notif.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                notif.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                                    notif.type === 'error' ? 'bg-rose-50 text-rose-600' :
                                        'bg-blue-50 text-blue-600'
                                }`}>
                                {notif.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                    notif.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                                        notif.type === 'error' ? <XCircle className="w-5 h-5" /> :
                                            <Info className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900">{notif.title}</h3>
                                    <span className="text-xs text-slate-500">{notif.date}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                                {notif.projectName && (
                                    <div className="mt-2">
                                        <Badge variant="neutral">
                                            {notif.projectName}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
