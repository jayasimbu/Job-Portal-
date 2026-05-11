import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications } from '../services/jobseekerService';
import { mapApplication } from '../../../core/api/adapters';

// Import Design System
import { SectionHeader, StatCard, ProgressBar } from '../components/DesignSystem';

const STAGES = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const data = await fetchApplications(user.id);
      if (data.applications) {
        setApplications(data.applications.map(app => mapApplication(app)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const interviewApplications = applications.filter(app => app.status === 'Interview');

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Application Tracker</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">End-to-end monitoring of your professional pipeline</p>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pipeline Health</span>
           <span className="text-sm font-black text-blue-600 uppercase tracking-tight">{applications.length} Active Processes</span>
        </div>
      </header>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <StatCard label="Total Apps" value={applications.length} />
         </div>
         <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <StatCard label="Interviews" value={interviewApplications.length} color="text-purple-600" />
         </div>
         <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <StatCard label="Shortlisted" value={applications.filter(a => a.status === 'Shortlisted').length} color="text-emerald-600" />
         </div>
         <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <StatCard label="Review Rate" value="84" suffix="%" color="text-blue-600" />
         </div>
      </div>

      {/* INTERVIEW TRACKER SECTION */}
      {interviewApplications.length > 0 && (
        <section className="space-y-8">
           <SectionHeader title="Interview Queue" icon="event_upcoming" iconColor="text-purple-600" bgColor="bg-purple-50" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {interviewApplications.map(app => (
                <div key={app.id} className="p-8 border border-slate-200 rounded-[2.5rem] bg-white shadow-sm hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer">
                   <div className="flex justify-between items-start mb-6">
                      <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-300 uppercase">
                        {app.company?.[0]}
                      </div>
                      <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-purple-100">Live Process</span>
                   </div>
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{app.title}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{app.company}</p>
                   
                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <span className="material-symbols-outlined text-sm">calendar_month</span>
                         May 15, 2026 • 10:30 AM
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <span className="material-symbols-outlined text-sm">video_chat</span>
                         <a href="#" className="text-blue-600 hover:underline">Launch Interview Meeting</a>
                      </div>
                   </div>

                   <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100">
                      Join Digital Office
                   </button>
                   <span className="absolute -bottom-6 -right-6 material-symbols-outlined text-[8rem] text-slate-50 opacity-[0.03] group-hover:scale-110 transition-transform">event</span>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* STATUS PIPELINE (KANBAN) */}
      <section className="space-y-8">
         <SectionHeader title="Intelligence Pipeline" icon="account_tree" />
         <div className="overflow-x-auto pb-8 -mx-2 px-2 custom-scrollbar">
            <div className="flex gap-8 min-w-[1400px]">
               {STAGES.map(stage => {
                 const appsInStage = applications.filter(app => {
                   const status = app.status?.toLowerCase();
                   const target = stage.toLowerCase();
                   if (target === 'applied') return status === 'applied' || !status;
                   return status === target;
                 });

                 return (
                   <div key={stage} className="flex-1 space-y-6">
                      <div className="flex items-center justify-between px-4">
                         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stage}</h3>
                         <span className="size-8 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100">
                           {appsInStage.length}
                         </span>
                      </div>

                      <div className="space-y-4">
                         {appsInStage.map(app => (
                           <div 
                             key={app.id} 
                             className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-blue-500 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-300 text-sm">
                                   {app.company?.[0]}
                                 </div>
                                 <div className="text-right">
                                   <p className="text-sm font-black text-slate-900 leading-tight">{app.ats_score || 78}%</p>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Match</p>
                                 </div>
                              </div>
                              
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{app.title}</h4>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{app.company}</p>
                              
                              <div className="pt-4 border-t border-slate-50">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Stage {STAGES.indexOf(stage) + 1}/6</span>
                                 </div>
                                 <ProgressBar value={(STAGES.indexOf(stage) + 1) / STAGES.length * 100} />
                              </div>
                           </div>
                         ))}
                         
                         {appsInStage.length === 0 && (
                           <div className="h-40 rounded-[2rem] border-2 border-dashed border-slate-50 flex items-center justify-center opacity-30">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Idle Stage</p>
                           </div>
                         )}
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Applications;
