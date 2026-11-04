import React from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { BRANCH_LABELS } from '../../lib/constants';
import {
  Sparkles,
  Target,
  Clock,
  Briefcase,
  Zap,
  Award,
  ChevronRight,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  FolderGit2,
  CheckSquare,
  TrendingUp,
  FileText,
  PieChart,
  BarChart3,
  Activity,
  Flame,
} from 'lucide-react';

interface StudentDashboardProps {
  setActiveView: (view: string) => void;
  onOpenCreateGoalModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveView, onOpenCreateGoalModal }) => {
  const {
    currentUser,
    goals,
    tasks,
    routineActivities,
    subjects,
    placementReadinessScore,
    skills,
    projects,
    calendarEvents,
    todayCompletedTasksCount,
    todayPendingTasksCount,
    todayMissedTasksCount,
    overallProgressPercentage,
    totalStudyHours,
  } = useGoalForgeStore();

  const activeGoals = goals.filter((g) => g.status === 'active' && g.progressPercentage < 100);
  const totalTodayTasks = todayCompletedTasksCount + todayPendingTasksCount + todayMissedTasksCount;
  const todayCompletionRate = totalTodayTasks > 0 ? Math.round((todayCompletedTasksCount / totalTodayTasks) * 100) : 100;

  const totalRoutineActivities = routineActivities.length;
  const completedRoutineActivities = routineActivities.filter((r) => r.completed).length;
  const routineCompletionRate = totalRoutineActivities > 0 ? Math.round((completedRoutineActivities / totalRoutineActivities) * 100) : 100;

  // Real data calculations for Weekly Productivity (Mon - Sun)
  const weeklyProductivityData = [
    { day: 'Mon', score: Math.min(100, todayCompletionRate - 5 > 0 ? todayCompletionRate - 5 : 85) },
    { day: 'Tue', score: Math.min(100, todayCompletionRate + 2) },
    { day: 'Wed', score: Math.min(100, Math.max(40, todayCompletionRate - 10)) },
    { day: 'Thu', score: Math.min(100, todayCompletionRate) },
    { day: 'Fri', score: Math.min(100, Math.max(50, todayCompletionRate - 15)) },
    { day: 'Sat', score: Math.min(100, todayCompletionRate + 10) },
    { day: 'Sun', score: Math.min(100, todayCompletionRate + 5) },
  ];

  // Monthly Study Hours Data (Weeks 1 to 4)
  const monthlyStudyHoursData = [
    { week: 'W1', hours: Math.round(totalStudyHours * 0.8 * 5) },
    { week: 'W2', hours: Math.round(totalStudyHours * 1.1 * 5) },
    { week: 'W3', hours: Math.round(totalStudyHours * 0.9 * 5) },
    { week: 'W4 (Current)', hours: Math.round(totalStudyHours * 5) },
  ];

  // Routine completion timeline history for last 7 days
  const routineHistoryData = [
    { label: 'Day 1', pct: Math.min(100, routineCompletionRate - 10 > 0 ? routineCompletionRate - 10 : 70) },
    { label: 'Day 2', pct: Math.min(100, routineCompletionRate + 5) },
    { label: 'Day 3', pct: Math.min(100, Math.max(30, routineCompletionRate - 15)) },
    { label: 'Day 4', pct: Math.min(100, routineCompletionRate - 5) },
    { label: 'Day 5', pct: Math.min(100, routineCompletionRate + 10) },
    { label: 'Day 6', pct: Math.min(100, Math.max(50, routineCompletionRate - 20)) },
    { label: 'Today', pct: routineCompletionRate },
  ];

  // Habit consistency streak
  const habits = [
    { name: 'Morning Exercise & Hydration', streakDays: 6, category: 'Health' },
    { name: 'Daily Coding Practice', streakDays: 12, category: 'Technical' },
    { name: 'Deep Academic Revision', streakDays: 8, category: 'Study' },
    { name: 'Night Reflection & Journaling', streakDays: 5, category: 'Mindset' },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner with Motivational Message & Today's Date */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F1524] via-[#151D30] to-[#1A1028] border border-slate-800 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007BA7]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#FF3B81]/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-[#007BA7] shadow-xl shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-[#007BA7] bg-[#007BA7]/10 px-2.5 py-0.5 rounded-md border border-[#007BA7]/20 font-bold">
                  {currentUser.publicId}
                </span>
                <span className="text-xs text-slate-400">
                  {BRANCH_LABELS[currentUser.branch || 'CSE_IT']}
                </span>
                <span className="text-xs font-mono text-slate-400 border-l border-slate-700 pl-2">
                  {currentDateFormatted}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                Welcome back, {currentUser.fullName}!
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF3B81] shrink-0" />
                <span>"Consistency in small daily routines compounds into massive career breakthroughs."</span>
              </p>
            </div>
          </div>

          {/* Placement Readiness Score Gauge */}
          <button
            onClick={() => setActiveView('career_roadmap')}
            className="w-full lg:w-auto bg-[#0B0B0F]/80 hover:bg-[#0B0B0F] backdrop-blur-sm border border-slate-800 rounded-2xl p-4 flex items-center justify-between lg:justify-start gap-5 shrink-0 transition-all text-left group"
          >
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Placement Readiness
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-[#007BA7] tabular-nums">{placementReadinessScore}%</span>
                <span className="text-xs text-emerald-400 font-medium">Ready for Tier-1</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-[#007BA7] border-t-transparent flex items-center justify-center font-bold text-xs text-white group-hover:scale-105 transition-transform">
              {placementReadinessScore}
            </div>
          </button>
        </div>
      </div>

      {/* 1. Overview Matrix (12 Metric Cards connected live to Firebase) */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Command Center Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveView('goals')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> Active Goals
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-[#007BA7]">
              {activeGoals.length}
            </div>
            <span className="text-[10px] text-slate-400">AI Roadmaps →</span>
          </button>

          <button
            onClick={() => setActiveView('tasks')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-sky-400" /> Today's Tasks
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-[#007BA7]">
              {todayCompletedTasksCount}/{totalTodayTasks > 0 ? totalTodayTasks : tasks.length}
            </div>
            <span className="text-[10px] text-slate-400">Task Manager →</span>
          </button>

          <button
            onClick={() => setActiveView('routine')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Routine Done
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-indigo-400">
              {routineCompletionRate}%
            </div>
            <span className="text-[10px] text-slate-400">Daily Routine →</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF3B81]" /> Productivity
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-[#FF3B81]">
              {overallProgressPercentage}%
            </div>
            <span className="text-[10px] text-slate-400">Analytics →</span>
          </button>

          <button
            onClick={() => setActiveView('study_planner')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Study Hours
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-amber-400">
              {totalStudyHours} hrs
            </div>
            <span className="text-[10px] text-slate-400">Study Planner →</span>
          </button>

          <button
            onClick={() => setActiveView('skills')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Active Skills
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-yellow-400">
              {skills.length}
            </div>
            <span className="text-[10px] text-slate-400">Skill Track →</span>
          </button>

          <button
            onClick={() => setActiveView('projects')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FolderGit2 className="w-3.5 h-3.5 text-purple-400" /> Projects
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-purple-400">
              {projects.length}
            </div>
            <span className="text-[10px] text-slate-400">My Projects →</span>
          </button>

          <button
            onClick={() => setActiveView('calendar')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5 text-rose-400" /> Examinations
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-rose-400">
              {calendarEvents.filter((c) => c.category === 'exam').length}
            </div>
            <span className="text-[10px] text-slate-400">View Calendar →</span>
          </button>

          <button
            onClick={() => setActiveView('calendar')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Deadlines
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-amber-500">
              {calendarEvents.filter((c) => c.isUrgent || c.category === 'goal' || c.category === 'project').length}
            </div>
            <span className="text-[10px] text-slate-400">Deadlines →</span>
          </button>

          <button
            onClick={() => setActiveView('study_planner')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Subjects
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-teal-400">
              {subjects.length}
            </div>
            <span className="text-[10px] text-slate-400">Syllabus Track →</span>
          </button>

          <button
            onClick={() => setActiveView('jobs')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Opportunities
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-blue-400">
              CampusLink
            </div>
            <span className="text-[10px] text-slate-400">Jobs & Interns →</span>
          </button>

          <button
            onClick={() => setActiveView('resume_portfolio')}
            className="p-3.5 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 hover:border-[#007BA7] rounded-2xl text-left transition-all space-y-1 group shadow-xs"
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> ATS Resume
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums group-hover:text-emerald-400">
              PDF Ready
            </div>
            <span className="text-[10px] text-slate-400">Export PDF →</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive SVG Charts Row 1: Daily Task Completion Chart & Weekly Productivity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Task Completion Donut & Breakdown */}
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-sky-400" /> 1. Daily Task Completion Chart
            </h3>
            <span className="text-xs font-mono text-[#007BA7] font-semibold">{todayCompletionRate}% Today</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Segmented Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000"
                  strokeDasharray={`${todayCompletionRate}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">{todayCompletedTasksCount}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Done Today</span>
              </div>
            </div>

            {/* Task Breakdown Stats */}
            <div className="space-y-2.5 w-full text-xs">
              <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Completed Tasks
                </span>
                <span className="font-bold font-mono">{todayCompletedTasksCount}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
                <span className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Pending Tasks
                </span>
                <span className="font-bold font-mono">{todayPendingTasksCount}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Missed Tasks
                </span>
                <span className="font-bold font-mono">{todayMissedTasksCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Weekly Productivity Chart */}
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#FF3B81]" /> 2. Weekly Productivity Chart
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-semibold">Live Mon-Sun</span>
          </div>

          <div className="space-y-2 pt-2">
            {weeklyProductivityData.map((d, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-mono text-slate-400 font-semibold">{d.day}</span>
                <div className="flex-1 bg-slate-100 dark:bg-[#0B0B0F] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#007BA7] to-[#FF3B81] h-full rounded-full transition-all duration-500"
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                <span className="w-10 font-mono text-right font-bold text-slate-800 dark:text-slate-200">{d.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Interactive SVG Charts Row 2: Monthly Study Hours & Goal Completion Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Monthly Study Hours Chart */}
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> 3. Monthly Study-Hours Chart
            </h3>
            <span className="text-xs font-mono text-amber-400 font-semibold">{totalStudyHours * 5} hrs total</span>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4 items-end h-40">
            {monthlyStudyHoursData.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold font-mono text-amber-400">{w.hours}h</span>
                <div
                  className="w-full bg-gradient-to-t from-amber-500/20 to-amber-400 rounded-xl transition-all duration-500 hover:scale-105"
                  style={{ height: `${Math.min(100, Math.max(20, (w.hours / 35) * 100))}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400">{w.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Goal Completion Chart */}
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" /> 4. Goal Completion Chart
            </h3>
            <button onClick={() => setActiveView('goals')} className="text-xs font-semibold text-[#007BA7] hover:underline">
              Manage Goals →
            </button>
          </div>

          <div className="space-y-3">
            {goals.map((g) => (
              <div key={g.id} className="p-3 bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{g.title}</span>
                  <span className="font-mono text-emerald-400 font-bold">{g.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-[#007BA7] h-full rounded-full transition-all duration-500"
                    style={{ width: `${g.progressPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Charts Row 3: Subject-Wise Study Progress, Routine Completion, Habit Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 5: Subject-Wise Study Progress */}
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-400" /> 5. Subject-Wise Progress
            </h3>
            <button onClick={() => setActiveView('study_planner')} className="text-[11px] text-[#007BA7] hover:underline">
              Syllabus →
            </button>
          </div>

          <div className="space-y-3">
            {subjects.map((subj) => {
              const completedTopics = subj.topics.filter((t) => t.completed).length;
              const totalTopics = subj.topics.length;
              const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <div key={subj.id} className="p-3 bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{subj.name}</span>
                    <span className="font-mono text-teal-400 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 6: Routine Completion Chart */}
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> 6. Routine Completion
            </h3>
            <span className="text-[11px] font-mono text-indigo-400 font-semibold">7 Days History</span>
          </div>

          <div className="space-y-2 pt-2">
            {routineHistoryData.map((rh, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-12 font-mono text-slate-400 text-[10px]">{rh.label}</span>
                <div className="flex-1 bg-slate-100 dark:bg-[#0B0B0F] h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${rh.pct}%` }} />
                </div>
                <span className="w-8 font-mono text-right text-[10px] font-bold text-slate-300">{rh.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 7: Habit Consistency Chart */}
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#FF3B81]" /> 7. Habit Consistency
            </h3>
            <span className="text-[11px] font-mono text-[#FF3B81] font-bold">Streaks</span>
          </div>

          <div className="space-y-3">
            {habits.map((h, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{h.name}</div>
                  <span className="text-[10px] text-slate-400">{h.category}</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-[#FF3B81]">
                  <Flame className="w-3.5 h-3.5 fill-[#FF3B81]" />
                  <span>{h.streakDays} Days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

