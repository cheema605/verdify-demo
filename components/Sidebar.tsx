'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  History,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Terminal,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView?: any;
  setView?: (view: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/results', label: 'Analysis Results', icon: Layers },
    { href: '/dashboard/history', label: 'Project History', icon: History },
    { href: '/dashboard/api', label: 'API Access', icon: Terminal },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold italic text-xl">
          V
        </div>
        <span className="font-bold text-slate-900 tracking-tight text-xl">Verdify</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${isActive
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
            </Link>
          );
        })}

        <div className="pt-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Enterprise</p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">Admin Control</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Bell className="w-4 h-4" />
            <span className="font-medium">Notifications</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">3</span>
          </button>
        </div>
      </nav>

      {/* Full Length Profile Footer Section */}
      <div className="p-4 border-t border-slate-100 bg-white mt-auto">
        <div className="flex items-center gap-3 p-3 mb-2 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-slate-100 cursor-pointer">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100"
              className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
              alt="User"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Toby Belhome</p>
            <p className="text-[10px] font-semibold text-slate-500 truncate uppercase tracking-tight">Enterprise Plan</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
