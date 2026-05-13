import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { matchJd, fetchLearningRecommendations } from '../services/jobseekerService';
import { useToast } from '../../../core/context/ToastContext';
import Button from '../../../components/ui/Button';
import { CheckCircle2, XCircle, Zap, ArrowRight, Loader, FileText, ClipboardList } from 'lucide-react';

const JDMatch = () => {
  const { resumeData } = useResume();
  const { showToast } = useToast();
  const [jdText, setJdText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const handleAnalyze = async () => {
    if (!jdText) {
      showToast("Please paste a Job Description first 📝");
      return;
    }
    if (!resumeData?.rawText) {
      showToast("Please upload your resume in the Dashboard first 📄");
      return;
    }

    setAnalyzing(true);
    try {
      const result = await matchJd({
        resume_text: resumeData.rawText,
        job_description: jdText
      });
      
      setMatchResult({
        matchPercentage: Math.round(result.ats_score || result.final_score || 0),
        matchedSkills: result.matched_keywords || [],
        missingSkills: result.missing_keywords || [],
        feedback: result.llm_enhanced_feedback
      });

      // Fetch learning recommendations based on missing skills
      if (result.missing_keywords?.length > 0) {
        const recs = await fetchLearningRecommendations(result.missing_keywords);
        setRecommendations(recs);
      }

      showToast("Analysis complete! 🎯");
    } catch (err) {
      console.error("Match analysis failed", err);
      showToast("Analysis failed ❌");
    } finally {
      setAnalyzing(false);
    }
  };

  const hasResume = !!resumeData?.rawText;

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-16 px-4 sm:px-6 pt-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Resume Match</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Compare your resume against a job description</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${hasResume ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'}`}>
          <FileText size={13} />
          {hasResume ? 'Resume Loaded' : 'Resume Missing'}
        </div>
      </div>

      {/* INPUT SECTION — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Resume Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Your Resume</h3>
          </div>
          {hasResume ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold">Resume loaded from Dashboard</span>
              </div>
              {resumeData?.parsedData?.skills?.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detected Skills ({resumeData.parsedData.skills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.parsedData.skills.slice(0, 8).map(s => (
                      <span key={s} className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded uppercase tracking-wider border border-blue-100 dark:border-blue-800/30">{s}</span>
                    ))}
                    {resumeData.parsedData.skills.length > 8 && (
                      <span className="text-[9px] font-bold text-slate-400 px-1">+{resumeData.parsedData.skills.length - 8}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">Upload your resume in the Dashboard first</p>
              <p className="text-[10px] text-slate-400 mt-1">Go to Dashboard → Upload Resume</p>
            </div>
          )}
        </div>

        {/* RIGHT: JD Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Job Description</h3>
          </div>
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here (Responsibilities, Requirements, Skills)..."
            className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-medium leading-relaxed"
          />
        </div>
      </div>

      {/* ANALYZE BUTTON */}
      <Button 
        onClick={handleAnalyze}
        disabled={analyzing || !jdText || !hasResume}
        className="w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
      >
        {analyzing ? (
           <>
              <Loader size={16} className="animate-spin mr-2" />
              Analyzing...
           </>
        ) : (
           'Analyze Match'
        )}
      </Button>

      {/* RESULTS — Only after analysis */}
      {matchResult && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Score + Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ATS Score */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">ATS Score</p>
              <div className="relative size-20 mx-auto">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className={matchResult.matchPercentage >= 70 ? "text-emerald-500" : matchResult.matchPercentage >= 40 ? "text-amber-500" : "text-rose-500"} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${matchResult.matchPercentage}, 100`} strokeLinecap="round" strokeWidth="3.5" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{matchResult.matchPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3">Matched Skills ({matchResult.matchedSkills.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchedSkills.map((s, i) => (
                  <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/30">
                    <CheckCircle2 size={10} /> {s}
                  </span>
                ))}
                {matchResult.matchedSkills.length === 0 && <p className="text-[10px] text-slate-400 italic">None detected</p>}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-3">Missing Skills ({matchResult.missingSkills.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills.map((s, i) => (
                  <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-800/30">
                    <XCircle size={10} /> {s}
                  </span>
                ))}
                {matchResult.missingSkills.length === 0 && <p className="text-[10px] text-slate-400 italic">All skills matched!</p>}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3">Recommended</p>
              {recommendations.length > 0 ? (
                <div className="space-y-2">
                  {recommendations.slice(0, 3).map((rec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Zap size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{rec.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {matchResult.missingSkills.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Zap size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Learn {s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Feedback */}
          {matchResult.feedback && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Feedback</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{matchResult.feedback}"
              </p>
            </div>
          )}

          {/* Export */}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => window.print()} className="h-9 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              Export Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JDMatch;
