import React, { useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function CourseRecommendations() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Python for Data Science & AI',
      provider: 'Coursera',
      instructor: 'IBM • Dr. Rav Ahuja',
      matchScore: 98,
      rating: 4.8,
      reviews: '12k',
      duration: '24h',
      skills: ['Python', 'Pandas'],
      moreSkills: 2,
      imageBg: 'from-blue-600 to-blue-600',
      icon: 'code'
    },
    {
      id: 2,
      title: 'The Complete Data Viz Bootcamp',
      provider: 'Udemy',
      instructor: 'Jose Portilla',
      matchScore: 92,
      rating: 4.6,
      reviews: '8.5k',
      duration: '18h',
      skills: ['Tableau', 'D3.js'],
      moreSkills: 0,
      imageBg: 'from-purple-500 to-pink-500',
      icon: 'bar_chart'
    },
    {
      id: 3,
      title: 'Google Data Analytics Cert',
      provider: 'Google',
      instructor: 'Google Career Certificates',
      matchScore: 88,
      rating: 4.9,
      reviews: '54k',
      duration: '6mo',
      skills: ['R Prog', 'Cleaning'],
      moreSkills: 4,
      imageBg: 'from-emerald-500 to-teal-600',
      icon: 'analytics'
    },
    {
      id: 4,
      title: 'Machine Learning Fundamentals',
      provider: 'edX',
      instructor: 'UCSanDiego',
      matchScore: 75,
      rating: 4.5,
      reviews: '2.1k',
      duration: '10w',
      skills: ['Algorithms', 'Statistics'],
      moreSkills: 0,
      imageBg: 'from-orange-400 to-red-500',
      icon: 'psychology'
    },
    {
      id: 5,
      title: 'Advanced SQL for Data Scientists',
      provider: 'Udemy',
      instructor: 'Maven Analytics',
      matchScore: 65,
      rating: 4.7,
      reviews: '3.4k',
      duration: '12h',
      skills: ['PostgreSQL', 'Window Functs'],
      moreSkills: 0,
      imageBg: 'from-cyan-500 to-blue-600',
      icon: 'database'
    }
  ]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors ">
      <JobSeekerShell active="learning" />
      
      <main className="flex-1 overflow-y-auto px-4 lg:px-10 py-8 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Stats & Filters */}
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            
            {/* Skill Gap Chart Widget */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-5 shadow-sm">
              <div className="flex flex-col gap-2 mb-4">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">analytics</span>
                  Skill Gap Analysis
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
                  Based on your target: <span className="text-slate-900 dark:text-white font-medium">Senior Data Analyst</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 mb-6">
                <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight truncate">
                  20% Gap
                </p>
                <p className="text-red-600 text-sm font-medium leading-normal">
                  Needs attention
                </p>
              </div>
              <div className="grid gap-y-4 grid-cols-[auto_1fr] items-center">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider w-24">Python</p>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider w-24">Data Viz</p>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider w-24">SQL</p>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider w-24">ML Ops</p>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>

            {/* Filters Widget */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="text-slate-900 dark:text-white text-base font-bold mb-4">
                Filter Courses
              </h3>
              <div className="space-y-4">
                {/* Platform Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Platform</label>
                  <div className="flex flex-col gap-2">
                    {['Coursera', 'Udemy', 'edX'].map((platform, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input defaultChecked={idx===0 || idx===1} className="peer size-4 appearance-none rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 checked:bg-blue-600 checked:border-blue-600 focus:ring-0 focus:ring-offset-0" type="checkbox" />
                          <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                        </div>
                        <span className="text-sm text-slate-900 dark:text-slate-200">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Duration Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Duration</label>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-600 text-white">Any</button>
                    <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">{'< 5h'}</button>
                    <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">5-20h</button>
                  </div>
                </div>
              </div>
            </div>

          </aside>

          {/* Main Content: Headings & Course Grid */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  Recommended Courses
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  AI-curated selection based on your gap analysis for <span className="font-semibold text-blue-600">Senior Data Analyst</span>.
                </p>
              </div>
            </div>

            {/* Warning Panel */}
            <div className="flex flex-col @container">
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 md:flex-row md:items-center shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg shrink-0">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">External Content Warning</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                      You are viewing external content. Enrollment and payment happens on the provider's website.
                    </p>
                  </div>
                </div>
                <label className="relative flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full border-none bg-slate-200 dark:bg-slate-700 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-blue-600 transition-colors">
                  <div className="h-full w-[27px] rounded-full bg-slate-50 shadow-sm"></div>
                  <input defaultChecked className="invisible absolute" type="checkbox" />
                </label>
              </div>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 pt-2 border-b border-slate-300 dark:border-slate-700">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                We found 12 courses matching your profile
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Sort by:</span>
                <select className="bg-transparent text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-0 cursor-pointer p-0 pr-6">
                  <option>Match Score</option>
                  <option>Rating</option>
                  <option>Duration</option>
                </select>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="group flex flex-col bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all hover:border-blue-500/50">
                  
                  {/* Card Image */}
                  <div className={`h-40 w-full bg-gradient-to-br ${course.imageBg} relative flex items-center justify-center text-white`}>
                    <span className="material-symbols-outlined text-5xl opacity-80">{course.icon}</span>
                    <div className="absolute top-3 right-3 bg-slate-50 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">verified</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{course.matchScore}% Match</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-slate-50/95 dark:bg-black/80 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">{course.provider}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {course.instructor}
                      </p>
                    </div>
                    
                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {course.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-100 dark:border-blue-800">
                          {skill}
                        </span>
                      ))}
                      {course.moreSkills > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                          +{course.moreSkills} more
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-300 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-[16px] fill-1">star</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{course.rating}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">({course.reviews})</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {course.duration}
                      </span>
                    </div>

                    {/* Action */}
                    <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                      View Course
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}



