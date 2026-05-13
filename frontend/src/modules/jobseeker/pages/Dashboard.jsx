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
  XCircle
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
          setProfile(profileRes?.profile || {});
          setJobs(recsRes?.recommendations || []);
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
      
      // Use the analysis already performed by the backend during upload
      const finalData = {
        optimizationScore: Math.round(resume.ats_score || 0),
        parsedData: {
          skills: resume.parsed_data?.skills || resume.skills || [],
          experienceYears: resume.parsed_data?.experience_years || resume.experience_years || 0,
          projects: resume.parsed_data?.projects || [],
          education: resume.parsed_data?.education || []
        },
        atsDetails: {
          ats_score: resume.ats_score,
          breakdown: resume.ats_breakdown || {},
          missing_keywords: resume.missing_skills || []
        },
        atsBreakdown: resume.ats_breakdown || {},
        missingSkills: resume.missing_skills || [],
        matchedSkills: resume.matched_skills || [],
        rawText: resume.raw_text || ''
      };

      if (updateResumeData) {
        updateResumeData(finalData);
      }
      showToast("Resume uploaded & analyzed successfully! 🚀");
      
      // Refresh profile from backend to get updated ats_score & breakdown
      if (userId) {
         const profileRes = await fetchJobSeekerProfile(userId);
         setProfile(profileRes?.profile || {});
      }
    } catch (err) {
      console.error("Resume Upload Error:", err);
      const errorData = err.response?.data || (err instanceof Error ? null : err);
      let errMsg = errorData?.message || errorData?.error || errorData?.detail || err.message || "Unknown error";
      
      // If detail is an array of errors (FastAPI style), extract the first one
      if (Array.isArray(errorData?.detail) && errorData.detail.length > 0) {
        const firstError = errorData.detail[0];
        errMsg = `${firstError.msg || 'Invalid data'} in ${firstError.loc?.join(' > ') || 'request'}`;
      }
      
      showToast(`Resume processing failed: ${errMsg} ❌`, "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── REAL DATA EXTRACTION ──────────────────────────────────────────────
  // Priority: profile (backend DB) → resumeData (context/localStorage) → 0/empty
  const score = profile?.ats_score ?? resumeData?.optimizationScore ?? 0;
  const hasData = score > 0;

  // ATS Breakdown — from profile (set by backend on upload) or from resumeData context
  const profileBreakdown = profile?.ats_breakdown || {};
  const contextBreakdown = resumeData?.atsBreakdown || resumeData?.atsDetails?.breakdown || {};
  const breakdown = Object.keys(profileBreakdown).length > 0 ? profileBreakdown : contextBreakdown;

  // Skills from profile or context
  const userSkills = (profile?.skills?.length > 0 ? profile.skills : null)
    || (resumeData?.parsedData?.skills?.length > 0 ? resumeData.parsedData.skills : null)
    || [];

  // Missing skills from profile or context
  const missingSkills = (profile?.missing_skills?.length > 0 ? profile.missing_skills : null)
    || (resumeData?.missingSkills?.length > 0 ? resumeData.missingSkills : null)
    || [];

  // Recommended skills based on what user already has
  const getSkillRecommendations = (skills = []) => {
    const recommendations = new Set();
    const lowerSkills = skills.map(s => s.toLowerCase());
    
    if (lowerSkills.includes('java')) ['Spring Boot', 'Hibernate'].forEach(s => recommendations.add(s));
    if (lowerSkills.includes('react')) ['Next.js', 'Redux'].forEach(s => recommendations.add(s));
    if (lowerSkills.includes('python')) ['Django', 'FastAPI'].forEach(s => recommendations.add(s));
    if (lowerSkills.includes('node.js') || lowerSkills.includes('node')) ['Express', 'MongoDB'].forEach(s => recommendations.add(s));
    if (lowerSkills.includes('javascript') || lowerSkills.includes('js')) ['TypeScript', 'Node.js'].forEach(s => recommendations.add(s));
    if (lowerSkills.includes('c++') || lowerSkills.includes('c')) ['Rust', 'Go'].forEach(s => recommendations.add(s));
    if (lowerSkills.includes('sql') || lowerSkills.includes('mysql')) ['PostgreSQL', 'Redis'].forEach(s => recommendations.add(s));
    if (lowerSkills.includes('html') || lowerSkills.includes('css')) ['React', 'Tailwind CSS'].forEach(s => recommendations.add(s));
    
    // Remove skills user already has
    lowerSkills.forEach(s => {
      recommendations.forEach(r => {
        if (r.toLowerCase() === s) recommendations.delete(r);
      });
    });
    
    if (recommendations.size === 0) ['Docker', 'AWS', 'TypeScript'].forEach(s => recommendations.add(s));
    
    return Array.from(recommendations).slice(0, 4);
  };

  const recommendedSkills = (profile?.recommended_skills?.length > 0)
    ? profile.recommended_skills 
    : getSkillRecommendations(userSkills);
  const displayJobs = jobs.length > 0 ? jobs.slice(0, 4) : [];

  // ATS metrics — keys match backend scorer: skills, experience, projects, education, certifications
  const atsMetrics = [
    { label: 'Skills', val: Math.round(breakdown.skills ?? 0), color: 'bg-blue-600' },
    { label: 'Experience', val: Math.round(breakdown.experience ?? 0), color: 'bg-indigo-600' },
    { label: 'Projects', val: Math.round(breakdown.projects ?? 0), color: 'bg-amber-600' },
    { label: 'Education', val: Math.round(breakdown.education ?? 0), color: 'bg-purple-600' },
    { label: 'Certifications', val: Math.round(breakdown.certifications ?? 0), color: 'bg-emerald-600' }
  ];

  return (
    <div className="space-y-5 pt-4">
      <input type="file" ref={fileInputRef} onChange={handleResumeUpload} accept=".pdf,.docx" className="hidden" />

      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Dashboard</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Your resume score & job matches</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/platform/jobseeker/jobs')}
            variant="secondary" 
            className="h-10 px-4 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 shadow-sm"
          >
            <Search size={14} /> Search Jobs
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="h-10 px-5 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20">
            {isUploading ? <Loader size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {isUploading ? 'Analyzing...' : 'Upload Resume'}
          </Button>
        </div>
      </div>

      {/* NO RESUME UPLOADED — PROMPT */}
      {!hasData && !loading && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 border border-slate-700 rounded-2xl p-8 text-white text-center shadow-xl">
          <div className="size-14 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UploadCloud size={28} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">Upload Your Resume</h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] max-w-md mx-auto leading-relaxed mb-5">
            Upload your resume to get a real ATS score, skill gap analysis, and personalized job recommendations.
          </p>
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="h-11 px-7 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/30 mx-auto">
            {isUploading ? <Loader size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {isUploading ? 'Analyzing...' : 'Upload Resume'}
          </Button>
        </div>
      )}

      {/* 2. ATS ANALYSIS CARD — REAL DATA */}
      {hasData && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col xl:flex-row">
          
          {/* SECTION 1: ATS OVERVIEW */}
          <div className="xl:w-[42%] p-5 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 space-y-5 bg-slate-50/30 dark:bg-slate-800/10">
            <div className="flex items-center gap-3">
               <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                  <Star size={16} />
               </div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">ATS Score</h2>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative size-24 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path className={score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-rose-500"} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${score}, 100`} strokeLinecap="round" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round(score)}%</span>
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tight">
                  {score >= 70 ? 'Strong Profile' : score >= 40 ? 'Needs Improvement' : 'Optimization Required'}
                </p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Target: 95% for Elite Rank</p>
                {userSkills.length > 0 && (
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">{userSkills.length} Skills Detected</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {atsMetrics.map(m => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-slate-900 dark:text-white">{m.val}%</span>
                  </div>
                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} transition-all duration-700`} style={{ width: `${m.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: SKILL INSIGHTS — REAL DATA */}
          <div className="xl:w-[58%] p-5 space-y-5">
            <div className="flex items-center gap-3">
               <div className="size-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-500/10">
                  <Sparkles size={16} />
               </div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Skill Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Part A: Missing Skills — REAL */}
              <div className="space-y-3">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-100 dark:border-rose-900/30 pb-2">
                  Missing Skills {missingSkills.length > 0 && `(${missingSkills.length})`}
                </p>
                <div className="space-y-2">
                  {missingSkills.length > 0 ? (
                    missingSkills.slice(0, 5).map(skill => (
                      <div key={skill} className="flex items-center gap-2.5 group">
                        <XCircle size={13} className="text-rose-400 group-hover:text-rose-600 transition-colors" />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{skill}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">Upload a resume to detect gaps</p>
                  )}
                </div>
              </div>

              {/* Part B: Recommended Skills — COMPUTED */}
              <div className="space-y-3">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] border-b border-blue-100 dark:border-blue-900/30 pb-2">Recommended Skills</p>
                <div className="space-y-2">
                  {recommendedSkills.map(skill => (
                    <div key={skill} className="flex items-center gap-2.5 group">
                      <div className="animate-pulse">
                        <Zap size={13} className="text-amber-500 fill-amber-500" />
                      </div>
                      <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wide">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detected Skills Preview */}
            {userSkills.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Your Skills ({userSkills.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.slice(0, 12).map(skill => (
                    <span key={skill} className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100 dark:border-blue-800/30">
                      {skill}
                    </span>
                  ))}
                  {userSkills.length > 12 && (
                    <span className="text-[9px] font-bold text-slate-400 px-2.5 py-1">+{userSkills.length - 12} more</span>
                  )}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => navigate('/platform/jobseeker/learning')} className="w-full h-10 gap-2 text-[9px] font-black uppercase tracking-[0.2em] bg-slate-900 dark:bg-black text-white hover:bg-slate-800 rounded-xl transition-all">
                View Learning <ArrowRight size={13} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECOMMENDED JOBS — VERTICAL LIST FEED */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Recommended Jobs</h2>
            <div className="h-0.5 w-8 bg-blue-600 rounded-full mt-1"></div>
          </div>
          <Button onClick={() => navigate('/platform/jobseeker/jobs')} variant="secondary" className="h-8 px-4 gap-2 text-[10px] font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800 rounded-lg">
            View All <ArrowRight size={12} />
          </Button>
        </div>

        <div className="space-y-2.5">
          {displayJobs.length > 0 ? displayJobs.map((job, idx) => {
            const match = job.matchScore || job.match_score || 0;
            const jobSkills = job.required_skills || job.skills || [];
            const matchedJobSkills = jobSkills.filter(s => userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
            const missingJobSkills = jobSkills.filter(s => !userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
            return (
              <div 
                key={job.id || idx} 
                className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-xl p-4 hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="size-11 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-lg text-blue-600 transition-transform group-hover:scale-105">
                    {job.company?.[0] || 'T'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{job.company || 'Company'}</span>
                       <span className="text-slate-300">•</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                         <MapPin size={11} className="text-slate-400" /> {job.location || 'Remote'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Match Info */}
                  <div className="flex flex-col items-center px-4 border-x border-slate-50 dark:border-slate-800">
                    <span className={`text-lg font-black tracking-tighter ${match >= 70 ? 'text-emerald-600' : match >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{Math.round(match)}%</span>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Match</span>
                  </div>

                  {/* Tech Stack Hints — REAL */}
                  <div className="hidden lg:flex items-center gap-1.5">
                    {matchedJobSkills.length > 0 && (
                      <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                        ✓ {matchedJobSkills.slice(0, 3).join(', ')}
                      </span>
                    )}
                    {missingJobSkills.length > 0 && (
                      <span className="text-[8px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest border border-rose-100 dark:border-rose-500/20">
                        ✗ {missingJobSkills.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate(`/platform/jobseeker/companies/${job.id}`)} 
                      className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Details
                    </Button>
                    <Button 
                      onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)} 
                      className="h-9 px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-blue-500/10 hover:shadow-blue-500/20"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            );
          }) : (
            !loading && (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Briefcase size={28} className="text-slate-200 mx-auto mb-3" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {hasData ? 'No matching jobs found yet' : 'Upload resume to see matched jobs'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
