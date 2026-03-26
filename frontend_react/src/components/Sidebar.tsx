import React from 'react';
import { LayoutDashboard, Users, User, BarChart3, Target, Bell, FileText, Upload, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Upload, label: 'Upload Data', path: '/' },
    { icon: LayoutDashboard, label: 'Executive Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customer Risk Table', path: '/risk-table' },
    { icon: User, label: 'Customer 360', path: '/customer-360' },
    { icon: BarChart3, label: 'Feature Insights', path: '/insights' },
    { icon: Target, label: 'Campaign Simulator', path: '/simulator' },
    { icon: Bell, label: 'Alerts Center', path: '/alerts' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
          <LayoutDashboard className="text-primary" /> ChurnSense
        </h1>
        <p className="text-xs text-slate-500 mt-1">Retention Intelligence SaaS</p>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.path 
                ? "bg-primary/20 text-primary border border-primary/20" 
                : "text-slate-500 hover:bg-white shadow-sm border border-slate-200 hover:text-slate-900"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 text-xs text-slate-600 text-center">
        &copy; 2026 ChurnSense AI
      </div>
    </div>
  );
};

export default Sidebar;
