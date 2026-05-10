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
      if (sortBy === 'Most Recent') return 0;
      if (sortBy === 'Oldest First') return 0;
      if (sortBy === 'Title A-Z') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'Title Z-A') return (b.title || '').localeCompare(a.title || '');
      return 0;
    });

  const finalJobs = sortBy === 'Oldest First' ? [...processed].reverse() : processed;

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Saved Opportunities</h1>
            <p className="text-sm text-slate-500">Manage and compare your bookmarked roles.</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Collection Size</span>
             <span className="text-sm font-bold text-blue-600">{savedJobs.length} SAVED</span>
          </div>
        </div>
      </header>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 h-10 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
            placeholder="Search saved jobs..."
          />
        </div>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => { setSortOpen(o => !o); setMatchOpen(false); }}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest hover:border-blue-500 transition-all shadow-sm"
          >
            {sortBy}
            <span className="material-symbols-outlined text-sm">{sortOpen ? 'expand_less' : 'expand_more'}</span>
          </button>
          {sortOpen && (
            <div className="absolute top-full right-0 mt-2 z-50 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors
                    ${sortBy === opt ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setRemoteOnly(r => !r)}
          className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm
            ${remoteOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500'}`}
        >
          Remote Only
        </button>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {finalJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-300">bookmark</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              {savedJobs.length === 0 ? 'No Saved Jobs' : 'No Results Found'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              {savedJobs.length === 0 ? 'Start exploring the marketplace to build your career collection.' : 'Try adjusting your filters to find what you are looking for.'}
            </p>
            {savedJobs.length === 0 && (
              <button onClick={() => navigate('/platform/jobseeker/jobs')} className="mt-6 h-10 px-8 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                Explore Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {finalJobs.map(job => (
              <div key={job.id} className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-12 bg-slate-50 flex items-center justify-center rounded-xl font-black text-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors uppercase">
                      {job.company?.[0] || 'J'}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">{job.title}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1">{job.company} • {job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                       <span className="block text-2xl font-black text-blue-600 leading-none">{job.matchScore || 0}% MATCH</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => removeJob(job.id)} className="size-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined">bookmark_remove</span>
                       </button>
                       <button className="h-10 px-8 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all">
                         View Details
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
