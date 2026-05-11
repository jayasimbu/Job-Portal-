import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecommendations, applyForJob } from '../services/jobseekerService';
import { mapJob } from '../../../core/api/adapters';

const PLATFORM_COLORS = {
  'LinkedIn': 'bg-blue-50 text-blue-700 border-blue-100',
  'Naukri': 'bg-slate-50 text-slate-700 border-slate-100',
  'Indeed': 'bg-blue-50 text-blue-700 border-blue-100',
  'Wellfound': 'bg-slate-50 text-slate-700 border-slate-100',
};

const JobSearch = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState({});
  
  // Filters
  const [location, setLocation] = useState('All');
  const [salary, setSalary] = useState('All');
  const [experience, setExperience] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [minMatch, setMinMatch] = useState(0);

  const [activeFilter, setActiveFilter] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const resp = await fetchRecommendations(user.id);
      const mapped = (resp.recommendations || []).map(j => mapJob(j));
      setJobs(mapped);
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (job) => {
    if (job.applied || isApplying[job.id]) return;
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setIsApplying(prev => ({ ...prev, [job.id]: true }));
    try {
      await applyForJob(user.id, job.id);
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: true } : j));
    } catch (err) {
      setError('Failed to apply.');
    } finally {
      setIsApplying(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesQuery = !query || j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase());
    const matchesLocation = location === 'All' || j.location.includes(location);
    const matchesMatch = (j.matchScore || 75) >= minMatch;
    return matchesQuery && matchesLocation && matchesMatch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* INDUSTRY SEARCH BAR */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-md focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <span className="material-symbols-outlined text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search jobs, companies or skills..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'location', label: 'Location', value: location, icon: 'location_on', options: ['All', 'Remote', 'Bangalore', 'Chennai', 'Mumbai'] },
            { id: 'match', label: 'Match %', value: minMatch > 0 ? `${minMatch}%+` : 'All', icon: 'analytics', options: [0, 50, 70, 85] },
          ].map(filter => (
            <div key={filter.id} className="relative">
              <button 
                onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                className="h-12 px-4 rounded-md border border-slate-200 flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400 text-lg">{filter.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{filter.value === 0 ? filter.label : filter.value}</span>
                <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
              </button>

              {activeFilter === filter.id && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
                  {filter.options.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => {
                        if (filter.id === 'location') setLocation(opt);
                        if (filter.id === 'match') setMinMatch(opt);
                        setActiveFilter(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {opt === 0 ? 'Any Match' : opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* JOB LISTING GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          [1,2,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-lg animate-pulse" />)
        ) : filteredJobs.map(job => (
          <div 
            key={job.id} 
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group"
            onClick={() => setSelectedJob(job)}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="size-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center font-bold text-slate-300 text-xl group-hover:text-blue-600 transition-colors">
                  {job.company?.[0]}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-600">{job.matchScore || 85}% Match</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.platform || 'Direct'}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
              <p className="text-sm font-semibold text-slate-500 mb-4">{job.company} • {job.location}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(job.skills_match?.missing_keywords || ['React', 'Node.js']).slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wide rounded border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-50">
               <button 
                onClick={(e) => { e.stopPropagation(); handleApply(job); }}
                disabled={job.applied || isApplying[job.id]}
                className={`flex-1 h-10 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                  job.applied 
                    ? 'bg-slate-50 text-slate-400 border border-slate-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
               >
                 {job.applied ? 'Applied' : isApplying[job.id] ? 'Sending...' : 'Apply Now'}
               </button>
            </div>
          </div>
        ))}
      </section>

      {/* JOB DETAIL MODAL (INDUSTRY STYLE) */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-slate-50 rounded border border-slate-200 flex items-center justify-center font-bold text-2xl text-slate-300">
                  {selectedJob.company?.[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedJob.title}</h2>
                  <p className="text-sm font-semibold text-slate-500">{selectedJob.company} • {selectedJob.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-900">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Match Summary</p>
                  <p className="text-sm font-semibold text-slate-700">Your profile is a <span className="text-blue-600">{selectedJob.matchScore || 85}% match</span> for this role.</p>
                </div>
                <div className="h-10 w-10 rounded-full border-4 border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-600">
                  {selectedJob.matchScore || 85}%
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Job Description</h4>
                <div className="text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                  {selectedJob.description || "Detailed job description goes here..."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'PostgreSQL'].map(s => (
                      <span key={s} className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold border border-green-100">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Docker', 'AWS'].map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[10px] font-bold border border-slate-100">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <footer className="px-8 py-6 border-t border-slate-100 flex gap-4">
               <button 
                onClick={() => handleApply(selectedJob)}
                disabled={selectedJob.applied || isApplying[selectedJob.id]}
                className={`flex-1 h-12 rounded font-bold text-sm uppercase tracking-wider transition-all ${
                  selectedJob.applied 
                    ? 'bg-slate-100 text-slate-400' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
               >
                 {selectedJob.applied ? 'Applied Successfully' : isApplying[selectedJob.id] ? 'Processing...' : 'Apply Now'}
               </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
