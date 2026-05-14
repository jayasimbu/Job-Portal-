import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Clock
} from 'lucide-react';

// UI Components
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { fetchEmployerJobs, deleteJobPosting } from '../services/employerService';
import { getCurrentUserId } from '../../../core/auth/session';

const JobCard = ({ job, onApplicants, onEdit, onDelete, isDeleting }) => (
  <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-200 dark:hover:border-blue-900 transition-all overflow-hidden group bg-white dark:bg-slate-900">
    <div className="flex flex-col md:flex-row items-stretch">
      {/* JOB INFO */}
      <div className="flex-1 p-5 flex items-center gap-5">
        <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
          <Briefcase size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors truncate">
            {job.title}
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-300" /> {job.location || 'Remote'}</span>
            <span className="size-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <span>{job.job_type || 'Full Time'}</span>
            <span className="size-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <span>{job.experience_level || 'Not Specified'}</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="px-5 py-5 md:py-0 flex items-center gap-8 bg-slate-50 dark:bg-slate-800/20 border-y md:border-y-0 md:border-x border-slate-200 dark:border-slate-700">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Applicants</span>
          <p className="text-lg font-black text-slate-900 dark:text-white">{job.applicants_count || 0}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Salary Range</span>
          <p className="text-sm font-bold text-blue-600">{job.salary || 'Competitive'}</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="p-5 flex items-center justify-between md:justify-end gap-3 min-w-[280px]">
        <Badge variant={job.active ? 'success' : 'secondary'} className="text-[9px] px-2 py-0.5 uppercase font-black">
          {job.active ? 'Active' : 'Draft'}
        </Badge>
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            className="h-9 px-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap" 
            onClick={() => onApplicants(job.id)}
          >
            View Applicants
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600" 
            onClick={() => onEdit(job.id)}
          >
            <Edit2 size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            onClick={() => onDelete(job.id)}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export default function JobManagement() {
  const navigate = useNavigate();
  const employerId = getCurrentUserId();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadJobs = useCallback(async () => {
    if (!employerId) return;
    try {
      setLoading(true);
      const data = await fetchEmployerJobs(employerId);
      setJobs(data.jobs || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError('Failed to load your job postings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [employerId]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;
    
    try {
      setDeletingId(jobId);
      await deleteJobPosting(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Failed to delete job posting. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-16 px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Manage Jobs
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Monitor and manage your active role inventory.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/platform/employer/post-job')} 
          className="h-10 px-6 rounded-lg font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-blue-500/20 bg-blue-600 text-white"
        >
          <Plus size={16} />
          Post New Job
        </Button>
      </div>

      {/* FILTER ROW */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm p-3 bg-white dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by job title or location..."
              className="w-full h-10 pl-9 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <select className="h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer dark:text-slate-300">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <Button variant="secondary" className="h-10 w-10 p-0 rounded-lg bg-slate-100 dark:bg-slate-800 border-0">
              <Filter size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* CONTENT */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={40} className="text-blue-600 animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading your jobs...</p>
        </div>
      ) : error ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
          <div className="size-16 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500">
            <AlertCircle size={32} />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{error}</p>
            <Button onClick={loadJobs} variant="ghost" className="mt-2 text-blue-600 underline">Try again</Button>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-300 dark:border-slate-700 rounded-[32px]">
          <div className="size-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
            <Briefcase size={40} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {search ? "No matching jobs found" : "No job postings yet"}
            </p>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {search 
                ? "Try adjusting your search terms to find what you're looking for." 
                : "Your recruitment journey starts here. Post your first job opening to start receiving top-tier applications."}
            </p>
          </div>
          {!search && (
            <Button 
              onClick={() => navigate('/platform/employer/post-job')} 
              className="h-12 px-8 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Post Your First Job
              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onApplicants={(id) => navigate(`/platform/employer/candidates?jobId=${id}`)}
              onEdit={(id) => navigate(`/platform/employer/post-job?editId=${id}`)}
              onDelete={handleDelete}
              isDeleting={deletingId === job.id}
            />
          ))}
        </div>
      )}

      {/* QUICK STATS FOOTER */}
      {!loading && !error && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Briefcase size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Total Active Roles</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{jobs.filter(j => j.active).length}</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Users size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Candidates</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {jobs.reduce((acc, job) => acc + (job.applicants_count || 0), 0)}
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <Clock size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Avg Time to Hire</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">12 Days</p>
          </div>
        </div>
      )}
    </div>
  );
}
