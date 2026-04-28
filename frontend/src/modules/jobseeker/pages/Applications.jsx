import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchApplications } from '../services/jobseekerService';
import { mapApplication } from '../../../core/api/adapters';

const STATUS_CONFIG = {
  applied:      { color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300', icon: 'send', label: 'Applied' },
  reviewing:    { color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300', icon: 'visibility', label: 'Reviewing' },
  interviewing: { color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300', icon: 'record_voice_over', label: 'Interview Scheduled 🟣' },
  offered:      { color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300', icon: 'celebration', label: 'Offered 🎉' },
  rejected:     { color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300', icon: 'close', label: 'Not Selected ❌' },
  shortlisted:  { color: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300', icon: 'star', label: 'Shortlisted ✅' },
};

export default function ApplicationTracking() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

    const [expandedAppId, setExpandedAppId] = useState(null);
    const [error, setError] = useState('');

    const fetchApps = async () => {
      setLoading(true);
      setError('');
      try {
        const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
        if (!userId) throw new Error('User not authenticated.');
        
        const data = await fetchApplications(userId);
        if (data.applications) {
          // map application fields via adapter, but merge in ATS fields if needed.
          const mapped = data.applications.map(app => ({
             ...app,
             ...mapApplication(app)
          }));
          setApplications(mapped);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchApps();
    }, []);

    const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);
    const stats = ['all', 'applied', 'shortlisted', 'interviewing', 'rejected', 'offered']
      .map(s => ({ status: s, count: s === 'all' ? applications.length : applications.filter(a => a.status === s).length }))
      .filter(s => s.count > 0);

    const timeAgo = (dateString) => {
      const date = new Date(dateString);
      const seconds = Math.floor((new Date() - date) / 1000);
      let interval = Math.floor(seconds / 86400);
      if (interval >= 1) return interval === 1 ? 'yesterday' : interval + ' days ago';
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return interval === 1 ? '1 hour ago' : interval + ' hours ago';
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return interval === 1 ? '1 min ago' : interval + ' mins ago';
      return 'just now';
    };

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-[#0d141b] dark:text-white pb-20">
        <div className="bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">Application Tracking & AI Insights</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{applications.length} active applications. Tap an application to view match insights.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-6">
          {/* Stats */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {stats.map(s => {
              const cfg = STATUS_CONFIG[s.status];
              return (
                <button
                  key={s.status}
                  onClick={() => setFilter(s.status)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm whitespace-nowrap transition-all ${filter === s.status ? 'ring-2 ring-blue-500 shadow-md' : 'hover:bg-slate-50 dark:hover:bg-slate-800'} ${s.status === 'all' ? 'bg-white dark:bg-[#1a2632] text-slate-700 dark:text-white border-slate-200 dark:border-slate-700' : cfg?.color || ''}`}
                >
                  {s.count} {s.status === 'all' ? 'All' : cfg?.label || s.status}
                </button>
              );
            })}
          </div>

          {/* Error State */}
          {error && (
            <div className="flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span className="font-bold">{error}</span>
              </div>
              <button 
                onClick={fetchApps}
                className="mt-2 w-fit px-4 py-1.5 bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300 font-bold text-xs rounded-lg hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Applications list */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-24 animate-pulse border border-slate-200 dark:border-slate-700" />
              ))}
            </div>
          ) : !error && (
            <div className="flex flex-col gap-4">
              {filtered.map(app => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                const isExpanded = expandedAppId === app.id;
                const atsScore = Math.round(app.ats_score || 0);
                
                // Color mapping
                const atsColor = atsScore >= 75 ? 'text-green-600' : atsScore >= 50 ? 'text-yellow-600' : 'text-red-500';
                const atsBorderColor = atsScore >= 75 ? 'border-green-200 dark:border-green-800' : atsScore >= 50 ? 'border-yellow-200 dark:border-yellow-800' : 'border-red-200 dark:border-red-900/50';
                
                // Strength mapping
                const matchStrength = atsScore >= 75 ? 'Strong Match' : atsScore >= 50 ? 'Moderate Match' : 'Weak Match';
                
                // Fallbacks for display
                const matchedSkills = app.skills_match?.matched_keywords?.length > 0 ? app.skills_match.matched_keywords : ['Core Technical Skills', 'Domain Experience'];
                const missingSkills = app.missing_keywords || [];
                const analyzedTime = timeAgo(app.updated_at || app.created_at || Date.now());

                return (
                  <div 
                    key={app.id} 
                    onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                    className={`bg-white dark:bg-[#1a2632] rounded-2xl border ${isExpanded ? 'border-blue-400 ring-4 ring-blue-500/10 shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:shadow-md'} p-5 flex flex-col gap-4 transition-all cursor-pointer`}
                  >
                    <div className="flex gap-4">
                      <div className={`size-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        <span className="material-symbols-outlined text-xl">{cfg.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="truncate">
                            <h3 className="font-bold text-lg truncate flex items-center gap-2">
                              {app.job_title || app.title || `Application #${app.job_id}`}
                              {atsScore >= 85 && (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">
                                  ⭐ Top Candidate
                                </span>
                              )}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{app.company || 'Employer'} · {app.location || 'Remote'}</p>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border shrink-0 ${cfg.color}`}>{cfg.label}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                           <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                             <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                               <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                               {app.appliedDate}
                             </span>
                           </div>
                           <div className="flex flex-col items-end">
                             <div className="flex items-center gap-2">
                               <span className={`text-[11px] font-bold ${atsColor}`}>{matchStrength}</span>
                               <span className={`font-black text-lg tracking-tight ${atsColor}`}>{atsScore}%</span>
                             </div>
                             {!isExpanded && <span className="text-[10px] text-blue-500 font-bold mt-1">Tap for Insights ▾</span>}
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* AI JOB MATCH INSIGHTS PANEL */}
                    {isExpanded && (
                      <div className="mt-3 pt-5 border-t border-slate-100 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between mb-5 px-2">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600 text-2xl font-light">psychology</span> 
                            <div>
                              <h4 className="font-black text-blue-950 dark:text-blue-100 text-[16px] tracking-tight">Job Match Insights</h4>
                              <p className="text-[10px] text-slate-400 font-medium">Analyzed: {analyzedTime}</p>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced ATS Score Bar */}
                        <div className={`mb-5 p-4 rounded-2xl bg-white dark:bg-slate-800 border ${atsBorderColor} flex flex-col gap-3 shadow-sm`}>
                          <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-600 dark:text-slate-300">ATS Match Strength</span>
                            <span className={atsColor}>{matchStrength} ({atsScore}%)</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner flex">
                            <div className="h-full rounded-r-full transition-all duration-1000 ease-out" 
                                 style={{ width: `${atsScore}%`, backgroundColor: atsScore >= 75 ? '#16a34a' : atsScore >= 50 ? '#ca8a04' : '#ef4444' }} />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Matched Skills */}
                          <div className="bg-slate-50 dark:bg-[#131d26] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Matched Skills</p>
                            <ul className="flex flex-col gap-2.5">
                              {matchedSkills.map((s, idx) => (
                                <li key={idx} className="text-[13px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                  <span className="flex items-center justify-center size-5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30">
                                    <span className="material-symbols-outlined text-[14px] font-black">check_small</span>
                                  </span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Missing Skills */}
                          <div className="bg-slate-50 dark:bg-[#131d26] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Missing Keywords</p>
                            <ul className="flex flex-col gap-2.5">
                              {missingSkills.length > 0 ? (
                                missingSkills.map((s, idx) => (
                                  <li key={idx} className="text-[13px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <span className="flex items-center justify-center size-5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/50">
                                      <span className="material-symbols-outlined text-[14px] font-black">close</span>
                                    </span>
                                    {s}
                                  </li>
                                ))
                              ) : (
                                <li className="text-[13px] font-bold text-green-700 flex items-center gap-2">
                                  <span className="flex items-center justify-center size-5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50">
                                    <span className="material-symbols-outlined text-[14px] font-black">celebration</span>
                                  </span>
                                  No missing skills 🎉
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className={`mt-4 rounded-2xl p-4 flex gap-3 shadow-inner ${atsScore < 50 ? 'bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50' : 'bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50'}`}>
                          <span className={`material-symbols-outlined text-2xl shrink-0 ${atsScore < 50 ? 'text-orange-600' : 'text-blue-600'}`}>
                            {atsScore < 50 ? 'warning' : 'lightbulb'}
                          </span>
                          <div>
                            <p className={`font-bold text-sm tracking-tight ${atsScore < 50 ? 'text-orange-900 dark:text-orange-100' : 'text-blue-900 dark:text-blue-100'}`}>
                              AI Improvement Suggestion
                            </p>
                            <p className={`text-xs font-semibold mt-1 leading-relaxed ${atsScore < 50 ? 'text-orange-800 dark:text-orange-300' : 'text-blue-800 dark:text-blue-300'}`}>
                              {atsScore < 50 
                                ? "⚠ Improve your resume by acquiring or adding these essential missing keywords before applying to similar roles."
                                : missingSkills.length > 0 
                                  ? "Add the missing keywords to your profile to drastically improve your ranking score for similar roles."
                                  : "Your profile matches the job requirements strongly. Keep an eye out for interview invites!"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                           <button className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1">
                             Close Insights <span className="text-[10px]">▴</span>
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-6 py-20 text-center bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl mx-auto px-6 shadow-sm relative overflow-hidden">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                  
                  {/* Inline Empty State SVG */}
                  <div className="relative z-10 hover:-translate-y-2 transition-transform duration-500">
                    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto drop-shadow-xl">
                      <rect x="20" y="30" width="120" height="100" rx="12" fill="#E2E8F0" className="dark:fill-slate-800" />
                      <rect x="40" y="10" width="120" height="100" rx="12" fill="#CBD5E1" className="dark:fill-slate-700" />
                      <rect x="60" y="50" width="120" height="100" rx="12" fill="#FFFFFF" className="dark:fill-slate-900 drop-shadow-sm" />
                      <path d="M80 80H160M80 100H130M80 120H140" stroke="#94A3B8" className="dark:stroke-slate-600" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="150" cy="50" r="30" fill="#3B82F6" className="drop-shadow-lg" />
                      <path d="M142 50L148 56L158 44" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Ready for your next move?</h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-sm mx-auto">No applications found with the status "{filter}". Start applying to jobs and use our AI insights to beat the competition.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/platform/jobseeker/jobs')}
                    className="relative z-10 mt-2 px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 text-sm uppercase tracking-wider flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">search</span>
                    Browse Active Jobs
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
}
