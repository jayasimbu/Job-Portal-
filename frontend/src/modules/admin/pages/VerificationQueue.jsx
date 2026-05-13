import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShieldAlert, CheckCircle2, XCircle, Eye, AlertTriangle, Clock, UserCheck } from 'lucide-react';
import apiClient from '@/core/api/apiClient';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

export default function VerificationQueue() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [reviewNote, setReviewNote] = useState({});

  const fetchQueue = useCallback(() => {
    setLoading(true);
    apiClient.get(`/admin/resumes/queue?status=${statusFilter}&page=${page}&page_size=15`)
      .then(r => {
        setItems(r.data.items || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.total_pages || 1);
      })
      .catch(() => console.error('Failed to load verification queue.'))
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const reviewItem = async (id, action) => {
    try {
      await apiClient.put(`/admin/resumes/${id}/review`, { action, notes: reviewNote[id] || '' });
      fetchQueue();
    } catch { console.error('Action failed.'); }
  };

  const riskColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  };

  const statusColors = {
    pending: 'secondary',
    approved: 'success',
    flagged: 'warning',
    rejected: 'danger'
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Identity Verification
          </h1>
          <p className="text-slate-500 font-medium">
            Review and audit entity verification requests.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <Card className="border-slate-300 shadow-sm overflow-visible">
        <CardBody className="p-4 flex flex-wrap gap-2">
          {['pending', 'approved', 'flagged', 'rejected', 'all'].map(s => (
            <Button 
              key={s} 
              variant={statusFilter === s ? 'primary' : 'ghost'}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              {s}
            </Button>
          ))}
        </CardBody>
      </Card>

      {/* VERIFICATION TABLE */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700">
                {['Entity', 'Type', 'Risk Level', 'Status', 'Submitted', ''].map(h => (
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
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">No requests in queue.</td>
                </tr>
              ) : items.map(item => (
                <tr key={item.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.user_name}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      {item.certificate_name ? 'Certification' : 'Profile Audit'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={riskColors[item.risk_level] || 'secondary'} className="text-[9px] px-2 py-0.5 uppercase">
                      {item.risk_level}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[item.status] || 'secondary'} className="text-[9px] px-2 py-0.5 uppercase font-black">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-500">{item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : '—'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="size-8 p-0 hover:text-emerald-600"
                        onClick={() => reviewItem(item.id, 'approved')}
                      >
                        <CheckCircle2 size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="size-8 p-0 hover:text-amber-600"
                        onClick={() => reviewItem(item.id, 'flagged')}
                      >
                        <AlertTriangle size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="size-8 p-0 hover:text-rose-600"
                        onClick={() => reviewItem(item.id, 'rejected')}
                      >
                        <XCircle size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800/50 border-t border-slate-300 dark:border-slate-700 flex items-center justify-between">
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



