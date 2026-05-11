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

// Import Global UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

// Import Jobseeker Specific Components
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

  const userSkills = resumeData?.parsedData?.skills || dashboardStats?.skills || [];
  const recommendedSkills = (resumeData?.atsDetails?.missing_keywords || resumeInsights?.missing_keywords) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Heading level={1}>Career Dashboard</Heading>
          <Text variant="lead">Manage your professional identity and AI insights.</Text>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/platform/jobseeker/profile')}>
            <span className="material-symbols-outlined mr-2">settings</span>
            Profile Settings
          </Button>
          <Button onClick={() => setShowJdModal(true)}>
            <span className="material-symbols-outlined mr-2">target</span>
            New JD Match
          </Button>
        </div>
      </div>

      {/* ROW 1: SCORE & MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ATS SCORE CARD */}
        <Card className="lg:col-span-8">
          <CardBody className="flex flex-col md:flex-row justify-between gap-8 p-10">
            <div className="space-y-10 flex-1">
              <div className="flex gap-16">
                <StatCard label="ATS Optimization" value={stats.atsScore} suffix="%" />
                <StatCard label="Market Alignment" value={stats.marketFit} suffix="%" color="text-emerald-600" />
              </div>

              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate('/platform/jobseeker/resume-analysis')} size="lg">
                  Detailed Analysis
                </Button>
                <Button variant="secondary" onClick={() => setShowJdModal(true)} size="lg">
                  Improve Score
                </Button>
              </div>

              <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">
                Last Intelligence Scan: {resumeData?.optimizationScore ? "Just Now" : "Today, 10:45 AM"}
              </Text>
            </div>
            
            <div className="flex items-center justify-center bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <ATSCircle value={stats.atsScore} size={160} />
            </div>
          </CardBody>
        </Card>

        {/* RESUME MANAGEMENT CARD */}
        <Card className="lg:col-span-4 bg-blue-600 text-white border-none shadow-blue-200">
          <CardBody className="flex flex-col justify-between h-full p-10 space-y-8">
            <div className="space-y-1">
              <Text variant="small" className="font-bold uppercase tracking-widest text-blue-100">Resume Status</Text>
              <Heading level={3} className="text-white">Live Intelligence</Heading>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="group relative flex flex-col items-center justify-center w-full aspect-square bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 rounded-3xl transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <Text className="text-white font-bold text-xs uppercase tracking-widest">{analysisStep}</Text>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl mb-2 group-hover:-translate-y-1 transition-transform">cloud_upload</span>
                    <Text className="text-white font-bold text-xs uppercase tracking-widest text-center">Upload PDF Resume</Text>
                  </>
                )}
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleResumeUpload} />
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-blue-200">
              <span>Updated: {dashboardStats?.resume_updated_at || "May 11"}</span>
              <span className="flex items-center gap-1">
                <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                Active
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ROW 2: SKILLS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* YOUR SKILLS */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <SectionHeader title="Your Profile Skills" icon="verified" iconColor="text-emerald-600" bgColor="bg-emerald-50" />
            <Badge variant="success">{userSkills.length} Total</Badge>
          </CardHeader>
          <CardBody className="min-h-[200px]">
            <div className="flex flex-wrap gap-2.5">
              {userSkills.length > 0 ? (
                userSkills.map(skill => (
                  <SkillChip key={skill} label={skill} variant="success" />
                ))
              ) : (
                <Text variant="small">No skills extracted yet. Please upload a resume.</Text>
              )}
            </div>
          </CardBody>
        </Card>

        {/* RECOMMENDED SKILLS */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <SectionHeader title="Missing & Target Skills" icon="lightbulb" iconColor="text-amber-600" bgColor="bg-amber-50" />
            <Badge variant="warning">Top Growth Area</Badge>
          </CardHeader>
          <CardBody className="min-h-[200px]">
            <div className="flex flex-wrap gap-2.5">
              {recommendedSkills.length > 0 ? (
                recommendedSkills.map(skill => (
                  <SkillChip key={skill} label={skill} variant="warning" />
                ))
              ) : (
                <Text variant="small">Complete your profile to see skill recommendations.</Text>
              )}
            </div>
          </CardBody>
          <CardFooter className="bg-amber-50/30">
             <Button variant="ghost" size="sm" className="text-amber-700" onClick={() => navigate('/platform/jobseeker/learning')}>
                View Learning Roadmap
                <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
             </Button>
          </CardFooter>
        </Card>
      </div>

      {/* ROW 3: RECOMMENDED JOBS */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <Heading level={2}>AI-Matched Opportunities</Heading>
            <Text>Jobs curated based on your current skill profile and market fit.</Text>
          </div>
          <Button variant="outline" onClick={() => navigate('/platform/jobseeker/jobs')}>
            Marketplace
            <span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((job, i) => (
              <JobCard 
                key={i} 
                job={job} 
                onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}/analysis`)}
              />
            ))
          ) : (
            [1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardBody className="h-[300px] bg-slate-50/50" />
              </Card>
            ))
          )}
        </div>
      </div>

      {/* JD MATCH MODAL */}
      {showJdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
           <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
              <CardHeader className="flex justify-between items-center">
                 <SectionHeader title="Targeted JD Analysis" icon="ads_click" />
                 <button 
                  onClick={() => setShowJdModal(false)} 
                  className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                 >
                    <span className="material-symbols-outlined text-slate-400">close</span>
                 </button>
              </CardHeader>
              
              <CardBody className="space-y-6">
                 <div className="space-y-2">
                    <Text variant="small" className="font-bold uppercase tracking-widest text-slate-500">Job Description Content</Text>
                    <textarea 
                      rows={10} 
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all resize-none"
                      placeholder="Paste the job description here to see your exact match score..."
                    />
                 </div>
              </CardBody>

              <CardFooter className="flex gap-4">
                 <Button 
                  onClick={handleJdMatch}
                  disabled={isMatching}
                  className="flex-1"
                  size="lg"
                 >
                   {isMatching ? (
                     <div className="flex items-center justify-center gap-3">
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Match...
                     </div>
                   ) : 'Start Intelligence Scan'}
                 </Button>
                 <Button 
                  variant="secondary"
                  onClick={() => setShowJdModal(false)} 
                  size="lg"
                 >
                    Cancel
                 </Button>
              </CardFooter>
           </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
