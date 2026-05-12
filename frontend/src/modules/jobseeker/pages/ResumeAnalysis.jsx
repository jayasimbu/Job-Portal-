import React, { useState, useRef } from 'react';
import apiClient from '../../../core/api/apiClient';
import { useToast } from '../../../core/context/ToastContext';
import appConfig from '../../../core/config/appConfig';
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function ResumeAnalysis() {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === 'application/pdf' || dropped.name.endsWith('.docx'))) {
      setFile(dropped);
      setError('');
    } else {
      showToast('Please upload a PDF or DOCX file 📄');
    }
  };

  const handleFile = (e) => {
    const picked = e.target.files[0];
    if (picked) {
      setFile(picked);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) { showToast('Select a file first'); return; }

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const storedUser = localStorage.getItem('currentUser');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?.id ?? 0;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', String(userId));
      formData.append('job_description', '');

      const token = localStorage.getItem('accessToken') || '';
      const baseUrl = appConfig.api.baseUrl;
      
      const uploadResp = await fetch(`${baseUrl}/jobseeker/resume/upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResp.ok) {
        const errorData = await uploadResp.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const uploadData = await uploadResp.json();
      const resumeText = uploadData.resume?.resume_text || uploadData.data?.resume?.resume_text || '';
      const skills = uploadData.resume?.skills || uploadData.data?.resume?.skills || [];
      const expYears = uploadData.resume?.experience_years || uploadData.data?.resume?.experience_years || 0;

      const atsResp = await apiClient.post('/jobseeker/ats/resume', { 
        resume_text: resumeText, 
        skills, 
        experience_years: expYears 
      });

      const atsData = atsResp.data?.data ?? atsResp.data;
      
      setResult({ 
        upload: uploadData.data ?? uploadData, 
        ats: atsData,
        rawText: resumeText
      });
      showToast('Analysis complete! 🎯');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      showToast('Analysis failed ❌');
    } finally {
      setLoading(false);
    }
  };

  const score = result?.ats?.final_score ?? result?.ats?.overall_score ?? 82;
  const extractedSkills = result?.upload?.resume?.skills || result?.upload?.skills || ['React', 'Node.js', 'MongoDB', 'Tailwind'];
  const missingSkills = result?.ats?.missing_keywords || ['Docker', 'AWS', 'System Design'];
  
  // Fallback insights and suggestions if not provided by API
  const insights = result?.ats?.llm_enhanced_feedback || "Your project experience is strong, but adding deployment-related skills could improve backend role visibility.";
  const suggestions = result?.ats?.improvement_suggestions || [
    "Add measurable achievements to your work experience.",
    "Include more cloud deployment projects.",
    "Highlight full-stack capabilities better."
  ];
  const learningRecs = result?.ats?.learning_recommendations || [
    "Docker Basics for Frontend Developers",
    "AWS Foundations",
    "Advanced React Patterns"
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-20 px-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resume Analysis</h1>
        <p className="text-slate-500 font-medium text-base">
          Understand how your resume performs in modern hiring systems.
        </p>
      </div>

      {/* TOP SECTION - UPLOAD CARD */}
      {!result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`group flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer transition-all
              ${dragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400'}`}
          >
            <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFile} />
            <div className={`size-16 rounded-2xl flex items-center justify-center transition-all ${file ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              {file ? <ShieldCheck size={32} /> : <Upload size={32} />}
            </div>
            {file ? (
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-500 font-medium">Ready to analyze</p>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-slate-900 dark:text-white">Upload Resume</p>
                <p className="text-sm text-slate-500 font-medium">PDF / DOCX supported</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="w-full sm:w-auto min-w-[200px] h-12 text-base"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </div>
          
          {error && (
            <p className="mt-4 text-center text-sm text-rose-600 font-medium">{error}</p>
          )}
        </div>
      )}

      {/* AFTER UPLOAD - MAIN LAYOUT */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          
          {/* LEFT SIDE: RESUME PREVIEW (col-span-5) */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[700px]">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
                <FileText size={18} className="text-slate-400" />
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Resume Preview</h3>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/50 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                {result.rawText ? result.rawText : 'Resume text preview not available. Extracted data will be shown in the analysis panels.'}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
               <Button variant="secondary" onClick={() => { setResult(null); setFile(null); }}>
                 Upload Another Resume
               </Button>
            </div>
          </div>

          {/* RIGHT SIDE: ANALYSIS PANELS (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* PANEL 1 - RESUME SCORE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex items-center gap-8">
              <div className="relative size-32 shrink-0">
                 <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="fill-none stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" className="fill-none stroke-blue-600" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * score) / 100} strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{score}%</span>
                 </div>
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Resume Score</h2>
                 <p className="text-slate-600 dark:text-slate-400">
                   {score >= 80 ? 'Your resume is well optimized for frontend roles.' : 'Your resume needs optimization to pass ATS filters.'}
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {/* PANEL 2 - EXTRACTED SKILLS */}
               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                     <CheckCircle2 size={18} />
                     <h3 className="font-bold">Extracted Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {extractedSkills.map(s => (
                        <span key={s} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-800/50">
                           {s}
                        </span>
                     ))}
                  </div>
               </div>

               {/* PANEL 3 - SKILLS TO IMPROVE */}
               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-rose-600">
                     <AlertCircle size={18} />
                     <h3 className="font-bold">Skills to Improve</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {missingSkills.map(s => (
                        <span key={s} className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-bold border border-rose-100 dark:border-rose-800/50">
                           {s}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* PANEL 4 - RESUME INSIGHTS */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-3">
                  <TrendingUp size={18} />
                  <h3 className="font-bold">Resume Insights</h3>
               </div>
               <p className="text-blue-900 dark:text-blue-200 font-medium leading-relaxed">
                  {insights}
               </p>
            </div>

            {/* PANEL 5 - IMPROVEMENT SUGGESTIONS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 text-amber-600 mb-4">
                  <Lightbulb size={18} />
                  <h3 className="font-bold text-slate-900 dark:text-white">Improvement Suggestions</h3>
               </div>
               <ul className="space-y-3">
                  {suggestions.map((s, i) => (
                     <li key={i} className="flex items-start gap-3">
                        <div className="size-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400 text-sm">{s}</span>
                     </li>
                  ))}
               </ul>
            </div>

            {/* PANEL 6 - LEARNING RECOMMENDATIONS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <BookOpen size={18} />
                  <h3 className="font-bold text-slate-900 dark:text-white">Learning Recommendations</h3>
               </div>
               <ul className="space-y-3">
                  {learningRecs.map((s, i) => (
                     <li key={i} className="flex items-center gap-3">
                        <div className="size-6 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded flex items-center justify-center shrink-0 text-xs font-bold border border-indigo-100 dark:border-indigo-800/50">
                           {i + 1}
                        </div>
                        <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{s}</span>
                     </li>
                  ))}
               </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
