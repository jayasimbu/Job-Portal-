import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../core/api/apiClient';
import { fetchRecommendations, applyForJob } from '../services/jobseekerService';
import { mapJob } from '../../../core/api/adapters';

const PLATFORM_COLORS = {
  'Naukri': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'Internshala': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Indeed': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Wellfound': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  'LinkedIn': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  'Glassdoor': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Monster': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  'ZipRecruiter': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300 border-lime-200 dark:border-lime-800',
};

const PLATFORMS = ['All', 'LinkedIn', 'Naukri', 'Internshala', 'Indeed', 'Wellfound', 'Glassdoor', 'Monster', 'ZipRecruiter'];

export default function JobSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fromCache, setFromCache] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saved_jobs') || '[]'); } catch { return []; }
  });
  const [searchHistory, setSearchHistory] = useState([]);
  
  const [isApplying, setIsApplying] = useState({});
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const [activeTab, setActiveTab] = useState('All');
  const [platformOpen, setPlatformOpen] = useState(false);

  const fetchInitialJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const userStr = localStorage.getItem('currentUser') || '{}';
      const user = JSON.parse(userStr);
      if (!user.id) throw new Error('User not authenticated.');
      
      const resp = await fetchRecommendations(user.id);
      const mappedJobs = (resp.recommendations || []).map(job => mapJob(job));
      
      // Ensure platform is set for the UI
      mappedJobs.forEach(job => { if (!job.platform) job.platform = 'Internal'; });
      
      setJobs(mappedJobs);
      setFromCache(false);
    } catch (err) {
      console.error('Initial jobs fetch failed', err);
      setError('Failed to fetch recommendations. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userStr = localStorage.getItem('currentUser') || '{}';
        const user = JSON.parse(userStr);
        if (!user.id) return;
        
        const res = await import('../services/jobseekerService').then(m => m.fetchSearchHistory(user.id));
        setSearchHistory(res.history || []);
      } catch (e) {
        console.error('Failed to fetch search history', e);
      }
    };

    const loadInitialData = async () => {
      setLoading(true);
      setError('');
      try {
        const userStr = localStorage.getItem('currentUser') || '{}';
        const user = JSON.parse(userStr);
        if (!user.id) throw new Error('User not authenticated.');
        
        const resp = await fetchRecommendations(user.id);
        const mappedJobs = (resp.recommendations || []).map(job => mapJob(job));
        
        mappedJobs.forEach(job => { if (!job.platform) job.platform = 'Internal'; });
        
        setJobs(mappedJobs);
        setFromCache(false);
      } catch (err) {
        console.error('Initial jobs fetch failed', err);
        setError('Failed to fetch recommendations. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    loadInitialData();
  }, []);

  const handleApply = async (job) => {
    if (job.applied || isApplying[job.id]) return;
    const userStr = localStorage.getItem('currentUser') || '{}';
    const user = JSON.parse(userStr);
    
    // Optimistic UI
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: true } : j));
    setIsApplying(prev => ({ ...prev, [job.id]: true }));
    
    try {
      await applyForJob(user.id, job.id);
    } catch (err) {
      // Rollback on failure
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: false } : j));
      setError('Failed to apply. Please try again.');
    } finally {
      setIsApplying(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [comparing, setComparing] = useState(false);
  const [compareResult, setCompareResult] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) { setError('Enter a job title or skill to search.'); return; }
    setLoading(true);
    setCurrentPage(1);
    setError('');
    const prevJobs = jobs; // Persistence fallback
    setFromCache(false);
    try {
      const userStr = localStorage.getItem('currentUser') || '{}';
      const user = JSON.parse(userStr);
      
      const resp = await fetchRecommendations(user.id);
      let mappedJobs = (resp.recommendations || []).map(job => mapJob(job));
      mappedJobs.forEach(job => { if (!job.platform) job.platform = 'Internal'; });
      
      if (query.trim() || location.trim()) {
        const q = query.toLowerCase();
        const l = location.toLowerCase();
        mappedJobs = mappedJobs.filter(j => 
          (q ? j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) : true) &&
          (l ? j.location.toLowerCase().includes(l) : true)
        );
      }
      
      setJobs(mappedJobs);
      setFromCache(false);
    } catch (err) {
      console.error('Search failed', err);
      setError('Unable to fetch results. Check your connection.');
      setJobs(prevJobs); // Keep old data to prevent empty jump
    } finally {
      setLoading(false);
    }
  }, [query, location, jobs]);

  // Handle Tab Change
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1); // Reset to first page
    // Soon: re-fetch or filter jobs based on this tab
    // For now, if we want to immediately fetch specific platform jobs, we can pass it to the backend.
  };

  // Sort jobs alphabetically by title
  const sortedJobs = [...jobs].sort((a, b) => a.title.localeCompare(b.title));
  // Optional: Filter by activeTab. Right now backend just returns all crawled jobs tagged with their platforms.
  const filteredJobs = activeTab === 'All' ? sortedJobs : sortedJobs.filter(j => j.platform === activeTab);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const toggleSave = (job) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.some(j => j.id === job.id);
      const updated = isAlreadySaved ? prev.filter(j => j.id !== job.id) : [...prev, job];
      localStorage.setItem('saved_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCompare = (job) => {
    setCompareList(prev => {
      const exists = prev.some(j => j.id === job.id);
      if (exists) return prev.filter(j => j.id !== job.id);
      if (prev.length >= 5) return prev;
      return [...prev, job];
    });
  };

  const handleCompare = async () => {
    if (compareList.length < 2) return;
    setComparing(true);
    setCompareResult(null);
    try {
      const token = localStorage.getItem('accessToken') || '';
      const resp = await fetch(`${API}/api/external/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          jobs: compareList.map(j => ({ url: j.url, title: j.title, company: j.company })),
        }),
      });
      const data = await resp.json();
      setCompareResult(data);
    } catch {
      setCompareResult({ success: false, error: 'Comparison failed.' });
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] dark:bg-[#0d1117] text-[var(--text-main)] dark:text-white pb-10">
      <div className="bg-[var(--bg-card)] dark:bg-[#1a2632] border-b border-[var(--border)] dark:border-slate-700 px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 w-full">
            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Job title, skill (e.g. React Developer)"
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder-slate-400 py-1"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 sm:w-56 w-full">
            <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="City / Remote"
              className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 py-1"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-10 px-6 rounded-lg font-bold text-sm transition-all
                ${loading ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow shadow-blue-600/20'}`}
            >
              {loading ? (
                <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              )}
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 h-10 px-4 rounded-lg text-sm font-bold border transition-colors whitespace-nowrap
                ${compareMode ? 'bg-blue-600 text-white border-blue-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              Compare {compareMode && `(${compareList.length}/5)`}
            </button>
          </div>
        </div>
      </div>

      {/* Compare bar */}
      {compareMode && compareList.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 md:px-10 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Comparing:</span>
            {compareList.map(j => (
              <span key={j.id} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                {j.title} @ {j.company}
                <button onClick={() => toggleCompare(j)} className="ml-1 hover:text-red-500">×</button>
              </span>
            ))}
            <button
              onClick={handleCompare}
              disabled={comparing || compareList.length < 2}
              className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {comparing ? 'Analyzing...' : '🤖 AI Compare'}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6">
        {error && (
          <div className="flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span className="font-bold">{error}</span>
            </div>
            <button 
              onClick={fetchInitialJobs}
              className="mt-2 w-fit px-4 py-1.5 bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300 font-bold text-xs rounded-lg hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* AI Compare result */}
        {compareResult && (
          <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-bold">AI Job Comparison</h3>
              <button onClick={() => setCompareResult(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            {compareResult.success ? (
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {compareResult.comparison_markdown}
              </div>
            ) : (
              <p className="text-sm text-red-600">{compareResult.error}</p>
            )}
          </div>
        )}

        {/* Stats bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-white">{filteredJobs.length}</span> jobs found {activeTab !== 'All' ? `(${activeTab})` : ''}
            {fromCache && <span className="ml-2 text-xs text-blue-500">(cached)</span>}
          </p>
          <div className="relative flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Platform:</span>
            <button
              onClick={() => setPlatformOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer min-w-[120px] justify-between"
            >
              {activeTab}
              <span className="material-symbols-outlined text-sm">{platformOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            {platformOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-y-auto max-h-44 py-1">
                {PLATFORMS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => { handleTabChange(tab); setPlatformOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm font-semibold transition-colors
                      ${activeTab === tab ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : currentJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <span className="material-symbols-outlined text-4xl">work_off</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              We couldn't find any recommendations based on your current profile. Try updating your skills or search query.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentJobs.map(job => {
            const isSaved = savedJobs.some(j => j.id === job.id);
            const inCompare = compareList.some(j => j.id === job.id);
            const pColor = PLATFORM_COLORS[job.platform] || 'bg-slate-100 text-slate-600 border-slate-200';
            return (
                <div
                  key={job.id}
                  className={`flex flex-col h-full bg-[var(--bg-card)] dark:bg-[#1a2632] rounded-2xl border transition-all cursor-pointer
                    ${inCompare ? 'border-blue-400 dark:border-blue-500 shadow-blue-100 dark:shadow-blue-900/20 shadow-md' : 'border-[var(--border)] dark:border-slate-700 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'}`}
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                >
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${pColor}`}>
                          {job.platform}
                        </span>
                        {job.matchScore !== undefined && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-sm flex items-center gap-1
                            ${job.matchScore >= 75 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 
                              job.matchScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800' : 
                              'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'}`}>
                            <span className="material-symbols-outlined text-[12px]">{job.matchScore >= 75 ? 'award_star' : 'analytics'}</span>
                            {job.matchScore}% Match
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base leading-tight line-clamp-2 min-h-[2.5rem]">{job.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{job.company}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); toggleSave(job); }}
                      className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-yellow-500 hover:text-yellow-600' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'}`}
                    >
                      <span className="material-symbols-outlined text-xl">{isSaved ? 'bookmark' : 'bookmark_border'}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3 overflow-hidden whitespace-nowrap">
                    <span className="material-symbols-outlined text-sm shrink-0">location_on</span>
                    <span className="truncate">{job.location}</span>
                    {job.salary && job.salary !== 'Not disclosed' && (
                      <span className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span>·</span>
                        <span className="material-symbols-outlined text-sm">payments</span>
                        <span className="truncate max-w-[120px]">{job.salary}</span>
                      </span>
                    )}
                  </div>
                  {job.tags?.length > 0 ? (
                    <div className="flex gap-1.5 mb-4 overflow-hidden h-6 items-center shrink-0">
                      {job.tags.slice(0, 5).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap">{tag}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4 h-6 shrink-0"></div>
                  )}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={e => { e.stopPropagation(); handleApply(job); }}
                      disabled={job.applied || isApplying[job.id]}
                      className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-bold transition-all
                        ${job.applied ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-600 text-white hover:bg-blue-700'}
                        ${isApplying[job.id] ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {isApplying[job.id] ? (
                        <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-sm">{job.applied ? 'check_circle' : 'open_in_new'}</span>
                      )}
                      {job.applied ? 'Applied' : isApplying[job.id] ? 'Applying...' : 'Apply Now'}
                    </button>
                    {compareMode && (
                      <button
                        onClick={e => { e.stopPropagation(); toggleCompare(job); }}
                        className={`h-9 px-3 rounded-xl text-xs font-bold border transition-colors
                          ${inCompare ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        {inCompare ? '✓ Added' : '+ Compare'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded */}
                {selectedJob?.id === job.id && (
                  <div className="border-t border-slate-100 dark:border-slate-700 px-5 pb-4 pt-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{job.description || 'No description available.'}</p>
                    {job.posted && (
                      <p className="text-xs text-slate-400 mt-2">Posted: {job.posted}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              title="First Page"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-sm">first_page</span>
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              title="Previous Page"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // If we're at the very beginning, show pages 1 to 5
                  if (currentPage <= 3) return page <= 5;
                  // If we're at the very end, show the last 5 pages
                  if (currentPage >= totalPages - 2) return page >= totalPages - 4;
                  // Otherwise, show standard sliding window of 5
                  return page >= currentPage - 2 && page <= currentPage + 2;
                })
                .map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all
                    ${currentPage === page 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              title="Next Page"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title="Last Page"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-sm">last_page</span>
            </button>
          </div>
        )}

        {/* Empty state & Search History */}
        {!loading && jobs.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 gap-8 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md">
              <div className="size-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shadow-inner hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-blue-500">search_insights</span>
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-800 dark:text-white mb-2">Discover Your Next Role</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  "The right job is waiting for you. Use the search bar above to crawl live listings from major platforms and see your AI-powered match score instantly."
                </p>
              </div>
            </div>

            {/* Search History Section */}
            {searchHistory.length > 0 && (
              <div className="w-full max-w-3xl mt-8">
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                  Recent Searches
                </h3>
                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {searchHistory.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <span className="material-symbols-outlined">search</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white capitalize">{item.query}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.location ? `${item.location} • ` : ''}
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setQuery(item.query || '');
                          setLocation(item.location || '');
                          if(item.query) setTimeout(() => handleSearch(), 100);
                        }}
                        className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Run Again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
