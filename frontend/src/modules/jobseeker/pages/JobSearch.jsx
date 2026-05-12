import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function JobSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

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
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Jobs</h1>
        <p className="text-slate-500 font-medium text-base">
          Explore opportunities matching your profile.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search roles, skills, or companies" 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <div className="relative w-full md:w-auto">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full md:w-40 pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>Location</option>
              <option>Remote</option>
              <option>Chennai</option>
              <option>Bangalore</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative w-full md:w-auto">
            <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full md:w-40 pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>Work Mode</option>
              <option>On-site</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <Button variant="secondary" className="h-full px-5 hidden lg:flex gap-2 text-slate-600 border-slate-200">
            <Filter size={16} /> Filters
          </Button>
          <Button className="h-full px-8">Search</Button>
        </div>
      </div>

      {/* JOB OVERVIEW SECTION */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs font-semibold text-blue-600/70 dark:text-blue-400 uppercase tracking-wider">Total Jobs</p>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{jobs.length} matching found</p>
          </div>
          <div className="w-px h-10 bg-blue-200 dark:bg-blue-800" />
          <div>
            <p className="text-xs font-semibold text-blue-600/70 dark:text-blue-400 uppercase tracking-wider">Top Category</p>
            <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-1">Frontend Development</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-blue-900/50 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50">
          <span className="text-xs font-bold text-blue-800 dark:text-blue-200">Highest Match</span>
          <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-1 rounded-lg text-sm">92%</span>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">No matching jobs found.</div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                
                {/* Job Info */}
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1">
                      <span className="text-slate-700 dark:text-slate-300">{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
                      Salary: {job.salary}
                    </span>
                    <span className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
                      Work Mode: {job.workMode}
                    </span>
                    <span className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Match Info & Actions */}
                <div className="flex flex-col md:w-80 gap-4 shrink-0">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Match Analysis</span>
                     <span className={`px-3 py-1 rounded-lg text-sm font-black border ${job.matchScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {job.matchScore}% Match
                     </span>
                  </div>
                  
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matched</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                           <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                           {job.matched.join(' • ')}
                        </p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Missing</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                           <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                           {job.missing.join(' • ')}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 mt-auto">
                    <Button 
                      variant="secondary" 
                      className="flex-1 h-10 text-sm"
                      onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                    >
                      View Job
                    </Button>
                    <Button className="flex-1 h-10 text-sm">
                      Apply
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
