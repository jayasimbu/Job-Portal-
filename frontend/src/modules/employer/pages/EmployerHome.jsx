import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const EmployerHome = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: 'Active Jobs', value: '12', icon: Briefcase, color: 'text-blue-600' },
    { label: 'New Applicants', value: '48', icon: Users, color: 'text-emerald-600' },
    { label: 'Interviews Today', value: '4', icon: Calendar, color: 'text-amber-600' },
    { label: 'Avg Match Score', value: '84%', icon: Zap, color: 'text-indigo-600' },
  ];

  const recentHiringActivity = [
    { role: 'Senior Frontend Engineer', candidates: 24, status: 'Active', match: 92 },
    { role: 'Product Designer', candidates: 15, status: 'Reviewing', match: 88 },
    { role: 'Fullstack Developer', candidates: 9, status: 'On Hold', match: 85 },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* ═══ WELCOME HERO ═══════════════════════════════════════════════ */}
      <section className="bg-slate-900 dark:bg-blue-600 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 size-96 bg-slate-50/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50/20 border border-white/30 text-xs font-black uppercase tracking-widest">
                  <Sparkles size={14} />
                  Hiring Intelligence Active
               </div>
               <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter uppercase">
                     Build your <br /> <span className="text-blue-200">World-Class</span> Team.
                  </h1>
                  <p className="text-lg text-blue-100 font-medium max-w-xl leading-relaxed">
                     Welcome back. Your hiring pipeline is performing 12% better than last week. Ready to find your next key player?
                  </p>
               </div>
               <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => navigate('/platform/employer/post-job')}
                    className="h-14 px-8 bg-slate-50 text-slate-900 hover:bg-slate-100 font-black rounded-2xl shadow-lg"
                  >
                    Post a New Job
                    <UserPlus size={18} />
                  </Button>
                  <Button 
                    onClick={() => navigate('/platform/employer/candidates')}
                    className="h-14 px-8 border-white/30 text-white hover:bg-slate-50/10 font-black rounded-2xl"
                    variant="outline"
                  >
                    Browse Candidates
                  </Button>
               </div>
            </div>

            <div className="hidden lg:block">
               <div className="grid grid-cols-2 gap-4">
                  {quickStats.map((stat, i) => (
                    <Card key={i} className="p-6 bg-slate-50/10 backdrop-blur-md border-white/20">
                       <div className={`size-10 rounded-xl bg-slate-50/20 flex items-center justify-center mb-4 text-white`}>
                          <stat.icon size={20} />
                       </div>
                       <p className="text-3xl font-black text-white leading-none">{stat.value}</p>
                       <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-2">{stat.label}</p>
                    </Card>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ═══ QUICK ACTIONS & SNAPSHOT ═══════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Hiring Pipeline */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Active Pipeline Snapshot</h3>
               <Button variant="ghost" className="text-blue-600 font-black text-xs uppercase" onClick={() => navigate('/platform/employer/jobs')}>View All Jobs</Button>
            </div>
            
            <div className="space-y-4">
               {recentHiringActivity.map((activity, i) => (
                 <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          <Briefcase size={24} />
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-none">{activity.role}</h4>
                          <div className="flex items-center gap-3 mt-2">
                             <span className="text-xs font-bold text-slate-500">{activity.candidates} Candidates</span>
                             <div className="size-1 bg-slate-200 rounded-full" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${activity.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {activity.status}
                             </span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-black text-blue-600">{activity.match}%</div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Match</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Intelligence Sidebar */}
         <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">AI Insights</h3>
            <Card className="p-8 space-y-8 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 rounded-[32px]">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                     <Zap size={18} />
                     <span className="text-xs font-black uppercase tracking-widest">Hiring Efficiency</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                     Your average "Time to Hire" has decreased by <strong className="text-blue-600 text-lg">2.4 days</strong> this month.
                  </p>
               </div>

               <div className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Actions</p>
                  <ul className="space-y-4">
                     <li className="flex gap-3">
                        <div className="mt-1 text-emerald-500"><CheckCircle2 size={16} /></div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Schedule interviews for 5 "Strong Match" candidates in Senior Frontend role.</p>
                     </li>
                     <li className="flex gap-3">
                        <div className="mt-1 text-blue-500"><Sparkles size={16} /></div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">New high-potential developer profile matched your "Fullstack" requirements.</p>
                     </li>
                  </ul>
               </div>

               <Button 
                onClick={() => navigate('/platform/employer/analytics')}
                className="w-full h-12 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/20"
               >
                  Full Report
                  <ArrowRight size={14} />
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default EmployerHome;
