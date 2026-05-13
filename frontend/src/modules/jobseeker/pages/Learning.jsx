import React, { useEffect, useState } from 'react';
import { BookOpen, Award, Code, ExternalLink, PlayCircle, ArrowRight, Loader } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { getCurrentUserId } from '../../../core/auth/session';
import { fetchLearningRecommendations } from '../services/jobseekerService';

export default function Learning() {
  const userId = getCurrentUserId();
  const [data, setData] = useState({ courses: [], roadmap: [], certifications: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (userId) {
          const res = await fetchLearningRecommendations(userId);
          setData(res.learning || { courses: [], roadmap: [], certifications: [] });
        }
      } catch (err) {
        console.error("Failed to fetch learning recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="animate-spin text-blue-600" size={32} />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tailoring your curriculum...</p>
      </div>
    );
  }

  const { courses, roadmap, certifications } = data;

  return (
    <div className="space-y-6 pb-16 pt-2">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Learning</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Recommendations based on your skill gaps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Courses & Roadmap */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* COURSES */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                <PlayCircle size={16} />
              </div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Recommended Courses</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map((course, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col h-full">
                  <div className="flex-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{course.provider || 'Online Course'}</p>
                     <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-3">{course.title}</h3>
                     <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                        <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{course.duration || 'Flexible'}</span>
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">{course.level || 'Intermediate'}</span>
                     </div>
                  </div>
                  <a href={course.url || "#"} target="_blank" rel="noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    View Course <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* SKILL ROADMAP */}
          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg flex items-center justify-center">
                <Code size={16} />
              </div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Skill Roadmap</h2>
            </div>
            
            <div className="space-y-3">
              {roadmap.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded uppercase tracking-widest">{item.milestone || 'Upcoming'}</span>
                      </div>
                      <p className="text-[12px] font-medium text-slate-500 leading-relaxed">{item.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(item.skills || []).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded text-[10px] font-bold border border-purple-100 dark:border-purple-800/50">
                            {s}
                          </span>
                        ))}
                      </div>
                   </div>
                   <Button variant="secondary" className="shrink-0 h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                     Start
                   </Button>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Certifications */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
               <div className="size-8 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg flex items-center justify-center">
                 <Award size={16} />
               </div>
               <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Certifications</h2>
             </div>
             
             <div className="space-y-3">
               {certifications.map((cert, idx) => (
                 <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl p-3 flex flex-col gap-1.5 hover:border-amber-300/50 transition-colors">
                    <h3 className="text-[12px] font-bold text-slate-900 dark:text-white">{cert.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500">{cert.provider || cert.skill}</p>
                    <button className="mt-1 w-fit text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center gap-1">
                      Explore <ExternalLink size={11} />
                    </button>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
