import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  Users, 
  Target, 
  MoreVertical,
  Edit2,
  Trash2,
  ChevronRight,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    location: 'Chennai',
    type: 'Full Time',
    experience: '5+ Years',
    applicants: 24,
    avg_match: 82,
    status: 'Active',
    skills: ['React', 'Tailwind', 'Node.js']
  },
  {
    id: 2,
    title: 'Backend Developer (Node.js)',
    location: 'Remote',
    type: 'Full Time',
    experience: '3+ Years',
    applicants: 18,
    avg_match: 79,
    status: 'Active',
    skills: ['Express', 'MongoDB', 'AWS']
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    location: 'Bangalore',
    type: 'Contract',
    experience: '2+ Years',
    applicants: 12,
    avg_match: 85,
    status: 'Active',
    skills: ['Figma', 'Prototyping', 'User Research']
  },
  {
    id: 4,
    title: 'Product Manager',
    location: 'Remote',
    type: 'Full Time',
    experience: '4+ Years',
    applicants: 42,
    avg_match: 76,
    status: 'Draft',
    skills: ['Product Strategy', 'Agile', 'Jira']
  }
];

const JobCard = ({ job, onApplicants, onEdit }) => (
  <Card className="border-slate-200 shadow-sm hover:border-blue-200 transition-all overflow-hidden group">
    <div className="flex flex-col md:flex-row items-stretch">
      {/* JOB INFO */}
      <div className="flex-1 p-5 flex items-center gap-5">
        <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <Briefcase size={22} />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h4>
          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-300" /> {job.location}</span>
            <span className="size-1 bg-slate-200 rounded-full" />
            <span>{job.type}</span>
            <span className="size-1 bg-slate-200 rounded-full" />
            <span>{job.experience}</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="px-5 py-5 md:py-0 flex items-center gap-8 bg-slate-100/50 dark:bg-slate-800/30 border-y md:border-y-0 md:border-x border-slate-200 dark:border-slate-700">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Applicants</span>
          <p className="text-lg font-black text-slate-900 dark:text-white">{job.applicants}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Match</span>
          <p className="text-lg font-black text-blue-600">{job.avg_match}%</p>
        </div>
        <div className="hidden lg:flex flex-col gap-1.5">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Core Skills</span>
          <div className="flex gap-1">
            {job.skills.map((s, idx) => (
              <span key={idx} className="text-[8px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-slate-500 uppercase tracking-tighter">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="p-5 flex items-center justify-between md:justify-end gap-3 min-w-[240px]">
        <Badge variant={job.status === 'Active' ? 'success' : 'secondary'} className="text-[9px] px-2 py-0 uppercase font-black">
          {job.status}
        </Badge>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="h-9 px-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap" onClick={() => onApplicants(job.id)}>
            View Applicants
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 border border-slate-200 hover:border-slate-300" onClick={() => onEdit(job.id)}>
            <Edit2 size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 border border-slate-200 hover:border-rose-100 hover:text-rose-500">
            <MoreVertical size={14} />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export default function JobManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-16 px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Jobs
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your recruitment pipeline and active role inventory.
          </p>
        </div>
        <Button onClick={() => navigate('/platform/employer/post-job')} className="h-10 px-6 rounded-lg font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-blue-500/10">
          <Plus size={16} />
          Create New Job
        </Button>
      </div>

      {/* FILTER ROW */}
      <Card className="border-slate-200 shadow-sm p-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, skills..."
              className="w-full h-10 pl-9 pr-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            {['Status', 'Location', 'Experience', 'Job Type'].map(filter => (
              <select key={filter} className="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                <option>{filter}</option>
              </select>
            ))}
            <Button variant="secondary" className="h-10 w-10 p-0 rounded-lg">
              <Filter size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* JOBS LIST - 1-by-1 */}
      <div className="space-y-3">
        {mockJobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onApplicants={() => navigate('/platform/employer/candidates')}
            onEdit={() => navigate(`/platform/employer/jobs`)}
          />
        ))}
      </div>
    </div>
  );
}
