import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { SubjectItem } from '../../types';
import { callAiGenerateStudyPlan } from '../../lib/aiClient';
import { BookOpen, Calendar, Clock, Plus, Sparkles, CheckCircle2, AlertCircle, Play, ChevronRight, FileText } from 'lucide-react';

export const StudyPlanner: React.FC = () => {
  const { subjects, addSubject, toggleTopic, updateSubject, currentUser } = useGoalForgeStore();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [modalOpen, setModalOpen] = useState(false);

  // New subject form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [examDate, setExamDate] = useState('2026-11-20');
  const [targetHours, setTargetHours] = useState(15);
  const [topicsInput, setTopicsInput] = useState('Topic 1, Topic 2, Topic 3');

  // AI study plan state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const topicItems = topicsInput.split(',').map((t, idx) => ({
      id: `top_${Date.now()}_${idx}`,
      title: t.trim(),
      completed: false,
    }));

    const newSubj: SubjectItem = {
      id: `subj_${Date.now()}`,
      userId: currentUser.uid,
      name,
      code,
      examDate,
      targetRevisionHours: targetHours,
      completedRevisionHours: 0,
      topics: topicItems,
    };

    addSubject(newSubj);
    setSelectedSubjectId(newSubj.id);
    setModalOpen(false);
    setName('');
    setCode('');
  };

  const handleGenerateAiStudyPlan = async () => {
    if (!activeSubject) return;
    setIsGeneratingPlan(true);

    try {
      const uncompletedTopics = activeSubject.topics.filter((t) => !t.completed).map((t) => t.title);
      const res = await callAiGenerateStudyPlan({
        subjectName: activeSubject.name,
        examDate: activeSubject.examDate,
        targetRevisionHours: activeSubject.targetRevisionHours,
        topics: uncompletedTopics,
      });

      updateSubject(activeSubject.id, {
        aiStudyPlan: res.aiStudyPlan,
      });
    } catch (err) {
      console.error('Study plan error:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Subject-Wise Study Planner</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize academic subjects, track exam countdowns, schedule revision sessions, and generate AI study plans.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007BA7] hover:bg-[#00688e] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#007BA7]/20 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subjects List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Subjects ({subjects.length})
          </h2>

          <div className="space-y-2.5">
            {subjects.map((s) => {
              const completedTopicsCount = s.topics.filter((t) => t.completed).length;
              const pct = s.topics.length > 0 ? Math.round((completedTopicsCount / s.topics.length) * 100) : 0;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSubjectId(s.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedSubjectId === s.id
                      ? 'bg-[#15151D] border-[#007BA7] ring-1 ring-[#007BA7]/50 shadow-xl'
                      : 'bg-[#0B0B0F] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white line-clamp-1">{s.name}</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      {s.code || 'CORE'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Exam: {s.examDate || 'TBD'}</span>
                    <span className="font-bold text-white tabular-nums">{pct}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Subject Topics & AI Study Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {activeSubject ? (
            <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded">
                      {activeSubject.code}
                    </span>
                    <h2 className="text-xl font-bold text-white">{activeSubject.name}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Exam Date: <strong className="text-slate-200">{activeSubject.examDate || 'Scheduled'}</strong> · Target Revision: {activeSubject.targetRevisionHours} hours
                  </p>
                </div>

                <button
                  onClick={handleGenerateAiStudyPlan}
                  disabled={isGeneratingPlan}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-[#007BA7] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingPlan ? 'Generating...' : 'AI Study Strategy'}</span>
                </button>
              </div>

              {/* Topics Tracker */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Syllabus Topics ({activeSubject.topics.filter((t) => t.completed).length}/{activeSubject.topics.length} Revised)
                </h3>

                <div className="space-y-2">
                  {activeSubject.topics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => toggleTopic(activeSubject.id, topic.id)}
                      className="p-3 bg-[#0B0B0F] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={topic.completed}
                          onChange={() => {}}
                          className="rounded border-slate-700 text-[#007BA7]"
                        />
                        <span className={topic.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                          {topic.title}
                        </span>
                      </div>

                      {topic.revisionScheduledDate && (
                        <span className="text-[10px] font-mono text-sky-400">
                          Scheduled: {topic.revisionScheduledDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Study Plan Output */}
              {activeSubject.aiStudyPlan && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" /> AI Study Strategy
                  </div>
                  <p className="text-slate-200 leading-relaxed">{activeSubject.aiStudyPlan}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-[#15151D] border border-slate-800 rounded-2xl">
              Select or add a subject to view topics and create study schedules!
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#15151D] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Academic Subject</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Compiler Design or Operating Systems"
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CS601"
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Syllabus Topics (comma separated)</label>
                <textarea
                  rows={3}
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
