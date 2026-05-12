import React, { useState } from 'react';
import { Send, MapPin, Search, Filter, Calendar, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Applications() {
  const [filter, setFilter] = useState('All');

  // Mock data for UI demonstration
  const applications = [
    {
      id: 1,
      role: 'Frontend Developer',
      company: 'Zoho',
      location: 'Chennai',
      appliedOn: '2 days ago',
      matchScore: 82,
      status: 'Under Review'
    },
    {
      id: 2,
      role: 'React Engineer',
      company: 'Freshworks',
      location: 'Chennai',
      appliedOn: '1 week ago',
      matchScore: 88,
      status: 'Selected'
    },
    {
      id: 3,
      role: 'UI Developer',
      company: 'Chargebee',
      location: 'Remote',
      appliedOn: '2 weeks ago',
      matchScore: 65,
      status: 'Rejected'
    }
  ];

  const filteredApps = filter === 'All' 
    ? applications 
    : applications.filter(app => app.status === filter);

  return (
    <div className="space-y-8 pt-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Application Hub</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Track & Manage Your Opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="h-10 px-5 rounded-xl border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest shadow-sm">
            <Calendar size={14} /> Schedule View
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl overflow-x-auto">
          {['All', 'Under Review', 'Selected', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === status 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2">
           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Search size={18} />
           </button>
           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {/* APPLICATIONS LIST — VERTICAL FEED */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="py-32 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
             <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                <Send size={32} />
             </div>
             <p className="font-black uppercase tracking-widest text-slate-400 text-xs">No active applications found</p>
          </div>
        ) : (
          filteredApps.map(app => (
            <div key={app.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              <div className="flex items-center gap-6 flex-1">
                <div className="size-14 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-blue-600 transition-transform group-hover:scale-105">
                  {app.company[0]}
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors truncate">{app.role}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="text-slate-900 dark:text-slate-300 font-black">{app.company}</span>
                    <span className="text-slate-200 dark:text-slate-800">•</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {app.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-10">
                {/* Stats */}
                <div className="flex flex-col items-center border-x border-slate-50 dark:border-slate-800 px-8">
                  <span className="text-xl font-black text-blue-600 tracking-tighter">{app.matchScore}%</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Match Score</span>
                </div>

                <div className="space-y-1.5 min-w-[140px]">
                   <div className="flex items-center gap-2">
                      {app.status === 'Under Review' && <Clock size={14} className="text-amber-500" />}
                      {app.status === 'Selected' && <CheckCircle2 size={14} className="text-emerald-500" />}
                      {app.status === 'Rejected' && <XCircle size={14} className="text-rose-500" />}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                         app.status === 'Under Review' ? 'text-amber-500' :
                         app.status === 'Selected' ? 'text-emerald-500' : 'text-rose-500'
                      }`}>{app.status}</span>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Applied {app.appliedOn}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="h-10 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-800">
                    View Specs
                  </Button>
                  <Button className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10">
                    Message HR
                  </Button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
  );
}
