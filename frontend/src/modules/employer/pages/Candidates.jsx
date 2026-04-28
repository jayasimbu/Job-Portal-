import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployerJobs, fetchRankedCandidates, updateApplicationStatus, scheduleInterview, fetchRecruiterNotes, addRecruiterNote, getResumeFileUrl, checkResumeExists } from '../services/employerService';
import { mapCandidate } from '../../../core/api/adapters';
import CandidateDetailSlideOut from '../components/CandidateDetailSlideOut';

const STATUS_COLORS = {
  shortlisted: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800',
  interviewing: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  reviewing: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
  applied: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  default: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

export default function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [statusTab, setStatusTab] = useState('all');
  const [certFilter, setCertFilter] = useState('all');
  const [processingIds, setProcessingIds] = useState(new Set());

  // Advanced Filters
  const [scoreMin, setScoreMin] = useState(0);
  const [skillFilter, setSkillFilter] = useState('');

  // Notes Modal
  const [notesModal, setNotesModal] = useState(null); // { appId, name }
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const openNotes = async (appId, name) => {
    setNotesModal({ appId, name });
    setNotesLoading(true);
    try {
      const data = await fetchRecruiterNotes(appId);
      setNotes(data.notes || []);
    } catch { setNotes([]); }
    finally { setNotesLoading(false); }
  };

  const submitNote = async () => {
    if (!noteText.trim() || !notesModal) return;
    try {
      await addRecruiterNote(notesModal.appId, noteText.trim());
      setNoteText('');
      const data = await fetchRecruiterNotes(notesModal.appId);
      setNotes(data.notes || []);
    } catch (e) { console.error('Failed to add note', e); }
  };

  // 1. Fetch Employer Jobs
  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!user.id) return navigate('/auth/login');
        
        const myJobs = await fetchEmployerJobs(user.id);
        const activeJobs = myJobs.filter(j => j.active);
        setJobs(activeJobs);
        if (activeJobs.length > 0) {
          setJobId(activeJobs[0].id);
        } else {
          setLoading(false); // No jobs available
        }
      } catch (e) {
        console.error("Failed to fetch jobs", e);
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  // 2. Fetch Candidates with Safe Polling
  useEffect(() => {
    if (!jobId) return;
    
    let interval;
    const fetchCandidatesData = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        setError('');
        const data = await fetchRankedCandidates(jobId);
        const mappedData = data.map(c => ({ ...c, ...mapCandidate(c) }));
        // Prevent flicker by diffing JSON
        setCandidates(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(mappedData)) return mappedData;
          return prev;
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch candidates", err);
        setError('Failed to fetch candidates.');
        setLoading(false);
      }
    };

    fetchCandidatesData();
    interval = setInterval(fetchCandidatesData, 10000); // Polling slower to be safe

    return () => clearInterval(interval);
  }, [jobId]);

  const handleUpdateStatus = async (appId, status, extraData = null) => {
    if (processingIds.has(appId)) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(appId));
      
      // If it's an interview, we also call the schedule API
      if (status === 'interviewing' && extraData) {
        await scheduleInterview({
          application_id: appId,
          date: extraData.date,
          time: extraData.time,
          location: extraData.location
        });
      }

      await updateApplicationStatus(appId, status);
      
      // Optimistic UI update
      setCandidates(prev => prev.map(c => c.id === appId ? { ...c, status } : c));
    } catch (e) {
      console.error("Failed to update status", e);
      throw e;
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
    }
  };

  const currentCandidates = [...candidates]
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => statusTab === 'all' || (c.status || 'applied') === statusTab)
    .filter(c => {
       if (certFilter === 'verified') return c.certificates?.some(cert => cert.status === 'verified');
       if (certFilter === 'high') return c.certificates?.some(cert => cert.confidence_score >= 80);
       return true;
    })
    .filter(c => !search || 
      (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (c.role || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter(c => (c.score || 0) >= scoreMin)
    .filter(c => !skillFilter || (c.skills || []).some(s => s.toLowerCase().includes(skillFilter.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
      if (sortBy === 'project') return (b.project_score || 0) - (a.project_score || 0);
      return 0;
    });

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex-shrink-0 flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            AI-Powered Candidate Ranking
            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center gap-1.5 shadow-sm shadow-green-500/20">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{candidates.length} candidates · Ranked by AI + ATS Score</p>
        </div>
        
        {jobs.length > 0 && (
          <select 
            value={jobId || ''} 
            onChange={e => setJobId(Number(e.target.value))}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none hover:border-purple-300 transition-colors"
          >
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-4">
        
        {/* Candidate View Header Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 pb-px flex-1 overflow-x-auto scrollbar-hide">
              {['all', 'applied', 'shortlisted', 'interviewing', 'rejected'].map(tab => {
                const count = tab === 'all' ? candidates.length : candidates.filter(c => c.status === tab).length;
                if (count === 0 && tab !== 'all') return null; // Only show populated tabs dynamically
                return (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`py-2 px-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${filter === tab ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                  >
                    <span className="capitalize">{tab === 'all' ? 'All Candidates' : tab}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${filter === tab ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="flex gap-2 shrink-0">
                <button onClick={() => setCertFilter('all')} className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-colors ${certFilter === 'all' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 block'}`}>Candidates</button>
                <button onClick={() => setCertFilter('verified')} className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-colors ${certFilter === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}><span className="material-symbols-outlined text-[14px]">workspace_premium</span> Verified Certs</button>
                <button onClick={() => setCertFilter('high')} className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-colors ${certFilter === 'high' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}><span className="material-symbols-outlined text-[14px]">psychology</span> High AI Score</button>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 shrink-0">
              <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="bg-transparent text-sm focus:outline-none placeholder-slate-400 w-32 md:w-48" />
            </div>
          </div>

          {/* Advanced Filters Row */}
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400 text-lg">tune</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Min Score:</label>
              <input type="range" min="0" max="100" value={scoreMin} onChange={e => setScoreMin(Number(e.target.value))}
                className="w-24 h-1.5 accent-blue-600 cursor-pointer" />
              <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md min-w-[36px] text-center">{scoreMin}%</span>
            </div>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Skill:</label>
              <input type="text" value={skillFilter} onChange={e => setSkillFilter(e.target.value)}
                placeholder="e.g. React, Python"
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 w-32" />
            </div>
            {(scoreMin > 0 || skillFilter) && (
              <button onClick={() => { setScoreMin(0); setSkillFilter(''); }} className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">close</span> Clear
              </button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span className="font-bold">{error}</span>
            </div>
            <button 
              onClick={() => setJobId(jobId)} // trigger re-fetch effect
              className="mt-2 w-fit px-4 py-1.5 bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300 font-bold text-xs rounded-lg hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-4 w-16">Rank</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-4">Candidate</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-4 w-40">ATS Match</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-4">Skills & Profile</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-4 min-w-[120px]">Status</th>
                <th className="px-5 py-4 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50 dark:border-slate-800/50">
                     <td className="px-5 py-6"><div className="size-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div></td>
                     <td className="px-5 py-6"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div><div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                     <td className="px-5 py-6"><div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div></td>
                     <td className="px-5 py-6"><div className="flex gap-2"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div></div></td>
                     <td className="px-5 py-6"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div></td>
                     <td className="px-5 py-6"></td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-50 dark:bg-amber-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center max-w-sm mx-auto hover:-translate-y-2 transition-transform duration-500">
                      <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 drop-shadow-xl">
                        <rect x="20" y="20" width="120" height="80" rx="12" fill="#FEF3C7" className="dark:fill-amber-900/40" />
                        <path d="M40 40H120M40 60H100M40 80H80" stroke="#F59E0B" className="dark:stroke-amber-600" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="120" cy="80" r="24" fill="#F59E0B" className="drop-shadow-lg" />
                        <path d="M112 80L118 86L128 74" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-2">No Active Jobs</h3>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6">Create a job posting to start receiving candidates and building your talent pipeline.</p>
                      <button 
                        onClick={() => navigate('/platform/employer/post-job')}
                        className="px-8 py-3.5 bg-amber-500 text-white font-black rounded-2xl shadow-lg shadow-amber-500/30 hover:bg-amber-600 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 text-sm uppercase tracking-wider flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Post a Job
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center max-w-sm mx-auto hover:-translate-y-2 transition-transform duration-500">
                      <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 drop-shadow-xl">
                        <circle cx="50" cy="60" r="30" fill="#E2E8F0" className="dark:fill-slate-800" />
                        <circle cx="110" cy="60" r="30" fill="#CBD5E1" className="dark:fill-slate-700" />
                        <circle cx="80" cy="50" r="36" fill="#3B82F6" className="drop-shadow-lg" />
                        <circle cx="80" cy="40" r="12" fill="white" />
                        <path d="M60 70C60 60 100 60 100 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight mb-2">No Applicants Yet</h3>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6">The best talent is out there. Share your job post on social media or professional networks to attract top candidates.</p>
                      <button 
                        onClick={() => { setFilter('all'); setStatusTab('all'); setSearch(''); setCertFilter('all'); }}
                        className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 text-sm uppercase tracking-wider flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        Refresh Pipeline
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentCandidates.map((c, i) => (
                <tr key={c.id} onClick={() => setSelectedCandidate(c)} className={`border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all ${filter === 'all' && i === 0 ? 'bg-amber-50/40 dark:bg-amber-900/10 relative group/row' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                       <span className={`inline-flex items-center justify-center size-8 rounded-full text-xs font-black
                        ${filter === 'all' && i === 0 ? 'bg-amber-100 text-amber-700 ring-4 ring-amber-50 dark:ring-amber-900/20 scale-110' : 
                          filter === 'all' && i === 1 ? 'bg-slate-100 text-slate-700 ring-2 ring-slate-200' : 
                          filter === 'all' && i === 2 ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-200' : 'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                        #{c.original_rank || (filter === 'all' ? i + 1 : '-')}
                      </span>
                      {filter === 'all' && i === 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-r-full shadow-[0_0_12px_rgba(251,191,36,0.5)]"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-bold text-[15px]">{c.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{c.role} · {c.location || 'Remote'}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">work_history</span>{c.experience || 'Entry-level'}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg" style={{ color: c.score >= 80 ? '#16a34a' : c.score >= 60 ? '#ca8a04' : '#dc2626' }}>{Math.round(c.score)}</span>
                        <div className="h-2 w-full max-w-[80px] bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">
                          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${c.score}%`, backgroundColor: c.score >= 80 ? '#22c55e' : c.score >= 60 ? '#eab308' : '#ef4444' }} />
                        </div>
                      </div>
                      {c.missing_keywords && c.missing_keywords.length > 0 && (
                        <p className="text-[10px] text-slate-400 max-w-[120px] truncate" title={c.missing_keywords.join(', ')}>Missing: {c.missing_keywords.join(', ')}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 w-40">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {(c.skills || []).slice(0, 3).map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-800/50">{s}</span>
                        ))}
                        {c.skills && c.skills.length > 3 && <span className="text-[10px] text-slate-400 font-bold">+{c.skills.length - 3}</span>}
                      </div>
                      
                      {c.certificates && c.certificates.length > 0 && (
                         <div className="mt-1 flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800 pt-2">
                           {c.certificates.map((cert, k) => (
                             <div key={k} onClick={(e) => { e.stopPropagation(); setSelectedCert(cert); }} className={`flex flex-col text-[10px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 -mx-1 rounded-md transition-colors ${cert.confidence_score < 50 ? 'border-2 border-red-400 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                               <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 truncate" title={cert.name}>
                                  {cert.status === 'verified' && <span className="material-symbols-outlined text-[12px] text-green-600">workspace_premium</span>}
                                  {cert.status === 'ai_reviewed' && <span className="material-symbols-outlined text-[12px] text-blue-600">psychology</span>}
                                  <span className="truncate">{cert.name}</span>
                               </div>
                               <span className="text-slate-400 pl-4 truncate">{cert.issuer} ({cert.status === 'verified' ? 'Verified' : 'AI Match'})</span>
                               {cert.confidence_score < 50 && <span className="text-red-500 pl-4 font-bold mt-0.5">🚨 Low Confidence</span>}
                             </div>
                           ))}
                         </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 w-max text-[11px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${STATUS_COLORS[c.status] || STATUS_COLORS.applied}`}>
                      {c.status === 'shortlisted' && <span className="material-symbols-outlined text-[13px] font-black">check</span>}
                      {c.status === 'rejected' && <span className="material-symbols-outlined text-[13px] font-black">close</span>}
                      {c.status === 'interviewing' && <span className="material-symbols-outlined text-[13px] font-black">record_voice_over</span>}
                      {c.status || 'applied'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 justify-end">
                      {/* View Resume with Safety Check */}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const exists = await checkResumeExists(c.user_id);
                          if (exists) {
                            window.open(getResumeFileUrl(c.user_id), '_blank');
                          } else {
                            alert("Candidate has not uploaded a valid resume file or it's currently being processed.");
                          }
                        }}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all shadow-sm"
                        title="View Resume"
                      >
                        <span className="material-symbols-outlined text-[18px]">description</span>
                      </button>
                      {/* Notes */}
                      <button
                        onClick={(e) => { e.stopPropagation(); openNotes(c.id, c.name); }}
                        className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
                        title="Recruiter Notes"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      </button>

                      {/* Status Actions */}
                      {(c.status === 'applied' || !c.status) && (
                        <>
                          <button 
                            disabled={processingIds.has(c.id)}
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'shortlisted'); }} 
                            className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Shortlist"
                          >
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                          </button>
                          <button 
                            disabled={processingIds.has(c.id)}
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'rejected'); }} 
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Reject"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </>
                      )}

                      {c.status === 'shortlisted' && (
                        <>
                          <button 
                            disabled={processingIds.has(c.id)}
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'interviewing'); }} 
                            className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all flex items-center gap-1.5 shadow-sm font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-[16px]">record_voice_over</span> Interview
                          </button>
                          <button 
                            disabled={processingIds.has(c.id)}
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'rejected'); }} 
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Reject"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </>
                      )}

                      {c.status === 'interviewing' && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'shortlisted'); }} className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-all shadow-sm" title="Revert to Shortlist">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'rejected'); }} className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all shadow-sm" title="Reject">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </>
                      )}

                      {c.status === 'rejected' && (
                        <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'applied'); }} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-sm font-bold text-xs">
                          <span className="material-symbols-outlined text-[16px]">refresh</span> Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentCandidates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a2632] border-t border-slate-100 dark:border-slate-800 rounded-b-2xl">
               <div className="size-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                  <span className="material-symbols-outlined text-4xl">person_search</span>
               </div>
               <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">No data yet 🚀</h3>
               <p className="text-slate-500 font-bold text-sm max-w-sm text-center px-4">
                 Start by posting a job or reviewing your active listings to see ranked candidates here.
               </p>
               <button 
                 onClick={() => navigate('/platform/employer/post-job')}
                 className="mt-6 px-6 py-2.5 bg-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-all active:scale-95 flex items-center gap-2"
               >
                 <span className="material-symbols-outlined text-[18px]">add</span> Post A New Job
               </button>
            </div>
          )}
        </div>
      </div>
      {/* Detail Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedCert(null)}>
          <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 scale-in-center" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-[#0d141b]">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{selectedCert.name}</h2>
                      <p className="text-slate-500 font-bold">{selectedCert.issuer}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedCert(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><span className="material-symbols-outlined">close</span></button>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <h3 className="text-[11px] tracking-widest uppercase font-black text-slate-400 mb-3 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">psychology</span> AI Extraction Match
                   </h3>
                   <div className="bg-slate-50 dark:bg-[#131d26] rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                      <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Confidence Score</p>
                         <p className="text-4xl font-black flex items-center gap-2" style={{ color: selectedCert.confidence_score >= 80 ? '#16a34a' : selectedCert.confidence_score >= 50 ? '#ca8a04' : '#dc2626' }}>
                           {selectedCert.confidence_score}%
                           {selectedCert.status === 'verified' && <span className="text-xs uppercase bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold ml-auto translate-y-[-4px]">Verified</span>}
                         </p>
                      </div>
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                         <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">AI Match Status</p>
                         <p className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            {selectedCert.confidence_level === 'High' || selectedCert.confidence_level === 'Highly Reliable' ? '🟢' : selectedCert.confidence_level === 'Medium' ? '🟡' : '🔴'} {selectedCert.confidence_level}
                         </p>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col">
                   <h3 className="text-[11px] tracking-widest uppercase font-black text-slate-400 mb-3 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">description</span> Original Document
                   </h3>
                   <a href={selectedCert.file_url} target="_blank" rel="noreferrer" className="flex-1 flex flex-col items-center justify-center min-h-[140px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-[#131d26] transition-colors text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer group bg-white dark:bg-[#1a2632]">
                      <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform mb-2">open_in_new</span>
                      <p className="font-bold text-sm">View Full Certificate</p>
                      <p className="text-[10px] text-slate-400 font-medium">Opens in new tab</p>
                   </a>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Recruiter Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => { setNotesModal(null); setNotes([]); setNoteText(''); }}>
          <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#0d141b]">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">edit_note</span>
                </div>
                <div>
                  <h2 className="font-black text-base">Recruiter Notes</h2>
                  <p className="text-[10px] text-slate-400 font-bold">{notesModal.name} · App #{notesModal.appId}</p>
                </div>
              </div>
              <button onClick={() => { setNotesModal(null); setNotes([]); setNoteText(''); }} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 max-h-64 overflow-y-auto flex flex-col gap-3">
              {notesLoading ? (
                <div className="flex justify-center py-8"><div className="size-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
              ) : notes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6 italic">No notes yet. Add your first observation below.</p>
              ) : notes.map((n) => (
                <div key={n.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-700 dark:text-slate-200">{n.text}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1.5">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitNote()}
                placeholder='e.g. "Strong in React, needs SQL practice"'
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={submitNote} className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Slide-Out */}
      <CandidateDetailSlideOut
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onAction={(id, status) => handleUpdateStatus(id, status)}
        processingIds={processingIds}
      />
    </div>
  );
}
