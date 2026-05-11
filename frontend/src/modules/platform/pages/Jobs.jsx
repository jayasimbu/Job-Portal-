import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../core/components/EmptyState';
import { useToast } from '../../../core/context/ToastContext';
import { fetchRecommendations, applyForJob } from '../../jobseeker/services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';

// Import Design System
import { JobCard, FilterDropdown, SectionHeader } from '../../jobseeker/components/DesignSystem';

const Jobs = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isApplying, setIsApplying] = useState({});
  const userId = getCurrentUserId();

  // Filters State
  const [filters, setFilters] = useState({
    location: 'Any Location',
    workMode: 'Any Mode',
    jobType: 'Any Type',
    experience: 'Any Experience'
  });

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
            platform: j.platform || (j.id > 100 ? 'LinkedIn' : 'Internal')
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
    let filtered = allJobs;

    if (query) {
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(query) || 
        (j.company || '').toLowerCase().includes(query) ||
        (j.description || '').toLowerCase().includes(query)
      );
    }

    // Apply basic filter logic
    if (filters.location !== 'Any Location') {
      filtered = filtered.filter(j => j.location === filters.location);
    }

    setFilteredJobs(filtered);
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
    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse shadow-sm h-64" />
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      <header className="space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
             <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Job Marketplace</h1>
             <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Discover roles optimized for your professional profile</p>
          </div>
          <div className="text-right hidden sm:block">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Intelligence Match</span>
             <span className="text-sm font-black text-blue-600 uppercase tracking-tight">{filteredJobs.length} Positions Found</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
           <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 group focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-600 transition-all">
                 <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-600">search</span>
                 <input 
                   type="text" 
                   placeholder="Search roles, companies, or industry keywords..." 
                   className="w-full bg-transparent text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                 />
              </div>
              <button 
                onClick={() => handleSearch()}
                className="h-14 px-10 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
              >
                 Find Opportunities
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FilterDropdown 
                label="Location" 
                value={filters.location} 
                icon="location_on"
                options={['Any Location', 'Remote', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Global']}
                onChange={(v) => setFilters({...filters, location: v})}
              />
              <FilterDropdown 
                label="Work Mode" 
                value={filters.workMode} 
                icon="home_work"
                options={['Any Mode', 'Full-time', 'Contract', 'Hybrid', 'Freelance']}
                onChange={(v) => setFilters({...filters, workMode: v})}
              />
              <FilterDropdown 
                label="Job Type" 
                value={filters.jobType} 
                icon="badge"
                options={['Any Type', 'Permanent', 'Internship', 'Advisory']}
                onChange={(v) => setFilters({...filters, jobType: v})}
              />
              <FilterDropdown 
                label="Experience" 
                value={filters.experience} 
                icon="bolt"
                options={['Any Experience', 'Entry Level', 'Mid Senior', 'Director', 'Founder']}
                onChange={(v) => setFilters({...filters, experience: v})}
              />
           </div>
        </div>
      </header>

      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}/analysis`)}
                onApply={() => handleApply(job.id, job.company)}
                isApplying={isApplying[job.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6 shadow-sm border-dashed">
            <div className="size-24 rounded-[3rem] bg-slate-50 flex items-center justify-center text-slate-300">
               <span className="material-symbols-outlined text-5xl">search_off</span>
            </div>
            <div className="space-y-2">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Matches Found</h3>
               <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto">Try broadening your search or adjusting your filters to discover more roles.</p>
            </div>
            <button 
              onClick={() => { setSearch(''); setFilters({location:'Any Location', workMode:'Any Mode', jobType:'Any Type', experience:'Any Experience'}); setFilteredJobs(allJobs); }}
              className="px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all"
            >
               Reset Intelligence Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
