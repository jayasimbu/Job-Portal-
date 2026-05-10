import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';

const JobRecommendations = () => {
  const { resumeData } = useResume();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Simulate fetching AI recommendations based on resume
    const timer = setTimeout(() => {
      setJobs([
        { id: 1, title: 'Senior Cloud Architect', company: 'Amazon', location: 'Remote', salary: '$160k - $200k', match: 92, type: 'Full-time', matchedSkills: ['AWS', 'System Design'] },
        { id: 2, title: 'Backend Engineer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$180k - $220k', match: 85, type: 'Hybrid', matchedSkills: ['Node.js', 'Microservices'] },
        { id: 3, title: 'DevOps Lead', company: 'Spotify', location: 'New York, NY', salary: '$150k - $190k', match: 81, type: 'Full-time', matchedSkills: ['CI/CD', 'Kubernetes'] },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [resumeData]);

  const SkeletonCard = () => (
    <div className="p-6 bg-white border border-slate-200 rounded-3xl animate-pulse shadow-sm">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="size-12 bg-slate-100 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-slate-200 rounded-full" />
              <div className="h-3 w-32 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
        <div className="size-16 bg-slate-200 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 space-y-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Career AI</h1>
          <p className="text-sm text-slate-500">Curated opportunities based on your ATS profile.</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {loading ? 'Curating Opportunities...' : `${jobs.length} High-Fidelity Matches`}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
          {loading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : !resumeData ? (
             <div className="py-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">upload_file</span>
                <p className="text-sm font-bold text-slate-500">Upload your resume to unlock AI recommendations.</p>
             </div>
          ) : (
            <div className="space-y-4 pb-6">
              {jobs.map(job => (
                <div key={job.id} className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 transition-all shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {job.company[0]}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h4>
                          <p className="text-xs font-bold text-slate-500">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[9px] font-black uppercase rounded-lg border border-slate-100">{job.type}</span>
                         <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-lg border border-green-100">{job.salary}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center pt-1">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Match Details:</span>
                         {job.matchedSkills.map(skill => (
                           <span key={skill} className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                             <span className="material-symbols-outlined text-[10px]">check</span> {skill}
                           </span>
                         ))}
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
                       <div className="flex items-center gap-3">
                          <div className="text-right">
                             <span className="block text-2xl font-black text-blue-600 leading-none">{job.match}%</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Match Score</span>
                          </div>
                          <div className="size-10 rounded-full border-[3px] border-blue-600 flex items-center justify-center">
                             <span className="material-symbols-outlined text-blue-600 text-sm">auto_fix_high</span>
                          </div>
                       </div>
                       <button className="w-full md:w-auto h-10 px-8 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-sm">
                         Apply Now
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobRecommendations;
