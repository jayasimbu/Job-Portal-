import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Mail, 
  MessageSquare, 
  Download, 
  FileText,
  ChevronLeft,
  Calendar,
  Briefcase,
  MapPin,
  Zap,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useCandidateAnalysis } from '../../../hooks/useCandidateAnalysis';
import { useToast } from '../../../core/context/ToastContext';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import ATSScoreCard from '../../../components/shared/ATSScoreCard';
import SectionTitle from '../../../components/shared/SectionTitle';
import SkillBadge from '../../../components/shared/SkillBadge';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import Button from '../../../components/ui/Button';

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAnalyzing, getAIVerdict, updateCandidateStatus } = useCandidateAnalysis();
  
  const [candidate, setCandidate] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // In a real app, we'd fetch the candidate detail + AI analysis
    // For now, simulating the fetch
    const fetchFullProfile = async () => {
      // Mock data for demo consistency
      const mockCandidate = {
        id,
        name: "Arjun R",
        role: "Frontend Developer",
        email: "arjun.r@example.com",
        location: "Chennai, India",
        experience: "3",
        skills: ["React", "TypeScript", "Tailwind", "Redux", "Jest", "Vite", "Node.js"],
        education: "B.Tech Computer Science",
        summary: "Specialist in high-performance React applications and scalable design systems.",
        applied_at: "Oct 12, 2023"
      };
      
      setCandidate(mockCandidate);
      
      // Get AI verdict (simulated if needed)
      const verdict = await getAIVerdict(id, 'current_job_id');
      setAnalysis(verdict || {
        match_percentage: 92,
        breakdown: { skills: 95, experience: 85, projects: 90, education: 80, certs: 70 },
        matched_skills: ["React", "TypeScript", "Tailwind", "Redux"],
        missing_skills: ["Docker", "AWS"],
        feedback: "Exceptional candidate for modern frontend roles. Strong proficiency in core stack. Minor gap in infrastructure/DevOps tools."
      });
    };

    fetchFullProfile();
  }, [id, getAIVerdict]);

  const handleStatusUpdate = async (status) => {
    const success = await updateCandidateStatus(id, status);
    if (success) {
      showToast(`Candidate ${status === 'shortlisted' ? 'Shortlisted' : 'Rejected'} successfully!`);
      if (status === 'rejected') navigate('/platform/employer/candidates');
    }
  };

  if (!candidate || isAnalyzing) return <LoadingSkeleton type="profile" count={1} />;

  return (
    <div className="space-y-8 pt-4 pb-20">
      
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-bold text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Pipeline
        </button>
        <div className="flex items-center gap-3">
           <Button variant="secondary" className="rounded-xl h-9 px-4 text-[10px] uppercase font-black tracking-widest">
              <Download size={14} className="mr-2" /> Resume
           </Button>
           <Button variant="secondary" className="rounded-xl h-9 px-4 text-[10px] uppercase font-black tracking-widest">
              <ExternalLink size={14} className="mr-2" /> Portfolio
           </Button>
        </div>
      </div>

      {/* Header Profile */}
      <div className="card-premium p-8 flex flex-col md:flex-row items-center gap-10">
        <div className="size-32 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary text-4xl font-black border border-primary/20 shrink-0">
           {candidate.name[0]}
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
           <div>
             <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{candidate.name}</h1>
             <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mt-1">{candidate.role}</p>
           </div>
           <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
             <span className="flex items-center gap-2"><MapPin size={14} className="text-danger" /> {candidate.location}</span>
             <span className="flex items-center gap-2"><Briefcase size={14} className="text-primary" /> {candidate.experience}y Experience</span>
             <span className="flex items-center gap-2"><Calendar size={14} className="text-warning" /> Applied {candidate.applied_at}</span>
           </div>
        </div>
        <div className="flex flex-col items-center gap-2 bg-gray-900 dark:bg-black p-6 rounded-3xl border border-gray-800 shadow-2xl shrink-0">
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">AI Score</span>
           <span className="text-5xl font-black text-primary tracking-tighter">{analysis?.match_percentage || 0}%</span>
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">High Potential</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Professional Profile */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="card-premium p-8 space-y-8">
            <SectionTitle title="Candidate Summary" description="Extracted professional overview." />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic">
              "{candidate.summary}"
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div className="space-y-4">
                  <SectionTitle title="Core Tech Stack" />
                  <div className="flex flex-wrap gap-2">
                     {candidate.skills.map(skill => (
                       <SkillBadge key={skill} name={skill} type="primary" />
                     ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <SectionTitle title="Education" />
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                     <p className="body-sm font-bold text-gray-900 dark:text-white">{candidate.education}</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Verified Credential</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="card-premium p-8 space-y-6">
             <SectionTitle title="Resume Preview" description="Interactive document view." />
             <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center space-y-4">
                <FileText className="text-gray-200 dark:text-gray-800" size={80} />
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Document Rendering Sandbox</p>
                <Button variant="secondary" className="rounded-xl h-10 px-6 text-[10px] uppercase font-black">Open Full Preview</Button>
             </div>
          </div>

        </div>

        {/* Right: AI Analysis & Actions */}
        <div className="space-y-8">
          
          <div className="space-y-6">
            <ATSScoreCard 
              score={analysis?.match_percentage || 0}
              breakdown={analysis?.breakdown}
            />
          </div>

          <div className="card-premium p-6 space-y-6">
             <div className="flex items-center gap-3 text-primary">
                <Sparkles size={20} />
                <SectionTitle title="AI Verdict" />
             </div>
             <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="body-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {analysis?.feedback}
                </p>
             </div>

             <div className="space-y-4">
                <SectionTitle title="Skills Gap" />
                <div className="space-y-3">
                   <div className="flex flex-wrap gap-2">
                      {analysis?.matched_skills?.map(s => <SkillBadge key={s} name={s} type="success" size="sm" />)}
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {analysis?.missing_skills?.map(s => <SkillBadge key={s} name={s} type="warning" size="sm" />)}
                   </div>
                </div>
             </div>
          </div>

          <div className="card-premium p-6 space-y-4 bg-gray-900 dark:bg-black border-gray-800 shadow-2xl">
             <Button 
                onClick={() => handleStatusUpdate('shortlisted')}
                className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 gap-3 text-xs uppercase font-black"
             >
                <CheckCircle2 size={18} /> Shortlist Candidate
             </Button>
             <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="h-12 rounded-xl text-white border-white/10 hover:bg-white/5 text-[10px] uppercase font-black">
                   <MessageSquare size={14} className="mr-2" /> Interview
                </Button>
                <Button variant="secondary" className="h-12 rounded-xl text-white border-white/10 hover:bg-white/5 text-[10px] uppercase font-black">
                   <Mail size={14} className="mr-2" /> Email
                </Button>
             </div>
             <div className="pt-4 border-t border-gray-800">
                <Button 
                  variant="ghost" 
                  onClick={() => handleStatusUpdate('rejected')}
                  className="w-full h-12 rounded-xl text-danger hover:bg-danger/10 text-[10px] uppercase font-black"
                >
                   <XCircle size={14} className="mr-2" /> Reject Application
                </Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
