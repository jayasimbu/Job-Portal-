import React, { useState } from 'react';
import { CheckCircle2, XCircle, Zap, Loader, FileText, ClipboardList } from 'lucide-react';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { useJDMatch } from '../hooks/useJDMatch';
import Button from '../../../components/ui/Button';

const JDMatchAnalysis = () => {
  const { 
    resumeText, 
    isParsing, 
    resumeFile, 
    analyzeResume 
  } = useResumeAnalysis();

  const {
    matchResults,
    recommendedJobs,
    isAnalyzing,
    runMatchAnalysis,
    resetMatch
  } = useJDMatch();

  const [jdText, setJdText] = useState('');

  const handleAnalyze = () => {
    if (!resumeText || !jdText.trim()) return;
    runMatchAnalysis(resumeText, jdText);
  };

  const handleResumeFile = (e) => {
    const file = e.target.files[0];
    if (file) analyzeResume(file);
  };

  const hasResume = !!resumeText;

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-16 pt-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Resume Match</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Compare your resume against a job description</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${hasResume ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'}`}>
          <FileText size={13} />
          {hasResume ? 'Resume Loaded' : 'Upload Resume'}
        </div>
      </div>

      {/* INPUT SECTION — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Resume Upload */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Your Resume</h3>
          </div>
          {hasResume ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold">{resumeFile?.name || 'Resume parsed successfully'}</span>
              </div>
              <button 
                onClick={() => document.getElementById('resume-upload-input').click()}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest block"
              >
                Re-upload
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <label htmlFor="resume-upload-input" className="cursor-pointer group">
                <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 transition-colors">
                  {isParsing ? <Loader size={24} className="text-blue-600 animate-spin" /> : <FileText size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />}
                </div>
                <p className="text-sm font-bold text-slate-500">{isParsing ? 'Parsing resume...' : 'Click to upload resume'}</p>
                <p className="text-[10px] text-slate-400 mt-1">PDF or DOCX supported</p>
              </label>
            </div>
          )}
          <input id="resume-upload-input" type="file" accept=".pdf,.docx" onChange={handleResumeFile} className="hidden" />
        </div>

        {/* RIGHT: JD Input */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Job Description</h3>
          </div>
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-40 p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-medium leading-relaxed"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jdText.trim() || !hasResume}
            className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10"
          >
            {isAnalyzing ? (
               <>
                  <Loader size={14} className="animate-spin mr-2" />
                  Analyzing...
               </>
            ) : (
               'Analyze Match'
            )}
          </Button>
        </div>
      </div>

      {/* RESULTS — Only after analysis */}
      {matchResults && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Score + Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ATS Score */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Match Score</p>
              <div className="relative size-20 mx-auto">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className={matchResults.matchPercentage >= 70 ? "text-emerald-500" : matchResults.matchPercentage >= 40 ? "text-amber-500" : "text-rose-500"} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${matchResults.matchPercentage}, 100`} strokeLinecap="round" strokeWidth="3.5" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{matchResults.matchPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3">Matched Skills ({matchResults.matchedSkills?.length || 0})</p>
              <div className="flex flex-wrap gap-1.5">
                {(matchResults.matchedSkills || []).map((s, i) => (
                  <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/30">
                    <CheckCircle2 size={10} /> {s}
                  </span>
                ))}
                {(!matchResults.matchedSkills || matchResults.matchedSkills.length === 0) && <p className="text-[10px] text-slate-400 italic">None detected</p>}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5">
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-3">Missing Skills ({matchResults.missingSkills?.length || 0})</p>
              <div className="flex flex-wrap gap-1.5">
                {(matchResults.missingSkills || []).map((s, i) => (
                  <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-800/30">
                    <XCircle size={10} /> {s}
                  </span>
                ))}
                {(!matchResults.missingSkills || matchResults.missingSkills.length === 0) && <p className="text-[10px] text-slate-400 italic">All matched!</p>}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5">
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3">Recommended Jobs</p>
              {recommendedJobs?.length > 0 ? (
                <div className="space-y-2">
                  {recommendedJobs.slice(0, 3).map((job, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Zap size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{job.title || job}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(matchResults.missingSkills || []).slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Zap size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Learn {s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          {matchResults.feedback && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Feedback</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{matchResults.feedback}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button variant="secondary" onClick={resetMatch} className="h-9 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              New Analysis
            </Button>
            <Button variant="secondary" onClick={() => window.print()} className="h-9 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              Export Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JDMatchAnalysis;
