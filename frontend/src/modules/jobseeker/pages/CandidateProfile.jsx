import { useState } from 'react';

const TABS = ['Resume Analysis', 'Growth History', 'Skill Breakdown', 'Recruiter Notes'];

const experiences = [
  {
    role: 'Senior Product Designer',
    company: 'TechFlow • San Francisco',
    dates: '2021 - Present',
    description: 'Led the redesign of the core analytics dashboard, improving user engagement by 40%. Managed a team of 3 junior designers and established the company\'s first design system using Figma variables.',
    skills: ['Figma', 'React', 'Analytics'],
    current: true,
  },
  {
    role: 'Product Designer',
    company: 'Creative Solutions Inc.',
    dates: '2018 - 2021',
    description: 'Collaborated with PMs to launch 3 new mobile apps. Conducted over 50 user research sessions to validate prototypes.',
    skills: [],
    current: false,
  },
  {
    role: 'UX Designer',
    company: 'StartUp Hub',
    dates: '2016 - 2018',
    description: 'Designed wireframes and high-fidelity mockups for early stage startups.',
    skills: [],
    current: false,
  },
];

const hardSkills = [
  { name: 'Figma & Prototyping', pct: 95 },
  { name: 'User Research', pct: 85 },
  { name: 'HTML/CSS Knowledge', pct: 70 },
];

const softSkills = [
  { name: 'Communication', pct: 90 },
  { name: 'Adaptability', pct: 88 },
];

const interviews = [
  { stage: 'Technical Screen', date: 'Nov 12', result: 'Passed with flying colors', score: '5.0', color: 'text-green-600' },
  { stage: 'Culture Fit', date: 'Nov 14', result: 'Good energy', score: '4.0', color: 'text-[#2563eb]' },
  { stage: 'Portfolio Review', date: 'Nov 15', result: 'Excellent case studies', score: '4.8', color: 'text-green-600' },
];

const certifications = [
  'Google UX Certificate',
  'Advanced React Patterns',
  'Accessibility for Designers',
];

export default function CandidateProfile() {
  const [activeTab, setActiveTab] = useState('Resume Analysis');

  return (
    <div className="bg-slate-50 dark:bg-[#0d141b] text-slate-900 dark:text-slate-200 min-h-screen">
      <div className="layout-container flex flex-col max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6">

        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 py-2 mb-4 items-center">
          <a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:underline">Candidates</a>
          <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          <a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:underline">Product Design</a>
          <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Sarah Jenkins</span>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
            {/* Avatar + Info */}
            <div className="flex gap-6 items-center flex-1">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 border-4 border-slate-50 dark:border-slate-700 shadow-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"
                >
                  <span className="text-white text-3xl font-bold">SJ</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white dark:border-[#1a2632] size-5 rounded-full" title="Online"></div>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-[#0d141b] dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">Sarah Jenkins</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Senior Product Designer at TechFlow</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span>San Francisco, CA</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">work_history</span>7 Years Exp.</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">paid</span>$140k - $160k</span>
                </div>
              </div>
            </div>
            {/* AI Score + Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="relative size-16">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[#2563eb]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="92, 100" strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">92%</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">AI Fit Score</span>
                  <span className="text-sm font-medium text-[#2563eb]">High Potential Match</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl h-11 px-5 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-bold transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                  <span className="hidden sm:inline">Reject</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl h-11 px-5 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-bold transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  <span className="hidden sm:inline">Shortlist</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl h-11 px-6 bg-[#2563eb] hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2632] rounded-t-xl px-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab ? 'font-bold text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Panel */}
            <div className="bg-white dark:bg-[#1a2632] rounded-b-xl rounded-tr-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 -mt-6">
              {activeTab === 'Resume Analysis' && (
                <>
                  {/* AI Summary */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 mb-8 border border-blue-100 dark:border-blue-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-blue-900 dark:text-blue-200 font-bold text-base">AI Executive Summary</h3>
                    </div>
                    <p className="text-slate-700 dark:text-blue-100/80 text-sm leading-relaxed">
                      Sarah demonstrates a strong trajectory in B2B SaaS product design, with a particular emphasis on data-heavy interfaces. She has consistently moved into roles with higher responsibility every 2 years. Her recent focus on AI-driven design tools aligns perfectly with our roadmap.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Strong Leadership Potential', 'SaaS Expert', 'Design Systems'].map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Timeline */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Professional Experience</h3>
                  <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-700 space-y-8 mb-6">
                    {experiences.map((exp) => (
                      <div key={exp.role} className="relative">
                        <div className={`absolute -left-[21px] top-1.5 size-3 rounded-full border-2 border-white dark:border-[#1a2632] ${exp.current ? 'bg-[#2563eb]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                            <p className={`text-sm font-medium ${exp.current ? 'text-[#2563eb]' : 'text-slate-500 dark:text-slate-400'}`}>{exp.company}</p>
                          </div>
                          <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{exp.dates}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{exp.description}</p>
                        {exp.skills.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {exp.skills.map((s) => (
                              <span key={s} className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'Skill Breakdown' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Technical Skills</h4>
                    {hardSkills.map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                          <span className="text-slate-500">{s.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${s.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Soft Skills (AI Inferred)</h4>
                    {softSkills.map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                          <span className="text-slate-500">{s.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${s.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab !== 'Resume Analysis' && activeTab !== 'Skill Breakdown' && (
                <div className="text-center py-16 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">construction</span>
                  <p className="text-sm">This section is coming soon.</p>
                </div>
              )}
            </div>

            {/* Skill Breakdown mini-card below tabs */}
            {activeTab === 'Resume Analysis' && (
              <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Breakdown</h3>
                  <button onClick={() => setActiveTab('Skill Breakdown')} className="text-[#2563eb] text-sm font-bold hover:underline">View Full Report</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Technical Skills</h4>
                    {hardSkills.map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                          <span className="text-slate-500">{s.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${s.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Soft Skills (AI Inferred)</h4>
                    {softSkills.map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                          <span className="text-slate-500">{s.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${s.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Interview Score */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interview Score</h3>
                <div className="flex items-center gap-1 text-orange-400 font-bold">
                  <span className="material-symbols-outlined text-[20px]">star</span>
                  <span>4.5/5</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {interviews.map((iv) => (
                  <div key={iv.stage} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>{iv.stage}</span>
                      <span>{iv.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">{iv.result}</span>
                      <span className={`text-sm font-bold ${iv.color}`}>{iv.score}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-slate-500 font-medium hover:text-[#2563eb] transition-colors border border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:border-[#2563eb]">
                + Add Interview Feedback
              </button>
            </div>

            {/* Learning Attitude */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Learning Attitude</h3>
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">High Velocity</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">3 certifications in 2023</p>
                </div>
              </div>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">verified</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Contact Info</h3>
              <div className="space-y-4">
                {[
                  { icon: 'mail', label: 'Email', value: 'sarah.jenkins@example.com' },
                  { icon: 'call', label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: 'link', label: 'Portfolio', value: 'sarahdesigns.io' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="size-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



