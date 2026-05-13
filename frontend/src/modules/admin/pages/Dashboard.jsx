import React, { useState } from 'react';
import { 
  Users, Building2, Briefcase, FileText, TrendingUp, 
  ArrowUpRight, ArrowDownRight, AlertTriangle, ShieldCheck, Activity
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function AdminDashboard() {
  const [stats] = useState({
    total_users: 1240,
    employers: 84,
    active_jobs: 312,
    applications: 4820,
  });

  const metrics = [
    { label: 'Total Users', value: stats.total_users.toLocaleString(), icon: Users, color: 'text-blue-600', trend: '+12%', trendUp: true },
    { label: 'Employers', value: stats.employers.toLocaleString(), icon: Building2, color: 'text-purple-600', trend: '+8%', trendUp: true },
    { label: 'Active Jobs', value: stats.active_jobs.toLocaleString(), icon: Briefcase, color: 'text-emerald-600', trend: '+15%', trendUp: true },
    { label: 'Applications', value: stats.applications.toLocaleString(), icon: FileText, color: 'text-amber-600', trend: '+22%', trendUp: true },
  ];

  // Activity chart data (CSS bars)
  const weeklyActivity = [
    { day: 'Mon', signups: 18, jobs: 12, apps: 42 },
    { day: 'Tue', signups: 24, jobs: 8, apps: 56 },
    { day: 'Wed', signups: 32, jobs: 15, apps: 68 },
    { day: 'Thu', signups: 28, jobs: 20, apps: 74 },
    { day: 'Fri', signups: 36, jobs: 18, apps: 82 },
    { day: 'Sat', signups: 14, jobs: 6, apps: 30 },
    { day: 'Sun', signups: 10, jobs: 4, apps: 22 },
  ];
  const maxApps = Math.max(...weeklyActivity.map(d => d.apps));

  const recentEmployers = [
    { name: 'Zoho Corporation', status: 'Verified', jobs: 12 },
    { name: 'Tata Consultancy', status: 'Verified', jobs: 8 },
    { name: 'Wipro Technologies', status: 'Pending', jobs: 3 },
  ];

  const recentJobs = [
    { title: 'Senior Frontend Engineer', company: 'Zoho', status: 'Active', applicants: 24 },
    { title: 'Backend Developer', company: 'TCS', status: 'Active', applicants: 18 },
    { title: 'DevOps Engineer', company: 'Wipro', status: 'Under Review', applicants: 6 },
  ];

  const recentApplications = [
    { candidate: 'Arjun R', role: 'Frontend Developer', match: 84, time: '2h ago' },
    { candidate: 'Siddharth M', role: 'Backend Developer', match: 92, time: '5h ago' },
    { candidate: 'Priya M', role: 'UI/UX Designer', match: 78, time: '1d ago' },
  ];

  const moderationQueue = [
    { type: 'Company Verification', count: 5, icon: Building2, color: 'text-amber-600' },
    { type: 'Flagged Content', count: 2, icon: AlertTriangle, color: 'text-rose-500' },
    { type: 'Certificate Review', count: 8, icon: ShieldCheck, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Platform overview and moderation tools.</p>
      </div>

      {/* Metric Cards with Trends */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${m.color}`}>
                <m.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${m.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {m.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.trend}
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{m.value}</h4>
          </div>
        ))}
      </div>

      {/* CHARTS + MODERATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Activity Chart — CSS bars */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Weekly Activity</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-blue-500" /> Applications</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-emerald-500" /> Signups</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-purple-500" /> Jobs</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-3 h-40">
            {weeklyActivity.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '140px' }}>
                  <div className="w-full flex items-end justify-center gap-0.5" style={{ height: '100%' }}>
                    <div className="w-2.5 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600" style={{ height: `${(d.apps / maxApps) * 100}%` }} title={`Apps: ${d.apps}`} />
                    <div className="w-2.5 bg-emerald-500 rounded-t transition-all duration-500 hover:bg-emerald-600" style={{ height: `${(d.signups / maxApps) * 100}%` }} title={`Signups: ${d.signups}`} />
                    <div className="w-2.5 bg-purple-500 rounded-t transition-all duration-500 hover:bg-purple-600" style={{ height: `${(d.jobs / maxApps) * 100}%` }} title={`Jobs: ${d.jobs}`} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation Queue */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Moderation Queue</h3>
          <div className="space-y-3">
            {moderationQueue.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`size-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.type}</span>
                </div>
                <span className="text-base font-black text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 size-8 rounded-lg flex items-center justify-center">{item.count}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-4 h-10 text-xs font-bold uppercase tracking-widest rounded-xl">
            Review All
          </Button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Employers */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Employers</h2>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <th className="p-3">Company</th>
                  <th className="p-3">Jobs</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentEmployers.map((emp, i) => (
                  <tr key={i} className="hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 text-sm font-medium text-slate-900 dark:text-white">{emp.name}</td>
                    <td className="p-3 text-sm font-semibold text-blue-600">{emp.jobs}</td>
                    <td className="p-3">
                      <Badge variant={emp.status === 'Verified' ? 'success' : 'warning'} className="text-[10px] uppercase font-bold px-2 py-0.5">
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs font-bold uppercase text-blue-600">Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Job Posts */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Job Posts</h2>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <th className="p-3">Role</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Applicants</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentJobs.map((job, i) => (
                  <tr key={i} className="hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 text-sm font-medium text-slate-900 dark:text-white">{job.title}</td>
                    <td className="p-3 text-sm text-slate-500">{job.company}</td>
                    <td className="p-3 text-sm font-semibold text-blue-600">{job.applicants}</td>
                    <td className="p-3">
                      <Badge variant={job.status === 'Active' ? 'success' : 'secondary'} className="text-[10px] uppercase font-bold px-2 py-0.5">
                        {job.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Applications</h2>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Match</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplications.map((app, i) => (
                  <tr key={i} className="hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 text-sm font-medium text-slate-900 dark:text-white">{app.candidate}</td>
                    <td className="p-3 text-sm text-slate-500">{app.role}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                        app.match >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      }`}>
                        {app.match}%
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-400">{app.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
