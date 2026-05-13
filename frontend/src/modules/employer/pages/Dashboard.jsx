import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Target, 
  ArrowRight, 
  TrendingUp,
  Sparkles,
  Zap,
  Activity,
  Plus
} from 'lucide-react';
import { useCandidateAnalysis } from '../../../hooks/useCandidateAnalysis';
import { getCurrentUserId } from '../../../core/auth/session';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import StatCard from '../../../components/shared/StatCard';
import CandidateCard from '../../../components/shared/CandidateCard';
import SectionTitle from '../../../components/shared/SectionTitle';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import EmptyState from '../../../components/shared/EmptyState';
import Button from '../../../components/ui/Button';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const employerId = getCurrentUserId();
  const { isAnalyzing, candidates, fetchCandidates } = useCandidateAnalysis();
  
  const [stats, setStats] = useState({
    activeJobs: 12,
    totalApplicants: 450,
    avgMatch: 82,
    hiringVelocity: "14 days"
  });

  useEffect(() => {
    // Fetch top candidates from all active jobs for the overview
    fetchCandidates('all'); 
  }, [fetchCandidates]);

  const pipeline = [
    { stage: 'Applied', count: 124, color: 'bg-blue-500' },
    { stage: 'Shortlisted', count: 42, color: 'bg-primary' },
    { stage: 'Interview', count: 18, color: 'bg-warning' },
    { stage: 'Hired', count: 5, color: 'bg-success' }
  ];

  return (
    <div className="space-y-8 pt-4 pb-20 animate-in fade-in duration-500">
      
      <PageHeader 
        title="Hiring Dashboard" 
        subtitle="Intelligent oversight of your recruitment pipeline."
        action={
          <Button onClick={() => navigate('/platform/employer/post-job')} className="rounded-xl shadow-lg shadow-primary/20">
            <Plus size={18} /> Post New Role
          </Button>
        }
      />

      {/* 1. Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Roles" value={stats.activeJobs} icon={Briefcase} trend="+2 new" />
        <StatCard title="Total Candidates" value={stats.totalApplicants} icon={Users} trend="+18% growth" trendType="positive" />
        <StatCard title="AI Match Rate" value={`${stats.avgMatch}%`} icon={Target} />
        <StatCard title="Hiring Speed" value={stats.hiringVelocity} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Top Candidates & Active Rankings */}
        <div className="xl:col-span-2 space-y-6">
          <SectionTitle 
            title="AI Recommended Candidates" 
            description="Automatically ranked by ATS score and semantic alignment."
            action={
              <Button variant="ghost" onClick={() => navigate('/platform/employer/candidates')}>
                View All Talent
              </Button>
            }
          />

          <div className="space-y-4">
            {isAnalyzing ? (
              <LoadingSkeleton type="card" count={4} />
            ) : candidates.length > 0 ? (
              candidates.slice(0, 5).map(candidate => (
                <CandidateCard 
                  key={candidate.id || candidate._id} 
                  candidate={candidate}
                  onViewDetails={() => navigate(`/platform/employer/candidates/${candidate.id || candidate._id}`)}
                />
              ))
            ) : (
              <EmptyState 
                title="No active applications" 
                description="Your job postings are live. Once candidates apply, AI will rank them here."
              />
            )}
          </div>
        </div>

        {/* Right: Pipeline & Activity */}
        <div className="space-y-8">
          
          {/* Hiring Funnel */}
          <div className="card-premium p-6 space-y-6">
            <SectionTitle title="Hiring Pipeline" />
            <div className="space-y-4">
              {pipeline.map(p => (
                <div key={p.stage} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">{p.stage}</span>
                    <span className="text-gray-900 dark:text-white">{p.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${p.color} transition-all duration-700`} 
                      style={{ width: `${(p.count / 150) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-2 rounded-xl text-[10px] uppercase font-black">
              Manage Pipeline
            </Button>
          </div>

          {/* Quick Insights Card */}
          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-primary">
               <Sparkles size={20} />
               <h4 className="text-xs font-black uppercase tracking-widest">AI Insights</h4>
            </div>
            <p className="body-sm text-primary/80 leading-relaxed font-medium">
              "Candidates with <strong>FastAPI</strong> and <strong>Ollama</strong> expertise are trending. Consider prioritizing these profiles for your Backend roles."
            </p>
          </div>

          {/* Recent Jobs Snapshot */}
          <div className="card-premium p-6 space-y-6">
             <SectionTitle title="Active Postings" />
             <div className="space-y-4">
                {[
                  { title: "Lead AI Engineer", apps: 24, match: 92 },
                  { title: "React Developer", apps: 18, match: 78 }
                ].map(job => (
                  <div key={job.title} className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="body-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{job.title}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{job.apps} Applicants</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-gray-900 dark:text-white">{job.match}%</p>
                       <p className="text-[7px] text-gray-400 uppercase font-black">Avg Match</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
