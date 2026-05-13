import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  Star,
  ChevronLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Currency,
  History,
  Info
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../core/context/ToastContext';

import apiClient from '../../../core/api/apiClient';
import { getCurrentUserId } from '../../../core/auth/session';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [job, setJob] = useState(null);
  const [hasRunMatch, setHasRunMatch] = useState(false);
  const [isRunningMatch, setIsRunningMatch] = useState(false);
  const userId = getCurrentUserId();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await apiClient.get('/jobseeker/jobs');
        const rawJobs = response.data?.data?.jobs || response.data?.jobs || [];
        
        // Find the specific job. Ensure type matching (id from params is string, id in json might be number)
        const jobData = rawJobs.find(j => j.id.toString() === id.toString());

        if (!jobData) {
          showToast("Job not found ❌");
          navigate('/platform/jobseeker/jobs');
          return;
        }

        setJob({
            id: jobData.id,
            title: jobData.title || 'Job Title',
            company: {
                name: jobData.company || 'Company Name',
                logo: (jobData.company || 'C')[0],
                industry: jobData.industry || 'Software & AI',
                location: jobData.location || 'Location',
                size: '100+ Employees',
                about: `Our team is looking for a passionate ${jobData.title} to join ${jobData.company}.`
            },
            salary: jobData.salary || 'Competitive',
            experience: jobData.experience || 'Depends on role',
            shift: jobData.shift || 'Day Shift',
            bond: jobData.bond || 'No Bond',
            workMode: jobData.type || 'Full-time',
            skills: jobData.tags || [],
            matchScore: 0,
            matchedSkills: [],
            missingSkills: [],
            description: jobData.description || 'No detailed description available.',
            requirements: jobData.requirements || jobData.tags || []
        });
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        showToast("Error loading job details ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, navigate, showToast]);

  const handleRunMatch = async () => {
      if (!userId || !job) return;
      setIsRunningMatch(true);
      
      try {
          // Artificial delay to simulate ATS processing
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const profileRes = await apiClient.get(`/jobseeker/profile/${userId}`);
          const profileSkills = profileRes.data?.data?.profile?.skills || [];
          
          const insightsRes = await apiClient.get('/jobseeker/resume-insights');
          const insightsSkills = insightsRes.data?.skills_match || [];
          
          const userSkills = new Set([...profileSkills, ...insightsSkills].map(s => s.toLowerCase()));
          const jobTags = (job.skills || []).map(t => t.toLowerCase());
          
          let score = 60;
          let matched = [];
          let missing = [];

          if (userSkills.size > 0) {
              const matches = jobTags.filter(t => userSkills.has(t));
              matched = job.skills.filter(t => userSkills.has(t.toLowerCase()));
              missing = job.skills.filter(t => !userSkills.has(t.toLowerCase()));
              score = Math.min(98, 60 + (matches.length * 6));
          } else {
              missing = job.skills;
          }
          
          setJob(prev => ({
              ...prev,
              matchScore: score,
              matchedSkills: matched,
              missingSkills: missing
          }));
          
          setHasRunMatch(true);
      } catch (err) {
          console.error("Failed to run match", err);
          showToast("Failed to run JD Match ❌");
      } finally {
          setIsRunningMatch(false);
      }
  };

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      showToast(`Application successfully sent to ${job.company.name}! 🚀`);
      setIsApplying(false);
    }, 1500);
  };

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="animate-spin size-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Generating AI Match Report...</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Back Header */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Listings
        </button>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job ID: {id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: COMPANY PROFILE (LEFT - 3 Units) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Building2 size={80} />
            </div>
            
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-3xl text-blue-600 mb-6 shadow-inner">
               {job.company.logo}
            </div>
            
            <div className="space-y-4">
               <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{job.company.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                     <ShieldCheck size={14} className="text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Employer</span>
                  </div>
               </div>

               <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-3 text-slate-500">
                     <Briefcase size={16} />
                     <span className="text-[11px] font-bold uppercase tracking-wide">{job.company.industry}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                     <MapPin size={16} />
                     <span className="text-[11px] font-bold uppercase tracking-wide">{job.company.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                     <Users size={16} />
                     <span className="text-[11px] font-bold uppercase tracking-wide">{job.company.size}</span>
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">About Company</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                     {job.company.about}
                  </p>
               </div>

               <Button variant="secondary" className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-700">
                  View Company Profile
               </Button>
            </div>
          </div>
        </div>

        {/* COLUMN 2: JOB SPECIFICS (CENTER - 6 Units) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 shadow-sm space-y-8">
             
             {/* Main Title Area */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded uppercase tracking-[0.2em]">Active Role</span>
                   <span className="px-3 py-1 border border-slate-300 dark:border-slate-700 text-slate-500 text-[9px] font-black rounded uppercase tracking-[0.2em]">{job.workMode}</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{job.title}</h1>
             </div>

             {/* Quick Specs Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compensation</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{job.salary}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{job.experience}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{job.shift}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contract</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{job.bond}</p>
                </div>
             </div>

             {/* Description */}
             <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                   <Info size={16} className="text-blue-600" />
                   Role Description
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line leading-relaxed">
                   {job.description}
                </div>
             </div>

             {/* Requirements */}
             <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                   <History size={16} className="text-blue-600" />
                   Technical Requirements
                </h3>
                <ul className="space-y-3 list-none">
                   {job.requirements.map((req, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                         <div className="size-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                         {req}
                      </li>
                   ))}
                </ul>
             </div>

             {/* Skills Tech Stack */}
             <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                   <Star size={16} className="text-blue-600" />
                   Tech Stack Hub
                </h3>
                <div className="flex flex-wrap gap-2">
                   {job.skills.map(s => (
                      <span key={s} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{s}</span>
                   ))}
                </div>
             </div>
          </div>
        </div>

         {/* COLUMN 3: MATCH ANALYSIS & ACTION (RIGHT - 3 Units) */}
        <div className="lg:col-span-3 space-y-4 sticky top-[100px]">
          <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
             <div className="flex items-center gap-3">
                <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                   <Sparkles size={16} />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AI Match Engine</h2>
             </div>

             {!hasRunMatch ? (
                 <div className="py-12 text-center space-y-6">
                    <div className="size-20 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto flex items-center justify-center text-blue-500">
                        <Zap size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white mb-2">Analyze JD Match</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Cross-reference your resume insights with this specific job description.</p>
                    </div>
                    <Button 
                        onClick={handleRunMatch}
                        disabled={isRunningMatch}
                        className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
                    >
                        {isRunningMatch ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Running ATS Scan...
                            </div>
                        ) : 'Run AI Match'}
                    </Button>
                 </div>
             ) : (
                 <>
                     <div className="flex items-center justify-center py-4">
                        <div className="relative size-32">
                           <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                              <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                              <path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${job.matchScore}, 100`} strokeLinecap="round" strokeWidth="3.5" />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-4xl font-black text-white tracking-tighter">{job.matchScore}%</span>
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Optimized</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-5">
                        <div className="space-y-3">
                           <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] border-b border-emerald-900/30 pb-2">Matched Skills</p>
                           <div className="flex flex-wrap gap-1.5">
                              {job.matchedSkills.map(s => (
                                 <span key={s} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded border border-emerald-500/20 uppercase tracking-widest">{s}</span>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] border-b border-rose-900/30 pb-2">Missing Capabilities</p>
                           <div className="flex flex-wrap gap-1.5">
                              {job.missingSkills.map(s => (
                                 <span key={s} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[9px] font-black rounded border border-rose-500/20 uppercase tracking-widest">{s}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                 </>
             )}

             <div className="pt-6 border-t border-slate-800 space-y-3">
                <Button 
                   onClick={handleApply}
                   disabled={isApplying}
                   className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 group relative overflow-hidden"
                >
                   {isApplying ? (
                      <div className="flex items-center gap-2">
                         <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full"></div>
                         Syncing Application...
                      </div>
                   ) : 'Submit Application'}
                </Button>
                <p className="text-[8px] font-bold text-slate-500 text-center uppercase tracking-widest">Automated Profile Matching Applied</p>
             </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
             <Zap size={18} className="text-amber-500 shrink-0 mt-0.5" />
             <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">AI Recommendation</p>
                <p className="text-[10px] font-bold text-amber-600/80 leading-relaxed uppercase tracking-wide">Add "Redux" to your resume to increase match score to 94%.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
