import React, { useState, useEffect } from 'react';
import EmptyState from '../../../core/components/EmptyState';
import { useToast } from '../../../core/context/ToastContext';

const Jobs = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Initial fetch
    const timer = setTimeout(() => {
      setJobs([
        { id: 1, title: 'Senior React Developer', company: 'GlobalTech', location: 'Remote', salary: '$140k - $180k', match: 95, type: 'Full-time', matchedSkills: ['React', 'Node.js', 'Tailwind'] },
        { id: 2, title: 'Frontend Engineer', company: 'Nexus Labs', location: 'New York, NY', salary: '$120k - $160k', match: 88, type: 'Hybrid', matchedSkills: ['React', 'JavaScript', 'CSS'] },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (search.toLowerCase() === 'xyz') {
        setJobs([]);
      } else {
        setJobs([
          { id: 1, title: 'Senior React Developer', company: 'GlobalTech', location: 'Remote', salary: '$140k - $180k', match: 95, type: 'Full-time', matchedSkills: ['React', 'Node.js', 'Tailwind'] },
        ]);
      }
      setLoading(false);
    }, 800);
  };

  const SkeletonCard = () => (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse shadow-sm">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="size-12 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-50 dark:bg-slate-800 rounded-lg" />
            <div className="h-6 w-20 bg-slate-50 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
        <div className="size-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 space-y-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Job Marketplace</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered opportunity discovery engine.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-5 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Job Title, Skills, or Keywords" 
              className="w-full bg-transparent text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="h-14 px-10 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95">
            Discover
            <span className="material-symbols-outlined text-sm">trending_flat</span>
          </button>
        </form>

        <div className="flex gap-2">
          {['Remote', 'Full-time', 'React'].map(chip => (
            <button key={chip} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 hover:text-white transition-all">
              {chip}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {loading ? 'Analyzing Opportunities...' : `${jobs.length} Precision Matches`}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
          {loading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4 pb-6">
              {jobs.map(job => (
                <div key={job.id} className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500 transition-all shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {job.company[0]}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h4>
                          <p className="text-xs font-bold text-slate-500">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase rounded-lg border border-slate-100 dark:border-slate-700">{job.type}</span>
                         <span className="px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-[9px] font-black uppercase rounded-lg border border-green-200/20">{job.salary}</span>
                      </div>
                      {job.matchedSkills && (
                        <div className="flex flex-wrap gap-2 items-center pt-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Match:</span>
                          {job.matchedSkills.map(skill => (
                            <span key={skill} className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">
                              <span className="material-symbols-outlined text-[10px]">check</span> {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-8">
                       <div className="flex items-center gap-3">
                          <div className="text-right">
                             <span className="block text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">{job.match}%</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Match Score</span>
                          </div>
                          <div className="size-10 rounded-full border-[3px] border-blue-600 dark:border-blue-400 flex items-center justify-center">
                             <span className="material-symbols-outlined text-blue-600 text-sm">auto_fix_high</span>
                          </div>
                       </div>
                    <button 
                      onClick={() => {
                        showToast(`Application sent to ${job.company} ✅`);
                      }}
                      className="w-full md:w-auto h-10 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      Apply Now
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="search_off"
              title="No jobs found 😔"
              description={`We couldn't find any matches for "${search}". Try searching for popular skills like "React" or "Frontend".`}
              actionText="Reset Search"
              onAction={() => { setSearch(''); handleSearch(); }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
