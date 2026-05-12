import React, { useState, useEffect, useCallback } from 'react';
import { Search, Briefcase, Building2, Eye, Trash2, CheckCircle2, XCircle, Users } from 'lucide-react';
import apiClient from '@/core/api/apiClient';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchJobs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, page_size: 20 });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    
    apiClient.get(`/admin/jobs?${params}`)
      .then(r => {
        setJobs(r.data.jobs || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.total_pages || 1);
      })
      .catch(() => console.error('Failed to load jobs.'))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const updateJobStatus = async (id, status) => {
    try {
      await apiClient.put(`/admin/jobs/${id}/status`, { status });
      fetchJobs();
    } catch { console.error('Action failed.'); }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Jobs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and manage all posted jobs.
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <Card className="border-slate-200 shadow-sm overflow-visible">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-full">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by job title or employer..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-slate-600"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* JOBS TABLE */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                {['Job Title', 'Employer', 'Applications', 'Status', 'Posted Date', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6 h-16 bg-slate-50/50" />
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">No jobs found.</td>
                </tr>
              ) : jobs.map(j => (
                <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{j.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{j.location || 'Remote'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Building2 size={14} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{j.company_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Users size={14} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{j.application_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={j.status === 'open' ? 'success' : 'secondary'} className="text-[9px] px-2 py-0.5">
                      {j.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-500">{j.created_at ? new Date(j.created_at).toLocaleDateString() : '—'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <Eye size={14} className="text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="sm" className="size-8 p-0 hover:text-rose-600">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
           <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-8 text-[10px] uppercase font-black"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="h-8 text-[10px] uppercase font-black"
              >
                Next
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}



