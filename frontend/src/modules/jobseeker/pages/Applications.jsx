import React, { useState } from 'react';
import { Send, MapPin, Search, Filter, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Applications() {
  const [filter, setFilter] = useState('All');

  const applications = [
    { id: 1, role: 'Frontend Developer', company: 'Zoho', location: 'Chennai', appliedOn: '2 days ago', matchScore: 82, status: 'Under Review' },
    { id: 2, role: 'React Engineer', company: 'Freshworks', location: 'Chennai', appliedOn: '1 week ago', matchScore: 88, status: 'Selected' },
    { id: 3, role: 'UI Developer', company: 'Chargebee', location: 'Remote', appliedOn: '2 weeks ago', matchScore: 65, status: 'Rejected' }
  ];

  const filteredApps = filter === 'All' 
    ? applications 
    : applications.filter(app => app.status === filter);

  return (
    <div className="space-y-4 pt-2">
      {/* HEADER + FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Applications</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl">
            {['All', 'Under Review', 'Selected', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  filter === status 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
             <Search size={16} />
          </button>
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="space-y-2">
        {filteredApps.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
             <Send size={28} className="text-slate-200 mx-auto mb-3" />
             <p className="font-bold uppercase tracking-widest text-slate-400 text-xs">No applications found</p>
          </div>
        ) : (
          filteredApps.map(app => (
            <div key={app.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:border-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 flex-1">
                <div className="size-10 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-base text-blue-600 transition-transform group-hover:scale-105">
                  {app.company[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors truncate">{app.role}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{app.company}</span>
                    <span className="text-slate-200 dark:text-slate-800">•</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {app.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center px-4">
                  <span className="text-lg font-black text-blue-600 tracking-tighter">{app.matchScore}%</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Match</span>
                </div>

                <div className="flex items-center gap-2 min-w-[120px]">
                  {app.status === 'Under Review' && <Clock size={13} className="text-amber-500" />}
                  {app.status === 'Selected' && <CheckCircle2 size={13} className="text-emerald-500" />}
                  {app.status === 'Rejected' && <XCircle size={13} className="text-rose-500" />}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest block ${
                       app.status === 'Under Review' ? 'text-amber-500' :
                       app.status === 'Selected' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>{app.status}</span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{app.appliedOn}</p>
                  </div>
                </div>

                <Button variant="secondary" className="h-8 px-4 rounded-lg text-[9px] font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800">
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
