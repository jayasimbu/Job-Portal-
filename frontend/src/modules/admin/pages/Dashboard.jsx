import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText
} from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function AdminDashboard() {
  const [stats] = useState({
    total_users: 1240,
    employers: 84,
    active_jobs: 312,
    applications: 4820,
  });

  const metrics = [
    { label: 'Total Users', value: stats.total_users.toLocaleString(), icon: Users, color: 'text-blue-600' },
    { label: 'Total Employers', value: stats.employers.toLocaleString(), icon: Building2, color: 'text-purple-600' },
    { label: 'Active Jobs', value: stats.active_jobs.toLocaleString(), icon: Briefcase, color: 'text-emerald-600' },
    { label: 'Applications', value: stats.applications.toLocaleString(), icon: FileText, color: 'text-amber-600' },
  ];

  const recentEmployers = [
    { name: 'Zoho Corporation', status: 'Verified' },
    { name: 'Tata Consultancy', status: 'Verified' },
    { name: 'Wipro Technologies', status: 'Pending' },
  ];

  const recentJobs = [
    { title: 'Senior Frontend Engineer', company: 'Zoho', status: 'Active' },
    { title: 'Backend Developer', company: 'TCS', status: 'Active' },
    { title: 'DevOps Engineer', company: 'Wipro', status: 'Under Review' },
  ];

  const recentApplications = [
    { candidate: 'Arjun R', role: 'Frontend Developer', match: 84 },
    { candidate: 'Siddharth M', role: 'Backend Developer', match: 92 },
    { candidate: 'Priya M', role: 'UI/UX Designer', match: 78 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Operational overview of platform activity.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="border-slate-200">
            <CardBody className="p-4 flex flex-col gap-2">
              <div className={`size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${m.color}`}>
                <m.icon size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{m.label}</p>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{m.value}</h4>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Employers */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Employers</h2>
          <Card className="border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="p-3">Company</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentEmployers.map((emp, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 text-sm font-medium text-slate-900 dark:text-white">{emp.name}</td>
                    <td className="p-3">
                      <Badge variant={emp.status === 'Verified' ? 'success' : 'warning'} className="text-[9px] uppercase font-bold px-2 py-0.5">
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-blue-600">Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Recent Job Posts */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Job Posts</h2>
          <Card className="border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="p-3">Role</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentJobs.map((job, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 text-sm font-medium text-slate-900 dark:text-white">{job.title}</td>
                    <td className="p-3 text-sm text-slate-500">{job.company}</td>
                    <td className="p-3">
                      <Badge variant={job.status === 'Active' ? 'success' : 'secondary'} className="text-[9px] uppercase font-bold px-2 py-0.5">
                        {job.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Applications</h2>
          <Card className="border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplications.map((app, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 text-sm font-medium text-slate-900 dark:text-white">{app.candidate}</td>
                    <td className="p-3 text-sm text-slate-500">{app.role}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.match >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {app.match}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

      </div>
    </div>
  );
}
