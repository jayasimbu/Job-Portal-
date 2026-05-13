import React from 'react';

export default function JobCrawlResults({ jobs = [] }) {
  const defaultJobs = [
    {
      id: "crawl_1",
      title: "Senior Full Stack Dev",
      company: "TechNova Solutions",
      location: "Remote, US",
      salary: "$120k - $150k",
      platform: "LinkedIn",
      matchScore: 88,
      posted: "2 hours ago",
      url: "#"
    },
    {
      id: "crawl_2",
      title: "React Engineer (Frontend)",
      company: "InnovateCorp",
      location: "New York, NY",
      salary: "Not specified",
      platform: "Indeed",
      matchScore: 92,
      posted: "1 day ago",
      url: "#"
    },
    {
      id: "crawl_3",
      title: "Python Backend Lead",
      company: "DataStream Systems",
      location: "San Francisco, CA",
      salary: "$140k - $180k",
      platform: "Naukri",
      matchScore: 75,
      posted: "3 days ago",
      url: "#"
    }
  ];

  const jobsList = jobs.length > 0 ? jobs : defaultJobs;

  const getPlatformIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'linkedin': return 'work';
      case 'indeed': return 'search';
      case 'naukri': return 'business';
      default: return 'language';
    }
  };

  const getPlatformColors = (platform) => {
    switch(platform.toLowerCase()) {
      case 'linkedin': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
      case 'indeed': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50';
      case 'naukri': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-purple-600 bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg shadow-sm">spider</span>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Web Crawl</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">External jobs sourced from across the web</p>
        </div>
      </div>
      
      {jobsList.map(job => (
        <a 
          key={job.id} 
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-300 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-800/50 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPlatformColors(job.platform)} flex items-center gap-1`}>
                  <span className="material-symbols-outlined !text-[12px]">{getPlatformIcon(job.platform)}</span>
                  {job.platform}
                </span>
                <span className="text-xs text-slate-400 font-medium">• {job.posted}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {job.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{job.company}</p>
            </div>
            {job.matchScore && (
              <div className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 px-2 py-1.5 rounded-lg border border-green-200 dark:border-green-800/50">
                <span className="text-xs font-bold text-green-700 dark:text-green-400">{job.matchScore}%</span>
                <span className="text-[10px] text-green-600/70 dark:text-green-400/70 uppercase tracking-widest">Match</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-3 border-t border-slate-200 dark:border-slate-700 mt-2">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-[16px]">location_on</span>
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-[16px]">payments</span>
              {job.salary}
            </span>
          </div>
        </a>
      ))}
      
      <button className="w-full py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        Load More External Jobs
      </button>
    </div>
  );
}



