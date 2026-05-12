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
  CloudUpload,
  Loader2
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
      const resume = uploadData.resume || uploadData.data?.resume || {};
      
      const atsResp = await apiClient.post('/jobseeker/ats/resume', {
        resume_text: resume.resume_text || '',
        skills: resume.skills || [],
        experience_years: resume.experience_years || 0
      });

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

      if (updateResumeData) {
        updateResumeData(finalData);
      }
      showToast("Resume uploaded & analyzed successfully! 🚀");
      
      // Refresh profile data to get updated score
      if (userId) {
         const profileRes = await fetchJobSeekerProfile(userId);
         setProfile(profileRes?.profile || {});
      }
    } catch (err) {
      console.error("Resume Upload Error:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.detail || err.message || "Unknown error";
      showToast(`Resume processing failed: ${errMsg} ❌`, "error");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const score = resumeData?.optimizationScore || profile?.ats_score || 82;

  // Fallback jobs for structural display if none returned
  const displayJobs = jobs.length > 0 ? jobs.slice(0, 4) : [
    { id: 1, title: 'Frontend Developer', company: 'Zoho', location: 'Chennai', matchScore: 87, matched: ['React', 'Tailwind'], missing: ['Docker'] },
    { id: 2, title: 'UI Engineer', company: 'Freshworks', location: 'Chennai', matchScore: 84, matched: ['JavaScript', 'CSS'], missing: ['GraphQL'] },
    { id: 3, title: 'React Developer', company: 'Chargebee', location: 'Remote', matchScore: 79, matched: ['React', 'Redux'], missing: ['Next.js'] },
    { id: 4, title: 'Software Engineer (Frontend)', company: 'Postman', location: 'Bangalore', matchScore: 76, matched: ['JavaScript'], missing: ['TypeScript'] },
  ];

  const recentApps = [
    { title: 'Frontend Developer', status: 'Under Review', time: 'Applied 2 days ago' },
    { title: 'React Engineer', status: 'Screening', time: 'Applied 5 days ago' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-8">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleResumeUpload} 
        accept=".pdf,.docx" 
        className="hidden" 
      />

      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Career Workspace</h1>
        <Button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUploading}
          className="h-10 px-5 rounded-xl shadow-sm font-semibold tracking-wide"
        >
          {isUploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CloudUpload size={16} />
          )}
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </Button>
      </div>

      {/* 2. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Resume Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FileText size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Resume Score</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{score}%</div>
          <p className="text-xs text-slate-500 mt-1">Optimization level.</p>
        </div>

        {/* Card 2: Recommended Jobs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Recommended</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{displayJobs.length > 3 ? '18' : displayJobs.length} Matches</div>
          <p className="text-xs text-slate-500 mt-1">Jobs fitting your profile.</p>
        </div>

        {/* Card 3: Applications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Send size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Applications</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{recentApps.length} Active</div>
          <p className="text-xs text-slate-500 mt-1">Under review.</p>
        </div>

        {/* Card 4: Skills to Improve */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Skills to Improve</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white truncate">Docker, AWS</div>
          <p className="text-xs text-slate-500 mt-1">Based on missing matches.</p>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended Jobs</h2>
          <button 
            onClick={() => navigate('/platform/jobseeker/jobs')} 
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View All Jobs <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayJobs.map((job, idx) => {
            const match = job.matchScore || job.match_score || 80;
            const matchedSkills = job.matched || ['React', 'Tailwind'];
            const missingSkills = job.missing || ['Docker'];
            
            return (
              <div key={job.id || idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{job.company || 'Tech Corp'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || 'Remote'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
                        {Math.round(match)}% Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Matched</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{matchedSkills.join(' • ')}</span>
                      </p>
                    </div>
                    <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missing</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <AlertCircle size={14} className="text-rose-500 shrink-0" />
                        <span className="truncate">{missingSkills.join(' • ')}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    variant="secondary" 
                    className="w-full sm:w-auto px-6 h-10 text-sm font-semibold"
                    onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                  >
                    View Job Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
