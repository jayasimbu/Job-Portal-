import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { getCurrentUserId } from '../../../core/auth/session';
import { fetchJobSeekerProfile, fetchRecommendations } from '../services/jobseekerService';
import { useAIAnalysis } from '../../../hooks/useAIAnalysis';
import { useToast } from '../../../core/context/ToastContext';
import { 
  Plus, 
  UploadCloud, 
  RefreshCw, 
  Search, 
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import StatCard from '../../../components/shared/StatCard';
import ATSScoreCard from '../../../components/shared/ATSScoreCard';
import JobCard from '../../../components/shared/JobCard';
import EmptyState from '../../../components/shared/EmptyState';
import SectionTitle from '../../../components/shared/SectionTitle';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import SkillBadge from '../../../components/shared/SkillBadge';
import Button from '../../../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const { resumeData, updateResumeData } = useResume();
  const { showToast } = useToast();
  const { isAnalyzing, analyzeResume, error: analysisError } = useAIAnalysis();
  
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const loadDashboardData = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const [profileRes, recsRes] = await Promise.all([
        fetchJobSeekerProfile(userId),
        fetchRecommendations(userId)
      ]);
      
      setProfile(profileRes?.profile || {});
      setJobs(recsRes?.recommendations || []);
    } catch (err) {
      console.error("[Dashboard] Load error:", err);
      showToast("Failed to sync dashboard data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const result = await analyzeResume(file);
    if (result) {
      showToast("Resume analyzed and profile updated! 🚀");
      
      // Update global context
      if (updateResumeData) {
        updateResumeData({
          optimizationScore: Math.round(result.resume?.ats_score || 0),
          parsedData: result.resume?.parsed_data || {},
          atsDetails: {
            breakdown: result.resume?.ats_breakdown || {},
            missing_keywords: result.resume?.missing_skills || []
          }
        });
      }
      
      // Refresh local data
      loadDashboardData();
    } else if (analysisError) {
      showToast(analysisError, "error");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Data Extraction logic
  const atsScore = profile?.ats_score || 0;
  const breakdown = profile?.ats_breakdown || {};
  const userSkills = profile?.skills || [];
  const missingSkills = profile?.missing_skills || [];
  const recommendedSkills = profile?.recommended_skills || ["System Design", "Cloud Architecture", "Advanced React"];

  if (isLoading) {
    return (
      <div className="space-y-8 pt-4">
        <LoadingSkeleton type="stats" count={4} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <LoadingSkeleton type="card" count={3} />
          </div>
          <LoadingSkeleton type="card" count={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleResumeUpload} 
        accept=".pdf,.docx" 
        className="hidden" 
      />

      <PageHeader 
        title="Dashboard" 
        subtitle="Manage your recruitment pipeline and AI-powered insights."
        action={
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/platform/jobseeker/jobs')}
              className="rounded-xl"
            >
              <Search size={18} /> Explore Jobs
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isAnalyzing}
              className="rounded-xl shadow-lg shadow-primary/20"
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <UploadCloud size={18} />}
              {isAnalyzing ? 'Analyzing...' : 'Update Resume'}
            </Button>
          </div>
        }
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Stats and Match Insights */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              title="Profile Strength" 
              value={`${Math.round(atsScore)}%`} 
              icon={Sparkles}
              trend={atsScore >= 70 ? "+12%" : undefined}
              trendType={atsScore >= 70 ? "positive" : "neutral"}
            />
            <StatCard 
              title="Job Matches" 
              value={jobs.length} 
              icon={Zap}
            />
          </div>

          {/* Recommended Jobs */}
          <div className="space-y-6">
            <SectionTitle 
              title="Recommended for You" 
              description="AI-matched roles based on your verified skill set."
              action={
                <Button variant="ghost" onClick={() => navigate('/platform/jobseeker/jobs')}>
                  View All
                </Button>
              }
            />
            
            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.slice(0, 4).map(job => (
                  <JobCard 
                    key={job.id || job._id} 
                    job={{
                      title: job.title,
                      company: job.company || "Tech Enterprise",
                      location: job.location || "Remote",
                      type: job.type || "Full-time",
                      salary: job.salary || "$70k - $120k",
                      matchedSkills: job.matched_skills || [],
                      missingSkills: job.missing_skills || []
                    }}
                    matchScore={job.match_score || 0}
                    onApply={() => navigate(`/platform/jobseeker/jobs/${job.id || job._id}`)}
                  />
                ))
              ) : (
                <EmptyState 
                  title="No matches yet" 
                  description="Complete your profile or upload a fresh resume to see AI job matches."
                  action={
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Upload Resume
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: ATS Breakdown & Skill Gaps */}
        <div className="space-y-8">
          
          {/* ATS Score Detailed Breakdown */}
          <ATSScoreCard 
            score={Math.round(atsScore)} 
            breakdown={{
              skills: breakdown.skills || 0,
              experience: breakdown.experience || 0,
              projects: breakdown.projects || 0,
              education: breakdown.education || 0,
              certs: breakdown.certifications || 0
            }} 
          />

          {/* Skill Intelligence Card */}
          <div className="card-premium p-6 space-y-6">
            <SectionTitle 
              title="Skill Intelligence" 
              description="Gaps detected between you and target roles."
            />

            {/* Missing Skills */}
            <div className="space-y-4">
              <p className="caption text-danger">Missing High-Impact Skills</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map(skill => (
                    <SkillBadge key={skill} name={skill} type="warning" />
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-success body-sm font-semibold">
                    <CheckCircle2 size={16} /> All target skills matched!
                  </div>
                )}
              </div>
            </div>

            {/* Growth Areas */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <p className="caption text-primary">Recommended for Growth</p>
              <div className="flex flex-wrap gap-2">
                {recommendedSkills.map(skill => (
                  <SkillBadge key={skill} name={skill} type="primary" />
                ))}
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-gray-900 text-white hover:bg-black rounded-xl"
              onClick={() => navigate('/platform/jobseeker/learning')}
            >
              Explore Learning Paths
            </Button>
          </div>

          {/* Quick Tips */}
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
            <AlertCircle className="text-primary shrink-0" size={20} />
            <p className="body-sm text-blue-800 leading-relaxed">
              <strong>Pro Tip:</strong> Verified projects increase your match visibility by <strong>35%</strong>. Check your project dashboard to link GitHub.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
