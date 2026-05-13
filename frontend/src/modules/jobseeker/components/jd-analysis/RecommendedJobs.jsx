import React from 'react';
import { Briefcase, MapPin, DollarSign, ArrowUpRight } from 'lucide-react';

const RecommendedJobs = ({ jobs }) => {
  return (
    <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="size-5 text-indigo-600" />
          Recommended Jobs
        </h3>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Top Matches</span>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No recommendations yet.</p>
        ) : (
          jobs.slice(0, 3).map((job, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all font-bold text-lg">
                    {job.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <MapPin className="size-3" />
                        Remote
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <DollarSign className="size-3" />
                        $80k - $120k
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${job.matchPercentage >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {job.matchPercentage}% Match
                  </div>
                  <button className="mt-2 text-indigo-600 hover:text-indigo-700 transition-colors p-1 rounded-full hover:bg-indigo-50">
                    <ArrowUpRight className="size-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.skills.slice(0, 3).map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-400 rounded">
                    +{job.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-200">
        Browse All Match Jobs
      </button>
    </div>
  );
};

export default RecommendedJobs;
