import React from 'react';
import { BookOpen, Award, Code, ExternalLink, PlayCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Learning() {
  const courses = [
    { id: 1, title: 'Docker for Frontend Developers', platform: 'Coursera', duration: '4 weeks', level: 'Beginner' },
    { id: 2, title: 'AWS Cloud Practitioner Essentials', platform: 'AWS Training', duration: '6 hours', level: 'Beginner' },
    { id: 3, title: 'Advanced React Patterns', platform: 'Frontend Masters', duration: '10 hours', level: 'Advanced' }
  ];

  const projects = [
    { id: 1, title: 'Full-stack E-commerce with CI/CD', description: 'Build a React app and deploy it using Docker and AWS.', skills: ['Docker', 'AWS', 'React'] },
    { id: 2, title: 'System Design Mock Architecture', description: 'Design a scalable system handling 1M users.', skills: ['System Design', 'Architecture'] }
  ];

  const certs = [
    { id: 1, title: 'AWS Certified Cloud Practitioner', provider: 'Amazon Web Services' },
    { id: 2, title: 'Docker Certified Associate', provider: 'Docker Inc' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 px-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Learning</h1>
        <p className="text-slate-500 font-medium text-base">
          Skill improvement recommendations based on your missing requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Courses & Projects */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* COURSES */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <PlayCircle size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Courses</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map(course => (
                <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                  <div className="flex-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{course.platform}</p>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-4">{course.title}</h3>
                     <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">{course.duration}</span>
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">{course.level}</span>
                     </div>
                  </div>
                  <Button variant="ghost" className="mt-6 w-full justify-center gap-2 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
                    View Course <ExternalLink size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECTS */}
          <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Code size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Suggestions</h2>
            </div>
            
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                   <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{proj.title}</h3>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.skills.map(s => (
                          <span key={s} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded text-xs font-bold border border-purple-100 dark:border-purple-800/50">
                            {s}
                          </span>
                        ))}
                      </div>
                   </div>
                   <Button variant="secondary" className="shrink-0 h-10 px-6">
                     Start Project
                   </Button>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Certifications */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                 <Award size={20} />
               </div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">Certifications</h2>
             </div>
             
             <div className="space-y-4">
               {certs.map(cert => (
                 <div key={cert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cert.title}</h3>
                    <p className="text-xs font-semibold text-slate-500">{cert.provider}</p>
                    <Button variant="ghost" className="mt-2 w-fit h-8 px-0 text-amber-600 hover:text-amber-700 hover:bg-transparent">
                      Explore Cert <ExternalLink size={14} className="ml-1" />
                    </Button>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
