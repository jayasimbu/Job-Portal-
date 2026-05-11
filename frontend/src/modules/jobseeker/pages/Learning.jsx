import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLearningRecommendations } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';

// Import Design System
import { SectionHeader, SkillChip, ProgressBar, StatCard } from '../components/DesignSystem';

const ROADMAP_STEPS = [
  { title: 'Frontend Fundamentals', skills: ['HTML', 'CSS', 'JS'], status: 'completed' },
  { title: 'Modern React Ecosystem', skills: ['React', 'Redux', 'Next.js'], status: 'current' },
  { title: 'Backend & APIs', skills: ['Node.js', 'Express', 'PostgreSQL'], status: 'upcoming' },
  { title: 'Cloud & Deployment', skills: ['Docker', 'AWS', 'CI/CD'], status: 'upcoming' },
  { title: 'AI Integration', skills: ['OpenAI API', 'Vector DBs', 'LLMs'], status: 'upcoming' },
];

const SKILL_GAPS = [
  { skill: 'Kubernetes', demand: 'High', importance: 'Critical', gap: 60 },
  { skill: 'AWS Lambda', demand: 'Medium', importance: 'High', gap: 45 },
  { skill: 'System Design', demand: 'High', importance: 'Critical', gap: 30 },
  { skill: 'GraphQL', demand: 'Medium', importance: 'Medium', gap: 20 },
];

const Learning = () => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      if (!userId) return;
      try {
        const data = await fetchLearningRecommendations(userId);
        setCourses(data.learning || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">AI Upskilling Engine</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Strategic learning paths to bridge your market gaps</p>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Growth Index</span>
           <span className="text-sm font-black text-blue-600 uppercase tracking-tight">Level 4 Developer</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: SKILL GAPS & COURSES */}
        <div className="lg:col-span-8 space-y-12">
           {/* 1. SKILL GAP SECTION */}
           <section className="space-y-8">
              <SectionHeader title="Skill Gap Analysis" icon="analytics" iconColor="text-rose-500" bgColor="bg-rose-50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {SKILL_GAPS.map((gap, i) => (
                   <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-6">
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{gap.skill}</h3>
                         <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                           gap.importance === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                         }`}>
                           {gap.importance}
                         </span>
                      </div>
                      <div className="space-y-6">
                         <ProgressBar label="Proficiency Gap" value={gap.gap} />
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Demand:</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{gap.demand}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           {/* 2. RECOMMENDED COURSES */}
           <section className="space-y-8">
              <SectionHeader title="Curated Learning Resources" icon="auto_stories" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {loading ? (
                   [1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-50 border border-slate-100 rounded-[2rem] animate-pulse" />)
                 ) : (courses.length > 0 ? courses : [
                    { id: 1, title: 'Advanced React & Next.js Mastery', provider: 'Coursera', duration: '8 weeks', level: 'Intermediate', match: 95, url: '#' },
                    { id: 2, title: 'TypeScript Design Patterns', provider: 'Udemy', duration: '4 weeks', level: 'Advanced', match: 88, url: '#' },
                 ]).map(course => (
                   <div key={course.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col justify-between group hover:border-blue-500 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                           <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{course.provider}</span>
                           <div className="flex items-center gap-1.5">
                              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{course.match || 92}% Fit</span>
                           </div>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">{course.title}</h3>
                        <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                           <span>{course.duration}</span>
                           <span>•</span>
                           <span>{course.level}</span>
                        </div>
                      </div>
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-10 relative z-10 flex items-center justify-center gap-2 h-14 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 hover:shadow-blue-100"
                      >
                        Enroll Now
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                      <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[10rem] text-slate-50 opacity-[0.05] group-hover:scale-110 transition-transform">school</span>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        {/* RIGHT: CAREER ROADMAP */}
        <div className="lg:col-span-4 space-y-12">
           <section className="space-y-8">
              <SectionHeader title="Career Roadmap" icon="explore" iconColor="text-emerald-600" bgColor="bg-emerald-50" />
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl">
                 <div className="relative z-10 space-y-14">
                    {ROADMAP_STEPS.map((step, i, arr) => (
                      <div key={i} className="flex gap-10 relative">
                         {i !== arr.length - 1 && (
                           <div className={`absolute left-5 top-12 w-0.5 h-14 ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                         )}
                         <div className={`size-10 shrink-0 rounded-full flex items-center justify-center z-10 shadow-lg ${
                           step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                           step.status === 'current' ? 'bg-blue-500 text-white animate-pulse' : 
                           'bg-slate-800 text-slate-500'
                         }`}>
                           <span className="material-symbols-outlined text-lg">{step.status === 'completed' ? 'check' : 'radio_button_checked'}</span>
                         </div>
                         <div className="space-y-4">
                           <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${step.status === 'upcoming' ? 'text-slate-500' : 'text-white'}`}>
                             {step.title}
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {step.skills.map(skill => (
                                <span key={skill} className="px-2.5 py-1.5 bg-white/5 rounded-lg text-[8px] font-black text-slate-400 border border-white/10 uppercase tracking-widest">
                                   {skill}
                                </span>
                              ))}
                           </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[15rem] text-white/5 rotate-12">map</span>
              </div>
           </section>

           <section className="bg-blue-600 rounded-[2rem] p-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                       <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">AI Growth Advisor</h3>
                       <p className="text-xs font-bold leading-tight">Focus on "System Design" next to unlock 40% more roles.</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-700/20">
                    Refresh Intelligence
                 </button>
              </div>
              <span className="absolute -bottom-6 -right-6 material-symbols-outlined text-[8rem] text-white/10 group-hover:scale-110 transition-transform">bolt</span>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Learning;
