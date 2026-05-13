import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../core/api/apiClient';

const API = 'http://localhost:8000';

export default function ProjectVerify() {
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!githubUrl.startsWith('https://github.com/')) {
      setError('Please enter a valid GitHub URL (e.g. https://github.com/username/repo)');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const resp = await apiClient.post('/api/verify/project', {
        github_url: githubUrl,
        live_url: liveUrl || undefined
      });
      const data = resp.data;
      if (!data.success) throw new Error(data.error || 'Verification failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verdictColors = {
    green: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    lime: 'text-lime-600 bg-lime-50 border-lime-200 dark:bg-lime-900/20 dark:border-lime-800',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    orange: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    red: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
  };

  const gaugeColor = result ? {
    green: '#22c55e', lime: '#84cc16', yellow: '#eab308', orange: '#f97316', red: '#ef4444',
  }[result.verdict_color] || '#3b82f6' : '#3b82f6';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0d1117] text-[#0d141b] dark:text-white">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-[#1a2632] border-b border-slate-300 dark:border-slate-700 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold">Project Authenticity Verification</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verify your GitHub projects with AI-powered commit analysis</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-blue-600 text-3xl mt-0.5">info</span>
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">How is authenticity measured?</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              We analyze your GitHub commit history, timeline spread, message quality, contributor patterns, and AI-assist signals. 
              AI-assisted work is labeled as <strong>"AI-Assisted"</strong> — not "Fake". This is informational, never a disqualifier.
            </p>
          </div>
        </div>

        {/* Input form */}
        <div className="bg-slate-50 dark:bg-[#1a2632] rounded-2xl border border-slate-300 dark:border-slate-700 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
              GitHub Repository URL *
            </label>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-slate-400 text-xl">code</span>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="flex-1 bg-transparent text-sm focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
              Live Demo URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-slate-400 text-xl">language</span>
              <input
                type="url"
                value={liveUrl}
                onChange={e => setLiveUrl(e.target.value)}
                placeholder="https://myproject.vercel.app"
                className="flex-1 bg-transparent text-sm focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">+10 points if your live URL returns HTTP 200</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading || !githubUrl}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-base font-bold transition-all
              ${loading || !githubUrl ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 cursor-pointer'}`}
          >
            {loading ? (
              <>
                <div className="size-5 rounded-full border-2 border-white border-t-transparent " />
                Analyzing Repository...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">manage_search</span>
                Verify Project Authenticity
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-6">
            {/* Score + verdict */}
            <div className="bg-slate-50 dark:bg-[#1a2632] rounded-2xl border border-slate-300 dark:border-slate-700 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Gauge */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative size-40">
                    <svg className="size-40 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={gaugeColor}
                        strokeWidth="3"
                        strokeDasharray={`${result.authenticity_score * 0.9} ${100 - result.authenticity_score * 0.9}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black" style={{ color: gaugeColor }}>{result.authenticity_score}</span>
                      <span className="text-xs text-slate-400 font-medium">/ 100</span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold border ${verdictColors[result.verdict_color] || ''}`}>
                    {result.verdict}
                  </div>
                </div>

                {/* Summary + repo info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-blue-600">code</span>
                    <a href={result.github_url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">
                      {result.repo_owner}/{result.repo_name}
                    </a>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{result.summary}</p>
                  {result.live_url && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="material-symbols-outlined text-sm text-green-600">language</span>
                      <a href={result.live_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline font-medium">
                        {result.live_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dimension breakdown */}
            <div className="bg-slate-50 dark:bg-[#1a2632] rounded-2xl border border-slate-300 dark:border-slate-700 p-6">
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">bar_chart</span>
                Dimension Breakdown
              </h3>
              <div className="flex flex-col gap-5">
                {result.dimensions.map((dim, i) => {
                  const pct = dim.max_score > 0 ? (dim.score / dim.max_score) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{dim.label}</span>
                        <span className="font-bold">{dim.score} / {dim.max_score}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full rounded-full transition-all "
                          style={{ width: `${pct}%`, backgroundColor: pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444' }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{dim.details}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setResult(null); setGithubUrl(''); setLiveUrl(''); }}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Verify Another Project
              </button>
              <button
                onClick={() => navigate('/jobseeker/profile')}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



