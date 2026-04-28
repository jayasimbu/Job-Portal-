import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../core/auth/session';
import apiClient from '../../../core/api/apiClient';
import { useToast } from '../../../core/context/ToastContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const userName = user?.full_name || user?.email?.split('@')[0] || 'User';

  // Upload state
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState('normal'); // 'normal' | 'jd'
  const [jobDesc, setJobDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusStep, setStatusStep] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setError('');
    } else {
      setError('Please upload a PDF file.');
    }
  };

  const handleFile = (e) => {
    const picked = e.target.files[0];
    if (picked) { setFile(picked); setError(''); }
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a PDF file first.'); return; }
    setAnalyzing(true);
    setResult(null);
    setError('');
    setProgress(0);
    setStatusStep(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 6, 92));
    }, 350);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', '0');
      formData.append('job_description', jobDesc);

      // Step 0: Uploading
      await new Promise(r => setTimeout(r, 600));
      setStatusStep(1); setProgress(20);

      // Step 1: Parsing
      const uploadResp = await apiClient.post('/jobseeker/resume/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatusStep(2); setProgress(45);

      // Step 2: Extracting skills
      await new Promise(r => setTimeout(r, 800));
      setStatusStep(3); setProgress(65);

      const uploadData = uploadResp.data;
      const resumeText = uploadData.resume?.resume_text || '';
      const skills = uploadData.resume?.skills || [];
      const atsPayload = mode === 'jd'
        ? { resume_text: resumeText, job_description: jobDesc }
        : { resume_text: resumeText, skills, experience_years: uploadData.resume?.experience_years || 0, projects: [], education: [] };

      const atsEndpoint = mode === 'jd' ? '/jobseeker/ats/jd' : '/jobseeker/ats/resume';

      // Step 3: Scoring
      const atsResp = await apiClient.post(atsEndpoint, atsPayload);
      setStatusStep(4); setProgress(90);

      // Step 4: Finalizing
      await new Promise(r => setTimeout(r, 500));
      setProgress(100);
      setResult({ upload: uploadData, ats: atsResp.data });
    } catch (err) {
      const msg = err.networkError
        ? 'Server waking up... Please wait ⏳'
        : err.response?.data?.detail || err.message || 'Analysis failed. Please try again.';
      setError(msg);
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
      setStatusStep(null);
    }
  };

  const { showToast } = useToast();
  useEffect(() => {
    if (result) {
      showToast('AI Intelligence Report Generated ✅', 'success', 'ai-report');
    }
  }, [result, showToast]);

  const score = result?.ats?.final_score ?? result?.ats?.overall_score ?? null;
  const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const scoreRingColor = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  const confidenceLevel = score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW';
  const confidenceBg = score >= 80 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : score >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';

  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl ${className}`} />
  );

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
        <div className="flex flex-col gap-2 mb-4">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Skeleton className="flex-1" />
            <Skeleton className="flex-[0.5]" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="flex-1" />
            <Skeleton className="flex-[0.4]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-10 xl:px-16 py-6 h-full flex flex-col overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <header className="flex-shrink-0 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-sm md:text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight leading-tight uppercase">Platform</h2>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-relaxed mt-0.5">Welcome back, {userName} 👋</h1>
        </div>
        
        {/* HERO CARD (QUICK SCORE) */}
        {result && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-6 animate-in slide-in-from-right-4 duration-500">
            <div className="shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Readiness Score</p>
              <h2 className="text-4xl font-black leading-none mt-1">{Math.round(result.ats?.final_score || 0)}%</h2>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="text-xs font-bold leading-snug">Strong match for roles</p>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-wider mt-1 inline-block">High Fidelity Profile</span>
            </div>
          </div>
        )}
      </header>

      {/* MAIN GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">

          {/* Upload + ATS Section */}
          <section className="flex-1 min-h-0 p-4 md:p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-1">

            {/* Mode Toggle */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                <span className="material-symbols-outlined text-blue-600 text-lg">analytics</span>
                ATS Intelligence Suite
              </h3>
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['normal', 'jd'].map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${mode === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                  >
                    {m === 'normal' ? 'General ATS' : 'Match to JD'}
                  </button>
                ))}
              </div>
            </div>

            {/* Show results OR upload area */}
            {result ? (
              /* === RESULTS VIEW === */
              <div className="flex-1 flex flex-col md:flex-row items-start gap-6 min-h-0 overflow-auto pr-2 custom-scrollbar">
                {/* Score Ring + Confidence */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="relative size-28">
                    <svg className="size-28 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreRingColor} strokeWidth="2.5"
                        strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round"
                        className="transition-all duration-1000 shadow-xl"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-black ${scoreColor} leading-none`}>{Math.round(score)}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                    </div>
                  </div>
                  {/* Confidence Badge */}
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${confidenceBg}`}>
                    {confidenceLevel}
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">AI Confidence</span>
                    <p className={`text-[10px] font-bold leading-tight max-w-[120px] ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-rose-500'}`}>
                      {score >= 80 
                        ? "Great match! You're ready for top-tier roles." 
                        : score >= 60 
                        ? "Good foundation. A few tweaks will make you stand out." 
                        : "Needs improvement. Focus on missing skills + keywords."}
                    </p>
                  </div>
                </div>

                {/* Breakdown + Actions */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score Breakdown</h4>
                    <span className="text-[10px] font-black text-blue-600">Synced with Resume</span>
                  </div>
                  
                  {(() => {
                    const breakdownObj = result.ats?.score_breakdown || result.ats?.section_scores || result.ats?.breakdown;
                    let breakdownArr = [];
                    if (breakdownObj && !Array.isArray(breakdownObj)) {
                      breakdownArr = Object.entries(breakdownObj).map(([key, val]) => ({
                        label: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                        score: val
                      }));
                    } else if (Array.isArray(breakdownObj)) {
                      breakdownArr = breakdownObj;
                    } else {
                      breakdownArr = [
                        { label: 'Skills Match', score: 85 },
                        { label: 'Experience', score: 70 },
                        { label: 'Keywords', score: 45 }
                      ];
                    }
                    return breakdownArr;
                  })().map((sec, i) => {
                    const val = sec.score ?? sec.value ?? 0;
                    const c = val >= 75 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-200">
                          <span>{sec.label || sec.name || `Section ${i+1}`}</span>
                          <span>{Math.round(val)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full ${c} rounded-full transition-all duration-1000 shadow-sm`} style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    );
                  })}

                  {/* Skills */}
                  {result.upload?.resume?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {result.upload.resume.skills.slice(0, 8).map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-100/50">{skill}</span>
                      ))}
                    </div>
                  )}

                  {/* Next Action CTA */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-sm">lightbulb</span>
                      Improve your resume to increase score
                    </p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => navigate('/platform/learning')}
                        className="flex-1 h-12 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-sm">school</span> View AI Learning Path
                      </button>
                      <button onClick={() => { setResult(null); setFile(null); }}
                        className="h-10 px-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <span className="material-symbols-outlined text-sm">sync</span> Replace
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : analyzing ? (
              /* === ANALYZING ANIMATION === */
              <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-0">
                <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 px-8 py-4 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm animate-pulse">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {['Uploading document...', 'Parsing resume content...', 'Extracting skills...', 'Calculating ATS score...', 'Finalizing insights...'][statusStep || 0]}
                  </span>
                </div>
                <div className="w-full max-w-sm px-4">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-3 px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Progress</span>
                    <span className="text-xs font-black text-blue-600">{Math.round(progress)}%</span>
                  </div>
                </div>
                <div className="flex gap-6 mt-2">
                  {[
                    { label: 'Upload', icon: 'upload' },
                    { label: 'Parse', icon: 'description' },
                    { label: 'Extract', icon: 'psychology' },
                    { label: 'Score', icon: 'analytics' },
                    { label: 'Done', icon: 'verified' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className={`size-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${statusStep > idx ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : statusStep === idx ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
                        <span className="material-symbols-outlined text-lg">{statusStep > idx ? 'check' : step.icon}</span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${statusStep >= idx ? 'text-blue-600' : 'text-slate-400'}`}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* === UPLOAD VIEW === */
              <div className="flex-1 flex flex-col min-h-0">
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`w-full min-h-[200px] md:min-h-[250px] lg:min-h-[300px] flex-1 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300
                    ${dragging ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[0.99]' : file ? 'border-green-400 bg-green-50/30 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-900/5'}`}
                >
                  <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
                  <div className={`size-12 md:size-16 rounded-2xl flex items-center justify-center shadow-sm ${file ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                    <span className={`material-symbols-outlined text-2xl md:text-3xl ${file ? 'text-green-600' : 'text-blue-600'}`}>
                      {file ? 'task_alt' : 'upload_file'}
                    </span>
                  </div>
                  {file ? (
                    <div className="text-center animate-in zoom-in-95 duration-300">
                      <p className="text-sm md:text-base font-black text-green-600 uppercase tracking-tight">{file.name}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(1)} KB · Ready for analysis</p>
                    </div>
                  ) : (
                    <div className="text-center py-10 opacity-60">
                      <p className="text-sm md:text-base font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Drop your PDF resume here</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">or click to browse systems · PDF only</p>
                      <p className="text-[10px] mt-4 font-bold text-blue-500 uppercase tracking-widest">No resume uploaded yet</p>
                    </div>
                  )}
                </div>

                {/* JD textarea */}
                {mode === 'jd' && (
                  <div className="mt-3 relative group">
                    <textarea
                      rows={2}
                      value={jobDesc}
                      onChange={e => setJobDesc(e.target.value)}
                      placeholder="Paste target job description to match against..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-[13px] font-medium resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <div className="absolute right-4 bottom-4 flex items-center gap-1.5 opacity-50 group-focus-within:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">Precision Mode</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-3 flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-tight">
                      <span className="material-symbols-outlined text-lg">info</span> {error}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setError(''); handleAnalyze(); }} className="px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20">
                        <span className="material-symbols-outlined text-sm">refresh</span> Retry
                      </button>
                      <button onClick={() => setError('')} className="p-1 text-amber-400 hover:text-amber-600 transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!file}
                  className={`mt-4 flex-shrink-0 h-12 md:h-14 w-full rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95
                    ${file ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'}`}
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  {mode === 'jd' ? 'Run Precision Match' : 'Generate Intelligence Report'}
                </button>
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Resume Evolution */}
          <section className="flex-1 min-h-0 p-4 md:p-6 bg-slate-900 dark:bg-blue-600 rounded-3xl text-white flex flex-col shadow-2xl relative overflow-hidden group transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 size-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-white/10" />
            <h3 className="text-xs md:text-sm font-black flex items-center gap-2 mb-3 md:mb-4 uppercase tracking-widest relative z-10">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              Resume Evolution
            </h3>
            <div className="flex-1 space-y-3 min-h-0 overflow-y-auto pr-1 custom-scrollbar-white relative z-10">
              {[
                { text: 'Add React projects', boost: '+10%', icon: 'code', action: 'Fix' },
                { text: 'Improve Summary', boost: '+8%', icon: 'edit_note', action: 'AI' },
                { text: 'Add Cloud keywords', boost: '+5%', icon: 'cloud', action: 'Fix' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-white/10 rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                  <div className="size-8 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black leading-tight uppercase tracking-tight truncate">{item.text}</p>
                    <span className="text-[10px] font-black text-emerald-300">{item.boost} Boost</span>
                  </div>
                  <button className="shrink-0 h-7 px-3 bg-white/20 hover:bg-white text-blue-900 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/platform/learning')}
              className="w-full mt-4 md:mt-5 h-10 md:h-12 bg-white text-slate-900 font-black rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 flex-shrink-0 relative z-10">
              Improve Score Now
              <span className="material-symbols-outlined text-sm">trending_flat</span>
            </button>
          </section>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
