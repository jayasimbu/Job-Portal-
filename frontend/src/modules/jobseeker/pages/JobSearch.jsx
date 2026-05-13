import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronDown, CheckCircle2, AlertCircle, Sparkles, LayoutGrid } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function JobSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended');

  // Mock data for UI demonstration
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setJobs([
        { id: 1, title: 'Frontend Developer', company: 'Zoho', location: 'Chennai', matchScore: 87, matched: ['React', 'Tailwind'], missing: ['Docker'], salary: '₹6–8 LPA', workMode: 'Hybrid', type: 'Full-time' },
        { id: 2, title: 'React Engineer', company: 'Freshworks', location: 'Chennai', matchScore: 92, matched: ['React', 'JavaScript', 'CSS'], missing: ['GraphQL'], salary: '₹8–12 LPA', workMode: 'On-site', type: 'Full-time' },
        { id: 3, title: 'Senior UI Developer', company: 'Chargebee', location: 'Remote', matchScore: 78, matched: ['JavaScript', 'HTML'], missing: ['Vue.js', 'Figma'], salary: '₹12–15 LPA', workMode: 'Remote', type: 'Contract' },
        { id: 4, title: 'Full Stack Engineer', company: 'TCS', location: 'Bangalore', matchScore: 85, matched: ['Node.js', 'React'], missing: ['AWS'], salary: '₹10–14 LPA', workMode: 'On-site', type: 'Full-time' },
        { id: 5, title: 'Product Designer', company: 'Cred', location: 'Remote', matchScore: 65, matched: ['Figma', 'UI Design'], missing: ['Prototyping', 'User Research'], salary: '₹15–18 LPA', workMode: 'Remote', type: 'Full-time' }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      {/* STICKY SEARCH & TABS CONTAINER */}
      <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-[#0d1117]/80 backdrop-blur-md pt-4 pb-3 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto space-y-3">
          
          {/* TOP SEARCH ROW */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* TABS */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit shrink-0">
              <button 
                onClick={() => setActiveTab('recommended')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'recommended' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Sparkles size={13} />
                Recommended
              </button>
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <LayoutGrid size={13} />
                All Jobs
              </button>
            </div>

            {/* SEARCH INPUT */}
            <div className="flex-1 flex gap-3">
              <div className="flex-1 relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search roles, skills, or companies..." 
                  className="w-full h-11 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              <Button className="h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20 text-[11px] font-bold uppercase tracking-widest">
                Search
              </Button>
            </div>
          </div>

          {/* FILTER ROW */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { icon: MapPin, options: ['Location', 'Remote', 'Chennai', 'Bangalore'] },
              { icon: Briefcase, options: ['Work Mode', 'On-site', 'Hybrid', 'Remote'] },
              { icon: Sparkles, options: ['Experience', 'Entry Level', 'Intermediate', 'Senior'] }
            ].map((filter, idx) => (
              <div key={idx} className="relative">
                <filter.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-widest appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-300 transition-colors shadow-sm">
                  {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ))}
            <Button variant="ghost" className="h-8 px-3 gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-auto">
              <Filter size={12} /> Clear
            </Button>
          </div>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="max-w-[1200px] mx-auto px-6 py-5">
        <div className="space-y-2.5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="size-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Finding the best roles...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-medium">No matching jobs found.</div>
          ) : (
            jobs.map((job) => (
              <div 
                key={job.id} 
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-500/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Logo + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="size-10 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-base text-blue-600">
                    {job.company[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-0.5">
                      <span 
                        className="text-slate-700 dark:text-slate-300 uppercase tracking-wide cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/platform/jobseeker/companies/${job.companyId || job.id}`)}
                      >
                        {job.company}
                      </span>
                      <span className="size-0.5 bg-slate-300 rounded-full" />
                      <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                      <span className="size-0.5 bg-slate-300 rounded-full hidden sm:block" />
                      <span className="hidden sm:inline">{job.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Match + Skills */}
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-black tracking-tighter ${job.matchScore >= 80 ? 'text-emerald-500' : job.matchScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {job.matchScore}%
                  </span>
                  
                  <div className="hidden lg:flex items-center gap-1.5">
                    {job.matched.slice(0, 2).map(s => (
                      <span key={s} className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/30">
                        <CheckCircle2 size={9} /> {s}
                      </span>
                    ))}
                    {job.missing.slice(0, 1).map(s => (
                      <span key={s} className="flex items-center gap-0.5 text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-800/30">
                        <AlertCircle size={9} /> {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="secondary" 
                      className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg border-slate-200"
                      onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                    >
                      Details
                    </Button>
                    <Button className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
