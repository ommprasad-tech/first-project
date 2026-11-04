import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { Goal } from '../../types';
import { callAiGenerateRoadmap } from '../../lib/aiClient';
import { Target, Plus, Sparkles, CheckCircle2, Clock, Trash2, Calendar, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const GoalManager: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoalTask, currentUser } = useGoalForgeStore();

  const [newGoalModalOpen, setNewGoalModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goals[0]?.id || null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Placement Prep');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [targetLevel, setTargetLevel] = useState('Advanced / Job-Ready');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const activeGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  const handleCreateGoalWithAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      // Call backend Gemini AI Roadmap endpoint
      const aiResult = await callAiGenerateRoadmap({
        goalTitle: title,
        description,
        currentLevel,
        targetLevel,
        targetDate,
        category,
        branch: currentUser.branch,
      });

      const newGoal: Goal = {
        id: `goal_${Date.now()}`,
        userId: currentUser.uid,
        title,
        description,
        targetDate,
        priority,
        currentLevel,
        targetLevel,
        category,
        status: 'active',
        progressPercentage: 5,
        createdAt: new Date().toISOString(),
        aiRoadmapGenerated: true,
        aiPlanSummary: aiResult.aiPlanSummary,
        milestones: aiResult.milestones || [],
        dailyTasks: aiResult.dailyTasks || [],
        weeklyTasks: aiResult.weeklyTasks || [],
      };

      addGoal(newGoal);
      setSelectedGoalId(newGoal.id);
      setNewGoalModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Failed to generate roadmap:', err);
      setAiError(err.message || 'AI Roadmap generation failed. Creating standard goal format.');

      // Fallback standard goal if server offline
      const fallbackGoal: Goal = {
        id: `goal_${Date.now()}`,
        userId: currentUser.uid,
        title,
        description,
        targetDate,
        priority,
        currentLevel,
        targetLevel,
        category,
        status: 'active',
        progressPercentage: 0,
        createdAt: new Date().toISOString(),
        aiRoadmapGenerated: false,
        aiPlanSummary: 'Custom goal created successfully.',
        milestones: [
          { id: `m_${Date.now()}_1`, title: 'Foundation & Core Concepts', targetDate, completed: false, tasks: [] },
          { id: `m_${Date.now()}_2`, title: 'Applied Projects & Practice', targetDate, completed: false, tasks: [] },
        ],
        dailyTasks: [
          { id: `dt_${Date.now()}_1`, title: `Daily 45-min study session for ${title}`, completed: false, type: 'daily' },
        ],
        weeklyTasks: [
          { id: `wt_${Date.now()}_1`, title: 'Weekly progress review & practice test', completed: false, type: 'weekly' },
        ],
      };

      addGoal(fallbackGoal);
      setSelectedGoalId(fallbackGoal.id);
      setNewGoalModalOpen(false);
      resetForm();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Placement Prep');
    setPriority('high');
    setCurrentLevel('Beginner');
    setTargetLevel('Advanced / Job-Ready');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#15151D] border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">GoalForge AI — Personal Goal & Life Manager</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create independent goals with custom AI roadmaps, milestones, and daily schedule trackers.
          </p>
        </div>

        <button
          onClick={() => setNewGoalModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007BA7] hover:bg-[#00688e] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#007BA7]/20 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal with AI Roadmap</span>
        </button>
      </div>

      {/* Main Goal Viewer & Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Independent Goals */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Your Active Goals ({goals.length})
          </h2>

          <div className="space-y-2.5">
            {goals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedGoalId === goal.id
                    ? 'bg-[#15151D] border-[#007BA7] ring-1 ring-[#007BA7]/50 shadow-xl'
                    : 'bg-[#0B0B0F] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white line-clamp-1">{goal.title}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase ${
                      goal.priority === 'urgent'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-[#007BA7]/10 text-[#007BA7] border border-[#007BA7]/20'
                    }`}
                  >
                    {goal.priority}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{goal.description}</p>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Target: {goal.targetDate}</span>
                  <span className="font-bold text-white tabular-nums">{goal.progressPercentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#007BA7] to-[#FF3B81] h-full rounded-full transition-all duration-300"
                    style={{ width: `${goal.progressPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Goal View & AI Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {activeGoal ? (
            <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Top Details & Delete */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-[#007BA7] bg-[#007BA7]/10 px-2.5 py-0.5 rounded border border-[#007BA7]/20">
                      {activeGoal.category}
                    </span>
                    <span className="text-xs text-slate-400">Target Date: {activeGoal.targetDate}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{activeGoal.title}</h2>
                  <p className="text-xs text-slate-300 mt-1">{activeGoal.description}</p>
                </div>

                <button
                  onClick={() => deleteGoal(activeGoal.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Levels & AI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#0B0B0F] border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Current Level</span>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{activeGoal.currentLevel}</div>
                </div>
                <div className="p-3.5 bg-[#0B0B0F] border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Target Level</span>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">{activeGoal.targetLevel}</div>
                </div>
              </div>

              {/* AI Strategy Summary */}
              {activeGoal.aiPlanSummary && (
                <div className="p-4 bg-gradient-to-r from-[#007BA7]/10 to-[#FF3B81]/10 border border-[#007BA7]/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-[#FF3B81]" />
                    <span>AI Strategic Roadmap</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeGoal.aiPlanSummary}</p>
                </div>
              )}

              {/* Milestones Checklist */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Key Milestones ({activeGoal.milestones.length})
                </h3>
                <div className="space-y-2">
                  {activeGoal.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 bg-[#0B0B0F] border border-slate-800 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-4 h-4 ${m.completed ? 'text-emerald-400' : 'text-slate-600'}`}
                        />
                        <span className={m.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{m.targetDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily & Weekly Tasks Board */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Tasks */}
                <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Daily Tasks</h4>
                  </div>
                  <div className="space-y-2">
                    {activeGoal.dailyTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => toggleGoalTask(activeGoal.id, t.id, 'daily')}
                        className="flex items-center gap-2.5 p-2 bg-[#15151D] hover:bg-slate-800 rounded-lg cursor-pointer text-xs transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => {}}
                          className="rounded border-slate-700 text-[#007BA7] focus:ring-0"
                        />
                        <span className={t.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {t.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Tasks */}
                <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Weekly Sprint</h4>
                  </div>
                  <div className="space-y-2">
                    {activeGoal.weeklyTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => toggleGoalTask(activeGoal.id, t.id, 'weekly')}
                        className="flex items-center gap-2.5 p-2 bg-[#15151D] hover:bg-slate-800 rounded-lg cursor-pointer text-xs transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => {}}
                          className="rounded border-slate-700 text-[#007BA7] focus:ring-0"
                        />
                        <span className={t.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {t.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-[#15151D] border border-slate-800 rounded-2xl">
              No goal selected. Create a new goal above!
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create New Goal with AI Roadmap */}
      {newGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#15151D] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF3B81]" />
                <h3 className="text-base font-bold text-white">Create New Goal (AI Roadmap)</h3>
              </div>
              <button
                onClick={() => setNewGoalModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoalWithAi} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Data Structures & Algorithms or Learn React Native"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Goal Description</label>
                <textarea
                  rows={2}
                  placeholder="What is your objective and motivation?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="Placement Prep">Placement Prep</option>
                    <option value="Projects">Projects & Portfolio</option>
                    <option value="Academics">Academic Exams</option>
                    <option value="Competitive Exams">Competitive Exams (GATE/CAT)</option>
                    <option value="Life & Skill">Skill & Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Level</label>
                  <input
                    type="text"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Level</label>
                  <input
                    type="text"
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              {aiError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewGoalModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingAi}
                  className="px-5 py-2 bg-gradient-to-r from-[#007BA7] to-[#FF3B81] hover:from-[#00688e] hover:to-[#e02e6e] text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#007BA7]/20 disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Generating AI Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Goal & Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
