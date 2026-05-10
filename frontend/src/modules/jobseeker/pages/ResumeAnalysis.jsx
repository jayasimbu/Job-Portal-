import React, { useState, useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import apiClient from '../../../core/api/apiClient';
import { getCurrentUserId } from '../../../core/auth/session';

const ResumeAnalysis = () => {
  const { resumeData, updateResumeData, setIsLoading } = useResume();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [statusStep, setStatusStep] = useState(0);
  const inputRef = useRef(null);
  const userId = getCurrentUserId();

  const handleFileSelect = (e) => {
    const picked = e.target.files[0];
    if (picked && picked.type === 'application/pdf') {
      setFile(picked);
      setError('');
    } else if (picked) {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      setError('Please select a resume file first.');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');
      setStatusStep(1); // Uploading

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', String(userId));

      // Step 1: Upload & Parse
      const uploadResp = await apiClient.post('/jobseeker/resume/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setStatusStep(2); // AI Analysis
      const uploadData = uploadResp.data;
      const resume = uploadData.resume || uploadData.data?.resume || {};
      
      // Step 2: ATS Scoring
      const atsResp = await apiClient.post('/jobseeker/ats/resume', {
        resume_text: resume.resume_text || '',
        skills: resume.skills || [],
        experience_years: resume.experience_years || 0
      });

      setStatusStep(3); // Finalizing
      const atsData = atsResp.data?.data || atsResp.data;

      const finalData = {
        optimizationScore: Math.round(atsData.final_score || atsData.overall_score || 0),
        parsedData: {
          skills: resume.skills || [],
          experienceYears: resume.experience_years || 0
        },
        atsDetails: atsData,
        rawText: resume.resume_text || ''
      };

      updateResumeData(finalData);
      setFile(null);
    } catch (err) {
      console.error("Analysis failed", err);
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
      setStatusStep(0);
    }
  };

  const steps = [
    { label: 'Uploading', icon: 'upload' },
    { label: 'Parsing', icon: 'description' },
    { label: 'AI Scoring', icon: 'auto_awesome' }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 space-y-2 mb-8">
        <div className="flex items-center gap-2 mb-2">
           <span className="material-symbols-outlined text-blue-600 text-sm">analytics</span>
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Intelligence Suite</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Resume Optimization</h1>
        <p className="text-sm font-bold text-slate-500">Enhance your profile for maximum ATS visibility using our neural scoring engine.</p>
      </header>

      <div className="flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-2 pb-10">
        
        {/* Upload Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-12 shadow-sm text-center relative overflow-hidden group">
           {analyzing && (
              <div className="absolute top-0 left-0 h-1 bg-blue-600 animate-[loading_2s_infinite]" style={{ width: '100%' }} />
           )}
           
           <input 
              type="file" 
              ref={inputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileSelect} 
           />

           <div className={`size-20 mx-auto rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${
              file ? 'bg-emerald-50 text-emerald-600 scale-110' : 'bg-blue-50 text-blue-600 group-hover:scale-110'
           }`}>
              <span className="material-symbols-outlined text-3xl">
                {analyzing ? 'hourglass_empty' : file ? 'task_alt' : 'upload_file'}
              </span>
           </div>

           <div className="space-y-2 mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {analyzing ? 'Analysis in Progress...' : file ? file.name : 'Upload Latest Resume'}
              </h3>
              <p className="text-sm font-bold text-slate-500">
                {analyzing ? `Step ${statusStep} of ${steps.length}: ${steps[statusStep-1]?.label}` : 'PDF format, maximum size 10MB.'}
              </p>
           </div>

           {error && (
              <p className="text-xs font-bold text-red-500 mb-6 bg-red-50 dark:bg-red-900/20 py-2 rounded-xl border border-red-100 dark:border-red-900/30">{error}</p>
           )}

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => inputRef.current?.click()}
                disabled={analyzing}
                className="h-14 px-8 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Change File
              </button>
              <button 
                onClick={file ? handleUploadAndAnalyze : () => inputRef.current?.click()}
                disabled={analyzing}
                className="h-14 px-12 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-600/20 flex items-center gap-3"
              >
                {analyzing ? (
                   <>
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                   </>
                ) : file ? (
                   <>
                      <span className="material-symbols-outlined text-base">analytics</span>
                      Analyze Now
                   </>
                ) : 'Select PDF'}
              </button>
           </div>
        </div>

        {/* Results Dashboard */}
        {resumeData && !analyzing && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
             
             {/* Score Metric */}
             <div className="lg:col-span-5 p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm flex flex-col items-center text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Optimization Quotient</p>
                
                <div className="relative size-48 mb-8">
                   <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50 dark:stroke-slate-800" strokeWidth="3" />
                      <circle 
                        cx="18" cy="18" r="16" fill="none" 
                        className="stroke-blue-600" 
                        strokeWidth="3" 
                        strokeDasharray="100" 
                        strokeDashoffset={100 - (resumeData.optimizationScore || 0)} 
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-none">{resumeData.optimizationScore}%</h2>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ATS Score</span>
                   </div>
                </div>

                <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                   resumeData.optimizationScore >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                   <span className="material-symbols-outlined text-base">verified</span>
                   {resumeData.optimizationScore >= 80 ? 'Market Ready' : 'Optimization Recommended'}
                </div>
             </div>

             {/* Skills & Insights */}
             <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-[32px] shadow-sm">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-blue-600">psychology</span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">AI Feedback</h3>
                   </div>
                   <p className="text-sm font-medium text-blue-900 dark:text-blue-200 leading-relaxed italic">
                      "{resumeData.atsDetails?.llm_enhanced_feedback || "Your resume has been successfully parsed. Review the detected skills and missing keywords to optimize your market fit."}"
                   </p>
                </div>

                <div className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Missing Keywords</h3>
                      <span className="text-[10px] font-bold text-rose-600 uppercase">Critical Gaps</span>
                   </div>
                   <div className="flex flex-wrap gap-3">
                      {(resumeData.atsDetails?.missing_keywords || []).length > 0 ? resumeData.atsDetails.missing_keywords.map((skill, idx) => (
                         <span key={idx} className="px-5 py-3 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl border border-rose-100 dark:border-rose-900/30 transition-all">
                            {skill}
                         </span>
                      )) : <p className="text-xs font-bold text-emerald-600">No major keyword gaps detected! You're good to go.</p>}
                   </div>
                </div>

                <div className="p-8 bg-slate-900 dark:bg-blue-700 rounded-[32px] text-white flex items-center justify-between group cursor-pointer shadow-xl shadow-slate-900/20" onClick={() => window.history.back()}>
                   <div className="flex items-center gap-4">
                      <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                         <span className="material-symbols-outlined">dashboard</span>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action Required</p>
                         <p className="text-sm font-bold">Apply these insights to your dashboard</p>
                      </div>
                   </div>
                   <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
