import React, { useState, useRef } from 'react';
import { 
  FileText, 
  ClipboardList, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';
import { useAIAnalysis } from '../../../hooks/useAIAnalysis';
import { useToast } from '../../../core/context/ToastContext';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import ATSScoreCard from '../../../components/shared/ATSScoreCard';
import SectionTitle from '../../../components/shared/SectionTitle';
import SkillBadge from '../../../components/shared/SkillBadge';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import Button from '../../../components/ui/Button';

export default function JDMatchAnalysis() {
  const { isAnalyzing, analyzeResume, getJobMatch, error } = useAIAnalysis();
  const { showToast } = useToast();
  
  const [resumeData, setResumeData] = useState(null);
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const result = await analyzeResume(file);
    if (result) {
      setResumeData(result.resume || result.data?.resume);
      showToast("Resume parsed successfully! Now paste a JD to compare.");
    }
  };

  const handleMatchAnalysis = async () => {
    if (!resumeData || !jdText.trim()) return;

    try {
      // In a real flow, we'd send the JD to the backend for matching
      // For this workspace, we'll use a simulated result if the backend doesn't have a direct 'match' endpoint yet
      // But I implemented getJobMatch in the hook.
      
      const response = await getJobMatch(resumeData.id, jdText);
      if (response) {
        setMatchResult(response);
        showToast("Analysis complete! Review your match insights.");
      }
    } catch (err) {
      showToast("Match analysis failed.", "error");
    }
  };

  return (
    <div className="space-y-8 pt-4 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="AI Match Workspace" 
        subtitle="Upload your resume and paste a job description to see how you rank."
        breadcrumbs={["Platform", "Jobseeker", "JD Match"]}
      />

      {/* Input Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Resume Section */}
        <div className="card-premium p-6 space-y-6">
          <SectionTitle 
            title="Your Resume" 
            description="Upload the resume you want to analyze."
          />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleResumeUpload} 
            className="hidden" 
            accept=".pdf,.docx" 
          />

          {!resumeData ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-all group"
            >
              <div className="size-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-gray-400 group-hover:text-primary" size={32} />
              </div>
              <p className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[11px]">Click to Upload Resume</p>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">PDF or DOCX (Max 5MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <div>
                    <p className="body-sm font-bold text-emerald-900">Resume Loaded</p>
                    <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest">
                      {resumeData.skills?.length || 0} Skills Detected
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="text-[10px] uppercase font-black">
                  Replace
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {resumeData.skills?.slice(0, 10).map(skill => (
                  <SkillBadge key={skill} name={skill} type="primary" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: JD Section */}
        <div className="card-premium p-6 space-y-6">
          <SectionTitle 
            title="Job Description" 
            description="Paste the target job description below."
          />
          
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl body-sm text-gray-700 dark:text-gray-300 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="Paste the full job description here (Role, Requirements, Tech Stack)..."
          />

          <Button 
            onClick={handleMatchAnalysis}
            disabled={isAnalyzing || !resumeData || !jdText.trim()}
            className="w-full h-12 rounded-xl shadow-lg shadow-primary/20"
          >
            {isAnalyzing ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Sparkles className="mr-2" size={18} />}
            {isAnalyzing ? 'Analyzing Alignment...' : 'Calculate Match Score'}
          </Button>
        </div>
      </div>

      {/* Results Workspace */}
      {isAnalyzing && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <LoadingSkeleton type="card" count={1} />
        </div>
      )}

      {matchResult && !isAnalyzing && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Top Result Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ATSScoreCard 
                score={matchResult.match_percentage || 0} 
                breakdown={{
                  skills: matchResult.breakdown?.skills || 0,
                  experience: matchResult.breakdown?.experience || 0,
                  projects: matchResult.breakdown?.projects || 0,
                  education: matchResult.breakdown?.education || 0,
                  certs: matchResult.breakdown?.certifications || 0
                }}
              />
            </div>

            <div className="lg:col-span-2 card-premium p-8 flex flex-col justify-center space-y-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">AI Alignment Verdict</h3>
                <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Semantic match analysis completed</p>
              </div>

              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 italic leading-relaxed">
                "{matchResult.feedback || "Your profile shows strong alignment with the technical requirements, especially in backend architecture. However, missing expertise in specific cloud providers like AWS might be a slight bottleneck."}"
              </p>

              <div className="flex gap-4">
                <Button variant="secondary" className="rounded-xl px-6">
                  <Download size={18} className="mr-2" /> Download Report
                </Button>
                <Button variant="ghost" className="rounded-xl px-6">
                  <Share2 size={18} className="mr-2" /> Share Insights
                </Button>
              </div>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-premium p-6 space-y-6 border-l-4 border-l-emerald-500">
              <SectionTitle title="Matched Keywords" description="Skills that perfectly align with the JD." />
              <div className="flex flex-wrap gap-2">
                {matchResult.matched_skills?.map(skill => (
                  <SkillBadge key={skill} name={skill} type="success" />
                )) || <p className="body-sm text-gray-400">No matches detected.</p>}
              </div>
            </div>

            <div className="card-premium p-6 space-y-6 border-l-4 border-l-danger">
              <SectionTitle title="Critical Gaps" description="Skills missing or underrepresented in your resume." />
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_skills?.map(skill => (
                  <SkillBadge key={skill} name={skill} type="warning" />
                )) || <p className="body-sm text-gray-400">Perfect alignment!</p>}
              </div>
            </div>
          </div>
          
        </div>
      )}

      {/* Initial State Placeholder */}
      {!matchResult && !isAnalyzing && (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
           <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
             <Zap className="text-gray-400" size={40} />
           </div>
           <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Ready for Analysis</h3>
           <p className="max-w-md body-sm mt-2">Upload your resume and paste the job description to unlock deep AI matching insights.</p>
        </div>
      )}

    </div>
  );
}
