import React, { useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function RecommendationLog() {
  // Mock data based on the HTML
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      role: 'Senior UX Designer',
      company: 'TechFlow Inc.',
      location: 'Remote',
      logoLetter: 'T',
      logoGradient: 'from-blue-500 to-blue-600',
      date: 'Oct 24, 2023',
      matchScore: 96,
      status: 'Saved',
      statusColor: 'blue'
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'Creative Studios',
      location: 'New York, NY',
      logoLetter: 'C',
      logoGradient: 'from-purple-500 to-pink-500',
      date: 'Oct 23, 2023',
      matchScore: 78,
      status: 'Viewed',
      statusColor: 'gray'
    },
    {
      id: 3,
      role: 'Lead UI Engineer',
      company: 'FinTech Global',
      location: 'San Francisco, CA',
      logoLetter: 'F',
      logoGradient: 'from-emerald-500 to-teal-600',
      date: 'Oct 21, 2023',
      matchScore: 94,
      status: 'Applied',
      statusColor: 'green'
    },
    {
      id: 4,
      role: 'Junior Web Developer',
      company: 'Startup Rocket',
      location: 'Austin, TX',
      logoLetter: 'S',
      logoGradient: 'from-orange-400 to-red-500',
      date: 'Oct 20, 2023',
      matchScore: 45,
      status: 'Ignored',
      statusColor: 'gray',
      ignored: true
    },
    {
      id: 5,
      role: 'Frontend Developer',
      company: 'BlueOcean Corp',
      location: 'London, UK',
      logoLetter: 'B',
      logoGradient: 'from-cyan-500 to-blue-600',
      date: 'Oct 18, 2023',
      matchScore: 65,
      status: 'Viewed',
      statusColor: 'gray'
    }
  ]);

  const getStatusClasses = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-100 dark:border-blue-800';
      case 'green': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-100 dark:border-green-800';
      case 'gray': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400 bg-green-500';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500';
    return 'text-red-500 dark:text-red-400 bg-red-400';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors ">
      <JobSeekerShell active="dashboard" />
      
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8 max-w-[1400px] mx-auto w-full">
        {/* Page Heading */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-[#0d141b] dark:text-white">
              Recommendation History
            </h1>
            <p className="text-[#4c739a] dark:text-gray-400 text-base font-normal max-w-2xl">
              Review your past AI job suggestions, track your application status, and revisit the opportunities you might have missed.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-[#e7edf3] dark:border-gray-700 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export Log
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="w-full lg:w-96 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4c739a]">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="w-full h-11 rounded-lg border border-[#e7edf3] dark:border-gray-700 bg-slate-100 dark:bg-slate-950 pl-10 pr-4 text-[#0d141b] dark:text-white placeholder:text-[#4c739a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Search by job title or company"
                type="text"
              />
            </div>
            
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center lg:justify-end">
              <span className="text-sm font-medium text-[#4c739a] dark:text-gray-500 mr-1 hidden sm:block">Filter by:</span>
              
              {['Date Range', 'Action Taken', 'Match Score', 'Industry'].map(filter => (
                <button key={filter} className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-[#f0f4f8] dark:bg-gray-800 hover:bg-[#e1e7ef] dark:hover:bg-gray-700 pl-3 pr-2 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                  <span className="text-[#0d141b] dark:text-gray-200 text-sm font-medium">{filter}</span>
                  <span className="material-symbols-outlined text-gray-500 text-[18px]">expand_more</span>
                </button>
              ))}
              
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-[#4c739a] hover:bg-[#f0f4f8] dark:hover:bg-gray-800 transition-colors ml-1"
                title="Clear Filters"
              >
                <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-gray-800 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e7edf3] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] dark:text-gray-400 min-w-[300px]">
                    Job & Company
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] dark:text-gray-400 cursor-pointer hover:text-blue-600 group">
                    <div className="flex items-center gap-1">
                      Date Recommended
                      <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100">arrow_downward</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] dark:text-gray-400 cursor-pointer hover:text-blue-600 group min-w-[180px]">
                    <div className="flex items-center gap-1">
                      Match Score
                      <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100">arrow_downward</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] dark:text-gray-400">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] dark:text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7edf3] dark:divide-gray-800">
                {recommendations.map(rec => (
                  <tr key={rec.id} className={`group hover:bg-[#f8faff] dark:hover:bg-gray-800/50 transition-colors ${rec.ignored ? 'opacity-60 hover:opacity-100' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-slate-50 border border-gray-100 p-1 flex items-center justify-center shrink-0 shadow-sm">
                          <div className={`w-full h-full bg-gradient-to-br ${rec.logoGradient} rounded flex items-center justify-center text-white font-bold text-lg`}>
                            {rec.logoLetter}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-[#0d141b] dark:text-white leading-tight">
                            {rec.role}
                          </p>
                          <p className="text-sm text-[#4c739a] dark:text-gray-400">
                            {rec.company} • {rec.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-[#0d141b] dark:text-gray-200">{rec.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                        <div className="flex justify-between items-end">
                          <span className={`text-sm font-bold ${getScoreColor(rec.matchScore).split(' ')[0]} ${getScoreColor(rec.matchScore).split(' ')[1]}`}>
                            {rec.matchScore}% Match
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getScoreColor(rec.matchScore).split(' ')[2]}`}
                            style={{ width: `${rec.matchScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusClasses(rec.statusColor)}`}>
                        {rec.status === 'Applied' && <span className="material-symbols-outlined text-[14px]">check</span>}
                        {rec.status === 'Saved' && <span className="size-1.5 rounded-full bg-blue-500"></span>}
                        {rec.status === 'Viewed' && <span className="size-1.5 rounded-full bg-gray-500"></span>}
                        {rec.status === 'Ignored' && <span className="material-symbols-outlined text-[14px]">close</span>}
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          {rec.status === 'Applied' ? 'View Status' : rec.ignored ? 'Undo' : 'View Job'}
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-[#0d141b] dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-[#e7edf3] dark:border-gray-800 flex items-center justify-between">
            <p className="text-sm text-[#4c739a] dark:text-gray-400">
              Showing <span className="font-bold text-[#0d141b] dark:text-white">1</span> to <span className="font-bold text-[#0d141b] dark:text-white">5</span> of <span className="font-bold text-[#0d141b] dark:text-white">24</span> recommendations
            </p>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1.5 rounded-lg border border-[#e7edf3] dark:border-gray-700 text-sm font-medium text-gray-400 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-[#e7edf3] dark:border-gray-700 text-sm font-medium text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Empty State / Promo area (Optional, kept minimal) */}
        <div className="mt-8 flex justify-center">
          <p className="text-sm text-[#4c739a] dark:text-gray-500 text-center">
            Looking for more matches? <a className="text-blue-600 font-medium hover:underline" href="#">Head to your Dashboard</a> to process today's queue.
          </p>
        </div>
      </main>
    </div>
  );
}



