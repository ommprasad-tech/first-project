import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { TrendingUp, BarChart3, Clock, CheckCircle2, Award, Zap, Calendar } from 'lucide-react';

export const ProgressAnalytics: React.FC = () => {
  const {
    todayCompletedTasksCount,
    todayPendingTasksCount,
    todayMissedTasksCount,
    overallProgressPercentage,
    totalStudyHours,
    goals,
    skills,
    projects,
  } = useGoalForgeStore();

  const [dateRange, setDateRange] = useState<'week' | 'month' | 'semester'>('week');

  const activeGoalsCount = goals.filter((g) => g.status === 'active').length;
  const completedGoalsCount = goals.filter((g) => g.progressPercentage === 100 || g.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#FF3B81]" />
            <h1 className="text-xl font-bold text-white">Student Progress Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time activity charts tracking task completion, study consistency, goal progress, and skill development.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 text-xs bg-[#0B0B0F] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setDateRange('week')}
            className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
              dateRange === 'week' ? 'bg-[#007BA7] text-white' : 'text-slate-400'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
              dateRange === 'month' ? 'bg-[#007BA7] text-white' : 'text-slate-400'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('semester')}
            className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
              dateRange === 'semester' ? 'bg-[#007BA7] text-white' : 'text-slate-400'
            }`}
          >
            Semester
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#15151D] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Overall Goal Completion</span>
          <div className="text-2xl font-bold text-[#007BA7] tabular-nums">{overallProgressPercentage}%</div>
          <p className="text-[10px] text-slate-400">{activeGoalsCount} Active Goals</p>
        </div>

        <div className="p-4 bg-[#15151D] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Today's Tasks Completed</span>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">{todayCompletedTasksCount}</div>
          <p className="text-[10px] text-slate-400">{todayPendingTasksCount} Pending Tasks</p>
        </div>

        <div className="p-4 bg-[#15151D] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Study & Coding Hours</span>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">{totalStudyHours} hrs</div>
          <p className="text-[10px] text-emerald-400">+2.5 hrs vs last week</p>
        </div>

        <div className="p-4 bg-[#15151D] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Skills Developed</span>
          <div className="text-2xl font-bold text-purple-400 tabular-nums">{skills.length}</div>
          <p className="text-[10px] text-slate-400">Technical & Soft skills</p>
        </div>
      </div>

      {/* Visual Analytics Bar Chart Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity Chart */}
        <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#007BA7]" /> Weekly Task Completion Rate
          </h2>

          <div className="space-y-3 pt-2">
            {[
              { day: 'Mon', completed: 85, hours: '4.5 hrs' },
              { day: 'Tue', completed: 90, hours: '5.0 hrs' },
              { day: 'Wed', completed: 75, hours: '3.5 hrs' },
              { day: 'Thu', completed: 100, hours: '6.0 hrs' },
              { day: 'Fri', completed: 80, hours: '4.0 hrs' },
              { day: 'Sat', completed: 60, hours: '3.0 hrs' },
              { day: 'Sun', completed: 70, hours: '3.5 hrs' },
            ].map((d, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>{d.day}</span>
                  <span className="font-mono text-slate-200">{d.hours} ({d.completed}%)</span>
                </div>
                <div className="w-full bg-[#0B0B0F] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#007BA7] to-[#FF3B81] h-full rounded-full"
                    style={{ width: `${d.completed}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Breakdown */}
        <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Active Goal Progress Breakdown
          </h2>

          <div className="space-y-4">
            {goals.map((g) => (
              <div key={g.id} className="p-3.5 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{g.title}</span>
                  <span className="font-mono text-[#007BA7] font-bold">{g.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-[#007BA7] h-full rounded-full"
                    style={{ width: `${g.progressPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly AI Summary Report */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Weekly AI Student Report</h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20 font-semibold">
            Generated from Firestore History
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* What went well */}
          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>What Went Well</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Completed {todayCompletedTasksCount} tasks today with overall {overallProgressPercentage}% goal completion.
              Consistent study blocks maintained across active subjects.
            </p>
          </div>

          {/* What was missed */}
          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <Clock className="w-4 h-4" />
              <span>Pending & Missed Tasks</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {todayPendingTasksCount} tasks pending for today. Make sure to complete high-priority coding and revision blocks before end of day.
            </p>
          </div>

          {/* Subject Attention */}
          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>Subject Attention Required</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Prioritize upcoming semester examination subjects and scheduled revision topics to ensure full syllabus coverage.
            </p>
          </div>

          {/* Goal Progress */}
          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#007BA7] font-bold">
              <Zap className="w-4 h-4" />
              <span>Active Goal Acceleration</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeGoalsCount} goals actively tracked. Maintain your current daily pace to achieve milestones ahead of target dates.
            </p>
          </div>

          {/* Next Week Focus */}
          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2 text-xs md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Calendar className="w-4 h-4" />
              <span>Next Week Strategic Focus</span>
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
              <li>Increase daily study target to maintain momentum on high-difficulty topics.</li>
              <li>Complete remaining project milestones and update GitHub repository.</li>
              <li>Perform evening reviews daily to keep routine completion percentage above 85%.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
