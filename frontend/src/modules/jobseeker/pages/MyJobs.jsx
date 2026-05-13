import React, { useState, useEffect } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

const BookmarkService = (() => {
  const KEY_PREFIX = "ca_bookmarks_";
  const GUEST_KEY = "ca_bookmarks_guest";

  function _storageKey() {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (user && user.email) return KEY_PREFIX + user.email;
    } catch { }
    return GUEST_KEY;
  }
  function getAll() {
    try { return JSON.parse(localStorage.getItem(_storageKey()) || "[]"); } catch { return []; }
  }
  function _setAll(jobs) { localStorage.setItem(_storageKey(), JSON.stringify(jobs)); }
  function remove(id) {
    _setAll(getAll().filter((j) => j.id !== id));
  }
  function clear() { localStorage.removeItem(_storageKey()); }
  return { getAll, remove, clear };
})();

const ExtBookmarkService = (() => {
  const KEY_PREFIX = "ca_ext_bookmarks_";
  const GUEST_KEY = "ca_ext_bookmarks_guest";

  function _storageKey() {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (user && user.email) return KEY_PREFIX + user.email;
    } catch { }
    return GUEST_KEY;
  }
  function getAll() {
    try { return JSON.parse(localStorage.getItem(_storageKey()) || "[]"); } catch { return []; }
  }
  function _setAll(jobs) { localStorage.setItem(_storageKey(), JSON.stringify(jobs)); }
  function remove(id) {
    _setAll(getAll().filter((j) => j.id !== id));
  }
  function clear() { localStorage.removeItem(_storageKey()); }
  return { getAll, remove, clear };
})();

export default function MyJobs() {
  const [activePage, setActivePage] = useState('bookmarks'); // bookmarks, applied, external
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [extJobs, setExtJobs] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Syncing...');

  const loadData = async () => {
    // Purge expired local before loading
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const locals = BookmarkService.getAll();
    let hasRemovals = false;
    locals.forEach(j => {
      if (j.deadline) {
        const d = new Date(j.deadline);
        d.setHours(0, 0, 0, 0);
        if (d < now) { BookmarkService.remove(j.id); hasRemovals = true; }
      }
    });

    setSavedJobs(BookmarkService.getAll());
    setExtJobs(ExtBookmarkService.getAll());
    
    // Sync from Backend
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) { setSyncStatus('Not logged in'); return; }
      const user = JSON.parse(raw);
      if (!user?.email) { setSyncStatus('Not logged in'); return; }

      const resp = await fetch(`http://127.0.0.1:8000/api/user/activity?email=${encodeURIComponent(user.email)}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          setAppliedJobs(data.appliedJobs || []);
          setSyncStatus(`Synced ${new Date().toLocaleTimeString()}`);
        }
      } else {
        setSyncStatus('Offline — local data only');
      }
    } catch (e) {
      setSyncStatus('Offline — local data only');
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const handleRemoveBookmark = (id) => { BookmarkService.remove(id); setSavedJobs(BookmarkService.getAll()); };
  const handleRemoveExtBookmark = (id) => { ExtBookmarkService.remove(id); setExtJobs(ExtBookmarkService.getAll()); };
  
  const handleClearAll = () => {
    if (activePage === 'external') {
      if (window.confirm("Remove all saved external jobs?")) { ExtBookmarkService.clear(); setExtJobs([]); }
    } else {
      if (window.confirm("Remove all saved jobs?")) { BookmarkService.clear(); setSavedJobs([]); }
    }
  };

  const filteredJobs = activeFilter === 'all' ? savedJobs : savedJobs.filter(j => 
    (j.type && j.type.toLowerCase().includes(activeFilter.toLowerCase())) ||
    (j.location && j.location.toLowerCase().includes(activeFilter.toLowerCase()))
  );

  const timeAgo = (ts) => {
    if (!ts) return "";
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    return Math.floor(hrs / 24) + "d ago";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JobSeekerShell active="my-jobs" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-4 overflow-y-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight mb-0.5">My Jobs</h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-sm text-blue-500">bookmark</span>
              Jobs you've bookmarked — saved from any page
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-full">
              {activePage === 'external' ? extJobs.length : activePage === 'applied' ? appliedJobs.length : savedJobs.length} {activePage === 'applied' ? 'applied' : 'saved'}
            </span>
            {(activePage !== 'applied' && (activePage === 'bookmarks' ? savedJobs.length > 0 : extJobs.length > 0)) && (
              <button 
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Sub-page Tabs */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button 
            onClick={() => setActivePage('bookmarks')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activePage === 'bookmarks' ? 'bg-blue-600 text-white shadow' : 'bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'}`}>
            <span className="material-symbols-outlined text-base">bookmark</span>
            Saved Jobs
          </button>
          <button 
            onClick={() => setActivePage('applied')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activePage === 'applied' ? 'bg-green-600 text-white shadow' : 'bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}>
            <span className="material-symbols-outlined text-base">send</span>
            Applied Jobs
            {appliedJobs.length > 0 && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full">{appliedJobs.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActivePage('external')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activePage === 'external' ? 'bg-purple-600 text-white shadow' : 'bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200'}`}>
            <span className="material-symbols-outlined text-base">open_in_new</span>
            External Jobs
          </button>
          
          <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-400 self-center">
            <span className="material-symbols-outlined text-[14px]">cloud_sync</span>
            <span>{syncStatus}</span>
          </span>
        </div>

        {/* ===== SAVED JOBS PANEL ===== */}
        {activePage === 'bookmarks' && (
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-slate-50 dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-300 dark:border-slate-700 shadow-sm mb-2 overflow-x-auto">
              {['all', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid', 'Internship', 'Freelance'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  {filter === 'all' && <span className="material-symbols-outlined text-sm">bookmark</span>}
                  {filter === 'all' ? 'All Saved' : filter}
                </button>
              ))}
            </div>

            {/* Job List */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-slate-400">bookmark_border</span>
                  </div>
                  <h2 className="text-lg font-bold mb-1">No saved jobs yet</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mb-4">
                    Bookmark any job from the Browse Jobs page and it will appear here.
                  </p>
                  <a href="/jobseeker/jobs" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <span className="material-symbols-outlined text-base">search</span>
                    Browse Jobs
                  </a>
                </div>
              ) : (
                filteredJobs.map((job, idx) => (
                  <article key={job.id || idx} className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-blue-500">work</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                              {job.company}{job.location ? ` · ${job.location}` : ""}
                            </p>
                          </div>
                          <button onClick={() => handleRemoveBookmark(job.id)} className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors" title="Remove bookmark">
                            <span className="material-symbols-outlined text-[20px] text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(job.tags || []).map(t => <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">{t}</span>)}
                          {job.type && <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold">{job.type}</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                          {job.salary && <span className="flex items-center gap-1 text-sm text-slate-500"><span className="material-symbols-outlined text-base">payments</span>{job.salary}</span>}
                          {job.savedAt && <span className="flex items-center gap-1 text-xs text-slate-400"><span className="material-symbols-outlined text-sm">schedule</span>Saved {timeAgo(job.savedAt)}</span>}
                          <div className="ml-auto flex gap-2">
                            {job.url && <a href={job.url} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">View Job</a>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===== APPLIED JOBS PANEL ===== */}
        {activePage === 'applied' && (
          <div>
            <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
              <span className="material-symbols-outlined text-green-600 text-xl">send</span>
              <div>
                <p className="font-bold text-green-800 dark:text-green-200 text-xs">Applied Jobs</p>
                <p className="text-green-600 dark:text-green-300 text-[10px]">Jobs you've applied for — synced from your account.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {appliedJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-green-400">send</span>
                  </div>
                  <h2 className="text-lg font-bold mb-1">No applications yet</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mb-4">When you click Apply Now on any job, it will appear here.</p>
                  <a href="/jobseeker/jobs" className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20">
                    <span className="material-symbols-outlined text-base">search</span>
                    Browse Jobs
                  </a>
                </div>
              ) : (
                appliedJobs.map((job, idx) => {
                  const appliedDate = job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : '';
                  const status = job.status || "applied";
                  const statusColor = status === "applied" ? "green" : status === "shortlisted" ? "blue" : status === "rejected" ? "red" : "slate";
                  
                  return (
                    <article key={idx} className={`bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 p-5 shadow-sm border-l-4 border-l-${statusColor}-400`}>
                      <div className="flex gap-4 items-start">
                        <div className={`w-12 h-12 rounded-xl bg-${statusColor}-50 dark:bg-${statusColor}-900/20 flex items-center justify-center shrink-0`}>
                          <span className={`material-symbols-outlined text-${statusColor}-500`}>send</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <h3 className="font-bold text-lg leading-tight">{job.jobTitle}</h3>
                              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                                {job.company}{job.location ? ` · ${job.location}` : ""}
                              </p>
                            </div>
                            <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-${statusColor}-100 text-${statusColor}-700 capitalize`}>{status}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {(job.tags || []).map(t => <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">{t}</span>)}
                            {job.type && <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">{job.type}</span>}
                          </div>
                          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                            {job.salary && <span className="flex items-center gap-1 text-sm text-slate-500"><span className="material-symbols-outlined text-base">payments</span>{job.salary}</span>}
                            {appliedDate && <span className="flex items-center gap-1 text-xs text-slate-400"><span className="material-symbols-outlined text-sm">schedule</span>Applied on {appliedDate}</span>}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ===== EXTERNAL JOBS PANEL ===== */}
        {activePage === 'external' && (
          <div>
            <div className="flex items-center gap-3 mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
              <span className="material-symbols-outlined text-purple-600 text-2xl">open_in_new</span>
              <div>
                <p className="font-bold text-purple-800 dark:text-purple-200 text-sm">External Job Bookmarks</p>
                <p className="text-purple-600 dark:text-purple-300 text-xs">Jobs from LinkedIn, Indeed, and other platforms you've saved. Clicking "View Job" opens the external site.</p>
              </div>
            </div>

            <div className="space-y-4">
              {extJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-4xl text-purple-400">open_in_new</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">No external jobs saved</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">Save external jobs from LinkedIn, Indeed, or other platforms using the bookmark icon on job listings.</p>
                  <a href="/jobseeker/jobs" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20">
                    <span className="material-symbols-outlined text-base">search</span>
                    Find External Jobs
                  </a>
                </div>
              ) : (
                extJobs.map((job, idx) => (
                  <article key={job.id || idx} className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 p-5 shadow-sm border-l-4 border-l-purple-400">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-purple-500">open_in_new</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                              {job.company}{job.location ? ` · ${job.location}` : ""}
                              {job.source && <span className="ml-2 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full">{job.source}</span>}
                            </p>
                          </div>
                          <button onClick={() => handleRemoveExtBookmark(job.id)} className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors" title="Remove bookmark">
                            <span className="material-symbols-outlined text-[20px] text-purple-600" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(job.tags || []).map(t => <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">{t}</span>)}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                          {job.salary && <span className="flex items-center gap-1 text-sm text-slate-500"><span className="material-symbols-outlined text-base">payments</span>{job.salary}</span>}
                          {job.savedAt && <span className="flex items-center gap-1 text-xs text-slate-400"><span className="material-symbols-outlined text-sm">schedule</span>Saved {timeAgo(job.savedAt)}</span>}
                          <div className="ml-auto flex gap-2">
                            {job.url && <a href={job.url} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-xs">open_in_new</span> View Job</a>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}



