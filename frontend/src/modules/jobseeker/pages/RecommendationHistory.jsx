import React, { useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function RecommendationHistory() {
  const [activeTab, setActiveTab] = useState('internal'); // 'internal' or 'external'

  // Dummy data for searches
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
      dateGroup: 'Today',
      logo: '/assets/logos/linkup_logo.png' // Using generic logo for now
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
    },
    {
      id: 5,
      type: 'external',
      title: 'Creative Director',
      company: 'Airbnb',
      source: 'Indeed',
      time: '1 day ago',
      dateGroup: 'Yesterday',
      logo: '/assets/logos/linkup_logo.png'
    }
  ];

  const aiSuggestions = [
    { id: 1, title: 'Lead Product Designer', match: '98%', company: 'Spotify', location: 'Remote', tags: ['Design System', 'Figma'] },
    { id: 2, title: 'Senior UI/UX Designer', match: '94%', company: 'Linear', location: 'San Francisco', tags: ['SaaS', 'Prototyping'] },
    { id: 3, title: 'Product Design Manager', match: '88%', company: 'Dropbox', location: 'Hybrid', tags: ['Management'] }
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
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JobSeekerShell active="dashboard" /> {/* Or a new nav item if added to shell */}

      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 lg:p-10 lg:py-8 flex flex-col lg:flex-row gap-8 overflow-y-auto">
        {/* Left Column: Search & Activity History */}
        <section className="flex-1 min-w-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Search History &amp; Activity
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg">
              Manage your recent searches and viewed jobs across platforms.
            </p>
          </div>

          {/* Controls Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Segmented Control */}
            <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl inline-flex w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('internal')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'internal' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
                }`}>
                Internal Searches
              </button>
              <button
                onClick={() => setActiveTab('external')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'external' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
                }`}>
                External Activity
              </button>
            </div>

            {/* Filters/Actions */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Date Range</span>
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Timelines */}
          {Object.entries(groupedItems).length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              No activity found for this category.
            </div>
          ) : (
            Object.entries(groupedItems).map(([groupName, items]) => (
              <div key={groupName} className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  {groupName}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{items.length} Activities</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {items.map(item => (
                    item.type === 'search' ? (
                      <div key={item.id} className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                              <span className="material-symbols-outlined text-[24px]">search</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button className="sm:self-center shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors w-full sm:w-auto">
                            <span className="material-symbols-outlined text-[18px]">replay</span>
                            Rerun
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={item.id} className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pl-2">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                              {/* Placeholder generic icon for external, optionally item.logo */}
                              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">domain</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">External View</span>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                {item.company} • Viewed on {item.source}
                              </p>
                              <span className="text-xs text-slate-400">{item.time}</span>
                            </div>
                          </div>
                          <div className="sm:self-center flex items-center gap-3 shrink-0">
                            <a href="#" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">
                              View Source
                              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Footer Action Bar */}
          <div className="mt-12 flex justify-center pb-8">
            <button className="text-slate-500 hover:text-red-500 text-sm font-semibold flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Clear Search History
            </button>
          </div>
        </section>

        {/* Right Column: AI Recommendations (Sidebar) */}
        <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
          {/* AI Recommendation Card */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-[#131d26] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Suggestions</h3>
              </div>
              <button className="text-slate-400 hover:text-blue-500 transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Based on your search for <span className="font-bold text-slate-800 dark:text-slate-200">"Product Designer"</span> and recent activity.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {aiSuggestions.map(s => (
                <a key={s.id} href="#" className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                      {s.title}
                    </h4>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                      {s.match} Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {s.company} • {s.location}
                  </p>
                  <div className="flex gap-1.5">
                    {s.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              View All Recommendations
            </button>
          </div>

          {/* Quick Stats/Promo */}
          <div className="rounded-2xl bg-blue-600 text-white p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform "></div>
            <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full group-hover:scale-110 transition-transform "></div>
            
            <h4 className="font-bold text-lg mb-2 relative z-10">Upload your Resume</h4>
            <p className="text-blue-100 text-sm mb-4 relative z-10">
              Get 2x better AI recommendations by uploading your latest CV.
            </p>
            <button className="bg-white text-blue-600 text-sm font-bold px-4 py-2 rounded-lg relative z-10 hover:bg-blue-50 transition-colors">
              Update Profile
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}



