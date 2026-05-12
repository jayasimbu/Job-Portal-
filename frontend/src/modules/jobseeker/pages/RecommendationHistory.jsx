import React, { useState } from 'react';
import { 
  Search, 
  History, 
  Globe, 
  ExternalLink, 
  RefreshCcw, 
  Trash2, 
  Sparkles, 
  Zap,
  ArrowRight,
  Filter,
  Calendar
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function RecommendationHistory() {
  const [activeTab, setActiveTab] = useState('internal'); 

  const historyItems = [
    {
      id: 1,
      type: 'search',
      title: 'Product Designer',
      time: '2 hours ago',
      tags: ['Remote', 'Full-time', '$120k - $160k'],
      dateGroup: 'Today'
    },
    {
      id: 2,
      type: 'external',
      title: 'Senior Frontend Developer',
      company: 'Google',
      source: 'LinkedIn',
      time: '3 hours ago',
      dateGroup: 'Today'
    },
    {
      id: 3,
      type: 'search',
      title: 'UX Researcher',
      time: '5 hours ago',
      tags: ['San Francisco, CA', 'Hybrid'],
      dateGroup: 'Today'
    },
    {
      id: 4,
      type: 'search',
      title: 'Marketing Manager',
      time: '1 day ago',
      tags: ['New York', 'Startup'],
      dateGroup: 'Yesterday'
    }
  ];

  const aiSuggestions = [
    { id: 1, title: 'Lead Product Designer', match: '98%', company: 'Spotify', location: 'Remote', tags: ['Design System', 'Figma'] },
    { id: 2, title: 'Senior UI/UX Designer', match: '94%', company: 'Linear', location: 'San Francisco', tags: ['SaaS', 'Prototyping'] }
  ];

  const filteredItems = historyItems.filter(item => 
    activeTab === 'internal' ? item.type === 'search' : item.type === 'external'
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.dateGroup]) acc[item.dateGroup] = [];
    acc[item.dateGroup].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pt-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Activity Hub</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Historical Search & Match Data</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50">
            <Trash2 size={14} /> Clear History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MAIN FEED (8 Units) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TABS & FILTERS */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl">
              {['internal', 'external'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {tab === 'internal' ? 'Internal Searches' : 'External View'}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 pr-2">
               <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Calendar size={18} />
               </button>
               <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Filter size={18} />
               </button>
            </div>
          </div>

          {/* ACTIVITY LIST */}
          <div className="space-y-6">
            {Object.entries(groupedItems).length === 0 ? (
              <div className="py-24 text-center">
                 <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                    <History size={32} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent Activity Found</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([groupName, items]) => (
                <div key={groupName} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{groupName}</h3>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className={`size-12 rounded-xl flex items-center justify-center ${item.type === 'search' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'} dark:bg-slate-800 border border-transparent group-hover:border-current transition-colors`}>
                            {item.type === 'search' ? <Search size={20} /> : <Globe size={20} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.type === 'search' ? (
                                item.tags.map(tag => (
                                  <span key={tag} className="text-[9px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700 uppercase tracking-widest">{tag}</span>
                                ))
                              ) : (
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.company} • {item.source}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="secondary" className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-800">
                          {item.type === 'search' ? <RefreshCcw size={14} /> : <ExternalLink size={14} />}
                          {item.type === 'search' ? 'Rerun' : 'Source'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SIDEBAR (4 Units) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI MATCH SUGGESTIONS */}
          <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-[2rem] p-7 shadow-xl space-y-6">
             <div className="flex items-center gap-3">
                <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                   <Sparkles size={16} />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AI Intelligence</h2>
             </div>
             
             <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-wide">
                Based on your interest in <span className="text-white font-black">"Product Designer"</span>
             </p>

             <div className="space-y-4">
                {aiSuggestions.map(s => (
                  <div key={s.id} className="group p-4 bg-slate-800/30 border border-slate-800/50 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-black text-sm text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{s.title}</h4>
                      <span className="text-[9px] font-black text-emerald-400">{s.match} Match</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">{s.company} • {s.location}</p>
                    <div className="flex flex-wrap gap-1.5">
                       {s.tags.map(t => <span key={t} className="text-[8px] font-black text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded uppercase">{t}</span>)}
                    </div>
                  </div>
                ))}
             </div>

             <Button className="w-full h-11 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10">
                Explore Recommendations <ArrowRight size={14} />
             </Button>
          </div>

          {/* ACTION CARD */}
          <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Zap size={100} fill="white" />
             </div>
             <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Optimize<br />Your Rank</h3>
                <p className="text-xs font-bold text-blue-100 uppercase tracking-widest leading-relaxed">Update your skills to unlock 2x more matches.</p>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest">
                   Sync Resume
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}



