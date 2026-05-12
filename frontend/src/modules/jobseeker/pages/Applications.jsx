import React, { useState } from 'react';
import { Send, MapPin, Search } from 'lucide-react';
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
      appliedOn: 'Applied 2 days ago',
      matchScore: 82,
      status: 'Under Review'
    },
    {
      id: 2,
      role: 'React Engineer',
      company: 'Freshworks',
      location: 'Chennai',
      appliedOn: 'Applied 1 week ago',
      matchScore: 88,
      status: 'Selected'
    },
    {
      id: 3,
      role: 'UI Developer',
      company: 'Chargebee',
      location: 'Remote',
      appliedOn: 'Applied 2 weeks ago',
      matchScore: 65,
      status: 'Rejected'
    }
  ];

  const filteredApps = filter === 'All' 
    ? applications 
    : applications.filter(app => app.status === filter);

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-20 px-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Applications</h1>
        <p className="text-slate-500 font-medium text-base">
          Track your applied jobs.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto w-full sm:w-auto">
          {['All', 'Under Review', 'Selected', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${filter === status ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            No applications found for this status.
          </div>
        ) : (
          filteredApps.map(app => (
            <div key={app.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              
              <div className="flex gap-4 items-start">
                <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center shrink-0">
                  <Send size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{app.role}</h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span className="text-slate-700 dark:text-slate-300">{app.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {app.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                <div className="flex items-center gap-3">
                   <span className="text-sm font-semibold text-slate-500">{app.appliedOn}</span>
                   <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded border border-emerald-100 text-xs">
                     {app.matchScore}% Match
                   </span>
                </div>
                <div>
                   {app.status === 'Under Review' && <span className="px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-lg text-sm font-bold">Under Review</span>}
                   {app.status === 'Selected' && <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-sm font-bold">Selected</span>}
                   {app.status === 'Rejected' && <span className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-lg text-sm font-bold">Rejected</span>}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
