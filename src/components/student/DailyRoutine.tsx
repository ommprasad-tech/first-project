import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { RoutineActivity, DailyHistoryRecord } from '../../types';
import { callAiGenerateRoutine, callAiDailyCheckIn } from '../../lib/aiClient';
import { Clock, Sparkles, CheckCircle2, XCircle, RefreshCw, Plus, Edit2, Play, AlertCircle, Calendar as CalendarIcon, CheckSquare, MessageSquare, Trash2, Save, Star } from 'lucide-react';

export const DailyRoutine: React.FC = () => {
  const {
    routineActivities,
    toggleRoutineActivity,
    setRoutineActivities,
    goals,
    tasks,
    saveDailyHistoryRecord,
    dailyHistoryRecords,
    currentUser,
  } = useGoalForgeStore();

  const [activeTab, setActiveTab] = useState<'schedule' | 'evening_review' | 'history'>('schedule');

  // Generator Form
  const [wakeTime, setWakeTime] = useState(currentUser.wakeTime || '06:30');
  const [sleepTime, setSleepTime] = useState(currentUser.sleepTime || '22:30');
  const [collegeStartTime, setCollegeStartTime] = useState('09:00');
  const [collegeEndTime, setCollegeEndTime] = useState('16:30');
  const [studyTargetHours, setStudyTargetHours] = useState(currentUser.dailyStudyHours || 4);

  const [isGenerating, setIsGenerating] = useState(false);

  // New Activity Modal
  const [addActModalOpen, setAddActModalOpen] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actCategory, setActCategory] = useState<RoutineActivity['category']>('study');
  const [actStart, setActStart] = useState('17:00');
  const [actEnd, setActEnd] = useState('18:00');

  // Reschedule Modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [newRescheduledTime, setNewRescheduledTime] = useState('18:00');
  const [missedReason, setMissedReason] = useState('');

  // Evening Review Form State
  const [difficulties, setDifficulties] = useState('');
  const [studyHoursLogged, setStudyHoursLogged] = useState(studyTargetHours);
  const [goalTasksDone, setGoalTasksDone] = useState(true);
  const [productivityRating, setProductivityRating] = useState(4);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSavedSuccess, setReviewSavedSuccess] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleGenerateAiRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const activeGoalTitles = goals.map((g) => g.title);
      const res = await callAiGenerateRoutine({
        wakeTime,
        sleepTime,
        collegeStartTime,
        collegeEndTime,
        studyTargetHours,
        activeGoalTitles,
      });

      if (res.routine && res.routine.length > 0) {
        setRoutineActivities(res.routine);
      }
    } catch (err) {
      console.error('Routine generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    const newAct: RoutineActivity = {
      id: `act_${Date.now()}`,
      title: actTitle,
      category: actCategory,
      startTime: actStart,
      endTime: actEnd,
      completed: false,
    };

    setRoutineActivities([...routineActivities, newAct]);
    setAddActModalOpen(false);
    setActTitle('');
  };

  const handleDeleteActivity = (id: string) => {
    setRoutineActivities(routineActivities.filter((a) => a.id !== id));
  };

  const handleSkipActivity = (id: string) => {
    setRoutineActivities(
      routineActivities.map((act) =>
        act.id === id ? { ...act, skipped: !act.skipped, completed: false } : act
      )
    );
  };

  const handleRescheduleActivity = () => {
    if (!selectedActId) return;
    setRoutineActivities(
      routineActivities.map((act) =>
        act.id === selectedActId
          ? {
              ...act,
              startTime: newRescheduledTime,
              rescheduledTime: newRescheduledTime,
              missedReason: missedReason || act.missedReason,
            }
          : act
      )
    );
    setRescheduleModalOpen(false);
    setMissedReason('');
  };

  // Submit Evening Review & Save Daily History
  const handleSubmitEveningReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    const completedList = routineActivities.filter((a) => a.completed).map((a) => a.title);
    const missedList = routineActivities.filter((a) => !a.completed).map((a) => a.title);

    let aiSuggestions: string[] = [
      'Maintain study blocks during your peak energy hours.',
      'Take 5-minute hydration breaks between intense coding sprints.',
      'Review tomorrow morning tasks before going to sleep.',
    ];
    let encouragement = 'Great job staying dedicated to your academic & career growth!';

    try {
      const aiRes = await callAiDailyCheckIn({
        completedTasks: completedList,
        pendingTasks: missedList,
        learnedToday: reviewNotes || 'Deep study & project work completed',
        studyHours: studyHoursLogged,
        challenges: difficulties || 'None',
      });

      if (aiRes.recommendations) aiSuggestions = aiRes.recommendations;
      if (aiRes.encouragement) encouragement = aiRes.encouragement;
    } catch (err) {
      console.warn('AI Evening Review checkin fallback:', err);
    }

    const completedActsCount = routineActivities.filter((a) => a.completed).length;
    const totalActsCount = routineActivities.length;
    const routinePct = totalActsCount > 0 ? Math.round((completedActsCount / totalActsCount) * 100) : 100;

    const completedTasksToday = tasks.filter((t) => t.status === 'completed');
    const pendingTasksToday = tasks.filter((t) => t.status === 'pending');
    const missedTasksToday = tasks.filter((t) => t.status === 'missed');

    const historyRecord: DailyHistoryRecord = {
      id: todayStr,
      userId: currentUser.uid,
      date: todayStr,
      routineSnapshot: routineActivities,
      completedActivitiesCount: completedActsCount,
      totalActivitiesCount: totalActsCount,
      routineCompletionPercentage: routinePct,
      studyHours: studyHoursLogged,
      completedTasksCount: completedTasksToday.length,
      pendingTasksCount: pendingTasksToday.length,
      missedTasksCount: missedTasksToday.length,
      productivityScore: productivityRating * 20,
      notes: reviewNotes,
      eveningReview: {
        completedSummary: completedList.join(', ') || 'Activities completed as scheduled.',
        missedSummary: missedList.join(', ') || 'No missed activities.',
        difficulties: difficulties || 'Smooth day with zero major blockers.',
        studyHoursLogged,
        goalTasksDone,
        productivityRating,
        aiImprovementSuggestions: aiSuggestions,
        encouragement,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveDailyHistoryRecord(historyRecord);
    setIsSubmittingReview(false);
    setReviewSavedSuccess(true);
    setTimeout(() => setReviewSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Smart Daily Routine & Life Planner</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            24-Hour time-blocked schedule, evening review, and permanent daily history tracking.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 text-xs bg-slate-100 dark:bg-[#0B0B0F] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold ${
              activeTab === 'schedule' ? 'bg-[#007BA7] text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Today's Schedule
          </button>

          <button
            onClick={() => setActiveTab('evening_review')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1 ${
              activeTab === 'evening_review' ? 'bg-[#FF3B81] text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Evening Review
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold ${
              activeTab === 'history' ? 'bg-[#007BA7] text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Saved Daily History
          </button>
        </div>
      </div>

      {/* Tab 1: Today's Schedule */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: AI Routine Generator Form (1 Col) */}
          <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs text-xs">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF3B81]" /> AI Schedule Generator
            </h2>

            <form onSubmit={handleGenerateAiRoutine} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Wake-Up Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Sleep Time</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">College Start</label>
                  <input
                    type="time"
                    value={collegeStartTime}
                    onChange={(e) => setCollegeStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">College End</label>
                  <input
                    type="time"
                    value={collegeEndTime}
                    onChange={(e) => setCollegeEndTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Target Study ({studyTargetHours} hrs)
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={studyTargetHours}
                  onChange={(e) => setStudyTargetHours(Number(e.target.value))}
                  className="w-full accent-[#007BA7]"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-[#007BA7] to-[#FF3B81] hover:from-[#00688e] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
              >
                {isGenerating ? 'Optimizing Schedule...' : 'Generate Balanced Routine'}
              </button>
            </form>
          </div>

          {/* Right 2 Columns: Time-Blocked Routine Timeline */}
          <div className="lg:col-span-2 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Today's Schedule ({routineActivities.length} Time Slots)
              </h2>
              <button
                onClick={() => setAddActModalOpen(true)}
                className="px-3 py-1 bg-[#007BA7] text-white font-semibold text-xs rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Activity
              </button>
            </div>

            <div className="space-y-3">
              {routineActivities.map((act) => (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    act.completed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-700 dark:text-slate-300'
                      : act.skipped
                      ? 'bg-rose-500/5 border-rose-500/20 text-slate-400'
                      : 'bg-slate-50 dark:bg-[#0B0B0F] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 font-mono text-xs text-[#007BA7] font-semibold shrink-0">
                      {act.startTime} - {act.endTime}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${act.completed ? 'line-through text-slate-500' : ''}`}>
                          {act.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase ${
                            act.category === 'college'
                              ? 'bg-purple-500/10 text-purple-400'
                              : act.category === 'coding'
                              ? 'bg-[#FF3B81]/10 text-[#FF3B81]'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {act.category}
                        </span>
                      </div>
                      {act.missedReason && (
                        <span className="text-[10px] text-rose-400 block mt-0.5">Reason: {act.missedReason}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleRoutineActivity(act.id)}
                      className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                        act.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {act.completed ? 'Completed' : 'Mark Done'}
                    </button>

                    <button
                      onClick={() => handleSkipActivity(act.id)}
                      className="p-1 text-slate-400 hover:text-amber-500"
                      title="Skip"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedActId(act.id);
                        setRescheduleModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-[#007BA7]"
                      title="Reschedule"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Evening Review Form */}
      {activeTab === 'evening_review' && (
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs text-xs max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF3B81]" /> End-of-Day Evening Review & AI Analysis
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Reflect on today's activities to generate tomorrow's AI improvement suggestions and save to daily history.</p>
            </div>
          </div>

          {reviewSavedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Evening Review & Daily History Record Saved to Firebase!</span>
            </div>
          )}

          <form onSubmit={handleSubmitEveningReview} className="space-y-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                How many total hours did you study/code today?
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="18"
                value={studyHoursLogged}
                onChange={(e) => setStudyHoursLogged(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Did you complete your primary goal-related tasks today?
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="goalDone"
                    checked={goalTasksDone}
                    onChange={() => setGoalTasksDone(true)}
                    className="text-[#007BA7]"
                  />
                  <span className="text-slate-800 dark:text-slate-200">Yes, completed all goal tasks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="goalDone"
                    checked={!goalTasksDone}
                    onChange={() => setGoalTasksDone(false)}
                    className="text-[#007BA7]"
                  />
                  <span className="text-slate-800 dark:text-slate-200">Partial / Missed some goal tasks</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Rate today's overall productivity (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setProductivityRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= productivityRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                What difficulties or blockers did you face today?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Unclear on recursion in Data Structures or distraction during evening study..."
                value={difficulties}
                onChange={(e) => setDifficulties(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Reflection & Key Learnings Today
              </label>
              <textarea
                rows={2}
                placeholder="What new concepts or topics did you learn today?"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full py-3 bg-gradient-to-r from-[#FF3B81] to-[#007BA7] text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-xs"
            >
              {isSubmittingReview ? (
                <span>AI Analyzing & Saving Daily Review...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Evening Review & Generate Tomorrow's Plan
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Saved Daily History */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" /> Permanent Daily History Archive ({dailyHistoryRecords.length} Days)
          </h2>

          <div className="space-y-4">
            {dailyHistoryRecords.map((rec) => (
              <div key={rec.id} className="p-4 bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-mono font-bold text-[#007BA7] text-sm">{rec.date}</span>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                    Productivity: {rec.productivityScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>Study Hours: <strong>{rec.studyHours} hrs</strong></div>
                  <div>Routine Completed: <strong>{rec.routineCompletionPercentage}%</strong></div>
                  <div>Tasks Done: <strong>{rec.completedTasksCount}</strong></div>
                  <div>Tasks Missed: <strong>{rec.missedTasksCount}</strong></div>
                </div>

                {rec.eveningReview && (
                  <div className="p-3 bg-slate-100 dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">AI Improvement Suggestions:</span>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                      {rec.eveningReview.aiImprovementSuggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {addActModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Time-Blocked Activity</h3>
            <form onSubmit={handleAddActivity} className="space-y-3">
              <div>
                <label className="block text-slate-500 mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures Revision"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={actStart}
                    onChange={(e) => setActStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={actEnd}
                    onChange={(e) => setActEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Category</label>
                <select
                  value={actCategory}
                  onChange={(e) => setActCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  <option value="study font-sans">Academic Study</option>
                  <option value="coding">Coding Practice</option>
                  <option value="exercise">Exercise / Health</option>
                  <option value="college">College / Classes</option>
                  <option value="meal">Meal / Break</option>
                  <option value="personal">Personal Time</option>
                  <option value="night">Night Routine</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddActModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#007BA7] text-white font-semibold rounded-lg"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reschedule Activity</h3>
            <div>
              <label className="block text-slate-500 mb-1">New Start Time</label>
              <input
                type="time"
                value={newRescheduledTime}
                onChange={(e) => setNewRescheduledTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Reason for Missed / Rescheduled Time</label>
              <input
                type="text"
                placeholder="e.g. Extra college lecture or lab assignment"
                value={missedReason}
                onChange={(e) => setMissedReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleActivity}
                className="px-3 py-1.5 bg-[#007BA7] text-white font-semibold rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

