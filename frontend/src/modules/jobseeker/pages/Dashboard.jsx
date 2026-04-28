import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAiQueueStatus, fetchApplications, fetchRecommendations, fetchJobSeekerProfile } from '../services/jobseekerService';
import { getCurrentUser, getCurrentUserId } from '../../../core/auth/session';

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [queueStatus, setQueueStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionUser = getCurrentUser();
  const userId = getCurrentUserId(1);
  const [userProfile, setUserProfile] = useState(sessionUser);

  const firstName = userProfile?.full_name?.split(' ')[0] || userProfile?.email?.split('@')[0] || 'Candidate';

  // Analysis Stats logic
  const activeResId = userProfile?.activeResumeId;
  const resumes = userProfile?.uploadedResumes || [];
  const activeRes = resumes.find(r => r.id === activeResId) || (resumes.length ? resumes[0] : null);
  const atsScore = activeRes?.atsAnalysis?.ats_score || activeRes?.normalATS?.score || 0;

  // Profile Completion logic
  const criteria = [
    { label: 'Upload Resume', completed: resumes.length > 0 },
    { label: 'Verify Email', completed: !!userProfile?.email },
    { label: 'Add Headline', completed: !!(userProfile?.headline && userProfile?.about) },
    { label: 'ATS Analysis', completed: !!(activeRes && (activeRes.atsAnalysis || activeRes.normalATS)) },
    { label: 'Extract Skills', completed: !!(activeRes?.extractedSkills?.length > 0) }
  ];
  const profileCompletion = Math.floor((criteria.filter(c => c.completed).length / criteria.length) * 100);

  useEffect(() => {
    let intervalId;
    
    const load = async () => {
      try {
        const [recommendationResponse, applicationResponse, profileResponse] = await Promise.all([
          fetchRecommendations(userId),
          fetchApplications(userId),
          fetchJobSeekerProfile(userId)
        ]);
        setJobs(recommendationResponse?.recommendations || []);
        setApplications(applicationResponse?.applications || []);
        
        if (profileResponse?.profile) {
          setUserProfile(profileResponse.profile);
          localStorage.setItem('career_auto_user', JSON.stringify(profileResponse.profile));
        }

        const queueRes = await fetchAiQueueStatus(userId);
        setQueueStatus(queueRes);
      } catch (err) {
        console.error("Dashboard data load failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    load();

    // Set up real-time polling (every 30 seconds) to ensure dynamic updates while user is working
    intervalId = setInterval(load, 30000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userId]);

  const upcomingInterviews = applications.filter(app => String(app.status).toLowerCase() === 'interview');

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-4 md:p-0">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            Welcome back, {firstName}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Explore your personalized job matches and career insights.
          </p>
        </div>
        <div className="flex w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={() => navigate('/jobseeker/jobs')}
            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Find Jobs
          </button>
        </div>
      </div>

      {/* Main Grid: Stats, Profile, Interviews, Learning Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Left Column: ATS Score & Interviews */}
        <div className="flex flex-col gap-6">
          {/* ATS Score Card */}
          <div 
            onClick={() => navigate('/jobseeker/profile/resume')}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer group flex flex-col"
          >
            <div className="mb-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Deep ATS Intelligence</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {atsScore > 0 ? atsScore : '—'}<span className="text-sm text-slate-400">/100</span>
              </h3>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${atsScore > 0 ? atsScore : 0}%` }} />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600">
              {atsScore >= 80 ? 'Perfect Match' : atsScore >= 60 ? 'Good Potential' : atsScore > 0 ? 'Needs Fix' : 'Upload Resume'}
            </div>
          </div>

          <section className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
            <div className="mb-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Interviews</h3>
            </div>
            <div className="space-y-2">
              {upcomingInterviews.length ? upcomingInterviews.map((int, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-transform hover:scale-[1.02]">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Coming Up</p>
                  <h4 className="font-bold text-slate-900 dark:text-white text-[13px] mb-0.5">{int.job_title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-medium">{int.company_name}</p>
                  <button className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Join Session</button>
                </div>
              )) : (
                <div className="py-5 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Clear Schedule</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Center Column: Profile Strength */}
        <div className="flex flex-col gap-6">
          <div 
            onClick={() => navigate('/jobseeker/profile')}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer flex flex-col h-full"
          >
            <div>
              <div className="mb-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Profile Optimization</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                    {profileCompletion > 0 ? profileCompletion + '%' : '—'}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 uppercase mb-1.5">
                    {profileCompletion > 0 ? (criteria.find(c => !c.completed) ? `Next: ${criteria.find(c => !c.completed)?.label}` : 'All Set') : 'Complete Profile'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {criteria.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i < criteria.filter(c => c.completed).length ? 'bg-green-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 flex-1 justify-center">
              {criteria.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className={c.completed ? "text-slate-800 dark:text-slate-200 font-bold" : "text-slate-400 dark:text-slate-500 font-medium"}>{c.label}</span>
                  {c.completed ? (
                    <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px] text-slate-300 dark:text-slate-600">radio_button_unchecked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Engine & Learning Hub */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl transition-all shadow-sm hover:shadow-md flex flex-col">
            <div className="mb-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Career Auto Engine</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Active</h3>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">Predicting matches for 12+ skills...</p>
              <button 
                onClick={() => navigate('/jobseeker/insights')}
                className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all uppercase tracking-widest"
              >
                Analyze Insights
              </button>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden flex-1 flex flex-col justify-center">
             <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10 flex flex-col justify-center h-full">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">Learning Hub</p>
                <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-2">Sharpen your System Design</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 font-medium">8 new resources matching your goals.</p>
                <div className="mt-auto">
                  <button 
                    onClick={() => navigate('/jobseeker/learning')}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest"
                  >
                    Start Learning
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Applications & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Recent Applications Section */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
            <h2 className="font-black text-base text-slate-900 dark:text-white">
              Recent Applications
            </h2>
            <button onClick={() => navigate('/jobseeker/applications')} className="text-[10px] font-black text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-widest">View All</button>
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            {applications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
                {applications.slice(0, 4).map((app, i) => (
                 <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                    <div className="flex justify-end mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        app.status === 'Interview' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">{app.job_title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">{app.company_name}</p>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest hover:tracking-wide transition-all">Track Progress →</button>
                 </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-slate-400 font-medium text-xs">You haven't applied to any jobs yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* AI Recommended Matches Section */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-base text-slate-900 dark:text-white">
              Recommended for you
            </h2>
          </div>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {jobs.length ? jobs.slice(0, 3).map((job, i) => (
              <div key={i} className="group p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-[13px]">{job.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{job.company_name} • {job.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-green-600 mb-1">{Math.round(job.match_score || 0)}% Match</p>
                  <button className="px-2 py-1 rounded-lg text-[10px] bg-white dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">View Details</button>
                </div>
              </div>
            )) : (
              <div className="py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Analyzing Landscape...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
