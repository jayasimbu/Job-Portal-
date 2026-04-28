import React, { useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function GrowthInsights() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'skillgap', icon: 'analytics', label: 'Skill Gap' },
    { id: 'profile', icon: 'trending_up', label: 'Growth Profile' },
    { id: 'courses', icon: 'auto_awesome', label: 'AI Course Picks' },
    { id: 'external', icon: 'public', label: 'External Courses' }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <JobSeekerShell active="learning" />
      
      <main className="flex-1 overflow-y-auto w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <button className="hover:text-blue-600 transition-colors">Home</button>
          <span>/</span>
          <button className="hover:text-blue-600 transition-colors">Dashboard</button>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">My Growth</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">
              My Growth &amp; Learning
            </h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-purple-500">bolt</span>
              You are upskilling <strong className="text-slate-700 dark:text-slate-200">2× faster</strong> than average candidates for your role.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-lg">download</span>
              Download Report
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl font-black text-blue-600">88%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Role Readiness</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">↑ +12% this month</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl font-black text-purple-600">5</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Courses Completed</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl font-black text-amber-500">3</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Skills Gaps Remaining</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl font-black text-emerald-500">12</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Skills Added</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'skillgap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold mb-4">Role Readiness</h2>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative size-44 flex items-center justify-center">
                    {/* Placeholder for circular gauge */}
                    <div className="absolute inset-0 rounded-full border-[14px] border-slate-100 dark:border-slate-800"></div>
                    <div className="absolute inset-0 rounded-full border-[14px] border-blue-600" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)' }}></div>
                    <div className="flex flex-col items-center justify-center z-10">
                      <span className="text-4xl font-extrabold">88%</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">Match Score</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Technical Skills</span><span className="font-bold">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Cultural Fit</span><span className="font-bold">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Leadership</span><span className="font-bold">78%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold mb-1">Improvement Velocity</h2>
                <p className="text-xs text-slate-500 mb-6">Skill growth over last 6 months</p>
                <div className="space-y-5">
                  <SkillVelocity title="React.js" bump="+25%" start={60} current={85} color="blue" />
                  <SkillVelocity title="Figma Prototyping" bump="+15%" start={75} current={90} color="blue" />
                  <SkillVelocity title="Leadership" bump="+8%" start={50} current={58} color="amber" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex gap-5 items-center">
                <div className="relative">
                  <div className="size-20 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
                    SJ
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Sarah Jenkins</h2>
                  <p className="text-slate-500">Senior UX Designer • San Francisco, CA</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">Actively Interviewing</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">trending_up</span>High Potential
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Chart Area Placeholder */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-lg font-bold">Growth Velocity</h2>
                      <p className="text-xs text-slate-500">Learning activity & resume updates trend</p>
                    </div>
                  </div>
                  <div className="h-48 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <span className="text-slate-500 text-sm font-medium">Chart visualization</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-bold mb-6">6-Month Upskilling Timeline</h2>
                  <div className="ml-2 pl-6 border-l-2 border-slate-100 dark:border-slate-800 relative space-y-8">
                    <TimelineItem date="January 15" timeago="2 weeks ago" text="Completed Advanced Certification" sub="Earned 'Advanced React Patterns' from Frontend Masters." icon="workspace_premium" color="purple" />
                    <TimelineItem date="December 10" timeago="1 month ago" text="Added 3 New Projects" sub="Updated portfolio with freelance UX case studies." icon="add_task" color="emerald" badges={['#A11y', '#DesignSystem']} />
                    <TimelineItem date="November 02" timeago="2 months ago" text="Enrolled in Leadership Course" sub="Started 'UX Management & Strategy' on Coursera." icon="school" color="blue" />
                    <TimelineItem date="October 15" timeago="3 months ago" text="Resume Update" sub="Major revision adding quantified results to Experience section." icon="update" color="slate" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-base mb-4">Key Strengths</h3>
                  <div className="space-y-3">
                    <StrengthItem icon="star" color="emerald" title="Top 5% in Figma" sub="Verified via portfolio" />
                    <StrengthItem icon="groups" color="blue" title="Team Leadership" sub="3 years management experience" />
                    <StrengthItem icon="workspace_premium" color="purple" title="Fast Learner" sub="5 certifications in 6 months" />
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity">
                  <div>
                    <p className="font-bold">View Full Resume Analysis</p>
                    <p className="text-blue-100 text-sm">ATS Score & Skill Gaps</p>
                  </div>
                  <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function SkillVelocity({ title, bump, start, current, color }) {
  const isBlue = color === 'blue';
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1.5">
        <span className="dark:text-white">{title}</span>
        <span className={`text-${color}-600 dark:text-${color}-400 text-xs font-bold bg-${color}-50 dark:bg-${color}-900/20 px-2 py-0.5 rounded-full flex items-center gap-1`}>
          {bump} <span className="material-symbols-outlined text-xs">arrow_upward</span>
        </span>
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full relative">
        <div className={`absolute h-full bg-slate-300 dark:bg-slate-600 rounded-l-full`} style={{ width: `${start}%` }}></div>
        <div className={`absolute h-full ${isBlue ? 'bg-blue-500' : 'bg-amber-400'} rounded-full opacity-70`} style={{ width: `${current}%` }}></div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>Start: {start}%</span><span>Current: {current}%</span>
      </div>
    </div>
  );
}

function TimelineItem({ date, timeago, text, sub, icon, color, badges }) {
  return (
    <div className="relative group">
      <div className={`absolute -left-[31px] top-1.5 size-4 rounded-full bg-white dark:bg-slate-900 border-2 border-${color}-500 shadow-[0_0_0_4px_rgba(43,140,238,0.1)]`}></div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-32 shrink-0">
          <p className="text-sm font-bold dark:text-white">{date}</p>
          <p className="text-xs text-slate-500">{timeago}</p>
        </div>
        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
          <h4 className="font-bold flex items-center gap-2 mb-1 dark:text-white">
            <span className={`material-symbols-outlined text-${color}-500 text-base`}>{icon}</span>
            {text}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">{sub}</p>
          {badges && (
            <div className="flex gap-2 mt-2">
              {badges.map((b, i) => (
                <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-md text-xs font-medium">{b}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StrengthItem({ icon, color, title, sub }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/10 border border-${color}-100 dark:border-${color}-800`}>
      <span className={`material-symbols-outlined text-${color}-500`}>{icon}</span>
      <div>
        <p className="font-bold text-sm dark:text-white">{title}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
    </div>
  );
}
