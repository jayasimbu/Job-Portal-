import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000';

const MOCK_INSIGHTS = {
  overallScore: 78,
  sections: [
    { name: 'Skills Match', score: 85, color: '#3b82f6' },
    { name: 'Experience Relevance', score: 72, color: '#8b5cf6' },
    { name: 'Education Fit', score: 90, color: '#10b981' },
    { name: 'Keyword Density', score: 65, color: '#f59e0b' },
    { name: 'Formatting Quality', score: 80, color: '#6366f1' },
  ],
  recommendations: [
    'Add measurable achievements (e.g. "Improved load time by 40%").',
    'Include keywords: TypeScript, System Design, CI/CD.',
    'Add a professional summary at the top.',
    'Quantify your project impact with metrics.',
  ],
  topSkills: ['React', 'JavaScript', 'Python', 'REST APIs', 'Git'],
  missingSkills: ['TypeScript', 'Docker', 'GraphQL', 'CI/CD', 'Redis'],
};

export default function Insights() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || '';
    const userId = (() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}').id; } catch { return null; } })();
    if (!userId) { setInsights(MOCK_INSIGHTS); setLoading(false); return; }
    fetch(`${API}/api/jobseeker/insights/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => setInsights(d.insights || MOCK_INSIGHTS))
      .catch(() => setInsights(MOCK_INSIGHTS))
      .finally(() => setLoading(false));
  }, []);

  const data = insights || MOCK_INSIGHTS;
  const score = data.overallScore || 0;
  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-[#0d141b] dark:text-white">
      <div className="bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold">Resume Insights & AI Match Reasoning</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered score breakdown and improvement tips</p>
        </div>
        <button
          onClick={() => navigate('/jobseeker/profile/resume')}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">upload_file</span>
          Upload Resume
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-10 rounded-full border-4 border-blue-600 border-t-transparent " />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-6">
          {/* Overall score + sections */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Gauge */}
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Overall ATS Score</p>
              <div className="relative size-36 my-2">
                <svg className="size-36 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="3"
                    strokeDasharray={`${score * 0.9} ${100 - score * 0.9}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black" style={{ color: scoreColor }}>{score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>
              <p className="font-bold" style={{ color: scoreColor }}>
                {score >= 80 ? 'Excellent 🎉' : score >= 60 ? 'Good 👍' : 'Needs Work ⚠️'}
              </p>
            </div>

            {/* Section bars */}
            <div className="md:col-span-2 bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <p className="font-bold mb-4">Score Breakdown</p>
              <div className="flex flex-col gap-4">
                {(data.sections || []).map((sec, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{sec.name}</span>
                      <span className="font-bold">{sec.score}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all " style={{ width: `${sec.score}%`, backgroundColor: sec.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-green-600">
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(data.topSkills || []).map(s => (
                  <span key={s} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-600">
                Missing / Add These
              </h3>
              <div className="flex flex-wrap gap-2">
                {(data.missingSkills || []).map(s => (
                  <span key={s} className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full border border-orange-200 dark:border-orange-800">
                    + {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              AI Recommendations
            </h3>
            <div className="flex flex-col gap-3">
              {(data.recommendations || []).map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900">
                  <span className="text-blue-600 font-black text-sm mt-0.5">{i + 1}</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={() => navigate('/jobseeker/profile/resume')} className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Re-analyze Resume
            </button>
            <button onClick={() => navigate('/jobseeker/jobs')} className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-sm">work</span>
              Browse Matching Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



