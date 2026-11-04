import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { Compass, CheckCircle2, ShieldCheck, FileText, Code2, Award, Zap } from 'lucide-react';

export const CareerRoadmap: React.FC = () => {
  const { currentUser, placementReadinessScore } = useGoalForgeStore();

  const [checklist, setChecklist] = useState([
    { id: 'chk_1', title: 'Complete 100+ LeetCode DSA Problems (Arrays, Trees, DP)', completed: true, category: 'Technical' },
    { id: 'chk_2', title: 'Build and deploy 2 Full-Stack projects with GitHub repos', completed: true, category: 'Portfolio' },
    { id: 'chk_3', title: 'Format ATS-compliant 1-page resume with verified projects', completed: true, category: 'Resume' },
    { id: 'chk_4', title: 'Review DBMS SQL Joins, Indexing, and Stored Procedures', completed: true, category: 'CS Core' },
    { id: 'chk_5', title: 'Practice Operating Systems Memory Management & Threads', completed: false, category: 'CS Core' },
    { id: 'chk_6', title: 'Complete 3 Mock Aptitude & Quantitative tests', completed: false, category: 'Aptitude' },
    { id: 'chk_7', title: 'Participate in 1 Peer Mock Technical & HR Interview round', completed: false, category: 'Interviews' },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)));
  };

  const completedCount = checklist.filter((c) => c.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Career Roadmap & Placement Readiness</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Targeting <strong className="text-slate-200">{currentUser.careerGoal}</strong>. Step-by-step career milestones and placement checklist.
          </p>
        </div>

        <div className="bg-[#0B0B0F] border border-slate-800 rounded-xl p-3 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Readiness Score</div>
            <div className="text-xl font-bold text-[#007BA7] tabular-nums">{placementReadinessScore}%</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#007BA7] flex items-center justify-center font-bold text-xs text-white">
            {placementReadinessScore}
          </div>
        </div>
      </div>

      {/* Roadmap Timeline Phases */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Software Engineer Career Roadmap (Year 3 - Year 4)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#0B0B0F] border border-emerald-500/30 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">PHASE 1 · COMPLETED</span>
            <h3 className="text-xs font-bold text-white">Fundamentals & Core CS</h3>
            <p className="text-[11px] text-slate-400">Master Data Structures, OOP, SQL databases, and Git version control.</p>
          </div>

          <div className="p-4 bg-[#0B0B0F] border border-[#007BA7] rounded-xl space-y-2 ring-1 ring-[#007BA7]/30">
            <span className="text-[10px] font-mono text-[#007BA7] bg-[#007BA7]/10 px-2 py-0.5 rounded">PHASE 2 · IN PROGRESS</span>
            <h3 className="text-xs font-bold text-white">Projects & Advanced DSA</h3>
            <p className="text-[11px] text-slate-400">Build full-stack AI web applications and solve 150+ LeetCode problems.</p>
          </div>

          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-slate-500">PHASE 3 · UPCOMING</span>
            <h3 className="text-xs font-bold text-slate-300">Campus Drives & OAs</h3>
            <p className="text-[11px] text-slate-400">Apply via CampusLink, complete online coding assessments and aptitude rounds.</p>
          </div>

          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-slate-500">PHASE 4 · UPCOMING</span>
            <h3 className="text-xs font-bold text-slate-300">Interviews & Offer Letter</h3>
            <p className="text-[11px] text-slate-400">Pass technical system design & HR interview rounds to sign offer letter.</p>
          </div>
        </div>
      </div>

      {/* Placement Readiness Checklist */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Placement Readiness Checklist ({completedCount}/{checklist.length} Verified)
            </h3>
            <p className="text-xs text-slate-400">Check off requirements as you complete prep modules.</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 font-mono">{progressPct}% Complete</span>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="p-3.5 bg-[#0B0B0F] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="rounded border-slate-700 text-[#007BA7]"
                />
                <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                  {item.title}
                </span>
              </div>

              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
