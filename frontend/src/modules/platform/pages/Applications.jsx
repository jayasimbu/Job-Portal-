import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../core/components/EmptyState';

const Applications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setApps([
        { id: 1, role: 'Senior React Developer', company: 'GlobalTech', date: '2 days ago', status: 'Interviewing', color: 'blue', step: 2 },
        { id: 2, role: 'Frontend Engineer', company: 'Nexus Labs', date: '5 days ago', status: 'Applied', color: 'slate', step: 0 },
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const SkeletonRow = () => (
    <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse shadow-sm">
      <div className="flex gap-4">
        <div className="size-12 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
      <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Hiring Pipeline</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your active applications in real-time.</p>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {loading ? (
          <div className="space-y-4">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : apps.length > 0 ? (
          <div className="space-y-4 pb-6">
            {apps.map(app => (
              <div key={app.id} className="flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all shadow-sm group">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-2xl font-black text-lg text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                      {app.company[0]}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">{app.role}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1">{app.company} • Applied {app.date}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-6">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-${app.color === 'blue' ? 'blue-50 text-blue-600' : 'slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {app.status}
                    </div>
                    <button className="material-symbols-outlined text-slate-400 hover:text-blue-600 transition-colors">
                      arrow_forward_ios
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 w-full max-w-md md:ml-16">
                  {['Applied', 'Screening', 'Interview', 'Offer'].map((step, idx) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={`size-3 rounded-full transition-all duration-700 ${idx <= app.step ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        <span className={`text-[8px] font-black uppercase tracking-widest ${idx <= app.step ? 'text-blue-600' : 'text-slate-400'}`}>{step}</span>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-[2px] mb-4 rounded-full transition-all duration-1000 ${idx < app.step ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon="rocket_launch"
            title="No applications yet"
            description="Your hiring journey starts here. Explore tailored job matches and send your first application."
            actionText="Explore Opportunities"
            onAction={() => navigate('/platform/jobs')}
          />
        )}
      </div>
    </div>
  );
};

export default Applications;
