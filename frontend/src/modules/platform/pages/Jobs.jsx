import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronDown, CheckCircle2, AlertCircle, Sparkles, LayoutGrid } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { fetchRecommendations, applyForJob } from '../../jobseeker/services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';
import apiClient from '../../../core/api/apiClient';
import appConfig from '../../../core/config/appConfig';

export default function Jobs() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended'); 
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 10;
  const userId = getCurrentUserId();
  const [isApplying, setIsApplying] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    remote: false,
    hybrid: false,
    fullTime: false,
    experience: 'All Experience'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        // Fetch ALL jobs for the "All" tab
        const allRes = await apiClient.get('/jobseeker/jobs');
        const rawJobs = allRes.data?.data?.jobs || allRes.data?.jobs || [];
        
        const transformedAll = rawJobs.map(j => ({
            ...j,
            salary: j.salary || 'Competitive',
            location: j.location || 'Remote',
            type: j.type || 'Full-time',
            postedTime: j.postedTime || 'Just Now'
        }));
        
        // Sort ALL jobs alphabetically by title as requested
        transformedAll.sort((a, b) => {
            const titleA = (a.title || '').toLowerCase();
            const titleB = (b.title || '').toLowerCase();
            return titleA.localeCompare(titleB);
        });
        
        setAllJobs(transformedAll);

        // Fetch AI dynamically scored top 5 recommendations
        if (userId) {
           const recRes = await apiClient.get(`/jobseeker/recommendations/${userId}`);
           const recs = recRes.data?.recommendations || [];
           
           // Sort Recommended jobs alphabetically by title as requested
           recs.sort((a, b) => {
               const titleA = (a.title || '').toLowerCase();
               const titleB = (b.title || '').toLowerCase();
               return titleA.localeCompare(titleB);
           });
           
           setRecommendedJobs(recs);
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) loadJobs();
  }, [userId]);

  const handleApply = async (jobId, companyName) => {
    try {
      setIsApplying(prev => ({ ...prev, [jobId]: true }));
      await applyForJob(userId, jobId);
      showToast(`Application sent to ${companyName} ✅`);
    } catch (err) {
      showToast("Application failed ❌");
    } finally {
      setIsApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // FRONTEND FILTERING
  const sourceJobs = activeTab === 'recommended' ? recommendedJobs : allJobs;
  
  const filteredJobs = sourceJobs.filter(job => {
    // 1. Search Filter
    if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase().trim();
        const searchString = `${job.title} ${job.company} ${(job.tags || []).join(' ')}`.toLowerCase();
        if (!searchString.includes(term)) return false;
    }

    // 2. Work Mode Filters
    const hasModeFilter = activeFilters.remote || activeFilters.hybrid || activeFilters.fullTime;
    if (hasModeFilter) {
      const isRemote = job.location?.toLowerCase().includes('remote');
      const isHybrid = job.location?.toLowerCase().includes('hybrid');
      const isFullTime = job.type?.toLowerCase().includes('full-time');
      
      const remoteMatch = activeFilters.remote && isRemote;
      const hybridMatch = activeFilters.hybrid && isHybrid;
      const fullTimeMatch = activeFilters.fullTime && isFullTime;
      
      if (!remoteMatch && !hybridMatch && !fullTimeMatch) return false;
    }

    // 3. Experience Filter (Simplified)
    if (activeFilters.experience !== 'All Experience') {
      const jobTitle = job.title?.toLowerCase() || '';
      if (activeFilters.experience.includes('Entry') && !jobTitle.includes('junior') && !jobTitle.includes('associate')) return false;
      if (activeFilters.experience.includes('Senior') && !jobTitle.includes('senior') && !jobTitle.includes('lead')) return false;
      if (activeFilters.experience.includes('Lead') && !jobTitle.includes('lead') && !jobTitle.includes('manager')) return false;
    }

    return true;
  });

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const currentJobs = filteredJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters, tabs, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeFilters, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0d1117] transition-colors">
      {/* HEADER SECTION */}
      <div className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-300 dark:border-slate-700 pt-8 pb-6 px-8 sticky top-0 z-30 backdrop-blur-xl bg-opacity-80">
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Job Feed</h1>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Real-time Matching System</p>
            </div>

            <div className="flex-1 max-w-2xl flex gap-3">
              <div className="flex-1 relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles, skills, or companies..." 
                  className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <Button className="h-12 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/10">
                Find Opportunities
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300 dark:border-slate-700 w-full lg:w-fit shrink-0">
              {['recommended', 'all'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                    activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {tab === 'recommended' && <Sparkles size={14} className={activeTab === 'recommended' ? 'animate-pulse' : ''} />}
                  {tab === 'all' && <LayoutGrid size={14} />}
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>

            {/* QUICK FILTERS */}
            <div className="flex items-center gap-2">
              {[
                { id: 'remote', label: 'Remote', icon: MapPin },
                { id: 'hybrid', label: 'Hybrid', icon: Briefcase },
                { id: 'fullTime', label: 'Full-Time', icon: Briefcase }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => toggleFilter(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    activeFilters[f.id]
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                  }`}
                >
                  <f.icon size={13} />
                  {f.label}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-300 dark:border-slate-700 mx-2 hidden sm:block" />

              {/* EXPERIENCE DROPDOWN */}
              <div className="relative">
                <Sparkles size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select 
                  value={activeFilters.experience}
                  onChange={(e) => setActiveFilters(p => ({...p, experience: e.target.value}))}
                  className="pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm min-w-[160px]"
                >
                  <option>All Experience</option>
                  <option>0-1 Years (Entry)</option>
                  <option>2-5 Years (Mid)</option>
                  <option>5-10 Years (Senior)</option>
                  <option>10+ Years (Lead)</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <Button 
                variant="ghost" 
                onClick={() => {
                    setActiveTab('all');
                    setActiveFilters({ remote: false, hybrid: false, fullTime: false, experience: 'All Experience' });
                }}
                className="h-8 px-3 gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-auto hover:text-rose-500 transition-colors"
              >
                <Filter size={12} /> Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* JOB FEED LIST */}
      <div className="px-8 py-8">
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center">
               <div className="animate-spin size-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Synchronizing Match Engine...</p>
            </div>
          ) : currentJobs.length === 0 ? (
            <div className="text-center py-20">
               <AlertCircle size={40} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No matching jobs found with current filters.</p>
               <Button variant="secondary" onClick={() => setActiveTab('all')} className="mt-4 h-8 text-[10px]">View All Jobs</Button>
            </div>
          ) : (
            <>
              {currentJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
                >
                  {/* 1. Primary Info */}
                  <div className="flex items-start gap-6 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {activeTab === 'recommended' && (
                          <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-widest">TOP MATCH</span>
                        )}
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">POSTED {job.postedTime}</span>
                      </div>
                      <Link to={`/platform/jobseeker/jobs/${job.id}`} className="no-underline">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                          {job.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{job.company}</span>
                         <span className="text-slate-300 dark:text-slate-800">•</span>
                         <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                           <MapPin size={13} /> {job.location}
                         </span>
                         <span className="text-slate-300 dark:text-slate-800">•</span>
                         <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">{job.salary}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. AI Intelligence Stats (ONLY IN RECOMMENDED) */}
                  {activeTab === 'recommended' && (
                    <div className="flex flex-wrap items-center gap-8 lg:px-12 lg:border-x border-slate-200 dark:border-slate-700">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black text-blue-600 tracking-tighter">{job.matchScore}%</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">MATCH SCORE</span>
                      </div>
                      
                      <div className="space-y-3 min-w-[200px]">
                        <div className="flex flex-col gap-1.5">
                           <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">MATCHED ASSETS</p>
                           <div className="flex flex-wrap gap-1">
                              {(job.matched || []).slice(0, 3).map(s => <span key={s} className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/30">{s}</span>)}
                           </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <p className="text-[8px] font-black text-rose-500 uppercase tracking-[0.2em]">MISSING CRITICALS</p>
                           <div className="flex flex-wrap gap-1">
                              {(job.missing || []).slice(0, 3).map(s => <span key={s} className="text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-800/30">{s}</span>)}
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-2.5 min-w-[160px]">
                    <Button 
                      onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                      variant="secondary" 
                      className="h-11 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-300 dark:border-slate-700"
                    >
                      Analyze Details
                    </Button>
                    <Button 
                      onClick={() => handleApply(job.id, job.company)}
                      disabled={isApplying[job.id]}
                      className="h-11 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10"
                    >
                      {isApplying[job.id] ? 'Syncing...' : 'Quick Apply'}
                    </Button>
                  </div>
                </div>
              ))}

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 py-4 border-t border-slate-300 dark:border-slate-800">
                  <Button 
                    variant="ghost" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="h-10 px-4 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                  >
                    Prev
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      // Show pages around current page
                      let pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                      if (pageNum < 1) pageNum = i + 1;
                      
                      if (pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`size-10 rounded-xl text-[10px] font-black transition-all ${
                            currentPage === pageNum 
                            ? 'bg-slate-900 text-white shadow-lg' 
                            : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && <span className="text-slate-400 px-2">...</span>}
                  </div>

                  <Button 
                    variant="ghost" 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="h-10 px-4 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
