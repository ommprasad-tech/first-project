import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { callAiAnalyzeSkillGap } from '../../lib/aiClient';
import { SkillGapAnalysisResult, SkillItem } from '../../types';
import { Zap, Sparkles, CheckCircle2, Award, Plus, Trash2, AlertCircle } from 'lucide-react';

export const SkillTrackStudent: React.FC = () => {
  const { skills, addSkill, deleteSkill, currentUser } = useGoalForgeStore();

  const [targetRole, setTargetRole] = useState(currentUser.careerGoal || 'Software Development Engineer (SDE-1)');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gapResult, setGapResult] = useState<SkillGapAnalysisResult | null>({
    currentLevelSummary: 'Strong foundation in Web Development & CS Core. Recommended focus on System Design & Microservices.',
    recommendedSkillsToLearn: [
      { name: 'System Design & Microservices', category: 'technical', priority: 'high', reason: 'Essential for SDE-1 interviews' },
      { name: 'Docker & Kubernetes', category: 'tool', priority: 'high', reason: 'Industry standard deployment & containerization' },
      { name: 'Cloud Services (AWS/GCP)', category: 'tool', priority: 'medium', reason: 'Valuable for full-stack & DevOps roles' },
    ],
    missingCoreSkills: ['System Architecture', 'Containerization', 'Cloud Deployment'],
    suggestedProjectsToBuild: [
      'Microservices E-Commerce API with Redis caching',
      'Dockerized Full-Stack Task Automation Dashboard',
    ],
    learningTimelineWeeks: 6,
  });

  // Add Skill Form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'soft_skill' | 'language' | 'tool'>('technical');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [certName, setCertName] = useState('');

  const handleRunSkillGap = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const skillNames = skills.map((s) => s.name);
      const result = await callAiAnalyzeSkillGap({
        studentSkills: skillNames,
        targetRole,
      });
      setGapResult(result);
    } catch (err) {
      console.error('Skill gap analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      id: `sk_${Date.now()}`,
      userId: currentUser.uid,
      name: newSkillName,
      category: newSkillCategory,
      level: newSkillLevel,
      certified: !!certName,
      certificationName: certName || undefined,
      lastAssessedDate: new Date().toISOString().split('T')[0],
    };

    addSkill(newSkill);
    setNewSkillName('');
    setCertName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold text-white">SkillTrack — Skill Development & Impact Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build your skill ratings, track verified certifications, and run AI skill-gap analysis for targeted industry roles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Skills:</span>
          <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {skills.length} Logged
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Matrix & Add Skill */}
        <div className="space-y-6">
          {/* Add Skill Form */}
          <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Add New Skill or Certification
            </h2>

            <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Docker, PostgreSQL, PyTorch"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="technical">Technical</option>
                    <option value="tool">Developer Tool</option>
                    <option value="language">Language</option>
                    <option value="soft_skill">Soft Skill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Proficiency</label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Certification (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Developer"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#007BA7] hover:bg-[#00688e] text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </form>
          </div>

          {/* Skill Inventory List */}
          <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Your Skills Inventory ({skills.length})
            </h3>

            <div className="space-y-2.5">
              {skills.map((s) => (
                <div key={s.id} className="p-3 bg-[#0B0B0F] border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded uppercase">
                        {s.level}
                      </span>
                      <button
                        onClick={() => deleteSkill(s.id)}
                        className="text-slate-500 hover:text-rose-400 p-0.5"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="uppercase text-[10px] text-slate-500 font-mono">{s.category}</span>
                    {s.certified && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                        <Award className="w-3.5 h-3.5 text-amber-400" /> {s.certificationName || 'Certified'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: AI Skill Gap Analysis Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Role Selector & AI Trigger */}
          <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Skill-Gap Analyzer
            </h2>

            <form onSubmit={handleRunSkillGap} className="flex flex-col sm:flex-row gap-3 text-xs">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Job Role (e.g. Full-Stack SDE, Data Scientist, DevOps Engineer)"
                className="flex-1 px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-5 py-2.5 bg-gradient-to-r from-[#007BA7] to-[#FF3B81] hover:from-[#00688e] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Gaps...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Skill-Gap Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Analysis Output */}
          {gapResult && (
            <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Summary Header */}
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs text-slate-400">Current Readiness Summary</span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">{gapResult.currentLevelSummary}</p>
              </div>

              {/* Recommended Skills Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Recommended Skills to Learn
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gapResult.recommendedSkillsToLearn.map((rec, i) => (
                    <div key={i} className="p-3.5 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{rec.name}</span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase ${
                            rec.priority === 'high'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-[#007BA7]/10 text-[#007BA7]'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Core Skills & Suggested Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Missing Core Skills */}
                <div className="p-4 bg-[#0B0B0F] border border-rose-500/20 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Missing Core Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {gapResult.missingCoreSkills.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-500/10 text-rose-300 rounded font-medium text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Portfolio Projects */}
                <div className="p-4 bg-[#0B0B0F] border border-[#007BA7]/20 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-[#007BA7] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Suggested Projects
                  </span>
                  <div className="space-y-1">
                    {gapResult.suggestedProjectsToBuild.map((proj, i) => (
                      <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#007BA7] shrink-0" />
                        <span>{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
