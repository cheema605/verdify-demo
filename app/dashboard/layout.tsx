import type { Metadata } from 'next';
import DashboardLayoutWrapper from '@/components/DashboardLayout';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Manage and monitor your satellite analysis projects',
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
