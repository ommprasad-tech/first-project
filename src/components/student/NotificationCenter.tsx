import React from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { Bell, Check, Trash2, Calendar, Target, Briefcase, Sparkles } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead } = useGoalForgeStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF3B81]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications & Reminders</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono">
            ✕
          </button>
        </div>

        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1 ${
                n.read
                  ? 'bg-slate-50 dark:bg-[#0B0B0F] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  : 'bg-slate-50 dark:bg-[#0B0B0F] border-[#007BA7]/40 text-slate-900 dark:text-slate-100 ring-1 ring-[#007BA7]/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">{n.message}</p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center text-slate-400 dark:text-slate-500 py-8 text-xs">No active notifications</div>
          )}
        </div>
      </div>
    </div>
  );
};
