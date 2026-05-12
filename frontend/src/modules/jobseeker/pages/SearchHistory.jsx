import React from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function SearchHistory() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors ">
      <JobSeekerShell active="search-history" />
      
      <main className="flex-1 overflow-y-auto w-full p-4 lg:p-10 lg:py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Search & Activity History */}
        <section className="flex-1 min-w-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Search History & Activity
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg">
              Manage your recent searches and viewed jobs across platforms.
            </p>
          </div>

          {/* Controls Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Segmented Control */}
            <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl inline-flex w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white text-sm font-bold transition-all">
                Internal Searches
              </button>
              <button className="flex-1 sm:flex-none px-6 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium transition-all">
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

          {/* Timeline: Today */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              Today
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                3 Activities
              </span>
            </h3>
            <div className="flex flex-col gap-4">
              
              {/* Item 1: Search */}
              <div className="group bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600">
                      <span className="material-symbols-outlined text-[24px]">search</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Product Designer</h4>
                        <span className="text-xs text-slate-400 font-medium">2 hours ago</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">Remote</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">Full-time</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">$120k - $160k</span>
                      </div>
                    </div>
                  </div>
                  <button className="sm:self-center shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors w-full sm:w-auto">
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    Rerun
                  </button>
                </div>
              </div>

              {/* Item 2: External View */}
              <div className="group bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                <div className="flex flex-col sm:flex-row justify-between gap-4 pl-2">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Senior Frontend Developer</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">External View</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Google • Viewed on LinkedIn</p>
                      <span className="text-xs text-slate-400">3 hours ago</span>
                    </div>
                  </div>
                  <div className="sm:self-center flex items-center gap-3 shrink-0">
                    <a className="flex items-center gap-1 text-blue-600 dark:text-blue-500 text-sm font-semibold hover:underline" href="#">
                      View Source
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 3: Search */}
              <div className="group bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600">
                      <span className="material-symbols-outlined text-[24px]">search</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">UX Researcher</h4>
                        <span className="text-xs text-slate-400 font-medium">5 hours ago</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">San Francisco, CA</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">Hybrid</span>
                      </div>
                    </div>
                  </div>
                  <button className="sm:self-center shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-colors w-full sm:w-auto">
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    Rerun
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline: Yesterday */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              Yesterday
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                2 Activities
              </span>
            </h3>
            <div className="flex flex-col gap-4">
              {/* Item 4: Search */}
               <div className="group bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600">
                      <span className="material-symbols-outlined text-[24px]">search</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Marketing Manager</h4>
                        <span className="text-xs text-slate-400 font-medium">1 day ago</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">New York</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">Startup</span>
                      </div>
                    </div>
                  </div>
                  <button className="sm:self-center shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-colors w-full sm:w-auto">
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    Rerun
                  </button>
                </div>
              </div>

              {/* Item 5: External View */}
              <div className="group bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                <div className="flex flex-col sm:flex-row justify-between gap-4 pl-2">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Creative Director</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">External View</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Airbnb • Viewed on Indeed</p>
                      <span className="text-xs text-slate-400">1 day ago</span>
                    </div>
                  </div>
                  <div className="sm:self-center flex items-center gap-3 shrink-0">
                    <a className="flex items-center gap-1 text-blue-600 dark:text-blue-500 text-sm font-semibold hover:underline" href="#">
                      View Source
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#1e293b] dark:to-[#131d26] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Suggestions</h3>
              </div>
              <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Based on your search for <span className="font-bold text-slate-800 dark:text-slate-200">"Product Designer"</span> and recent activity.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group" href="#">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors text-sm">Lead Product Designer</h4>
                  <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-1.5 py-0.5 rounded">98% Match</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Spotify • Remote</p>
                <div className="flex gap-1.5">
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">Design System</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">Figma</span>
                </div>
              </a>

              <a className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group" href="#">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors text-sm">Senior UI/UX Designer</h4>
                  <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-1.5 py-0.5 rounded">94% Match</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Linear • San Francisco</p>
                <div className="flex gap-1.5">
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">SaaS</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">Prototyping</span>
                </div>
              </a>
            </div>

            <button className="w-full mt-4 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              View All Recommendations
            </button>
          </div>

          <div className="rounded-2xl bg-indigo-600 text-white p-6 relative overflow-hidden group mt-2">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform "></div>
            <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full group-hover:scale-110 transition-transform "></div>
            <h4 className="font-bold text-lg mb-2 relative z-10">Upload your Resume</h4>
            <p className="text-indigo-100 text-sm mb-4 relative z-10">Get 2x better AI recommendations by uploading your latest CV.</p>
            <button className="bg-white text-indigo-600 text-sm font-bold px-4 py-2 rounded-lg relative z-10 hover:bg-indigo-50 transition-colors">
              Update Profile
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
}



