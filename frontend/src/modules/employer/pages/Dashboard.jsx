import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Target, 
  ArrowRight, 
  User
} from 'lucide-react';

import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export default function Dashboard() {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Active Jobs', value: '8', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Total Applicants', value: '124', icon: Users, color: 'text-purple-600' },
    { label: 'Avg Match Score', value: '81%', icon: Target, color: 'text-emerald-600' },
    { label: 'Applications This Week', value: '34', icon: Calendar, color: 'text-amber-600' },
  ];

  const recentApplicants = [
    { name: 'Arjun R', role: 'Frontend Developer', match: 84, time: '3 hours ago' },
    { name: 'Siddharth M', role: 'Backend Engineer', match: 79, time: '5 hours ago' },
    { name: 'Priya M', role: 'UI/UX Designer', match: 92, time: 'Yesterday' },
    { name: 'Rahul S', role: 'DevOps Engineer', match: 71, time: 'Yesterday' },
  ];

  const activeJobs = [
    { title: 'Frontend Developer', applicants: 24, match: 82, status: 'Active' },
    { title: 'Backend Developer', applicants: 18, match: 79, status: 'Active' },
    { title: 'UI/UX Designer', applicants: 12, match: 85, status: 'Active' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-16 px-6 pt-4">
      
      {/* METRIC ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="border-slate-100 shadow-sm">
            <CardBody className="p-4 flex flex-col gap-2">
              <div className={`size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${m.color}`}>
                <m.icon size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{m.label}</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{m.value}</h4>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Applicants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Applications</h3>
            <button 
              onClick={() => navigate('/platform/employer/candidates')}
              className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight size={10} />
            </button>
          </div>
          
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentApplicants.map((app, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <User size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{app.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[11px] font-black text-blue-600">{app.match}% Match</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Applied {app.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Active Jobs Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Job Snapshot</h3>
            <button 
              onClick={() => navigate('/platform/employer/post-job')} 
              className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Post a Job
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {activeJobs.map((job, idx) => (
              <Card key={idx} className="border-slate-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
                <CardBody className="p-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-600">{job.applicants} Applicants</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Avg Match: {job.match}%</span>
                    </div>
                    <Badge variant="success" className="text-[8px] uppercase font-black">{job.status}</Badge>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
