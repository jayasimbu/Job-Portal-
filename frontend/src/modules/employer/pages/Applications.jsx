import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  User, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { fetchEmployerJobs, fetchRankedCandidates } from '../services/employerService';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export default function Applications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = (() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch { return {}; } })();
        const jobs = await fetchEmployerJobs(user.id);
        
        // Mocking application data based on jobs and candidates
        const allApps = [
          { id: 1, job: 'Frontend Developer', candidate: 'Arjun R', score: 84, date: 'Yesterday', status: 'under_review' },
          { id: 2, job: 'Backend Developer', candidate: 'Siddharth M', score: 78, date: '2 days ago', status: 'selected' },
          { id: 3, job: 'UI/UX Designer', candidate: 'Priya M', score: 92, date: '3 days ago', status: 'selected' },
          { id: 4, job: 'Frontend Developer', candidate: 'Rahul S', score: 65, date: 'Yesterday', status: 'rejected' },
          { id: 5, job: 'Product Manager', candidate: 'Ananya K', score: 81, date: '4 days ago', status: 'under_review' },
        ];
        setApplications(allApps);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = !search || 
      app.candidate.toLowerCase().includes(search.toLowerCase()) || 
      app.job.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'under_review': return <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-100 uppercase text-[8px]">Under Review</Badge>;
      case 'rejected': return <Badge variant="danger" className="uppercase text-[8px]">Rejected</Badge>;
      case 'selected': return <Badge variant="success" className="uppercase text-[8px]">Selected</Badge>;
      default: return <Badge variant="secondary" className="uppercase text-[8px]">Applied</Badge>;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-16 px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Applications
          </h1>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {['all', 'under_review', 'rejected', 'selected'].map(tab => (
            <Button 
              key={tab}
              variant={filter === tab ? 'primary' : 'ghost'}
              onClick={() => setFilter(tab)}
              className="h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
            >
              {tab.replace('_', ' ')}
            </Button>
          ))}
        </div>
        
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search applications..."
            className="h-9 pl-9 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            [1,2,3,4].map(i => <div key={i} className="p-8 animate-pulse bg-slate-50/30" />)
          ) : filteredApps.length === 0 ? (
            <div className="p-20 text-center text-slate-400 font-bold uppercase text-[10px]">No applications found.</div>
          ) : filteredApps.map(app => (
            <div key={app.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <User size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{app.job}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">•</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{app.candidate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span className="text-blue-600 font-black">{app.score}% Match</span>
                    <span className="size-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1"><Clock size={10} /> Applied {app.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:block">
                  {getStatusBadge(app.status)}
                </div>
                <div className="flex gap-1.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 border border-transparent hover:border-blue-100"
                    onClick={() => navigate('/platform/employer/candidates')}
                  >
                    Open Candidate
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-100">
                    <MoreVertical size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
