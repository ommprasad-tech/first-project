import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { ProjectItem } from '../../types';
import { callAiProjectAssistant } from '../../lib/aiClient';
import { FolderGit2, Plus, Github, ExternalLink, Sparkles, CheckCircle2, Clock, Code2, Users, FileText, Trash2 } from 'lucide-react';

export const ProjectManager: React.FC = () => {
  const { projects, addProject, updateProject, toggleProjectTask, currentUser } = useGoalForgeStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('React, TypeScript, Express, Firebase');
  const [teamMembersInput, setTeamMembersInput] = useState(`${currentUser.fullName} (Lead)`);
  const [githubUrl, setGithubUrl] = useState('');

  // AI Assistant output state
  const [aiDocOutput, setAiDocOutput] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      userId: currentUser.uid,
      title,
      description,
      techStack: techStackInput.split(',').map((s) => s.trim()),
      teamMembers: teamMembersInput.split(',').map((s) => s.trim()),
      githubUrl: githubUrl || undefined,
      progressPercentage: 10,
      status: 'in_progress',
      tasks: [
        { id: `pt_${Date.now()}_1`, title: 'Design Database Schema & API Architecture', completed: false },
        { id: `pt_${Date.now()}_2`, title: 'Build Responsive Frontend UI Components', completed: false },
        { id: `pt_${Date.now()}_3`, title: 'Deploy prototype to Cloud Run and add README', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    addProject(newProj);
    setSelectedProjectId(newProj.id);
    setModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleRunAiAssistant = async (action: 'documentation' | 'task_breakdown' | 'architecture_advice') => {
    if (!activeProject) return;
    setIsGeneratingAi(true);
    try {
      const res = await callAiProjectAssistant({
        title: activeProject.title,
        description: activeProject.description,
        techStack: activeProject.techStack,
        action,
      });

      if (res.output) {
        setAiDocOutput(res.output);
        updateProject(activeProject.id, {
          aiDocumentation: res.output,
        });
      }
    } catch (err) {
      console.error('Project assistant error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Project & Portfolio Manager</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage software projects, team members, GitHub links, task boards, and generate AI technical documentation.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007BA7] hover:bg-[#00688e] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#007BA7]/20 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Projects Portfolio ({projects.length})
          </h2>

          <div className="space-y-2.5">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedProjectId === p.id
                    ? 'bg-[#15151D] border-[#007BA7] ring-1 ring-[#007BA7]/50 shadow-xl'
                    : 'bg-[#0B0B0F] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white line-clamp-1">{p.title}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase ${
                      p.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-purple-500/10 text-purple-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{p.techStack.slice(0, 3).join(', ')}</span>
                  <span className="font-bold text-white tabular-nums">{p.progressPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Selected Project Details & AI Advisor */}
        <div className="lg:col-span-2 space-y-6">
          {activeProject ? (
            <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Project Title & Links */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{activeProject.title}</h2>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {activeProject.progressPercentage}% Progress
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{activeProject.description}</p>
                </div>

                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-[#0B0B0F] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2 shrink-0"
                  >
                    <Github className="w-4 h-4" /> GitHub Repository
                  </a>
                )}
              </div>

              {/* Tech Stack & Team */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-slate-800 text-slate-200 rounded font-mono text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Members</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeProject.teamMembers || []).map((m: string, i: number) => (
                      <span key={i} className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 rounded text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks Board */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Project Tasks ({activeProject.tasks.filter((t) => t.completed).length}/{activeProject.tasks.length})
                </h3>

                <div className="space-y-2">
                  {activeProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleProjectTask(activeProject.id, task.id)}
                      className="p-3 bg-[#0B0B0F] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-3 text-xs cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-[#007BA7]"
                      />
                      <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Assistant Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF3B81]" /> AI Project Architect
                  </h4>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => handleRunAiAssistant('documentation')}
                      disabled={isGeneratingAi}
                      className="px-3 py-1.5 bg-[#007BA7]/10 text-[#007BA7] border border-[#007BA7]/20 rounded-lg hover:bg-[#007BA7]/20 font-medium disabled:opacity-50"
                    >
                      Generate Technical Docs
                    </button>
                    <button
                      onClick={() => handleRunAiAssistant('architecture_advice')}
                      disabled={isGeneratingAi}
                      className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 font-medium disabled:opacity-50"
                    >
                      Architecture Advice
                    </button>
                  </div>
                </div>

                {(aiDocOutput || activeProject.aiDocumentation) && (
                  <div className="p-4 bg-black border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                    {aiDocOutput || activeProject.aiDocumentation}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-[#15151D] border border-slate-800 rounded-2xl">
              Select or add a project on the left.
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#15151D] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Project to Portfolio</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Resume Screener or Campus Placement Portal"
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain problem statement and architecture..."
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Team Members</label>
                <input
                  type="text"
                  value={teamMembersInput}
                  onChange={(e) => setTeamMembersInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GitHub URL (Optional)</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
