import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { CalendarEvent } from '../../types';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, AlertCircle, BookOpen, Briefcase, User, Filter, CheckSquare, Target, FolderGit2 } from 'lucide-react';

export const SmartCalendar: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    routineActivities,
    tasks,
    goals,
    projects,
    subjects,
    currentUser,
  } = useGoalForgeStore();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<CalendarEvent['category']>('exam');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [isUrgent, setIsUrgent] = useState(false);

  // Consolidated Events List from all features
  const aggregatedEvents: CalendarEvent[] = [
    ...calendarEvents,
    ...routineActivities.map((r) => ({
      id: `rt_${r.id}`,
      userId: currentUser.uid,
      title: `Routine: ${r.title}`,
      description: `Category: ${r.category}`,
      date: new Date().toISOString().split('T')[0],
      startTime: r.startTime,
      endTime: r.endTime,
      category: 'routine' as const,
      isUrgent: false,
    })),
    ...tasks.map((t) => ({
      id: `task_${t.id}`,
      userId: currentUser.uid,
      title: `Task: ${t.title}`,
      description: t.description || 'Task Deadline',
      date: t.dueDate,
      startTime: t.startTime || '09:00',
      category: 'task' as const,
      isUrgent: t.priority === 'urgent' || t.priority === 'high',
    })),
    ...goals.map((g) => ({
      id: `goal_${g.id}`,
      userId: currentUser.uid,
      title: `Goal Milestone: ${g.title}`,
      description: `Target level: ${g.targetLevel}`,
      date: g.targetDate,
      category: 'goal' as const,
      isUrgent: g.priority === 'urgent',
    })),
    ...projects.map((p) => ({
      id: `proj_${p.id}`,
      userId: currentUser.uid,
      title: `Project Deadline: ${p.title}`,
      description: `Tech: ${p.techStack.join(', ')}`,
      date: p.deadline || new Date().toISOString().split('T')[0],
      category: 'project' as const,
      isUrgent: true,
    })),
    ...subjects.filter((s) => s.examDate).map((s) => ({
      id: `subj_${s.id}`,
      userId: currentUser.uid,
      title: `EXAM: ${s.name}`,
      description: `Target Revision: ${s.targetRevisionHours} hours`,
      date: s.examDate!,
      category: 'exam' as const,
      isUrgent: true,
    })),
  ];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEv: CalendarEvent = {
      id: `ce_${Date.now()}`,
      userId: currentUser.uid,
      title,
      description,
      date,
      category,
      startTime,
      endTime,
      isUrgent,
    };

    addCalendarEvent(newEv);
    setModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">Smart Academic & Personal Calendar</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consolidated calendar tracking daily routines, exams, study sessions, goal milestones, and project deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-[#0B0B0F] p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'month' ? 'bg-[#007BA7] text-white' : 'text-slate-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'week' ? 'bg-[#007BA7] text-white' : 'text-slate-400'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'day' ? 'bg-[#007BA7] text-white' : 'text-slate-400'
              }`}
            >
              Daily
            </button>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#007BA7] hover:bg-[#00688e] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#007BA7]/20 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aggregatedEvents.map((ev) => (
          <div
            key={ev.id}
            className={`p-4 rounded-xl border space-y-3 transition-all ${
              ev.isUrgent
                ? 'bg-rose-500/5 border-rose-500/30'
                : 'bg-[#15151D] border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    ev.category === 'exam'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : ev.category === 'interview'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : ev.category === 'goal'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : ev.category === 'routine'
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}
                >
                  {ev.category}
                </span>
                <h3 className="text-xs font-bold text-white mt-1.5">{ev.title}</h3>
              </div>

              {ev.id.startsWith('ce_') && (
                <button
                  onClick={() => deleteCalendarEvent(ev.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {ev.description && <p className="text-xs text-slate-400 leading-relaxed">{ev.description}</p>}

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="font-mono text-[#007BA7] font-semibold">{ev.date}</span>
              {ev.startTime && (
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" /> {ev.startTime} - {ev.endTime || ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#15151D] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Calendar Event</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="exam">Exam</option>
                    <option value="assignment">Assignment</option>
                    <option value="interview">Interview Schedule</option>
                    <option value="project">Project Milestone</option>
                    <option value="personal">Personal Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="urg"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded border-slate-700"
                />
                <label htmlFor="urg" className="text-slate-300">Mark as High Priority / Urgent</label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007BA7] text-white font-semibold rounded-xl"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

