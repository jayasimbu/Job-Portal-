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
  ArrowRight,
  Zap,
  Sparkles,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { fetchEmployerJobs } from '../services/employerService';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import SectionTitle from '../../../components/shared/SectionTitle';
import FilterTabs from '../../../components/shared/FilterTabs';
import SearchBar from '../../../components/shared/SearchBar';
import Button from '../../../components/ui/Button';

export default function Applications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulation of fetching real data
        const allApps = [
          { id: 1, job: 'Lead AI Engineer', candidate: 'Arjun R', score: 94, date: '2h ago', status: 'reviewing', skills: ['PyTorch', 'Vector DBs'] },
          { id: 2, job: 'Senior Backend Engineer', candidate: 'Siddharth M', score: 82, date: '5h ago', status: 'selected', skills: ['Node.js', 'PostgreSQL'] },
          { id: 3, job: 'UI/UX Designer', candidate: 'Priya M', score: 91, date: '1d ago', status: 'selected', skills: ['Figma', 'A11y'] },
          { id: 4, job: 'React Developer', candidate: 'Rahul S', score: 68, date: '1d ago', status: 'rejected', skills: ['React', 'CSS'] },
          { id: 5, job: 'Lead AI Engineer', candidate: 'Ananya K', score: 88, date: '2d ago', status: 'reviewing', skills: ['LLMs', 'Prompt Eng'] },
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
    const matchesFilter = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = !search || 
      app.candidate.toLowerCase().includes(search.toLowerCase()) || 
      app.job.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusTabs = [
    { id: 'all', label: 'All Feed' },
    { id: 'reviewing', label: 'Reviewing' },
    { id: 'selected', label: 'Shortlisted' },
    { id: 'rejected', label: 'Archived' }
  ];

  return (
    <div className="space-y-8 pt-4 pb-20 max-w-6xl mx-auto">
      
      <PageHeader 
        title="Application Feed" 
        subtitle="Real-time stream of incoming talent matched to your active roles."
        breadcrumbs={["Platform", "Employer", "Applications"]}
      />

      {/* Controller Area */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="w-full md:w-1/3">
            <SearchBar placeholder="Filter feed..." onSearch={setSearch} />
         </div>
         <FilterTabs 
           tabs={statusTabs}
           activeTab={activeTab}
           onTabChange={setActiveTab}
         />
      </div>

      {/* Main Feed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <SectionTitle 
             title={`${filteredApps.length} Recent Interactions`} 
             description="Live talent stream ordered by neural match score."
           />
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Activity size={14} className="text-emerald-500" /> Live Updates
           </div>
        </div>

        <div className="card-premium overflow-hidden">
           <div className="divide-y divide-gray-50 dark:divide-gray-800">
             {loading ? (
               [1,2,3,4].map(i => <div key={i} className="p-12 animate-pulse bg-gray-50/20 dark:bg-gray-900/20" />)
             ) : filteredApps.length === 0 ? (
               <div className="p-20 text-center space-y-4">
                  <div className="size-16 bg-gray-50 dark:bg-gray-900 rounded-2xl mx-auto flex items-center justify-center text-gray-300">
                     <Filter size={32} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Clear filters to see all applications</p>
               </div>
             ) : filteredApps.map(app => (
               <div key={app.id} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-all group">
                 
                 <div className="flex items-center gap-6">
                    {/* Neural Match Circle */}
                    <div className="relative shrink-0">
                       <svg className="size-14 transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary" strokeDasharray={150.7} strokeDashoffset={150.7 - (150.7 * app.score) / 100} />
                       </svg>
                       <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-gray-900 dark:text-white">{app.score}%</span>
                    </div>

                    <div className="space-y-1.5">
                       <div className="flex items-center gap-3">
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{app.candidate}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                             app.status === 'selected' ? 'bg-emerald-500/10 text-emerald-500' :
                             app.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                             'bg-amber-500/10 text-amber-500'
                          }`}>
                             {app.status}
                          </span>
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Briefcase size={10} className="text-gray-300" /> {app.job}</span>
                          <span className="w-px h-3 bg-gray-100 dark:bg-gray-800" />
                          <span className="flex items-center gap-1.5"><Clock size={10} className="text-gray-300" /> {app.date}</span>
                       </div>
                       <div className="flex gap-2 pt-1">
                          {app.skills.map(s => (
                            <span key={s} className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-0.5">{s}</span>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      className="rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:bg-primary/5"
                      onClick={() => navigate(`/platform/employer/candidates/${app.id}`)}
                    >
                      Analyze Profile <ArrowUpRight size={14} className="ml-2" />
                    </Button>
                    <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                       <MoreVertical size={18} />
                    </button>
                 </div>

               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pt-4">
         <Sparkles size={14} className="text-primary" />
         Showing the most relevant interactions from the last 30 days.
      </div>

    </div>
  );
}
