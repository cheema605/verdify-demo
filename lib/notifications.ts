import { Project } from '@/types';

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    type: 'success' | 'warning' | 'info' | 'error';
    priority: 'High' | 'Medium' | 'Low';
    projectId?: string;
    projectName?: string;
}

export function generateNotifications(projects: Project[]): Notification[] {
    const notifications: Notification[] = [];

    projects.forEach((project) => {
        // Completed projects
        if (project.status === 'Completed') {
            notifications.push({
                id: `notif-${project.id}-completed`,
                title: 'Analysis Complete',
                message: `${project.name} has finished processing successfully.`,
                date: project.deadline,
                type: 'success',
                priority: 'Low',
                projectId: project.id,
                projectName: project.name
            });
        }

        // Active projects with high progress
        if (project.status === 'Active' && project.progress >= 75) {
            notifications.push({
                id: `notif-${project.id}-near-completion`,
                title: 'Analysis Nearing Completion',
                message: `${project.name} is ${project.progress}% complete.`,
                date: new Date().toISOString().split('T')[0],
                type: 'info',
                priority: 'Low',
                projectId: project.id,
                projectName: project.name
            });
        }

        // Active projects with cloud cover warning (simulated based on area)
        if (project.status === 'Active' && project.progress < 50) {
            notifications.push({
                id: `notif-${project.id}-cloud-cover`,
                title: 'Cloud Cover Threshold',
                message: `${project.name} analysis may be affected by cloud cover. Processing paused for clearer data.`,
                date: new Date().toISOString().split('T')[0],
                type: 'warning',
                priority: 'High',
                projectId: project.id,
                projectName: project.name
            });
        }

        // Pending projects
        if (project.status === 'Pending') {
            notifications.push({
                id: `notif-${project.id}-pending`,
                title: 'Analysis Pending',
                message: `${project.name} is scheduled to start processing.`,
                date: project.startDate,
                type: 'info',
                priority: 'Medium',
                projectId: project.id,
                projectName: project.name
            });
        }

        // Canceled projects
        if (project.status === 'Canceled') {
            notifications.push({
                id: `notif-${project.id}-canceled`,
                title: 'Analysis Canceled',
                message: `${project.name} was canceled at ${project.progress}% completion.`,
                date: new Date().toISOString().split('T')[0],
                type: 'error',
                priority: 'Medium',
                projectId: project.id,
                projectName: project.name
            });
        }
    });

    // Add system notification
    notifications.push({
        id: 'sys-maintenance',
        title: 'System Maintenance',
        message: 'Scheduled maintenance for the compute cluster this weekend.',
        date: new Date().toISOString().split('T')[0],
        type: 'info',
        priority: 'Low'
    });

    // Sort by priority (High > Medium > Low) and then by date
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return notifications.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}
