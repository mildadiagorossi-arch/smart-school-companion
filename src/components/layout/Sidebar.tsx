import React from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

const menuItems = [
    { icon: LayoutDashboard, label: 'dashboard.dashboard', href: '/dashboard' },
    { icon: Users, label: 'dashboard.students', href: '/dashboard/students' },
    { icon: BookOpen, label: 'dashboard.classes', href: '/dashboard/classes' },
    { icon: BarChart3, label: 'dashboard.analytics', href: '/dashboard/analytics' },
    { icon: Settings, label: 'dashboard.settings', href: '/dashboard/settings' }
];

export const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const { t } = useLanguage();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg z-30">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold">{t('common.app_name')}</h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Icon className="h-5 w-5" />
                            <span>{t(item.label)}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-gray-800 p-4">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>{t('common.logout')}</span>
                </button>
            </div>
        </aside>
    );
};
