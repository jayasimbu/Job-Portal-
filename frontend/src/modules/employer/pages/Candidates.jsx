import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronDown, 
  ChevronRight,
  Calendar, 
  Clock, 
  User, 
  Users,
  Briefcase,
  CheckCircle2, 
  XCircle,
  X,
  ArrowUpDown,
  History,
  Loader2,
  AlertCircle

} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { fetchAllCandidates, fetchEmployerJobs } from '../services/employerService';
import { getCurrentUserId } from '../../../core/auth/session';
import apiClient from '../../../core/api/apiClient';


// ── Dropdown Component Helper ──────────────────────────────────────────────
const FilterDropdown = ({ isOpen, onClose, filters, setFilters, roles }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 p-5 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Advanced Filters</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
      </div>

      {/* Date Filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Date</label>
        <select 
          className="w-full h-10 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-3 outline-none"
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Role Filter (Inside dropdown now) */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specific Job Role</label>
        <select 
          className="w-full h-10 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-3 outline-none"
          value={filters.role}
          onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
        >
          <option value="All">All Active Roles</option>
          {roles.map(r => (
            <option key={r.id} value={r.title}>{r.title}</option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort By</label>
        <select 
          className="w-full h-10 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-3 outline-none"
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="score_high">Highest Match Score</option>
          <option value="score_low">Lowest Match Score</option>
        </select>
      </div>

      <div className="pt-2">
        <Button 
          variant="primary" 
          className="w-full h-11 text-[10px] font-black uppercase tracking-widest"
          onClick={onClose}
        >
          Apply Filters
        </Button>
        <button 
          className="w-full mt-3 text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
          onClick={() => {
            setFilters({ dateRange: 'all', role: 'All', sortBy: 'newest' });
            onClose();
          }}
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default function Candidates() {
  const navigate = useNavigate();
  const employerId = getCurrentUserId();
  
  // ── State ──────────────────────────────────────────────────────────────────
  const [candidates, setCandidates] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [filters, setFilters] = useState({ 
    dateRange: 'all', 
    role: 'All', 
    sortBy: 'newest',
    status: 'all'
  });


  // ── Fetching ───────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!employerId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const [candRes, jobsRes] = await Promise.all([
        fetchAllCandidates(employerId),
        fetchEmployerJobs(employerId)
      ]);
      setCandidates(candRes.candidates || []);
      setRoles(jobsRes.jobs || []);
      setError(null);
    } catch (err) {
      console.error('Pipeline load error:', err);
      const msg = err.response?.data?.detail || err.message || 'Unknown network error';
      setError(`Failed to load pipeline: ${msg}`);
    } finally {
      setLoading(false);
    }

  }, [employerId]);


  useEffect(() => { loadData(); }, [loadData]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await apiClient.post('/employer/candidates/status', {
        application_id: applicationId,
        status: newStatus
      });
      if (response.data) {
        setCandidates(prev => prev.map(c => 
          c.application_id === applicationId ? { ...c, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) } : c
        ));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // ── Click Outside to Close ────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Filtering Logic ────────────────────────────────────────────────────────
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.skills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filters.role === 'All' || c.role === filters.role;
    const matchesStatus = filters.status === 'all' || c.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateRange !== 'all' && c.applied_at) {
      const appliedDate = new Date(c.applied_at);
      const now = new Date();
      const diffDays = (now - appliedDate) / (1000 * 60 * 60 * 24);
      if (filters.dateRange === 'today') matchesDate = diffDays < 1;
      else if (filters.dateRange === 'yesterday') matchesDate = diffDays >= 1 && diffDays < 2;
      else if (filters.dateRange === 'week') matchesDate = diffDays < 7;
      else if (filters.dateRange === 'month') matchesDate = diffDays < 30;
    }
    return matchesSearch && matchesRole && matchesDate && matchesStatus;
  }).sort((a, b) => {
    if (filters.sortBy === 'newest') return new Date(b.applied_at) - new Date(a.applied_at);
    if (filters.sortBy === 'oldest') return new Date(a.applied_at) - new Date(b.applied_at);
    if (filters.sortBy === 'score_high') return b.score - a.score;
    if (filters.sortBy === 'score_low') return a.score - b.score;
    return 0;
  });

  const isActuallyEmpty = !loading && !error && candidates.length === 0;
  const isFilteredEmpty = !loading && !error && candidates.length > 0 && filteredCandidates.length === 0;

  const quickTabs = [
    { id: 'all', label: 'All Talent', icon: Users },
    { id: 'Applied', label: 'New Apps', icon: Clock },
    { id: 'Shortlisted', label: 'Shortlisted', icon: CheckCircle2 },
    { id: 'Rejected', label: 'Rejected', icon: XCircle },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-16 px-6 pt-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Hiring Workspace</h1>
          <p className="text-sm font-medium text-slate-500">Manage and evaluate your incoming talent pool.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
          <History size={16} className="text-blue-600" />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{candidates.length} Total Applicants</span>
        </div>
      </div>

      {/* QUICK TABS */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-fit">
        {quickTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilters(prev => ({ ...prev, status: tab.id }))}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              (filters.status || 'all') === tab.id 
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 relative" ref={dropdownRef}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search candidates by name or skill keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
          />
        </div>
        
        <div className="flex gap-2 relative">
          <Button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="secondary" 
            className={`h-12 px-6 rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm ${isFilterOpen ? 'bg-slate-100 dark:bg-slate-800 border-blue-500' : 'bg-white dark:bg-slate-900'}`}
          >
            <Filter size={16} /> Filters
            <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </Button>

          <FilterDropdown 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
            filters={filters} 
            setFilters={setFilters} 
            roles={roles}
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4">
          <Loader2 size={40} className="text-blue-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing Pipeline...</p>
        </div>
      ) : error ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="size-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-1">
            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Connection Issue</p>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
          <Button onClick={loadData} variant="primary" className="h-10 px-8 text-[10px] font-black uppercase tracking-widest rounded-xl">
            Retry Connection
          </Button>
        </div>
      ) : isActuallyEmpty ? (
        <div className="py-24 flex flex-col items-center justify-center text-center gap-6 bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-[32px]">
          <div className="size-20 rounded-[32px] bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-300">
             <User size={40} />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Pipeline is Empty</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">You haven't received any applications yet. Post a new job to start receiving candidates.</p>
          </div>
          <Button onClick={() => navigate('/platform/employer/post-job')} variant="primary" className="h-12 px-10 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">
            Post Your First Job
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[32px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Info</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Role</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Match</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.application_id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{cand.candidate_name}</h3>
                             <Badge variant={cand.status === 'Shortlisted' ? 'success' : cand.status === 'Rejected' ? 'danger' : 'secondary'} className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                               {cand.status}
                             </Badge>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock size={10} /> Applied {new Date(cand.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2">
                          <Briefcase size={14} className="text-slate-300" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cand.role}</span>
                       </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[11px] font-black text-blue-600">{cand.score}%</span>
                        <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${cand.score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(cand.application_id, 'shortlisted')}
                          className={`size-9 rounded-xl flex items-center justify-center transition-colors border ${cand.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 border-transparent hover:border-emerald-100'}`}
                          title="Shortlist"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                           onClick={() => handleStatusUpdate(cand.application_id, 'rejected')}
                           className={`size-9 rounded-xl flex items-center justify-center transition-colors border ${cand.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 border-transparent hover:border-rose-100'}`}
                           title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-slate-100 dark:bg-slate-800 border-none hover:bg-blue-600 hover:text-white transition-all ml-2"
                          onClick={() => navigate(`/platform/employer/candidates/${cand.application_id}`)}
                        >
                          Details <ChevronRight size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing {filteredCandidates.length} Candidates</p>
             <div className="flex gap-2">
                <Button variant="ghost" disabled size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest">Prev</Button>
                <Button variant="ghost" disabled size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest">Next</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
