import React, { useState } from 'react';
import { Bell, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b shadow-sm z-20">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('common.welcome')} {user?.firstName}!</h2>
        </div>

        {/* Right Items */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {user?.firstName?.charAt(0)}
              </div>
              <span className="text-sm font-medium">{user?.firstName}</span>
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                >
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
