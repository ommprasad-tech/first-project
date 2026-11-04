import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { callAiResumeSuggestions } from '../../lib/aiClient';
import { FileText, Download, Sparkles, Github, Linkedin, ExternalLink, Save, Plus, Edit2, CheckCircle2 } from 'lucide-react';

export const ResumePortfolio: React.FC = () => {
  const { resumeData, updateResumeData, currentUser } = useGoalForgeStore();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'portfolio'>('edit');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ improvedSummary?: string; actionableSuggestions?: string[]; atsKeywordsToAdd?: string[] } | null>(null);

  // Form Fields
  const [summary, setSummary] = useState(resumeData.summary);
  const [githubUrl, setGithubUrl] = useState(resumeData.githubUrl || currentUser.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(resumeData.linkedinUrl || currentUser.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(resumeData.portfolioUrl || currentUser.portfolioUrl || '');

  const handleSaveResume = () => {
    updateResumeData({
      summary,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    });
  };

  const handleRunAiResumeSuggestions = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await callAiResumeSuggestions({
        summary: resumeData.summary,
        skills: resumeData.skills,
        experience: resumeData.experience,
        projects: resumeData.projects,
        careerGoal: currentUser.careerGoal,
      });

      setAiSuggestions(res);
      if (res.improvedSummary) {
        setSummary(res.improvedSummary);
      }
    } catch (err) {
      console.error('Resume AI error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Export Resume as PDF (using clean browser print layout)
  const handleExportPdf = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.fullName} - Resume</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.5; font-size: 14px; }
            h1 { font-size: 24px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
            .contact { font-size: 12px; color: #555; margin-bottom: 20px; border-bottom: 2px solid #222; padding-bottom: 10px; }
            h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 20px; color: #007BA7; }
            .section { margin-bottom: 15px; }
            .item-title { font-weight: bold; }
            .item-sub { font-size: 12px; color: #444; }
            ul { margin-top: 5px; padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${resumeData.fullName}</h1>
          <div class="contact">
            ${resumeData.email} | ${resumeData.phone} | ${resumeData.location}<br/>
            GitHub: ${resumeData.githubUrl || ''} | LinkedIn: ${resumeData.linkedinUrl || ''}
          </div>

          <h2>Professional Summary</h2>
          <p>${resumeData.summary}</p>

          <h2>Education</h2>
          ${resumeData.education.map((e) => `<div class="section"><div class="item-title">${e.degree}</div><div class="item-sub">${e.institution} (${e.year}) — GPA: ${e.gpa}</div></div>`).join('')}

          <h2>Technical Skills</h2>
          <p>${resumeData.skills.join(' • ')}</p>

          <h2>Projects</h2>
          ${resumeData.projects.map((p) => `<div class="section"><div class="item-title">${p.title}</div><div class="item-sub">Tech: ${p.tech}</div><p>${p.description}</p></div>`).join('')}

          <h2>Achievements</h2>
          <ul>${resumeData.achievements.map((a) => `<li>${a}</li>`).join('')}</ul>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#007BA7]" />
            <h1 className="text-xl font-bold text-white">Resume Builder & Personal Portfolio</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build ATS-compliant student resumes, generate AI suggestions, live preview, and export to PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all shadow-lg"
          >
            <Download className="w-4 h-4" /> Export Resume PDF
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 rounded-xl transition-colors font-semibold ${
            activeTab === 'edit' ? 'bg-[#007BA7] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Edit Resume Data
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl transition-colors font-semibold ${
            activeTab === 'preview' ? 'bg-[#007BA7] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Resume Preview
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl transition-colors font-semibold ${
            activeTab === 'portfolio' ? 'bg-[#007BA7] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Portfolio Links
        </button>
      </div>

      {/* Tab 1: Edit Resume Data */}
      {activeTab === 'edit' && (
        <div className="space-y-6">
          <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Professional Summary & AI Optimization
              </h2>
              <button
                onClick={handleRunAiResumeSuggestions}
                disabled={isGeneratingAi}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF3B81] to-[#007BA7] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAi ? 'Analyzing ATS...' : 'AI Resume Suggestions'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Resume Executive Summary</label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 bg-[#0B0B0F] border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#007BA7]"
              />
            </div>

            {/* AI Suggestions Box */}
            {aiSuggestions && (
              <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-sky-300 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> ATS Optimization Recommendations
                </span>
                <ul className="space-y-1 list-disc list-inside text-slate-200">
                  {aiSuggestions.actionableSuggestions?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleSaveResume}
              className="px-5 py-2 bg-[#007BA7] hover:bg-[#00688e] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Resume Updates
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Live Resume Preview Card */}
      {activeTab === 'preview' && (
        <div className="bg-white dark:bg-[#15151D] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto space-y-6 shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-300 dark:border-slate-800 pb-4 text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {resumeData.fullName}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {resumeData.email} · {resumeData.phone} · {resumeData.location}
            </p>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#007BA7] border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">{resumeData.summary}</p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#007BA7] border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
              Education
            </h2>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-slate-100">{edu.degree}</div>
                <div className="text-slate-600 dark:text-slate-400">
                  {edu.institution} ({edu.year}) — GPA: {edu.gpa}
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#007BA7] border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
              Skills
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">{resumeData.skills.join(' • ')}</p>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#007BA7] border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
              Projects
            </h2>
            {resumeData.projects.map((proj, i) => (
              <div key={i} className="text-xs space-y-1 mb-3">
                <div className="font-bold text-slate-900 dark:text-slate-100">{proj.title}</div>
                <div className="text-[11px] font-mono text-[#007BA7]">Tech: {proj.tech}</div>
                <p className="text-slate-700 dark:text-slate-300">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Portfolio Links */}
      {activeTab === 'portfolio' && (
        <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Personal Portfolio & Online Presence Links
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">GitHub Profile URL</label>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="flex-1 px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">LinkedIn Profile URL</label>
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-sky-400" />
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="flex-1 px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Portfolio Website URL</label>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#FF3B81]" />
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://myportfolio.dev"
                  className="flex-1 px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSaveResume}
              className="px-5 py-2 bg-[#007BA7] text-white font-semibold rounded-xl"
            >
              Save Portfolio Links
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
