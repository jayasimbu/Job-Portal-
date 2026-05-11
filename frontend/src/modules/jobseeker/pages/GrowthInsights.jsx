import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

export default function GrowthInsights() {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const [activeTab, setActiveTab] = useState('skillgap');

  const tabs = [
    { id: 'skillgap', icon: 'analytics', label: 'Skill Gap' },
    { id: 'profile', icon: 'trending_up', label: 'Growth Profile' },
    { id: 'courses', icon: 'auto_awesome', label: 'AI Course Picks' }
  ];

  const atsScore = resumeData?.optimizationScore || 45;
  const missingKeywords = resumeData?.atsDetails?.missing_keywords || [];
  const detectedSkills = resumeData?.parsedData?.skills || [];

  return (
    <div className="h-full flex flex-col overflow-hidden ">
      <header className="flex-shrink-0 mb-8">
        <div className="flex items-center gap-2 mb-2">
           <span className="material-symbols-outlined text-blue-600 text-sm">trending_up</span>
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Growth Engine</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">My Growth & Insights</h1>
        <p className="text-sm text-slate-500">Real-time analysis of your market competitiveness and upskilling velocity.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {activeTab === 'skillgap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm flex flex-col items-center text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Role Readiness</p>
                 
                 <div className="relative size-48 mb-8">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                       <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50" strokeWidth="3" />
                       <circle 
                         cx="18" cy="18" r="16" fill="none" 
                         className="stroke-blue-600" 
                         strokeWidth="3" 
                         strokeDasharray="100" 
                         strokeDashoffset={100 - atsScore} 
                         strokeLinecap="round"
                         style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <h2 className="text-5xl font-black text-slate-900 leading-none">{atsScore}%</h2>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Match Score</span>
                    </div>
                 </div>

                 <div className="space-y-4 w-full">
                   <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase text-blue-600">Technical Skills</span>
                     <span className="text-sm font-bold text-blue-900">92%</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase text-slate-500">Industry Context</span>
                     <span className="text-sm font-bold text-slate-900">78%</span>
                   </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Detected Gaps</h3>
                 <div className="flex flex-wrap gap-3">
                    {missingKeywords.length > 0 ? missingKeywords.map((skill, idx) => (
                       <span key={idx} className="px-5 py-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100">
                          {skill}
                       </span>
                    )) : <p className="text-sm font-bold text-emerald-600">No major gaps detected! Your profile is high-performing.</p>}
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-8 text-white flex items-center justify-between group cursor-pointer shadow-xl shadow-slate-900/20" onClick={() => navigate('/platform/jobseeker/learning')}>
                 <div className="flex items-center gap-4">
                    <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                       <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Recommendation</p>
                       <p className="text-sm font-bold">Start {missingKeywords[0] || 'System Design'} Curriculum</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex flex-col gap-8 pb-10">
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
              <div className="flex items-center gap-6 mb-10">
                <div className="size-20 rounded-[28px] bg-blue-600 flex items-center justify-center text-white text-3xl font-black">
                  {detectedSkills[0]?.charAt(0) || 'P'}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">High Potential Profile</h2>
                  <p className="text-sm text-slate-500 font-medium italic">"You are upskilling 2x faster than average candidates for your role."</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Courses Completed', val: '5', color: 'blue' },
                   { label: 'Skills Verified', val: detectedSkills.length, color: 'emerald' },
                   { label: 'Profile Views', val: '12', color: 'purple' }
                 ].map(stat => (
                   <div key={stat.label} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                      <p className={`text-3xl font-black text-${stat.color}-600`}>{stat.val}</p>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10">Upskilling Timeline</h3>
               <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div className="relative pl-12">
                     <div className="absolute left-0 top-1 size-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-lg">workspace_premium</span>
                     </div>
                     <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Today</p>
                     <h4 className="text-sm font-black text-slate-900 uppercase">Started Advanced React Patterns</h4>
                  </div>
                  <div className="relative pl-12 opacity-50">
                     <div className="absolute left-0 top-1 size-9 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-lg">update</span>
                     </div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">2 Weeks Ago</p>
                     <h4 className="text-sm font-black text-slate-900 uppercase">Resume Optimization (Score 85%)</h4>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
           <div className="pb-10">
              <div className="bg-blue-600 rounded-[32px] p-12 text-white mb-8 text-center">
                 <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Master Your Domain</h2>
                 <p className="text-blue-100 text-sm font-medium mb-8">Personalized curriculum based on your detected skill gaps.</p>
                 <button onClick={() => navigate('/platform/jobseeker/learning')} className="h-12 px-10 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                    Open Learning Hub
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
