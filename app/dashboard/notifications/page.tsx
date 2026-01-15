'use client';

import React from 'react';
import NotificationsView from '@/components/views/NotificationsView';

export default function NotificationsPage() {
    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <NotificationsView />
        </div>
    );
}
