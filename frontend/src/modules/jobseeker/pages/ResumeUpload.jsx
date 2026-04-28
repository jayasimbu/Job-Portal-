import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../core/api/apiClient';
import appConfig from '../../../core/config/appConfig';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [mode, setMode] = useState('normal'); // 'normal' | 'jd'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

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
    if (picked) {
      setFile(picked);
      setError('');
    }
  };

  const [statusStep, setStatusStep] = useState(null); // null | 0 | 1 | 2 | 3

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a PDF file first.'); return; }

    setLoading(true);
    setResult(null);
    setError('');
    setStatusStep(0); // Uploading

    // Hard timeout — if anything takes longer than 30 s the user gets a clear message
    const TIMEOUT_MS = appConfig.api.timeout || 30000;
    let didTimeout = false;
    const timeoutHandle = setTimeout(() => {
      didTimeout = true;
      setLoading(false);
      setStatusStep(null);
      setError(
        'Analysis timed out after 30 seconds. ' +
        'Check that the backend is running: cd backend → uvicorn main:app --reload'
      );
    }, TIMEOUT_MS);

    try {
      // Read real user_id from localStorage
      const storedUser = localStorage.getItem('currentUser');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?.id ?? 0;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', String(userId));
      formData.append('job_description', jobDesc);

      // Step 1 — Upload & Parse
      const uploadResp = await apiClient.post('/jobseeker/resume/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (didTimeout) return;
      setStatusStep(1); // Parsing

      await new Promise(r => setTimeout(r, 900));
      if (didTimeout) return;
      setStatusStep(2); // AI Analysis

      const uploadData = uploadResp.data;
      const resumeText = uploadData.resume?.resume_text || uploadData.data?.resume?.resume_text || '';
      const skills = uploadData.resume?.skills || uploadData.data?.resume?.skills || [];
      const expYears = uploadData.resume?.experience_years || uploadData.data?.resume?.experience_years || 0;

      const atsPayload = mode === 'jd'
        ? { resume_text: resumeText, job_description: jobDesc }
        : { resume_text: resumeText, skills, experience_years: expYears, projects: [], education: [] };

      const atsEndpoint = mode === 'jd' ? '/jobseeker/ats/jd' : '/jobseeker/ats/resume';

      // Step 2 — ATS Analysis (now fast — returns in <1 s from backend)
      const atsResp = await apiClient.post(atsEndpoint, atsPayload);
      if (didTimeout) return;
      setStatusStep(3); // Finalizing

      await new Promise(r => setTimeout(r, 600));
      if (didTimeout) return;

      const atsData = atsResp.data?.data ?? atsResp.data;
      setResult({ upload: uploadData.data ?? uploadData, ats: atsData });
    } catch (err) {
      if (!didTimeout) {
        const msg =
          err.message ||
          err.response?.data?.message ||
          err.response?.data?.detail ||
          'Analysis failed. Please try again.';
        setError(msg);
      }
    } finally {
      clearTimeout(timeoutHandle);
      if (!didTimeout) {
        setLoading(false);
        setStatusStep(null);
      }
    }
  };

  const score = result?.ats?.final_score ?? result?.ats?.overall_score ?? 0;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-500';
  const gaugeFill = score;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-[#0d141b] dark:text-white">


      <div className="max-w-4xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        {/* Mode toggle */}
        <div className="flex gap-2 bg-white dark:bg-[#1a2632] p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
          {['normal', 'jd'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
            >
              {m === 'normal' ? '📋 General ATS Score' : '🎯 Match to Job Description'}
            </button>
          ))}
        </div>

        {/* Upload dropzone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all
            ${dragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1a2632] hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
          <div className={`size-16 rounded-2xl flex items-center justify-center ${file ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
            <span className={`material-symbols-outlined text-4xl ${file ? 'text-green-600' : 'text-blue-600'}`}>
              {file ? 'task_alt' : 'upload_file'}
            </span>
          </div>
          {file ? (
            <div className="text-center">
              <p className="text-base font-bold text-green-600">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Drag & drop your PDF resume here</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse · PDF only · Max 10MB</p>
            </div>
          )}
        </div>

        {/* JD input */}
        {mode === 'jd' && (
          <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
              Paste Job Description *
            </label>
            <textarea
              rows={6}
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here to get a match-specific ATS score..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {loading && (
          <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col gap-6 shadow-xl border-l-4 border-l-blue-500 scale-in-center">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600 text-3xl">psychology</span>
                Processing Intelligence
              </h3>
              <div className="text-[10px] uppercase tracking-widest font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-4 py-1.5 rounded-full animate-pulse border border-blue-200 dark:border-blue-800">
                Phase {statusStep + 1} / 4
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Uploading Document', icon: 'upload' },
                { label: 'Parsing Skill Context', icon: 'description' },
                { label: 'ATS Match Scoring', icon: 'analytics' },
                { label: 'Finalizing Insights', icon: 'verified' }
              ].map((step, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-500 ${statusStep === idx ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 translate-x-2' : statusStep > idx ? 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-60' : 'border-transparent opacity-20'}`}>
                  <div className={`size-10 rounded-xl flex items-center justify-center shadow-sm ${statusStep > idx ? 'bg-green-100 text-green-600' : statusStep === idx ? 'bg-blue-600 text-white shadow-blue-500/40' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-xl">{statusStep > idx ? 'check' : step.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs uppercase tracking-tighter font-black ${statusStep === idx ? 'text-blue-600' : 'text-slate-400'}`}>{statusStep > idx ? 'Completed' : statusStep === idx ? 'In Progress' : 'Pending'}</span>
                    <span className={`text-sm font-bold ${statusStep === idx ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{step.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-red-500 mt-0.5">error</span>
              <p className="text-red-700 dark:text-red-400 font-bold text-sm leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => { setError(''); handleAnalyze(); }}
              className="self-start flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Retry Analysis
            </button>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className={`group flex h-14 items-center justify-center gap-3 rounded-2xl text-base font-black uppercase tracking-widest shadow-xl transition-all
            ${loading || !file ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/25 hover:-translate-y-1 hover:shadow-blue-600/40 cursor-pointer active:scale-95'}`}
        >
          {loading ? (
            <>
              <div className="size-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">analytics</span>
              {mode === 'jd' ? 'Compare Match Accuracy' : 'Generate ATS Score'}
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-6">
            {/* Score card */}
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold mb-6">ATS Analysis Results</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Gauge */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative size-36">
                    <svg className="size-36 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'}
                        strokeWidth="3"
                        strokeDasharray={`${gaugeFill} ${100 - gaugeFill}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-black ${scoreColor}`}>{Math.round(score)}</span>
                      <span className="text-xs text-slate-500 font-medium">/ 100</span>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${scoreColor}`}>
                    {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[140px] text-center leading-snug" title="Score based on skills match (50%), experience relevance (30%), and keyword coverage (20%)">
                    Based on skills, experience & keywords
                  </p>
                </div>
                {/* Breakdown bars */}
                <div className="flex-1 flex flex-col gap-3">
                  {(result.ats?.section_scores || result.ats?.breakdown || []).map((sec, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{sec.label || sec.name || `Section ${i+1}`}</span>
                        <span className="font-bold">{Math.round(sec.score ?? sec.value ?? 0)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${sec.score ?? sec.value ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Extracted skills */}
            {result.upload?.resume?.skills?.length > 0 && (
              <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">psychology</span>
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.upload.resume.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI feedback */}
            {result.ats?.llm_enhanced_feedback && (
              <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">auto_awesome</span>
                  AI-Powered Feedback
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result.ats.llm_enhanced_feedback}
                </p>
              </div>
            )}

            {/* Missing keywords */}
            {result.ats?.missing_keywords?.length > 0 && (
              <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-600">
                  <span className="material-symbols-outlined">warning</span>
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.ats.missing_keywords.map(kw => (
                    <span key={kw} className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full border border-orange-200 dark:border-orange-800">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/jobseeker/insights')}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">insights</span>
                View Full Insights
              </button>
              <button
                onClick={() => { setResult(null); setFile(null); }}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">upload</span>
                Analyze Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
