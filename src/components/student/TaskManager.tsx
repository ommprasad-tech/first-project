import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { TaskItem } from '../../types';
import { CheckSquare, Plus, Trash2, CheckCircle2, Clock, AlertCircle, Filter, Calendar } from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, goals, projects, currentUser } = useGoalForgeStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'missed'>('all');
  const [filterTimeframe, setFilterTimeframe] = useState<'all' | 'today' | 'week'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [category, setCategory] = useState<'academic' | 'coding' | 'personal' | 'career'>('coding');
  const [assignedGoalId, setAssignedGoalId] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesTimeframe =
      filterTimeframe === 'all'
        ? true
        : filterTimeframe === 'today'
        ? t.dueDate === todayStr
        : true;
    return matchesStatus && matchesTimeframe;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      userId: currentUser.uid,
      title,
      dueDate,
      priority,
      status: 'pending',
      category,
      assignedGoalId: assignedGoalId || undefined,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    setModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#007BA7]" />
            <h1 className="text-xl font-bold text-white">Daily & Weekly Task Manager</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize daily tasks, tag to personal goals or projects, and automatically sync progress analytics.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007BA7] hover:bg-[#00688e] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#007BA7]/20 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#15151D] border border-slate-800 rounded-2xl p-4 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'all' ? 'bg-[#007BA7] text-white font-semibold' : 'bg-[#0B0B0F] text-slate-400'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'pending' ? 'bg-[#007BA7] text-white font-semibold' : 'bg-[#0B0B0F] text-slate-400'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'completed' ? 'bg-[#007BA7] text-white font-semibold' : 'bg-[#0B0B0F] text-slate-400'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">View:</span>
          <button
            onClick={() => setFilterTimeframe('all')}
            className={`px-3 py-1.5 rounded-lg ${filterTimeframe === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            All Dates
          </button>
          <button
            onClick={() => setFilterTimeframe('today')}
            className={`px-3 py-1.5 rounded-lg ${filterTimeframe === 'today' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            Today Only
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleTask(t.id)}
            className={`p-4 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
              t.status === 'completed'
                ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                : 'bg-[#0B0B0F] border-slate-800 hover:border-slate-700 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={t.status === 'completed'}
                onChange={() => {}}
                className="rounded border-slate-700 text-[#007BA7] focus:ring-0"
              />
              <div>
                <span className={`font-semibold ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                  {t.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                  <span className="font-mono text-[#007BA7]">Due: {t.dueDate}</span>
                  <span>· {t.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase ${
                  t.priority === 'urgent'
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-[#007BA7]/10 text-[#007BA7]'
                }`}
              >
                {t.priority}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(t.id);
                }}
                className="p-1 text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center text-slate-500 py-8 text-xs">No tasks match selected filter.</div>
        )}
      </div>

      {/* Add Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#15151D] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Task</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete 2 LeetCode Tree questions"
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assign to Active Goal (Optional)</label>
                <select
                  value={assignedGoalId}
                  onChange={(e) => setAssignedGoalId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                >
                  <option value="">-- None --</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#007BA7] text-white font-semibold rounded-xl">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
