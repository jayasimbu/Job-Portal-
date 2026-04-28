import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PLATFORM_COLORS = {
  'Naukri': 'bg-orange-100 text-orange-700 border-orange-200',
  'Internshala': 'bg-blue-100 text-blue-700 border-blue-200',
  'Indeed': 'bg-purple-100 text-purple-700 border-purple-200',
  'Wellfound': 'bg-green-100 text-green-700 border-green-200',
  'LinkedIn': 'bg-sky-100 text-sky-700 border-sky-200',
  'Glassdoor': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Monster': 'bg-violet-100 text-violet-700 border-violet-200',
  'ZipRecruiter': 'bg-lime-100 text-lime-700 border-lime-200',
};

const SORT_OPTIONS = ['Most Recent', 'Oldest First', 'Title A-Z', 'Title Z-A'];
const MATCH_OPTIONS = ['Any Score', 'High Match (>70%)', 'Medium Match (40-70%)', 'Low Match (<40%)'];

export default function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [matchFilter, setMatchFilter] = useState('Any Score');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const sortRef = useRef(null);
  const matchRef = useRef(null);

  useEffect(() => {
    try {
      const jobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      setSavedJobs(jobs);
    } catch { setSavedJobs([]); }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (matchRef.current && !matchRef.current.contains(e.target)) setMatchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const removeJob = (id) => {
    const updated = savedJobs.filter(j => j.id !== id);
    setSavedJobs(updated);
    localStorage.setItem('saved_jobs', JSON.stringify(updated));
  };

  // Filter + Sort pipeline
  const processed = savedJobs
    .filter(j => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q);
      const matchesRemote = !remoteOnly || j.location?.toLowerCase().includes('remote');
      const score = j.matchScore || 0;
      const matchesScore =
        matchFilter === 'Any Score' ? true :
        matchFilter === 'High Match (>70%)' ? score > 70 :
        matchFilter === 'Medium Match (40-70%)' ? score >= 40 && score <= 70 :
        matchFilter === 'Low Match (<40%)' ? score < 40 : true;
      return matchesSearch && matchesRemote && matchesScore;
    })
    .sort((a, b) => {
      if (sortBy === 'Most Recent') return 0; // preserved insertion order
      if (sortBy === 'Oldest First') return 0; // reversed
      if (sortBy === 'Title A-Z') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'Title Z-A') return (b.title || '').localeCompare(a.title || '');
      return 0;
    });

  const finalJobs = sortBy === 'Oldest First' ? [...processed].reverse() : processed;

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Your Saved Jobs <span className="text-slate-400 font-medium text-base ml-1">({savedJobs.length})</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Manage and compare your bookmarked opportunities.</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="material-symbols-outlined text-[16px] text-blue-600">compare_arrows</span>
          Compare Mode
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2632] text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by title or company..."
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => { setSortOpen(o => !o); setMatchOpen(false); }}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm"
          >
            {sortBy}
            <span className="material-symbols-outlined text-sm">{sortOpen ? 'expand_less' : 'expand_more'}</span>
          </button>
          {sortOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setSortOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors
                    ${sortBy === opt ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Match Score Dropdown */}
        <div className="relative" ref={matchRef}>
          <button
            onClick={() => { setMatchOpen(o => !o); setSortOpen(false); }}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {matchFilter === 'Any Score' ? 'Match Score' : matchFilter}
            <span className="material-symbols-outlined text-sm">{matchOpen ? 'expand_less' : 'expand_more'}</span>
          </button>
          {matchOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1">
              {MATCH_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setMatchFilter(opt); setMatchOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors
                    ${matchFilter === opt ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Remote Only Toggle */}
        <button
          onClick={() => setRemoteOnly(r => !r)}
          className={`h-8 px-3 rounded-lg text-xs font-bold border transition-colors
            ${remoteOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-[#1a2632] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          Remote Only
        </button>
      </div>

      {/* Job List */}
      <div className="flex flex-col gap-2">
        {finalJobs.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">bookmark_border</span>
            <h2 className="text-base font-bold mt-2 text-slate-600 dark:text-slate-300">
              {savedJobs.length === 0 ? 'No saved jobs yet.' : 'No jobs match your filters.'}
            </h2>
            {savedJobs.length === 0 && (
              <button onClick={() => navigate('/jobseeker/jobs')} className="mt-4 px-5 py-1.5 text-sm bg-blue-600 text-white rounded-xl">Browse Jobs</button>
            )}
          </div>
        ) : finalJobs.map(job => {
          const pColor = PLATFORM_COLORS[job.platform] || 'bg-slate-50 border-slate-200 text-slate-600';
          return (
            <div key={job.id} className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-400/40 transition-all">
              {/* Platform badge */}
              <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border text-[9px] font-bold text-center leading-tight p-1 ${pColor}`}>
                {job.platform?.slice(0, 6)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{job.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {job.salary && job.salary !== 'Not disclosed' && (
                    <span className="flex items-center gap-1 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[12px]">payments</span>{job.salary}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>Full-time
                  </span>
                  {job.posted_at && <span className="text-[10px] text-slate-400">{job.posted_at}</span>}
                </div>
              </div>

              {/* Match + Actions */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{job.matchScore || 0}%</span>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Match</p>
                </div>
                <div className="flex gap-1.5 items-center">
                  <button onClick={() => removeJob(job.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-base">bookmark_remove</span>
                  </button>
                  <a
                    href={job.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white text-[11px] font-bold transition-all"
                  >
                    Apply
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
