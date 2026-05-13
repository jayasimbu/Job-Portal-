import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { getCurrentUserId } from '../../../core/auth/session';
import appConfig from '../../../core/config/appConfig';
import { fetchJobSeekerProfile, fetchRecommendations } from '../services/jobseekerService';
import apiClient from '../../../core/api/apiClient';
import { useToast } from '../../../core/context/ToastContext';
import { 
  FileText, 
  Briefcase, 
  Send, 
  TrendingUp, 
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Loader,
  Zap,
  Star,
  LayoutGrid,
  Search,
  Sparkles,
  XCircle,
  Trash2
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const { resumeData, updateResumeData } = useResume();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (userId) {
          const profileRes = await fetchJobSeekerProfile(userId);
          const recsRes = await fetchRecommendations(userId);
          setProfile(profileRes?.data?.profile || {});
          setJobs(recsRes?.data?.recommendations || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', String(userId));
      formData.append('job_description', '');

      const token = localStorage.getItem(appConfig.auth.tokenStorageKey);
      const uploadResp = await fetch(`${appConfig.api.baseUrl}/jobseeker/resume/upload-file`, {
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
      const resume = uploadData.resume || uploadData.data?.resume || uploadData.data || {};
      
      // Refresh profile to get NEW AI-generated gaps & recs
      const profileRes = await fetchJobSeekerProfile(userId);
      const updatedProfile = profileRes?.profile || {};
      setProfile(updatedProfile);

      const finalData = {
        hasResume: true,
        optimizationScore: Math.round(resume.ats_score || 0),
        missingSkills: updatedProfile.missing_skills || resume.missing_skills || [],
        recommendedSkills: updatedProfile.recommended_skills || resume.recommended_skills || [],
        parsedData: {
          skills: updatedProfile.skills || resume.skills || [],
          experience_years: updatedProfile.experience_years || resume.experience_years || 0,
        },
      };

      if (updateResumeData) {
        updateResumeData(finalData);
      }
      showToast("Resume analyzed with Cloud AI! 🚀");
    } catch (err) {
      console.error("Resume Upload Error:", err);
      showToast("Resume processing failed. ❌", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResumeDelete = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume? This will clear your AI insights.")) return;
    
    try {
      setIsUploading(true);
      await apiClient.delete(`/jobseeker/resume/${resumeId}`);
      
      // Reset local state
      const profileRes = await fetchJobSeekerProfile(userId);
      setProfile(profileRes?.profile || {});
      
      if (updateResumeData) {
        updateResumeData({ hasResume: false });
      }
      showToast("Resume deleted successfully! 🗑️");
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Failed to delete resume.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const hasResume = profile?.hasResume || resumeData?.hasResume || false;
  const score = hasResume ? (profile?.ats_score ?? resumeData?.optimizationScore ?? 0) : 0;
  const hasData = hasResume && score > 0;

  const breakdown = hasResume ? (profile?.ats_breakdown || resumeData?.atsBreakdown || {}) : {};
  const userSkills = hasResume ? (profile?.skills || resumeData?.parsedData?.skills || []) : [];
  
  const missingSkills = hasResume ? (profile?.missing_skills || resumeData?.missingSkills || []) : [];
  const recommendedSkills = hasResume ? (profile?.recommended_skills || resumeData?.recommendedSkills || []) : [];

  const displayJobs = jobs.length > 0 ? jobs.slice(0, 4) : [];

  const atsMetrics = [
    { label: 'Skills', val: Math.round(breakdown.skills ?? 0), color: 'bg-blue-600' },
    { label: 'Experience', val: Math.round(breakdown.experience ?? 0), color: 'bg-indigo-600' },
    { label: 'Projects', val: Math.round(breakdown.projects ?? 0), color: 'bg-amber-600' },
    { label: 'Education', val: Math.round(breakdown.education ?? 0), color: 'bg-purple-600' },
    { label: 'Certifications', val: Math.round(breakdown.certifications ?? 0), color: 'bg-emerald-600' }
  ];

  return (
    <div className="space-y-3 pt-2">
      <input type="file" ref={fileInputRef} onChange={handleResumeUpload} accept=".pdf,.docx" className="hidden" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Dashboard</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">AI-Powered Career Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="h-10 px-5 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20">
            {isUploading ? <Loader size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {isUploading ? 'AI Analyzing...' : 'Upload Resume'}
          </Button>
        </div>
      </div>

      {!hasData && !loading && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 text-white text-center shadow-xl">
          <div className="size-14 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">Initialize Your Profile</h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-5">Upload your resume to activate Cloud AI Analysis.</p>
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="mx-auto h-11 px-7 rounded-xl font-bold text-[11px] uppercase tracking-widest">
            {isUploading ? 'Analyzing...' : 'Get Started'}
          </Button>
        </div>
      )}

      {hasData && (
        <div className="flex flex-col gap-4">
          {/* ACTIVE RESUME INDICATOR */}
          <div className="bg-blue-600/5 border border-blue-200/50 dark:border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Active Intelligence Source</h3>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate pr-4">
                  {profile?.uploadedResumes?.[0]?.file_name || "Latest Resume Analysis"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
               <div className="hidden sm:flex items-center gap-2">
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                   Analyzed: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Just now'}
                 </span>
                 <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
               </div>
               
               <div className="flex items-center gap-1.5">
                 <button onClick={() => fileInputRef.current?.click()} className="h-8 px-3 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600/10 transition-colors">Replace</button>
                 {profile?.uploadedResumes?.[0]?.id && (
                    <button 
                      onClick={() => handleResumeDelete(profile.uploadedResumes[0].id)}
                      className="size-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 size={14} />
                    </button>
                 )}
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col xl:flex-row">
            
            {/* ATS SECTION */}
            <div className="xl:w-[42%] p-5 border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-700 space-y-5">
              <div className="flex items-center gap-3 text-slate-400">
                <Star size={16} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">ATS Analysis</h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative size-24">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" className="text-blue-600" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{Math.round(score)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black uppercase">{score >= 70 ? 'Strong Match' : 'Needs Optimization'}</p>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">AI Verified Profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {atsMetrics.map(m => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                      <span>{m.label}</span>
                      <span className="text-slate-900 dark:text-white">{m.val}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${m.color}`} style={{ width: `${m.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SKILL ANALYSIS SECTION */}
            <div className="xl:w-[58%] p-5 space-y-5 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-3 text-slate-400">
                <Sparkles size={16} className="text-blue-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Cloud AI Insights</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Missing Skills */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-100 dark:border-rose-900/30 pb-2">Missing Skills</p>
                  <div className="space-y-2.5">
                    {missingSkills.length > 0 ? missingSkills.slice(0, 5).map(skill => (
                      <div key={skill} className="flex items-center gap-2">
                        <XCircle size={14} className="text-rose-400" />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">{skill}</span>
                      </div>
                    )) : (
                      <div className="animate-pulse flex items-center gap-2 text-slate-300">
                        <Loader size={12} className="animate-spin" />
                        <span className="text-[10px] italic">Recalculating gaps...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Skills */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] border-b border-blue-100 dark:border-blue-900/30 pb-2">Top Recommendations</p>
                  <div className="space-y-2.5">
                    {recommendedSkills.length > 0 ? recommendedSkills.slice(0, 5).map(skill => (
                      <div key={skill} className="flex items-center gap-2 group">
                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase group-hover:text-blue-600 transition-colors">{skill}</span>
                      </div>
                    )) : (
                      <div className="animate-pulse flex items-center gap-2 text-slate-300">
                        <Loader size={12} className="animate-spin" />
                        <span className="text-[10px] italic">Optimizing recs...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Skills */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Detected Skills ({userSkills.length})</p>
                <div className="flex flex-wrap gap-2">
                  {userSkills.slice(0, 10).map(skill => (
                    <span key={skill} className="text-[9px] font-bold px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg uppercase text-slate-600 dark:text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <Button onClick={() => navigate('/platform/jobseeker/learning')} className="w-full h-11 bg-slate-900 dark:bg-black text-white font-bold text-[10px] uppercase tracking-widest rounded-xl">
                Launch Learning Roadmap <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RECOMMENDED JOBS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tight">Personalized Matches</h2>
          <Button onClick={() => navigate('/platform/jobseeker/jobs')} variant="secondary" className="h-8 text-[10px] uppercase font-bold">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayJobs.map((job, idx) => (
            <div key={job.id || idx} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between group hover:border-blue-500 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-blue-600">{job.company?.[0] || 'J'}</div>
                <div>
                  <h3 className="text-sm font-black uppercase leading-none">{job.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{job.company}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-blue-600 leading-none">{Math.round(job.match_score || 0)}%</div>
                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Match</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
