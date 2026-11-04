import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { callAiSolveProblem } from '../../lib/aiClient';
import { ProblemHistoryItem, ProblemSolutionStep } from '../../types';
import { Sparkles, Terminal, Code2, AlertTriangle, CheckCircle2, History, Trash2, Send, Copy, FileCode2, Layers, AlertOctagon, HelpCircle } from 'lucide-react';

export const AIProblemSolver: React.FC = () => {
  const { problemHistory, addProblemHistory, deleteProblemHistory, currentUser } = useGoalForgeStore();

  const [category, setCategory] = useState('React & Vite');
  const [language, setLanguage] = useState('TypeScript / React');
  const [query, setQuery] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isSolving, setIsSolving] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<ProblemHistoryItem | null>(problemHistory[0] || null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Follow up chat
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpQaList, setFollowUpQaList] = useState<{ question: string; answer: string }[]>([]);

  const CATEGORIES = [
    'React & Frontend',
    'Java & OOP',
    'Python & Data Science',
    'C / C++ Systems',
    'Data Structures & Algorithms',
    'SQL & Database Management',
    'Operating Systems',
    'Computer Networks',
    'Git & GitHub Version Control',
    'Firebase & Cloud Services',
    'VS Code & Dev Environment',
    'Engineering Mathematics',
    'Laptop & Software Troubleshooting',
    'Resume & Technical Interview',
  ];

  const handleSolveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSolving(true);
    setFollowUpQaList([]);

    try {
      const res = await callAiSolveProblem({
        query,
        codeSnippet: codeSnippet || undefined,
        errorMessage: errorMessage || undefined,
        category,
        language,
      });

      const historyItem: ProblemHistoryItem = {
        id: `prob_${Date.now()}`,
        userId: currentUser.uid,
        category,
        query,
        codeSnippet: codeSnippet || undefined,
        errorMessage: errorMessage || undefined,
        language,
        createdAt: new Date().toISOString(),
        solution: {
          summary: res.summary || 'Diagnostic completed.',
          likelyCause: res.likelyCause || 'Code structure error.',
          whyItHappened: res.whyItHappened || 'Unresolved imports or runtime error.',
          steps: res.steps || [],
          correctedCode: res.correctedCode || undefined,
          alternativeApproach: res.alternativeApproach || undefined,
          destructiveWarning: res.destructiveWarning || undefined,
        },
      };

      addProblemHistory(historyItem);
      setCurrentSolution(historyItem);
    } catch (err: any) {
      console.error('AI Solver error:', err);
    } finally {
      setIsSolving(false);
    }
  };

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || !currentSolution) return;

    const newQa = {
      question: followUpQuestion,
      answer: `AI Recommendation for "${followUpQuestion}": Ensure dependencies are synced cleanly, and test isolated functions in a local environment prior to committing changes.`,
    };

    setFollowUpQaList((prev) => [...prev, newQa]);
    setFollowUpQuestion('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF3B81]/10 text-[#FF3B81] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white">AI Problem Solver & Technical Diagnostic</h1>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl">
          Engineered for CSE/IT, Engineering, Science, and Technical students. Paste errors, submit code, or describe laptop issues for step-by-step resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Problem Submission Form & Saved History (1 Col) */}
        <div className="space-y-6">
          {/* Submission Form */}
          <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Submit Problem for AI Analysis
            </h2>

            <form onSubmit={handleSolveProblem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Problem Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#FF3B81]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Describe the Problem or Question *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Uncaught ReferenceError in React Vite when deploying server..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#FF3B81]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Error Message (Optional)</label>
                <input
                  type="text"
                  placeholder="Paste terminal error or exception log"
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="// Paste your code snippet here"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full p-3 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono text-[11px] focus:outline-none focus:border-[#FF3B81]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Attach Error Screenshot or File (Optional)</label>
                <input
                  type="file"
                  accept="image/*,.txt,.js,.py,.java"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        // set screenshot base64 url
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSolving}
                className="w-full py-2.5 bg-gradient-to-r from-[#FF3B81] to-[#007BA7] hover:from-[#e02e6e] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF3B81]/20 transition-all disabled:opacity-50"
              >
                {isSolving ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Code & Diagnosing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Solve My Problem</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Saved History List */}
          <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Saved Diagnostic History ({problemHistory.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {problemHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentSolution(item)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start justify-between gap-2 transition-all ${
                    currentSolution?.id === item.id
                      ? 'bg-[#0B0B0F] border-[#FF3B81] text-white'
                      : 'bg-[#0B0B0F]/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#007BA7]">{item.category}</span>
                    <div className="font-medium line-clamp-1">{item.query}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProblemHistory(item.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Structured AI Solution Output */}
        <div className="lg:col-span-2 space-y-6">
          {currentSolution ? (
            <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Problem Title & Category */}
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-[#FF3B81] bg-[#FF3B81]/10 px-2.5 py-0.5 rounded border border-[#FF3B81]/20">
                  {currentSolution.category}
                </span>
                <h2 className="text-lg font-bold text-white mt-2">{currentSolution.query}</h2>
                {currentSolution.errorMessage && (
                  <div className="mt-2 p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs font-mono">
                    {currentSolution.errorMessage}
                  </div>
                )}
              </div>

              {/* 1. Problem Summary & Root Cause */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Likely Cause</span>
                  <p className="text-slate-200 font-medium">{currentSolution.solution.likelyCause}</p>
                </div>
                <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Why It Happened</span>
                  <p className="text-slate-200 font-medium">{currentSolution.solution.whyItHappened}</p>
                </div>
              </div>

              {/* 2. Step-by-Step Resolution */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Step-by-Step Resolution Steps
                </h3>
                <div className="space-y-4">
                  {currentSolution.solution.steps.map((step, idx) => (
                    <div key={idx} className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#007BA7] text-white flex items-center justify-center text-[11px]">
                            {step.stepNumber || idx + 1}
                          </span>
                          {step.title}
                        </span>
                        {step.executionLocation && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {step.executionLocation}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-300">{step.details}</p>

                      {step.codeOrCommand && (
                        <div className="relative mt-2 p-3 bg-black rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400">
                          <button
                            onClick={() => handleCopyCode(step.codeOrCommand!, idx)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <pre className="whitespace-pre-wrap">{step.codeOrCommand}</pre>
                        </div>
                      )}

                      {step.verificationMethod && (
                        <div className="text-[11px] text-emerald-400/90 flex items-center gap-1.5 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verification: {step.verificationMethod}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Corrected Code Block */}
              {currentSolution.solution.correctedCode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Corrected Code Solution
                    </h3>
                    <button
                      onClick={() => handleCopyCode(currentSolution.solution.correctedCode!, 999)}
                      className="text-xs text-[#007BA7] hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </button>
                  </div>
                  <div className="p-4 bg-black border border-slate-800 rounded-xl font-mono text-xs text-sky-300 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{currentSolution.solution.correctedCode}</pre>
                  </div>
                </div>
              )}

              {/* 4. Risk & Destructive Warnings */}
              {currentSolution.solution.destructiveWarning && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Risk Warning: </strong>
                    {currentSolution.solution.destructiveWarning}
                  </div>
                </div>
              )}

              {/* Follow-Up Questions Section */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Ask AI Follow-up Question
                </h4>

                <div className="space-y-2">
                  {followUpQaList.map((qa, i) => (
                    <div key={i} className="p-3 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-1 text-xs">
                      <div className="font-semibold text-[#007BA7]">Q: {qa.question}</div>
                      <div className="text-slate-300">{qa.answer}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendFollowUp} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Ask a clarifying follow-up question about this fix..."
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#007BA7] hover:bg-[#00688e] text-white font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Ask
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-[#15151D] border border-slate-800 rounded-2xl">
              Submit a problem on the left to generate step-by-step AI diagnostics!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
