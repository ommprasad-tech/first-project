import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { Bell, Sun, Moon, Sparkles, Search, User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenNotifications: () => void;
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenNotifications,
  onToggleMobileNav,
}) => {
  const { currentUser, notifications, theme, toggleTheme, logout } = useGoalForgeStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 py-3 bg-white/90 dark:bg-[#0B0B0F]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Logo & Search */}
      <div className="flex items-center gap-3 shrink-0">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="p-1.5 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007BA7] to-[#FF3B81] p-0.5 flex items-center justify-center shadow-lg shadow-[#007BA7]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0B0F] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF3B81]" />
            </div>
          </div>
          <span>GoalForge <span className="text-[#FF3B81]">AI</span></span>
        </button>

        {/* Global Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 w-48 md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search goals, tasks, topics..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Zone 2: Actions & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Toggle Dark / Light Mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3B81] rounded-full" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#007BA7]/40"
            />
            <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
              {currentUser.fullName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 text-xs">
              <button
                onClick={() => {
                  setActiveView('profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User className="w-4 h-4 text-[#007BA7]" /> My Profile
              </button>

              <button
                onClick={() => {
                  setActiveView('settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Settings className="w-4 h-4 text-slate-400" /> Settings
              </button>

              <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-rose-500 hover:bg-rose-500/10 font-medium"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
