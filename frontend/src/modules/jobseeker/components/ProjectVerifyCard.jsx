import React, { useState } from 'react';

export default function ProjectVerifyCard() {
  const [url, setUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    if (!url) return;
    setIsVerifying(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      // Mock result
      setResult({
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        commits: Math.floor(Math.random() * 200) + 50,
        contributors: Math.floor(Math.random() * 4) + 1,
        aiVibe: Math.random() > 0.7 ? 'Moderate' : 'Low'
      });
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 w-full mb-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-blue-600 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">verified</span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Authenticity Verifier</h3>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Validate your GitHub repository to increase employer trust. We check commit history, contributors, and anomaly patterns.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 !text-[20px]">link</span>
          <input 
            type="url" 
            placeholder="https://github.com/username/repo" 
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <button 
          onClick={handleVerify}
          disabled={!url || isVerifying}
          className="flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isVerifying ? (
            <><span className="material-symbols-outlined  mr-2 !text-[18px]">sync</span> Verifying...</>
          ) : 'Analyze Repo'}
        </button>
      </div>

      {result && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700  text-sm">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Authenticity Score</span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-black ${result.score >= 80 ? 'text-green-600' : 'text-amber-500'}`}>{result.score}/100</span>
              {result.score >= 80 && <span className="material-symbols-outlined text-green-500">check_circle</span>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">Commits</div>
              <div className="font-bold text-slate-900 dark:text-white">{result.commits}</div>
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">Contributors</div>
              <div className="font-bold text-slate-900 dark:text-white">{result.contributors}</div>
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">AI Vibe</div>
              <div className={`font-bold ${result.aiVibe === 'Low' ? 'text-green-600' : 'text-amber-500'}`}>{result.aiVibe}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



