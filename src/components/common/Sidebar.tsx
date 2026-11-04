import React from 'react';
import { useGoalForgeStore } from '../../lib/store';
import {
  LayoutDashboard,
  User,
  Target,
  Clock,
  BookOpen,
  Calendar,
  CheckSquare,
  Sparkles,
  Zap,
  Compass,
  Briefcase,
  FileText,
  FolderGit2,
  TrendingUp,
  Award,
  Bell,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  mobileOpen,
  setMobileOpen,
}) => {
  const { logout } = useGoalForgeStore();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-sky-400" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4 text-emerald-400" /> },
    { id: 'goals', label: 'AI Goal Planner', icon: <Target className="w-4 h-4 text-emerald-400" /> },
    { id: 'routine', label: 'Daily Routine', icon: <Clock className="w-4 h-4 text-sky-400" /> },
    { id: 'study_planner', label: 'Study Planner', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4 text-indigo-400" /> },
    { id: 'tasks', label: 'Task Manager', icon: <CheckSquare className="w-4 h-4 text-[#007BA7]" /> },
    { id: 'problem_solver', label: 'AI Problem Solver', icon: <Sparkles className="w-4 h-4 text-[#FF3B81]" /> },
    { id: 'learning_center', label: 'Learning Center', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { id: 'skills', label: 'Skill Development', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
    { id: 'career_roadmap', label: 'Career Roadmap', icon: <Compass className="w-4 h-4 text-teal-400" /> },
    { id: 'jobs', label: 'Jobs & Internships', icon: <Briefcase className="w-4 h-4 text-blue-400" /> },
    { id: 'resume_portfolio', label: 'Resume & Portfolio', icon: <FileText className="w-4 h-4 text-purple-400" /> },
    { id: 'projects', label: 'My Projects', icon: <FolderGit2 className="w-4 h-4 text-indigo-400" /> },
    { id: 'analytics', label: 'Progress Analytics', icon: <TrendingUp className="w-4 h-4 text-[#FF3B81]" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4 text-rose-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
  ];

  const handleSelectNav = (id: string) => {
    setActiveView(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-64 h-full md:h-auto min-h-[calc(100vh-57px)] bg-white dark:bg-[#0F1017] border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4 overflow-y-auto max-h-[85vh] pr-1">
          {/* Mobile Drawer Close Button */}
          <div className="flex items-center justify-between md:hidden border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">GoalForge AI Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Student Ecosystem
          </div>

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                  activeView === item.id
                    ? 'bg-[#007BA7] text-white font-bold shadow-md shadow-[#007BA7]/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
