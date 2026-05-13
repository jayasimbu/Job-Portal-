import React, { useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function JobMatchBreakdown() {
  const [activeTab, setActiveTab] = useState('overview');

  const jobDetails = {
    title: 'Senior UX Designer',
    company: 'TechFlow Inc.',
    location: 'San Francisco (Hybrid)',
    salary: '$120k - $150k',
    type: 'Full-time',
    aiMatchScore: 88,
    whyFit: 'Your experience in user research and prototyping strongly aligns with the core requirements. However, proficiency in Motion Design (After Effects) is missing.',
    matchedSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    missingSkills: ['After Effects', 'Motion Design']
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors ">
      <JobSeekerShell active="dashboard" />
      
      <main className="flex-1 overflow-y-auto w-full max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-10">
        
        {/* Job Heading Section */}
        <div className="mb-8 rounded-2xl bg-slate-50 dark:bg-slate-800 p-6 shadow-sm border border-slate-300 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div className="flex gap-5 items-center">
              <div className="size-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center p-2 shrink-0 border border-slate-300 dark:border-slate-600">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">
                  T
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-tight">
                  {jobDetails.title}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium items-center">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">business</span>
                    {jobDetails.company}
                  </span>
                  <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    {jobDetails.location}
                  </span>
                  <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    {jobDetails.salary}
                  </span>
                  <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                    {jobDetails.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-11 px-6 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined icon-filled">bookmark</span>
                Save
              </button>
              <button className="flex-1 md:flex-none h-11 px-8 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                Apply Now
                <span className="material-symbols-outlined">arrow_outward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: 2 Cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Job Description */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-300 dark:border-slate-700 overflow-x-auto">
              {['Overview', 'Company', 'Reviews'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-300 dark:border-slate-700 flex flex-col gap-8">
              {/* Job Overview */}
              <section>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About the Role</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base mb-4">
                  We are looking for a Senior UX Designer to join our product design team. You will be responsible for leading design workshops, creating high-fidelity prototypes, and ensuring a consistent user experience across our platform. You will work closely with PMs and Engineers to deliver high-quality products that solve real user problems.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                  This role requires a deep understanding of user-centered design principles and a passion for creating intuitive interfaces. You should be comfortable working in a fast-paced environment and iterating quickly based on feedback.
                </p>
              </section>

              {/* Responsibilities */}
              <section>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Responsibilities</h3>
                <ul className="flex flex-col gap-3">
                  {[
                    'Lead design projects from concept to launch, collaborating with cross-functional teams.',
                    'Conduct user research and usability testing to validate design decisions.',
                    'Create wireframes, prototypes, and high-fidelity mockups using Figma.',
                    'Develop and maintain our design system to ensure consistency.',
                    'Mentor junior designers and contribute to the design culture.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 size-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Requirements */}
              <section>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Requirements</h3>
                <ul className="flex flex-col gap-3">
                  {[
                    '5+ years of experience in product design or UX/UI design.',
                    'Strong portfolio showcasing end-to-end design process.',
                    'Proficiency in Figma and prototyping tools.',
                    'Experience with Motion Design (After Effects) is a plus.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Benefits */}
              <section>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Perks & Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: 'medical_services', text: 'Full Health Coverage' },
                    { icon: 'beach_access', text: 'Unlimited PTO' },
                    { icon: 'laptop_mac', text: 'New MacBook Pro' },
                    { icon: 'school', text: 'Learning Budget' }
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50">
                      <span className="material-symbols-outlined text-blue-600">{benefit.icon}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Right Column: AI Match Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
            
            {/* AI Match Card */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-300 dark:border-slate-700">
              {/* Header Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    AI Match Insights
                  </h3>
                  <span className="bg-slate-50/20 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm">Beta</span>
                </div>
              </div>
              
              <div className="p-6">
                {/* Match Score */}
                <div className="flex flex-col items-center justify-center mb-8 relative">
                  <div className="relative size-32">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                      <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                      <path className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${jobDetails.aiMatchScore}, 100`} strokeWidth="3.5" strokeLinecap="round"></path>
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{jobDetails.aiMatchScore}%</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Match</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                    {jobDetails.whyFit}
                  </p>
                </div>

                {/* Skills Breakdown */}
                <div className="flex flex-col gap-6">
                  {/* Matched Skills */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                      Matched Skills
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs">
                        {jobDetails.matchedSkills.length} Found
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.matchedSkills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-800">
                          <span className="material-symbols-outlined text-[18px]">check</span>{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-px w-full bg-slate-100 dark:bg-slate-700"></div>

                  {/* Missing Skills */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                      Missing Skills
                      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full text-xs">
                        {jobDetails.missingSkills.length} Gaps
                      </span>
                    </h4>
                    <div className="flex flex-col gap-3">
                      {jobDetails.missingSkills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10">
                          <span className="inline-flex items-center gap-2 text-orange-800 dark:text-orange-300 font-medium text-sm">
                            <span className="material-symbols-outlined text-[18px]">warning</span>{skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other similar jobs mini-list */}
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Similar High Matches
              </h4>
              <div className="flex flex-col gap-4">
                <a className="flex gap-3 items-center group" href="#">
                  <div className="size-10 rounded bg-blue-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="font-bold text-blue-600 dark:text-blue-400">G</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                      Product Designer
                    </p>
                    <p className="text-xs text-slate-500">Google • Remote</p>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">
                    94%
                  </span>
                </a>
                <a className="flex gap-3 items-center group" href="#">
                  <div className="size-10 rounded bg-rose-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="font-bold text-rose-600 dark:text-rose-400">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                      UX Researcher
                    </p>
                    <p className="text-xs text-slate-500">Airbnb • San Francisco</p>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">
                    88%
                  </span>
                </a>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}



