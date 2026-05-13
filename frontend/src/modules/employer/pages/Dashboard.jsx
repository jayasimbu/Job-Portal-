import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, Calendar, Target, ArrowRight, User, 
  CheckCircle2, XCircle, Clock, ChevronRight, TrendingUp
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Active Jobs', value: '8', icon: Briefcase, color: 'text-blue-600', trend: '+2 this week' },
    { label: 'Total Applicants', value: '124', icon: Users, color: 'text-purple-600', trend: '+18 this week' },
    { label: 'Avg Match Score', value: '81%', icon: Target, color: 'text-emerald-600', trend: '↑ 3% from last month' },
    { label: 'This Week', value: '34', icon: Calendar, color: 'text-amber-600', trend: 'Applications received' },
  ];

  const pipeline = [
    { stage: 'New', count: 34, color: 'bg-blue-500' },
    { stage: 'Screening', count: 18, color: 'bg-indigo-500' },
    { stage: 'Interview', count: 12, color: 'bg-amber-500' },
    { stage: 'Offer', count: 4, color: 'bg-emerald-500' },
    { stage: 'Hired', count: 2, color: 'bg-green-600' }
  ];
  const pipelineTotal = pipeline.reduce((sum, p) => sum + p.count, 0);

  const recentApplicants = [
    { name: 'Arjun R', role: 'Frontend Developer', match: 84, time: '3 hours ago', skills: ['React', 'TypeScript'] },
    { name: 'Siddharth M', role: 'Backend Engineer', match: 79, time: '5 hours ago', skills: ['Node.js', 'Python'] },
    { name: 'Priya M', role: 'UI/UX Designer', match: 92, time: 'Yesterday', skills: ['Figma', 'CSS'] },
    { name: 'Rahul S', role: 'DevOps Engineer', match: 71, time: 'Yesterday', skills: ['Docker', 'AWS'] },
  ];

  const activeJobs = [
    { title: 'Frontend Developer', applicants: 24, match: 82, status: 'Active' },
    { title: 'Backend Developer', applicants: 18, match: 79, status: 'Active' },
    { title: 'UI/UX Designer', applicants: 12, match: 85, status: 'Active' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-12 px-6 pt-2">
      
      {/* METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${m.color}`}>
              <m.icon size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{m.label}</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{m.value}</h4>
              <p className="text-xs font-semibold text-emerald-500 mt-0.5">{m.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* HIRING PIPELINE */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Hiring Pipeline</h3>
          <span className="text-xs font-semibold text-slate-500">{pipelineTotal} Total Candidates</span>
        </div>
        
        {/* Pipeline Bar */}
        <div className="flex h-3.5 rounded-full overflow-hidden mb-4">
          {pipeline.map(p => (
            <div key={p.stage} className={`${p.color} transition-all`} style={{ width: `${(p.count / pipelineTotal) * 100}%` }} title={`${p.stage}: ${p.count}`} />
          ))}
        </div>
        
        {/* Pipeline Labels */}
        <div className="flex justify-between">
          {pipeline.map(p => (
            <div key={p.stage} className="flex flex-col items-center gap-1">
              <div className={`size-2.5 rounded-full ${p.color}`} />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{p.stage}</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Applicants — Candidate Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Applications</h3>
            <button 
              onClick={() => navigate('/platform/employer/candidates')}
              className="text-xs font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="space-y-2">
            {recentApplicants.map((app, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 font-black text-base group-hover:scale-105 transition-transform">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{app.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{app.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-1">
                    {app.skills.map(s => (
                      <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${app.match >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{app.match}%</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{app.time}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="size-8 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Shortlist">
                      <CheckCircle2 size={15} />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 transition-colors" title="Reject">
                      <XCircle size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs Snapshot */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Active Jobs</h3>
            <button 
              onClick={() => navigate('/platform/employer/post-job')} 
              className="text-xs font-bold text-blue-600 uppercase tracking-wide hover:text-blue-700 transition-colors"
            >
              + Post a Job
            </button>
          </div>
          
          <div className="space-y-2">
            {activeJobs.map((job, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded uppercase tracking-widest">{job.status}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-blue-600">{job.applicants} Applicants</span>
                  <span className="text-xs text-slate-400 font-semibold">Avg Match: {job.match}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${job.match}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Analytics */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Quick Analytics</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Avg Time to Hire', value: '12 days' },
                { label: 'Offer Rate', value: '18%' },
                { label: 'Active Pipeline', value: '70' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
