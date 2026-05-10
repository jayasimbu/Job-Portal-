import React, { useState, useEffect } from 'react';
import EmptyState from '../../../core/components/EmptyState';
import { useToast } from '../../../core/context/ToastContext';
import { fetchRecommendations, applyForJob } from '../../jobseeker/services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';

const PLATFORM_COLORS = {
  'Internal': 'bg-blue-50 text-blue-600 border-blue-100',
  'LinkedIn': 'bg-sky-50 text-sky-600 border-sky-100',
  'Naukri': 'bg-orange-50 text-orange-600 border-orange-100',
  'Indeed': 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

const Jobs = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isApplying, setIsApplying] = useState({});
  const userId = getCurrentUserId();

  useEffect(() => {
    const loadJobs = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchRecommendations(userId);
        const jobs = (data.recommendations || []).map(j => ({
            ...j,
            platform: j.platform || (j.id > 100 ? 'LinkedIn' : 'Internal') // Mock logic for variety
        }));
        setAllJobs(jobs);
        setFilteredJobs(jobs);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [userId]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = search.toLowerCase().trim();
    if (!query) {
      setFilteredJobs(allJobs);
    } else {
      const filtered = allJobs.filter(j => 
        j.title.toLowerCase().includes(query) || 
        (j.company || '').toLowerCase().includes(query) ||
        (j.description || '').toLowerCase().includes(query)
      );
      setFilteredJobs(filtered);
    }
  };

  const handleApply = async (jobId, companyName) => {
    try {
      setIsApplying(prev => ({ ...prev, [jobId]: true }));
      await applyForJob(userId, jobId);
      showToast(`Application sent to ${companyName} ✅`);
      setAllJobs(prev => prev.map(j => j.id === jobId ? { ...j, hasApplied: true } : j));
      setFilteredJobs(prev => prev.map(j => j.id === jobId ? { ...j, hasApplied: true } : j));
    } catch (err) {
      showToast(err.response?.data?.detail || "Application failed ❌");
    } finally {
      setIsApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const SkeletonCard = () => (
    <div className="p-8 bg-white border border-slate-100 rounded-[32px] animate-pulse shadow-sm h-48" />
  );

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 space-y-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-blue-600 text-sm">explore</span>
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Opportunity Discovery</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Job Marketplace</h1>
            <p className="text-sm text-slate-500">AI-powered engine discovering roles that match your verified potential.</p>
          </div>
          <div className="text-right hidden sm:block">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Market Pulse</span>
             <span className="text-sm font-bold text-blue-600 uppercase">{filteredJobs.length} matches found</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm">
           <div className="flex-1 flex items-center gap-4 px-6 h-14 bg-slate-50 rounded-2xl transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
              <span className="material-symbols-outlined text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search roles, companies, or keywords..." 
                className="w-full bg-transparent text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
           </div>
           <button className="h-14 px-10 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10">
              Search Jobs
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
            {filteredJobs.map(job => (
              <div key={job.id} className="group p-8 bg-white border border-slate-200 rounded-[40px] hover:border-blue-500 transition-all shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 flex flex-col h-full relative overflow-hidden">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="size-16 bg-slate-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-300 group-hover:text-blue-600 transition-colors uppercase">
                    {(job.company || 'C')[0]}
                  </div>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${PLATFORM_COLORS[job.platform] || PLATFORM_COLORS['Internal']}`}>
                    {job.platform || 'Internal'}
                  </div>
                </div>

                <div className="flex-1 relative z-10">
                  <h4 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-2">{job.title}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{job.company || 'Confidential'}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                     <div className="px-3 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">location_on</span> {job.location || 'Remote'}
                     </div>
                     <div className="px-3 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">payments</span> {job.salary || 'Competitive'}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</span>
                        <span className="text-xl font-black text-blue-600">{Math.round(job.match_score || 75)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${job.match_score || 75}%` }} />
                     </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex gap-4 relative z-10">
                   <button 
                     disabled={job.hasApplied || isApplying[job.id]}
                     onClick={() => handleApply(job.id, job.company)}
                     className={`flex-1 h-12 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-sm active:scale-95 ${
                        job.hasApplied 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                     }`}
                   >
                     {isApplying[job.id] ? 'Processing...' : job.hasApplied ? 'Applied' : 'Quick Apply'}
                   </button>
                   <button className="size-12 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <span className="material-symbols-outlined">bookmark</span>
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon="search_off"
            title="No matches found"
            description="We couldn't find any roles matching your search. Try broadening your keywords."
            actionText="Reset Search"
            onAction={() => { setSearch(''); setFilteredJobs(allJobs); }}
          />
        )}
      </div>
    </div>
  );
};

export default Jobs;
