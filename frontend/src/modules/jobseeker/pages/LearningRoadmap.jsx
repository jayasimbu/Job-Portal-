import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as jobseekerService from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { UI } from '../../../constants/ui';

const LearningRoadmap = () => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await jobseekerService.fetchDashboardData(userId);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch roadmap data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return (
    <div className={UI.PAGE_CONTAINER + " flex items-center justify-center min-h-[60vh]"}>
      <div className="size-12 border-4 border-blue-600 border-t-transparent rounded-full " />
    </div>
  );

  const roadmap = data?.skills?.learning_roadmap || data?.learningPath || [];
  const missingSkills = data?.missing_skills || [];

  return (
    <div className={UI.PAGE_CONTAINER}>
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
           <span className="material-symbols-outlined text-purple-600 text-3xl">auto_awesome</span>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Career Roadmap</h1>
        </div>
        <p className="text-slate-500 font-medium max-w-2xl">
          Based on your resume and market analysis, we've structured a 3-phase journey to help you bridge your skill gaps and reach your target roles.
        </p>
      </header>

      {roadmap.length > 0 ? (
        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {roadmap.map((phase, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-600 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-sm font-bold">{idx + 1}</span>
              </div>
              {/* Content */}
              <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500">
                <div className="flex items-center justify-between space-x-2 mb-2">
                  <div className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">{phase.phase || `Phase ${idx+1}`}</div>
                  <time className="font-bold text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{phase.effort || phase.estimated_time || '2-4 Weeks'}</time>
                </div>
                <div className="text-slate-900 dark:text-white font-bold text-lg mb-2">{phase.skill || (phase.topics && phase.topics[0])}</div>
                <div className="text-slate-500 text-sm mb-4 leading-relaxed">
                  {phase.topics?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {phase.topics.map((topic, tidx) => (
                        <li key={tidx}>{topic}</li>
                      ))}
                    </ul>
                  ) : (
                    "Focusing on core principles and industry best practices to ensure a solid foundation for growth."
                  )}
                </div>
                <button 
                  onClick={() => navigate('/platform/jobseeker/learning')}
                  className="w-full h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Find Learning Resources
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
           <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">analytics</span>
           <h3 className="text-lg font-bold text-slate-900">Roadmap Not Ready</h3>
           <p className="text-slate-500 mb-6 max-w-sm mx-auto">Upload a new resume to trigger our AI engine and generate your personalized learning roadmap.</p>
           <button onClick={() => navigate('/platform/jobseeker/dashboard')} className={UI.BTN_PRIMARY}>Go to Dashboard</button>
        </div>
      )}

      <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
           <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Market Fit Prediction</h3>
           <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">
              Upon completing this roadmap, your market fit for <strong>Senior Developer</strong> roles is projected to increase by <strong>25-30%</strong>.
           </p>
           <div className="flex items-center gap-4">
              <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-400 w-3/4 rounded-full" />
              </div>
              <span className="font-black text-blue-400">75% -> 95%</span>
           </div>
        </div>
        <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[12rem] opacity-5 rotate-12">trending_up</span>
      </div>
    </div>
  );
};

export default LearningRoadmap;



