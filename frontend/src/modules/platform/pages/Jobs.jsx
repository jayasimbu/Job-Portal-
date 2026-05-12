import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronDown, CheckCircle2, AlertCircle, Sparkles, LayoutGrid } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { fetchRecommendations, applyForJob } from '../../jobseeker/services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';

export default function Jobs() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended'); 
  const userId = getCurrentUserId();
  const [isApplying, setIsApplying] = useState({});

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        // Using real service but with mock fallback for demo if needed
        const data = await fetchRecommendations(userId || 'demo-user');
        const recommendations = data.recommendations || [];
        
        // If no real recommendations, use the premium mock data for demonstration
        if (recommendations.length === 0) {
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
        } else {
          setJobs(recommendations.map(j => ({
            ...j,
            matchScore: j.matchScore || 75,
            matched: j.matched || ['React'],
            missing: j.missing || ['Node.js'],
            salary: j.salary || '₹10–15 LPA',
            workMode: j.workMode || 'Remote',
            type: j.type || 'Full-time'
          })));
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#0d1117] border-b border-slate-200 dark:border-slate-800 pt-8 pb-6 px-8 sticky top-0 z-30 backdrop-blur-xl bg-opacity-80">
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
                  placeholder="Search roles, skills, or companies..." 
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <Button className="h-12 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/10">
                Find Opportunities
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {['recommended', 'all'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>

            {/* QUICK FILTERS */}
            <div className="flex items-center gap-2">
              {['Remote', 'Hybrid', 'Full-time', 'Senior'].map(filter => (
                <button key={filter} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-white dark:hover:bg-slate-900 transition-all">
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* JOB FEED LIST */}
      <div className="px-8 py-8">
        <div className="space-y-4">
          {loading ? (
            <div className="py-32 text-center">
               <div className="animate-spin size-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Synchronizing Match Engine...</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div 
                key={job.id} 
                className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                {/* 1. Primary Info */}
                <div className="flex items-start gap-6 flex-1">
                  <div className="size-16 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-2xl text-blue-600 transition-transform group-hover:scale-105">
                    {job.company?.[0] || 'T'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-widest">TOP MATCH</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">POSTED 2D AGO</span>
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

                {/* 2. AI Intelligence Stats */}
                <div className="flex flex-wrap items-center gap-8 lg:px-12 lg:border-x border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">{job.matchScore}%</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">MATCH SCORE</span>
                  </div>
                  
                  <div className="space-y-3 min-w-[200px]">
                    <div className="flex flex-col gap-1.5">
                       <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">MATCHED ASSETS</p>
                       <div className="flex flex-wrap gap-1">
                          {job.matched.slice(0, 3).map(s => <span key={s} className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/30">{s}</span>)}
                       </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <p className="text-[8px] font-black text-rose-500 uppercase tracking-[0.2em]">MISSING CRITICALS</p>
                       <div className="flex flex-wrap gap-1">
                          {job.missing.slice(0, 3).map(s => <span key={s} className="text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-800/30">{s}</span>)}
                       </div>
                    </div>
                  </div>
                </div>

                {/* 3. Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 min-w-[160px]">
                  <Button 
                    onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                    variant="secondary" 
                    className="h-11 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200 dark:border-slate-800"
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
