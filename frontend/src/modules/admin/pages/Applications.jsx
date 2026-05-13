import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  TrendingUp,
  User,
  Building2,
  Activity,
  MoreVertical,
  ShieldCheck,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import apiClient from '../../../core/api/apiClient';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const r = await apiClient.get(`/admin/applications?${params}`);
      setApps(r.data.applications || []);
    } catch (err) {
      console.error(err);
      // Fallback to empty if failed
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const statusColors = {
    pending: 'warning',
    reviewed: 'info',
    shortlisted: 'primary',
    hired: 'success',
    rejected: 'danger',
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review all candidate applications across the platform.
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <Card className="border-slate-300 shadow-sm overflow-visible">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl w-full">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by candidate or job..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-slate-600"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* APPLICATIONS TABLE */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700">
                {['Candidate', 'Job & Company', 'Match Score', 'Status', 'Applied Date', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6 h-16 bg-slate-100/50" />
                  </tr>
                ))
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">No applications found.</td>
                </tr>
              ) : apps.map(app => (
                <tr key={app.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 uppercase">
                        {app.user_name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{app.user_name}</p>
                        <p className="text-xs text-slate-500 font-medium">#{app.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{app.job_title}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <Building2 size={12} className="text-slate-300" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.company_name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 min-w-[60px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                             className={`h-full ${app.match_score >= 80 ? 'bg-emerald-500' : app.match_score >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                             style={{ width: `${app.match_score}%` }}
                          />
                       </div>
                       <span className="text-xs font-black text-slate-900 dark:text-white">{app.match_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[app.status] || 'secondary'} className="text-[9px] px-2 py-0.5 uppercase">
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-500">{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '—'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <Eye size={14} className="text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <ArrowUpRight size={14} className="text-slate-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Applications;



