import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { fetchJobSeekerProfile } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { normalizeResumeData } from '../utils/resumeParser';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resumeData, updateResumeData, setIsLoading } = useResume();
  const userId = getCurrentUserId();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState([]);
  const [learning, setLearning] = useState([]);
  const [resumeInsights, setResumeInsights] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const [profileRes, recsRes, insightsRes, learningRes, resumeInsRes] = await Promise.all([
          import('../services/jobseekerService').then(m => m.fetchJobSeekerProfile(userId)),
          import('../services/jobseekerService').then(m => m.fetchRecommendations(userId)),
          import('../services/jobseekerService').then(m => m.fetchInsights(userId)),
          import('../services/jobseekerService').then(m => m.fetchLearningRecommendations(userId)),
          import('../services/jobseekerService').then(m => m.fetchResumeInsights())
        ]);

        const profile = profileRes?.profile || {};
        setDashboardStats(profile);
        setRecommendations(recsRes?.recommendations || []);
        setInsights(insightsRes?.insights || []);
        setLearning(learningRes?.learning || []);
        setResumeInsights(resumeInsRes || null);

        if (profile.hasResume && !resumeData) {
          updateResumeData(normalizeResumeData(profile));
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, [userId]);

  const score = resumeInsights?.ats_score || resumeData?.optimizationScore || dashboardStats?.ats_score || 45;
  const marketFit = resumeInsights?.ats_score ? Math.min(100, resumeInsights.ats_score + 10) : 50;

  const detectedSkills = dashboardStats?.skills || resumeData?.parsedData?.skills || ['React', 'Node.js', 'System Design'];
  
  const recommendedSkills = learning?.length > 0 
    ? learning.slice(0, 4).map(l => l.gap || l.title)
    : ['Cloud Architecture', 'CI/CD Pipelines', 'Docker'];

  const topJobs = recommendations.length > 0
    ? recommendations.map(j => ({
        title: j.title,
        company: j.company || 'TechCorp',
        location: j.location || 'Remote',
        score: j.match_score || 85
      }))
    : [
        { title: 'Senior Software Engineer', company: 'TechFlow', location: 'Remote', score: 92 },
        { title: 'Product Developer', company: 'Nova Labs', location: 'San Francisco', score: 88 }
      ];

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">Your Career Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome back! Here's what's happening with your job search.</p>
        </div>
        <button 
          onClick={() => navigate('/platform/jobseeker/learning')}
          className="h-14 px-8 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-semibold shadow-xl shadow-slate-900/10 dark:shadow-blue-600/10 hover:scale-[1.02] transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-xl">insights</span>
          View Growth Insights
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-10 pb-12">
        {/* TOP SECTION: SCORES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/20">
            <div className="flex-1 space-y-8 w-full">
               <div className="flex flex-wrap gap-16">
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Profile Strength</p>
                     <div className="flex items-baseline gap-2">
                        <h2 className="text-5xl font-semibold text-slate-900 dark:text-white">{score}%</h2>
                        <span className="text-emerald-500 font-bold text-sm">+2.4%</span>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Market Relevance</p>
                     <h2 className="text-5xl font-semibold text-blue-600 dark:text-blue-400">{marketFit}%</h2>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/platform/jobseeker/resume-analysis')}
                    className="h-12 px-8 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all"
                  >
                    Optimize Profile
                  </button>
                  <button 
                    onClick={() => navigate('/platform/jobseeker/jd-match')}
                    className="h-12 px-8 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  >
                    Skill Analysis
                  </button>
               </div>
            </div>

            <div className="relative size-40 shrink-0">
               <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="2.5" />
                  <circle 
                    cx="18" cy="18" r="16" fill="none" 
                    className="stroke-blue-600" 
                    strokeWidth="2.5" 
                    strokeDasharray="100" 
                    strokeDashoffset={100 - marketFit} 
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-slate-900 dark:text-white">{marketFit}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fit Score</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 dark:bg-blue-600 rounded-[32px] p-10 flex flex-col justify-between shadow-2xl shadow-slate-900/20">
             <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 dark:text-blue-200 uppercase tracking-widest">Resume Engine</p>
                <h3 className="text-2xl font-semibold text-white tracking-tight leading-tight">Ready for a new role?</h3>
             </div>
             <button 
               onClick={() => navigate('/platform/jobseeker/resume-analysis')}
               className="w-full h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all hover:scale-[1.02] active:scale-95"
             >
               <span className="material-symbols-outlined">upload</span>
               Update Resume
             </button>
             <p className="text-[10px] font-medium text-slate-400 dark:text-blue-200 text-center">Last updated: 2 days ago</p>
          </div>
        </div>

        {/* GROWTH & ROADMAP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8">
              <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-[32px] p-12 text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-blue-500/30 h-full" onClick={() => navigate('/platform/jobseeker/learning')}>
                 <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                          <span className="material-symbols-outlined text-white">auto_awesome</span>
                       </div>
                       <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Intelligent Roadmap</p>
                    </div>
                    <h2 className="text-4xl font-semibold tracking-tight">Bridge the gap to Senior Engineer.</h2>
                    <p className="text-blue-100/80 text-lg font-medium leading-relaxed">Your current profile is highly competitive. Complete these modules to unlock high-tier roles.</p>
                    
                    <div className="flex gap-4 pt-4">
                       {[1, 2, 3].map(i => (
                          <div key={i} className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                             <div className={`h-full bg-white transition-all duration-[2000ms] ${i === 1 ? 'w-full' : 'w-0'}`} />
                          </div>
                       ))}
                    </div>
                 </div>
                 <span className="absolute -bottom-16 -right-16 material-symbols-outlined text-[16rem] opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">explore</span>
              </div>
           </div>

           <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[32px] p-10 flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                 <div className="flex justify-between items-start">
                    <div className="size-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                       <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">+12% Velocity</span>
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Growth Profile</h3>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">You are outperforming 85% of candidates in your segment. Keep up the momentum.</p>
                 </div>
              </div>
              <button 
                onClick={() => navigate('/platform/jobseeker/growth')}
                className="w-full h-14 border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-50"
              >
                View Growth Insights
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
           </div>
        </div>

        {/* SKILLS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500">verified</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Top Competencies</h3>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Verified</span>
              </div>
              <div className="flex flex-wrap gap-3">
                 {detectedSkills.map(s => (
                    <span key={s} className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-semibold border border-slate-100 dark:border-slate-700">
                       {s}
                    </span>
                 ))}
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <span className="material-symbols-outlined text-blue-500">bolt</span>
                 <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Growth Targets</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                 {recommendedSkills.map(s => (
                    <span key={s} className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-semibold border border-blue-100/50 dark:border-blue-800/30">
                       {s}
                    </span>
                 ))}
              </div>
           </div>
        </div>

        {/* JOBS SECTION */}
        <div className="space-y-8">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <h3 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Recommended for You</h3>
                 <p className="text-sm text-slate-500 font-medium">Based on your recent skill updates and profile strength.</p>
              </div>
              <button onClick={() => navigate('/platform/jobseeker/jobs')} className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">View All Opportunities</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topJobs.slice(0, 3).map((job, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm group hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                    <div className="flex justify-between items-start mb-6">
                       <div className="size-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-400">
                          {job.company[0]}
                       </div>
                       <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">{job.score}% Match</div>
                    </div>
                    <div className="space-y-1 mb-8">
                       <h4 className="font-semibold text-xl text-slate-900 dark:text-white tracking-tight truncate">{job.title}</h4>
                       <p className="text-sm font-medium text-slate-500">{job.company} • {job.location}</p>
                    </div>
                    <button className="w-full h-12 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-sm font-semibold hover:bg-blue-600 transition-all">
                       Apply Now
                    </button>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
