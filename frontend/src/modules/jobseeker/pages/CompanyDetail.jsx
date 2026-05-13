import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  Globe,
  Star,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setCompany({
        id,
        name: 'Real Time Projects',
        industry: 'Software Development',
        location: 'Bangalore, India',
        verificationStatus: 'Verified Employer',
        companySize: '50-100 Employees',
        founded: '2018',
        website: 'https://realtimeprojects.com',
        overview: 'Real Time Projects is a leading technology partner specializing in building high-performance AI solutions and enterprise applications.',
        mission: 'To empower businesses through cutting-edge technology and seamless integration of AI in daily workflows.',
        culture: 'We believe in a "Builder First" culture where innovation is rewarded and work-life balance is prioritized.',
        activeJobsCount: 12,
        activeJobs: [
          { id: 1, title: 'Senior Backend Engineer', type: 'Full-time', salary: '₹12–18 LPA', date: '2d ago' },
          { id: 2, title: 'UI/UX Designer', type: 'Full-time', salary: '₹8–12 LPA', date: '3d ago' },
          { id: 3, title: 'DevOps Engineer', type: 'Hybrid', salary: '₹15–20 LPA', date: '5d ago' }
        ],
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Company Profile...</div>;

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <div className="px-2">
        <button 
          onClick={() => navigate('/platform/jobseeker/jobs')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Back to Job Feed
        </button>
      </div>

      {/* HEADER HERO */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Building2 size={120} />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="size-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner border border-slate-200 dark:border-slate-700 font-black text-3xl">
            {company.name[0]}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-[32px] font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{company.name}</h1>
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck size={11} /> {company.verificationStatus}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-black uppercase tracking-[0.15em] text-[10px]">
              <span className="flex items-center gap-1.5"><Briefcase size={13} /> {company.industry}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {company.location}</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <Button className="h-12 px-10 rounded-xl shadow-lg shadow-blue-500/10 text-[11px] font-black uppercase tracking-widest">
             Connect With HR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* MAIN CONTENT AREA (8 Units) */}
        <div className="lg:col-span-8 space-y-5">
          {/* SECTION 1 — OVERVIEW & ABOUT */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-7 shadow-sm space-y-8">
             <div className="space-y-3">
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Executive Summary</h2>
               <p className="text-[16px] text-slate-600 dark:text-slate-400 leading-[1.7] font-medium">{company.overview}</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50 dark:border-slate-700">
               <div className="space-y-3">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Our Mission</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{company.mission}</p>
               </div>
               <div className="space-y-3">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Work Culture</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{company.culture}</p>
               </div>
             </div>
          </div>

          {/* SECTION 2 — OPEN POSITIONS (NEW) */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Live Opportunities</h2>
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[9px] font-black rounded uppercase tracking-widest">{company.activeJobsCount} Positions</span>
            </div>
            
            <div className="space-y-3">
              {company.activeJobs.map((job, idx) => (
                <div key={job.id} className="group p-4 bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors truncate">{job.title}</h4>
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
                       <span className="text-blue-600">{job.type}</span>
                       <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                       <span>{job.salary}</span>
                       <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                       <span className="text-emerald-500">{75 + idx * 5}% MATCH</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Button variant="secondary" className="h-9 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest border-slate-300 dark:border-slate-700">Analyze</Button>
                    <Button className="h-9 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest">Apply Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3 — TECH STACK */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-7 shadow-sm space-y-6">
             <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Core Tech Stack</h2>
             <div className="flex flex-wrap gap-2">
                {company.requiredSkills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:text-blue-600 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
             </div>
          </div>
        </div>

        {/* SIDEBAR AREA (4 Units) */}
        <div className="lg:col-span-4 space-y-5">
          {/* QUICK STATS */}
          <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-3xl p-7 shadow-xl space-y-6">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Business Intelligence</h2>
             <div className="space-y-6">
                {[
                  { label: 'Hiring Status', val: 'Active', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { label: 'Work Mode', val: 'Hybrid/Remote', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Company Size', val: company.companySize, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  { label: 'Founded', val: company.founded, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { label: 'Active Jobs', val: company.activeJobsCount, icon: LayoutGrid, color: 'text-rose-500', bg: 'bg-rose-500/10' }
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-4 group">
                     <div className={`size-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} border border-white/5 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={18} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-base font-black text-white uppercase tracking-tight">{stat.val}</p>
                     </div>
                  </div>
                ))}
                
                <div className="pt-6 border-t border-slate-800 flex items-center justify-between group">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enterprise Website</p>
                   <a href={company.website} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-1.5">
                     {company.website.replace('https://', '')}
                     <ChevronRight size={12} />
                   </a>
                </div>
             </div>
          </div>
          
          {/* RATINGS / SOCIAL */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-7 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Employee Rating</h2>
                <div className="flex items-center gap-1 text-amber-500">
                   <Star size={14} className="fill-amber-500" />
                   <span className="text-sm font-black">4.8</span>
                </div>
             </div>
             <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[92%]"></div>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">Based on 120+ reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
