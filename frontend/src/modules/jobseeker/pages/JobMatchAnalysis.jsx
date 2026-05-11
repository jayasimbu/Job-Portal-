import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecommendations, applyForJob } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';

const JobMatchAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const userId = getCurrentUserId();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        const data = await fetchRecommendations(userId);
        const found = data.recommendations?.find(j => j.id.toString() === id);
        if (found) {
          setJob(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobDetails();
  }, [id, userId]);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await applyForJob(userId, job.id);
      showToast(`Applied successfully to ${job.company} ✅`);
      setJob({ ...job, hasApplied: true });
    } catch (err) {
      showToast("Application failed ❌");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <div className="p-8 font-black uppercase tracking-widest text-slate-400">Analyzing Compatibility...</div>;
  if (!job) return <div className="p-8 font-bold text-red-500">Job not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
        <div className="flex items-center gap-6">
           <div className="size-20 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center font-black text-4xl text-slate-300">
              {job.company?.[0]}
           </div>
           <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
              <p className="text-lg font-semibold text-blue-600 uppercase tracking-wider">{job.company} • {job.location}</p>
           </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Status</span>
           <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase border border-emerald-100">Actively Hiring</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDE: JOB DESCRIPTION */}
        <div className="lg:col-span-7 space-y-8">
           <section className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                 <span className="material-symbols-outlined text-slate-900">description</span>
                 <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Detailed Job Description</h2>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600">The Role</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {job.description || "As a Senior Developer, you will be responsible for architecting and implementing scalable solutions, mentoring junior engineers, and driving technical excellence across our platform."}
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600">Core Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium">
                       <li>Lead development of high-performance microservices.</li>
                       <li>Collaborate with product and design teams to build intuitive user experiences.</li>
                       <li>Optimize application performance and scalability for millions of users.</li>
                       <li>Participate in code reviews and advocate for engineering best practices.</li>
                    </ul>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600">Technical Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                       {['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes', 'CI/CD'].map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs font-bold text-slate-500 uppercase tracking-widest">{skill}</span>
                       ))}
                    </div>
                 </div>
              </div>
           </section>
        </div>

        {/* RIGHT SIDE: RESUME ANALYSIS */}
        <div className="lg:col-span-5 space-y-8">
           <section className="bg-slate-900 text-white rounded-lg p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Analysis Engine</p>
                       <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Compatibility Score</h2>
                    </div>
                    <div className="text-right">
                       <p className="text-5xl font-bold">{Math.round(job.match_score || 72)}%</p>
                    </div>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${job.match_score || 72}%` }}></div>
                 </div>
                 <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                   "Based on your resume, you have a strong match for the core technical stack, but adding Docker experience would significantly improve your chances."
                 </p>
              </div>
              <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[12rem] text-white/5 rotate-12">psychology</span>
           </section>

           {/* OUTPUT SECTION: SKILLS COMPARISON */}
           <section className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm space-y-8">
              <div className="grid grid-cols-1 gap-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                       Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {['React', 'Node.js', 'MongoDB', 'JavaScript'].map(s => (
                          <span key={s} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">✔ {s}</span>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <span className="material-symbols-outlined text-red-500 text-sm">cancel</span>
                       Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {['Docker', 'AWS', 'Kubernetes'].map(s => (
                          <span key={s} className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-[10px] font-bold border border-red-100 uppercase tracking-widest">✘ {s}</span>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50 space-y-4">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Strategic Recommendations</h4>
                 <ul className="space-y-3">
                    {[
                       'Highlight your deployment projects in the resume.',
                       'Improve keyword density for backend optimization roles.',
                       'Mention CI/CD tools you have explored even if self-taught.'
                    ].map((rec, i) => (
                       <li key={i} className="flex gap-3 text-xs font-semibold text-slate-600">
                          <span className="text-blue-600">•</span> {rec}
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="pt-8">
                 <button 
                  onClick={handleApply}
                  disabled={job.hasApplied || isApplying}
                  className={`w-full h-14 rounded-md text-xs font-bold uppercase tracking-widest transition-all shadow-md ${
                    job.hasApplied 
                      ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  }`}
                 >
                   {job.hasApplied ? 'Application Sent ✅' : isApplying ? 'Processing Application...' : 'Apply for this Role'}
                 </button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default JobMatchAnalysis;
