import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerShell from '../components/EmployerShell';

const mockJobs = [
  {
    id: 1,
    title: 'Senior Machine Learning Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    postedDate: 'Oct 10, 2023',
    applicants: 142,
    topMatches: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYuQ5Wb4YUb3VcE5ZuCPH7o2ZEvd7_4f3wShBbfwlKQfEzLGO9k5VrJrk1d2M=s96-c',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAq9fjdFQNfBFMn6zfxWvR7kxHtKqXGsLc0CW6p8Gj5fEzLGO9k5VrJrk1d2M=s96-c',
    ],
    status: 'Active',
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    postedDate: 'Oct 5, 2023',
    applicants: 98,
    topMatches: [],
    status: 'Active',
  },
  {
    id: 3,
    title: 'Backend Engineer (Node.js)',
    department: 'Engineering',
    location: 'New York, NY',
    postedDate: 'Sep 28, 2023',
    applicants: 0,
    topMatches: [],
    status: 'Draft',
  },
  {
    id: 4,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    postedDate: 'Sep 15, 2023',
    applicants: 85,
    topMatches: [],
    status: 'Closed',
  },
];

const statusConfig = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const statusDotConfig = {
  Active: 'bg-green-500',
  Draft: 'bg-yellow-500',
  Closed: 'bg-gray-500',
};

export default function JobManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Sort by: Date');

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f4f8] dark:bg-[#0d141b] text-[#0d141b] dark:text-white">
      <EmployerShell active="jobs" />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="layout-container flex flex-col p-6 md:p-10 max-w-[1400px] mx-auto w-full gap-8">

            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  Job Management
                </h1>
                <p className="text-[#4c739a] text-base font-normal leading-normal">
                  Manage your active listings and track hiring progress.
                </p>
              </div>
              <button
                onClick={() => navigate('/platform/employer/post-job')}
                className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-[#2563eb] hover:bg-blue-600 text-white text-sm font-bold leading-normal transition-all shadow-md shadow-blue-500/20"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                <span className="truncate">Post New Job</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Active Jobs', value: '12', change: '+2 this week', icon: 'work_outline', changeColor: 'text-[#078838] bg-[#078838]/10' },
                { label: 'Total Candidates', value: '486', change: '+15% vs last mo', icon: 'groups', changeColor: 'text-[#078838] bg-[#078838]/10' },
                { label: 'Interviews', value: '24', change: 'Coming up', icon: 'calendar_month', changeColor: 'text-orange-500 bg-orange-500/10' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1A2633] border border-[#cfdbe7] dark:border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[#4c739a] text-sm font-medium leading-normal">{stat.label}</p>
                    <span className="material-symbols-outlined text-[#2563eb] text-2xl">{stat.icon}</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <p className="text-[#0d141b] dark:text-white tracking-tight text-3xl font-bold leading-tight">{stat.value}</p>
                    <span className={`${stat.changeColor} px-2 py-0.5 rounded text-xs font-bold mb-1`}>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#1A2633] p-4 rounded-xl border border-[#cfdbe7] dark:border-gray-800 shadow-sm items-center">
              {/* Search */}
              <div className="flex-1 w-full md:w-auto relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#4c739a]">search</span>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-[#f6f7f8] dark:bg-gray-800 text-[#0d141b] dark:text-white placeholder-[#4c739a] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
                  placeholder="Search by job title or keyword..."
                />
              </div>
              {/* Filters */}
              <div className="flex w-full md:w-auto gap-3">
                <div className="relative w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm rounded-xl bg-[#f6f7f8] dark:bg-gray-800 text-[#0d141b] dark:text-white appearance-none cursor-pointer"
                  >
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Closed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#4c739a]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <div className="relative w-full md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm rounded-xl bg-[#f6f7f8] dark:bg-gray-800 text-[#0d141b] dark:text-white appearance-none cursor-pointer"
                  >
                    <option>Sort by: Date</option>
                    <option>Sort by: Applicants</option>
                    <option>Sort by: Title</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#4c739a]">
                    <span className="material-symbols-outlined">sort</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Data Table */}
            <div className="flex flex-col rounded-xl border border-[#cfdbe7] dark:border-gray-800 bg-white dark:bg-[#1A2633] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#cfdbe7] dark:divide-gray-800">
                  <thead className="bg-[#f8f9fa] dark:bg-gray-900/50">
                    <tr>
                      {['Job Title', 'Posted Date', 'Applicants', 'Top AI Matches', 'Status', 'Actions'].map((col, i) => (
                        <th
                          key={col}
                          scope="col"
                          className={`px-6 py-4 text-xs font-semibold text-[#4c739a] uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#cfdbe7] dark:divide-gray-800 bg-white dark:bg-[#1A2633]">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#4c739a]">
                          <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                          No jobs found matching your search.
                        </td>
                      </tr>
                    ) : filteredJobs.map((job) => (
                      <tr
                        key={job.id}
                        className={`hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors ${job.status === 'Closed' ? 'opacity-70' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-bold text-[#0d141b] dark:text-white">{job.title}</div>
                            <div className="text-xs text-[#4c739a]">{job.department} • {job.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0d141b] dark:text-gray-300">{job.postedDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#0d141b] dark:text-white">{job.applicants}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {job.applicants > 0 ? (
                            <div className="flex items-center -space-x-2 overflow-hidden">
                              {[...Array(Math.min(3, Math.ceil(job.applicants / 50)))].map((_, i) => (
                                <div
                                  key={i}
                                  className="inline-flex h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1A2633] bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center text-white text-xs font-bold"
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No matches yet</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[job.status]}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusDotConfig[job.status]}`}></span>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {job.status !== 'Closed' ? (
                              <>
                                <button className="text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                  <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                  <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                                <button className="text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                  <span className="material-symbols-outlined text-xl">archive</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#f8f9fa] dark:bg-gray-900/30 border-t border-[#cfdbe7] dark:border-gray-800">
                <div className="text-sm text-[#4c739a]">
                  Showing <span className="font-medium text-[#0d141b] dark:text-white">1</span> to{' '}
                  <span className="font-medium text-[#0d141b] dark:text-white">{filteredJobs.length}</span> of{' '}
                  <span className="font-medium text-[#0d141b] dark:text-white">{mockJobs.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-[#cfdbe7] dark:border-gray-700 text-[#4c739a] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#2563eb] text-white text-sm font-bold shadow-sm">1</button>
                  <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-[#cfdbe7] dark:border-gray-700 text-[#0d141b] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
                  <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-[#cfdbe7] dark:border-gray-700 text-[#0d141b] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">3</button>
                  <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-[#cfdbe7] dark:border-gray-700 text-[#4c739a] hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
