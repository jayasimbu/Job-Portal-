import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications } from '../../jobseeker/services/jobseekerService';
import { mapApplication } from '../../../core/api/adapters';
import { getCurrentUserId } from '../../../core/auth/session';

const STATUS_CONFIG = {
  applied:      { color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300', icon: 'send', label: 'Applied' },
  reviewing:    { color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300', icon: 'visibility', label: 'Reviewing' },
  interviewing: { color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300', icon: 'record_voice_over', label: 'Interview Scheduled' },
  offered:      { color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300', icon: 'celebration', label: 'Offered 🎉' },
  rejected:     { color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300', icon: 'close', label: 'Not Selected' },
  shortlisted:  { color: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300', icon: 'star', label: 'Shortlisted ✅' },
};

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedAppId, setExpandedAppId] = useState(null);
  const userId = getCurrentUserId();

  useEffect(() => {
    const loadApps = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await fetchApplications(userId);
        if (data.applications) {
          const mapped = data.applications.map(app => ({
             ...app,
             ...mapApplication(app)
          }));
          setApplications(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, [userId]);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Hiring Pipeline</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your active applications in real-time.</p>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 pb-10">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
            {['all', 'applied', 'shortlisted', 'interviewing', 'rejected', 'offered'].map(s => (
                <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === s ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'}`}
                >
                    {s}
                </button>
            ))}
        </div>

        {loading ? (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
            </div>
        ) : (
            <div className="space-y-4">
                {filtered.map(app => {
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                    const isExpanded = expandedAppId === app.id;
                    const atsScore = Math.round(app.ats_score || 0);

                    return (
                        <div 
                            key={app.id}
                            className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all hover:border-blue-500/50 cursor-pointer ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className={`size-12 rounded-xl flex items-center justify-center font-black text-lg ${cfg.color}`}>
                                        {(app.company || 'C')[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{app.job_title || 'Software Role'}</h4>
                                        <p className="text-xs font-bold text-slate-500 mt-1">{app.company || 'Enterprise Corp'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cfg.color}`}>
                                        {cfg.label}
                                    </span>
                                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{atsScore}% AI Score</div>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Matched Keywords</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(app.skills_match?.matched_keywords || ['Verified Skills']).map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 text-[9px] font-black rounded border border-green-100 dark:border-green-800">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Missing Keywords</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(app.missing_keywords || []).length > 0 ? app.missing_keywords.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 text-[9px] font-black rounded border border-red-100 dark:border-red-800">{s}</span>
                                                )) : <span className="text-[10px] font-bold text-green-600">No missing keywords!</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">AI Recommendation</p>
                                        <p className="text-xs font-medium text-blue-900 dark:text-blue-200">
                                            {atsScore >= 75 ? "Your profile is a strong match. Expect a follow-up soon." : "Consider adding the missing keywords to your profile for better visibility."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="py-20 text-center bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl">
                        <p className="text-sm font-bold text-slate-400">No applications found in this stage.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
