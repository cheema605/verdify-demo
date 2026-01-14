'use client';

import React from 'react';
import { Bell, Search, Settings, HelpCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0 z-10">
                    <div className="relative w-96 max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Verdify (⌘K)"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative group">
                            <Bell className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group">
                            <HelpCircle className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group">
                            <Settings className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
                        </button>
                    </div>
                </header>
                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
