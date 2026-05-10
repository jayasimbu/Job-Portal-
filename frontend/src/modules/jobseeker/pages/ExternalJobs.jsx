import React, { useState, useEffect } from 'react';
import apiClient from '../../../core/api/apiClient';

const PLATFORM_COLORS = {
  Naukri: 'bg-orange-100 text-orange-700 border-orange-200',
  LinkedIn: 'bg-sky-100 text-sky-700 border-sky-200',
  Indeed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Internshala: 'bg-blue-100 text-blue-700 border-blue-200',
  Glassdoor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Wellfound: 'bg-green-100 text-green-700 border-green-200',
  Monster: 'bg-purple-100 text-purple-700 border-purple-200',
  ZipRecruiter: 'bg-teal-100 text-teal-700 border-teal-200',
  CareerBuilder: 'bg-rose-100 text-rose-700 border-rose-200',
  SimplyHired: 'bg-amber-100 text-amber-700 border-amber-200',
  Dice: 'bg-red-100 text-red-700 border-red-200',
  Upwork: 'bg-lime-100 text-lime-700 border-lime-200',
  Fiverr: 'bg-green-100 text-green-700 border-green-200',
  FlexJobs: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Remote.co': 'bg-slate-100 text-slate-700 border-slate-200',
  'We Work Remotely': 'bg-orange-100 text-orange-700 border-orange-200',
  USAJOBS: 'bg-blue-100 text-blue-700 border-blue-200',
  'Shine.com': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  TimesJobs: 'bg-red-100 text-red-700 border-red-200',
  Freshersworld: 'bg-pink-100 text-pink-700 border-pink-200',
  Apna: 'bg-blue-100 text-blue-700 border-blue-200',
  WorkIndia: 'bg-orange-100 text-orange-700 border-orange-200',
  Foundit: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  QuikrJobs: 'bg-blue-100 text-blue-700 border-blue-200',
  ClickIndia: 'bg-orange-100 text-orange-700 border-orange-200',
  PlacementIndia: 'bg-green-100 text-green-700 border-green-200',
  'Reed.co.uk': 'bg-pink-100 text-pink-700 border-pink-200',
  Seek: 'bg-blue-100 text-blue-700 border-blue-200',
  Bayt: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  JobsDB: 'bg-sky-100 text-sky-700 border-sky-200',
  GulfTalent: 'bg-orange-100 text-orange-700 border-orange-200',
  JobStreet: 'bg-blue-100 text-blue-700 border-blue-200',
  Totaljobs: 'bg-red-100 text-red-700 border-red-200',
  Snagajob: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function ExternalJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('recommended');

  useEffect(() => {
    console.log("[ExternalJobs] Initializing...");
    const load = async () => {
      try {
        setLoading(true);
        // Robust user ID retrieval
        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.id || user?.user_id;

        console.log("[ExternalJobs] User session found:", userId);
        
        if (!userId) {
          console.warn("[ExternalJobs] No user ID found in session.");
          setLoading(false);
          return;
        }

        const res = await apiClient.get(`/jobseeker/recommendations/${userId}`);
        console.log("[ExternalJobs] Data fetched:", res.data);
        const all = res.data?.recommendations || [];
        setJobs(all.filter(j => j.platform && j.platform !== 'Internal'));
      } catch (err) { 
        console.error("[ExternalJobs] Fetch error:", err);
        setJobs([]); 
      }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = tab === 'recommended' ? jobs.filter(j => (j.match_score || 0) >= 60) : jobs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">External Jobs</h1>
        <p className="text-sm text-slate-500 mt-1">Opportunities from top platforms, matched to your skills.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        {['recommended', 'all'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${tab === t ? 'bg-[#2563eb] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            {t === 'recommended' ? '⭐ Recommended' : '🌐 All External'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="size-8 border-3 border-[#2563eb] border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-[var(--shadow-sm)]">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">work_off</span>
          <p className="font-bold text-slate-400">No external jobs found yet.</p>
          <p className="text-xs text-slate-400 mt-1">Try updating your skills to unlock more matches.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((job, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-5 shadow-[var(--shadow-sm)] hover:border-blue-200 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-[#2563eb] transition-colors">{job.title || 'Untitled'}</h3>
                  <p className="text-sm text-slate-500">{job.company || 'Unknown'} • {job.location || 'Remote'}</p>
                </div>
                {job.match_score > 0 && (
                  <span className={`text-sm font-black px-2 py-1 rounded-lg ${job.match_score >= 80 ? 'bg-emerald-50 text-emerald-600' : job.match_score >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                    {job.match_score}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PLATFORM_COLORS[job.platform] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {job.platform}
                </span>
                {job.type && <span className="text-[10px] font-bold text-slate-400 uppercase">{job.type}</span>}
              </div>
              <a href={job.url || job.apply_link || '#'} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-9 rounded-lg bg-[#2563eb] text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                <span className="material-symbols-outlined text-sm">open_in_new</span> View & Apply
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
