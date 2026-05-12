import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronDown, CheckCircle2, AlertCircle, Sparkles, LayoutGrid } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function JobSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' or 'all'

  // Mock data for UI demonstration
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setJobs([
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'Zoho',
          location: 'Chennai',
          matchScore: 87,
          matched: ['React', 'Tailwind'],
          missing: ['Docker'],
          salary: '₹6–8 LPA',
          workMode: 'Hybrid',
          type: 'Full-time'
        },
        {
          id: 2,
          title: 'React Engineer',
          company: 'Freshworks',
          location: 'Chennai',
          matchScore: 92,
          matched: ['React', 'JavaScript', 'CSS'],
          missing: ['GraphQL'],
          salary: '₹8–12 LPA',
          workMode: 'On-site',
          type: 'Full-time'
        },
        {
          id: 3,
          title: 'Senior UI Developer',
          company: 'Chargebee',
          location: 'Remote',
          matchScore: 78,
          matched: ['JavaScript', 'HTML'],
          missing: ['Vue.js', 'Figma'],
          salary: '₹12–15 LPA',
          workMode: 'Remote',
          type: 'Contract'
        },
        {
          id: 4,
          title: 'Full Stack Engineer',
          company: 'TCS',
          location: 'Bangalore',
          matchScore: 85,
          matched: ['Node.js', 'React'],
          missing: ['AWS'],
          salary: '₹10–14 LPA',
          workMode: 'On-site',
          type: 'Full-time'
        },
        {
          id: 5,
          title: 'Product Designer',
          company: 'Cred',
          location: 'Remote',
          matchScore: 65,
          matched: ['Figma', 'UI Design'],
          missing: ['Prototyping', 'User Research'],
          salary: '₹15–18 LPA',
          workMode: 'Remote',
          type: 'Full-time'
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      {/* STICKY SEARCH & TABS CONTAINER */}
      <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-[#0d1117]/80 backdrop-blur-md pt-6 pb-4 px-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto space-y-4">
          
          {/* TOP SEARCH ROW */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* TABS (Near Search) */}
            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit shrink-0">
              <button 
                onClick={() => setActiveTab('recommended')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'recommended' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Sparkles size={14} />
                Recommended
              </button>
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                All Jobs
              </button>
            </div>

            {/* SEARCH INPUT */}
            <div className="flex-1 flex gap-3">
              <div className="flex-1 relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search roles, skills, or companies..." 
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                />
              </div>
              <Button className="h-14 px-10 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-transform">
                Find Opportunities
              </Button>
            </div>
          </div>

          {/* FILTER ROW */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-300 transition-colors shadow-sm">
                <option>Location</option>
                <option>Remote</option>
                <option>Chennai</option>
                <option>Bangalore</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-300 transition-colors shadow-sm">
                <option>Work Mode</option>
                <option>On-site</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-300 transition-colors shadow-sm">
                <option>Experience</option>
                <option>Entry Level</option>
                <option>Intermediate</option>
                <option>Senior</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <Button variant="ghost" className="h-10 px-4 gap-2 text-slate-500 border-slate-200 text-xs font-black uppercase tracking-widest ml-auto">
              <Filter size={14} /> Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* JOB LIST CONTENT */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="size-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">Finding the best roles...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-32 text-slate-500 font-medium">No matching jobs found.</div>
          ) : (
            jobs.map((job, index) => (
              <div 
                key={job.id} 
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Accent for Order (Optional, but clean) */}
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between">
                  
                  {/* Job Info */}
                  <div className="space-y-5 flex-1">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-100 dark:border-blue-800">
                          #{index + 1} Featured
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">• Posted {index + 1}d ago</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-500 mt-2">
                        <span 
                          className="text-slate-800 dark:text-slate-200 uppercase tracking-wide cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => navigate(`/platform/jobseeker/companies/${job.companyId || job.id}`)}
                        >
                          {job.company}
                        </span>
                        <span className="size-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[job.salary, job.workMode, job.type].map((tag, i) => (
                        <span key={i} className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Match Info & Actions */}
                  <div className="flex flex-col md:w-80 gap-6 shrink-0">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Match Analysis</span>
                       <div className="flex flex-col items-end">
                         <span className={`text-2xl font-black ${job.matchScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {job.matchScore}%
                         </span>
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 -mt-1">Precision</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Matches</p>
                          <div className="flex flex-wrap gap-1.5">
                             {job.matched.map(skill => (
                               <span key={skill} className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800">
                                 <CheckCircle2 size={10} /> {skill}
                               </span>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                             {job.missing.map(skill => (
                               <span key={skill} className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md border border-rose-100 dark:border-rose-900/30">
                                 <AlertCircle size={10} /> {skill}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button 
                        variant="secondary" 
                        className="flex-1 h-12 text-xs font-black uppercase tracking-widest rounded-xl border-slate-200"
                        onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                      >
                        Details
                      </Button>
                      <Button className="flex-1 h-12 text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">
                        Quick Apply
                      </Button>
                    </div>
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
