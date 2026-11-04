import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { JobOpportunity, SavedJobTracker } from '../../types';
import { Briefcase, Search, Bookmark, ExternalLink, Calendar, CheckCircle2, Clock, MapPin, DollarSign, FileCheck } from 'lucide-react';

export const CampusLinkJobs: React.FC = () => {
  const { jobOpportunities, savedTrackers, toggleSaveJobOpportunity, updateJobTrackerStatus, currentUser } = useGoalForgeStore();

  const [activeTab, setActiveTab] = useState<'opportunities' | 'my_trackers'>('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredOpportunities = jobOpportunities.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || j.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Jobs & Internships Discovery</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover student job and internship opportunities, save listings, and track application milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Tracked Applications:</span>
          <span className="font-bold text-[#007BA7] bg-[#007BA7]/10 px-2.5 py-1 rounded-lg border border-[#007BA7]/20">
            {savedTrackers.length} Tracked
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-xl transition-colors font-semibold ${
            activeTab === 'opportunities' ? 'bg-[#007BA7] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Discover Opportunities ({jobOpportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('my_trackers')}
          className={`px-4 py-2 rounded-xl transition-colors font-semibold ${
            activeTab === 'my_trackers' ? 'bg-[#007BA7] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          My Application Tracker ({savedTrackers.length})
        </button>
      </div>

      {/* Tab 1: Discover Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#007BA7]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg ${filterType === 'all' ? 'bg-[#007BA7] text-white font-semibold' : 'bg-slate-100 dark:bg-[#0B0B0F] text-slate-600 dark:text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('Internship')}
                className={`px-3 py-1.5 rounded-lg ${filterType === 'Internship' ? 'bg-[#007BA7] text-white font-semibold' : 'bg-slate-100 dark:bg-[#0B0B0F] text-slate-600 dark:text-slate-400'}`}
              >
                Internships
              </button>
              <button
                onClick={() => setFilterType('Full-Time')}
                className={`px-3 py-1.5 rounded-lg ${filterType === 'Full-Time' ? 'bg-[#007BA7] text-white font-semibold' : 'bg-slate-100 dark:bg-[#0B0B0F] text-slate-600 dark:text-slate-400'}`}
              >
                Full-Time
              </button>
            </div>
          </div>

          {/* Opportunities Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs hover:border-[#007BA7] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={opp.companyLogoUrl}
                        alt={opp.companyName}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 object-cover"
                      />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">{opp.companyName}</h3>
                        <span className="text-[10px] font-mono text-[#007BA7]">{opp.type}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveJobOpportunity(opp.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        opp.isSaved ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400 hover:text-amber-500'
                      }`}
                      title={opp.isSaved ? 'Saved to Tracker' : 'Save Opportunity'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{opp.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    💰 {opp.ctcOrStipend}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{opp.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-[#007BA7] hover:bg-[#00688e] text-white text-xs font-semibold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Official Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: My Application Tracker */}
      {activeTab === 'my_trackers' && (
        <div className="bg-white dark:bg-[#15151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Track Application Milestones
          </h2>

          <div className="space-y-3">
            {savedTrackers.map((tr) => (
              <div
                key={tr.id}
                className="p-4 bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{tr.companyName}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{tr.title}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    {tr.status}
                  </span>
                </div>

                {tr.interviewDate && (
                  <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg text-xs font-mono">
                    Interview Scheduled: {tr.interviewDate}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">Update Status:</span>
                  {(['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'] as SavedJobTracker['status'][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateJobTrackerStatus(tr.id, st)}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                        tr.status === st
                          ? 'bg-[#007BA7] text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {savedTrackers.length === 0 && (
              <div className="text-center text-slate-500 py-8 text-xs">
                No tracked opportunities yet. Bookmark opportunities in the Discover tab!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
