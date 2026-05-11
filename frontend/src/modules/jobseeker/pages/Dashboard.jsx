import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';
import { normalizeResumeData } from '../utils/resumeParser';
import { 
  matchJd, 
  fetchJobSeekerProfile, 
  fetchRecommendations, 
  fetchResumeInsights 
} from '../services/jobseekerService';
import apiClient from '../../../core/api/apiClient';

// Import Design System
import { 
  StatCard, 
  JobCard, 
  SkillChip, 
  ATSCircle, 
  SectionHeader 
} from '../components/DesignSystem';

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { resumeData, updateResumeData, setIsLoading } = useResume();
  const userId = getCurrentUserId();
  
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [resumeInsights, setResumeInsights] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  
  const fileInputRef = useRef(null);
  const [showJdModal, setShowJdModal] = useState(false);
  const [jdText, setJdText] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const loadDashboard = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const [profileRes, recsRes, resumeInsRes] = await Promise.all([
        fetchJobSeekerProfile(userId),
        fetchRecommendations(userId),
        fetchResumeInsights(userId)
      ]);

      setDashboardStats(profileRes?.profile || {});
      setRecommendations(recsRes?.recommendations || []);
      setResumeInsights(resumeInsRes || null);

      if (profileRes?.profile?.hasResume && !resumeData) {
        updateResumeData(normalizeResumeData(profileRes.profile));
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [userId]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setAnalysisStep('Uploading & Parsing...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', String(userId));

      const uploadResp = await apiClient.post('/jobseeker/resume/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setAnalysisStep('AI Scoring Engine...');
      const uploadData = uploadResp.data;
      const resume = uploadData.resume || uploadData.data?.resume || {};
      
      const atsResp = await apiClient.post('/jobseeker/ats/resume', {
        resume_text: resume.resume_text || '',
        skills: resume.skills || [],
        experience_years: resume.experience_years || 0
      });

      setAnalysisStep('Finalizing Profile...');
      const atsData = atsResp.data?.data || atsResp.data;

      const finalData = {
        optimizationScore: Math.round(atsData.ats_score || atsData.final_score || 0),
        parsedData: {
          skills: resume.skills || [],
          experienceYears: resume.experience_years || 0
        },
        atsDetails: atsData,
        rawText: resume.resume_text || ''
      };

      updateResumeData(finalData);
      showToast("Resume processed and analyzed! 🚀");
      loadDashboard();
    } catch (err) {
      showToast("Resume processing failed ❌");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleJdMatch = async () => {
    if (!jdText) {
      showToast("Please enter a Job Description 📝");
      return;
    }
    if (!resumeData?.rawText) {
      showToast("Please upload your resume first 📄");
      return;
    }

    try {
      setIsMatching(true);
      const result = await matchJd({
        resume_text: resumeData.rawText,
        job_description: jdText
      });
      
      showToast("Match analysis complete! 🎯");
      setShowJdModal(false);
      navigate(`/platform/jobseeker/jobs/target-analysis`, { state: { result } });
    } catch (err) {
      showToast("Matching failed ❌");
    } finally {
      setIsMatching(false);
    }
  };

  const stats = {
    atsScore: resumeData?.optimizationScore || resumeInsights?.ats_score || dashboardStats?.ats_score || 0,
    marketFit: 71, 
  };

  const userSkills = resumeData?.parsedData?.skills || dashboardStats?.skills || ['ai', 'bootstrap', 'css3', 'deep learning', 'es6'];
  const recommendedSkills = (resumeData?.atsDetails?.missing_keywords || resumeInsights?.missing_keywords) || ['System Design', 'Cloud Architecture', 'Unit Testing', 'CI/CD Pipelines'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6">
      {/* ROW 1: SCORE & MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ATS SCORE CARD */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between min-h-[340px]">
           <div className="flex justify-between items-start">
              <div className="flex gap-16">
                 <StatCard label="ATS SCORE" value={stats.atsScore} suffix="%" />
                 <StatCard label="MARKET FIT" value={stats.marketFit} suffix="%" color="text-blue-600" />
              </div>
              <ATSCircle value={stats.marketFit} size={140} />
           </div>

           <div className="space-y-6">
              <div className="flex gap-4">
                 <button 
                  onClick={() => setShowJdModal(true)}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                 >
                    Improve Score
                 </button>
                 <button 
                  onClick={() => navigate('/platform/jobseeker/resume-analysis')}
                  className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
                 >
                    View Analysis
                 </button>
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                 LAST ANALYSIS: {resumeData?.optimizationScore ? "JUST NOW" : "TODAY, 10:45 AM"}
              </p>
           </div>
        </div>

        {/* RESUME MANAGEMENT CARD */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between min-h-[340px]">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">RESUME MANAGEMENT</p>
           
           <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full h-24 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 disabled:opacity-50 hover:-translate-y-1 active:scale-95"
              >
                {isAnalyzing ? (
                   <div className="flex items-center gap-3">
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {analysisStep}
                   </div>
                ) : (
                   <>
                      <span className="material-symbols-outlined text-2xl">upload_file</span>
                      Upload New Resume
                   </>
                )}
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleResumeUpload} />
           </div>

           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">
              Last upload: {dashboardStats?.resume_updated_at || "May 08, 2026"}
           </p>
        </div>
      </div>

      {/* ROW 2: SKILLS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* YOUR SKILLS */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-10">
           <SectionHeader title="Your Skills" icon="check_circle" iconColor="text-emerald-500" bgColor="bg-emerald-50" />
           <div className="flex flex-wrap gap-3">
              {userSkills.slice(0, 12).map(skill => (
                <SkillChip key={skill} label={skill} variant="success" />
              ))}
           </div>
        </div>

        {/* RECOMMENDED SKILLS */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-10">
           <SectionHeader title="Recommended Skills" icon="lightbulb" iconColor="text-rose-500" bgColor="bg-rose-50" />
           <div className="flex flex-wrap gap-3">
              {recommendedSkills.slice(0, 12).map(skill => (
                <SkillChip key={skill} label={skill} variant="danger" />
              ))}
           </div>
        </div>
      </div>

      {/* ROW 3: RECOMMENDED JOBS */}
      <div className="space-y-10 pt-4">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recommended Jobs</h2>
           <button 
            onClick={() => navigate('/platform/jobseeker/jobs')} 
            className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] hover:underline"
           >
              View All Marketplace
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.slice(0, 3).map((job, i) => (
            <JobCard 
              key={i} 
              job={job} 
              onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}/analysis`)}
            />
          ))}
        </div>
      </div>

      {/* JD MATCH MODAL */}
      {showJdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white rounded-[2.5rem] p-12 w-full max-w-2xl shadow-2xl space-y-10 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center">
                 <SectionHeader title="JD Target Analysis" icon="target" />
                 <button 
                  onClick={() => setShowJdModal(false)} 
                  className="material-symbols-outlined text-slate-400 hover:text-slate-900 transition-colors"
                 >
                    close
                 </button>
              </div>
              
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paste Job Description</label>
                 <textarea 
                   rows={8} 
                   value={jdText}
                   onChange={(e) => setJdText(e.target.value)}
                   className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all resize-none shadow-inner"
                   placeholder="Paste the full job description here to see your exact match percentage..."
                 />
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  onClick={handleJdMatch}
                  disabled={isMatching}
                  className="flex-1 py-5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 disabled:opacity-50"
                 >
                   {isMatching ? (
                     <div className="flex items-center justify-center gap-3">
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Calculating Match...
                     </div>
                   ) : 'Start Intelligence Scan'}
                 </button>
                 <button 
                  onClick={() => setShowJdModal(false)} 
                  className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95"
                 >
                    Cancel
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
