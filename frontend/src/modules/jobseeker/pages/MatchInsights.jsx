const matchFactors = [
  {
    icon: 'verified',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-[#2563eb]',
    title: 'Top Tier Experience',
    desc: 'Your Python experience is in the top 5% of all applicants for this level.',
  },
  {
    icon: 'trending_up',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    title: 'Experience Surplus',
    desc: 'You exceed the 4-year requirement by 2 years, positioning you as a senior candidate.',
  },
  {
    icon: 'public',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    title: 'Remote Friendly',
    desc: 'This role is 100% remote-friendly, perfectly matching your location preference.',
  },
];

const cultureTags = [
  { label: 'Innovation', matched: false },
  { label: 'Autonomy', matched: true },
  { label: 'Learning', matched: true },
  { label: 'Work-Life Balance', matched: false },
];

export default function MatchInsights() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f0f4f8] dark:bg-[#0d141b] text-[#0d141b] dark:text-white">
      <main className="overflow-y-auto layout-container flex h-full grow flex-col px-4 md:px-10 py-8 mx-auto w-full max-w-7xl">

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#2563eb] font-bold text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              AI Transparency Report
            </div>
            <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Why you're a great fit
            </h1>
            <p className="text-[#4c739a] dark:text-slate-400 text-base md:text-lg font-medium leading-normal flex items-center gap-2">
              Senior Product Designer at{' '}
              <span className="font-bold text-[#0d141b] dark:text-white">TechCorp</span>
            </p>
          </div>
          {/* Score Badge + Apply */}
          <div className="flex items-center gap-4 bg-white dark:bg-[#1a2632] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="relative size-16">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-[#2563eb]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-sm font-bold text-[#0d141b] dark:text-white">94%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#0d141b] dark:text-white">Match Score</span>
              <span className="text-xs text-[#4c739a] dark:text-slate-400">Exceptional</span>
            </div>
            <button className="ml-2 bg-[#2563eb] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/30">
              Apply Now
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left: Visualizations */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Radar Chart */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">Skills Gap Analysis</h3>
                  <p className="text-sm text-[#4c739a] dark:text-slate-400 mt-1">Comparing your profile vs. job requirements</p>
                </div>
                <div className="flex gap-4 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#2563eb] rounded-full"></div>
                    <span className="text-[#0d141b] dark:text-slate-200">You</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                    <span className="text-[#4c739a] dark:text-slate-400">The Role</span>
                  </div>
                </div>
              </div>
              {/* SVG Radar */}
              <div className="relative w-full aspect-[4/3] max-h-[400px] flex justify-center items-center">
                <svg className="w-full h-full" viewBox="0 0 400 350">
                  <g className="text-slate-100 dark:text-slate-800 stroke-current" fill="none" strokeWidth="1">
                    <polygon points="200,50 342,130 292,290 108,290 58,130" />
                    <polygon points="200,90 299,146 264,258 136,258 101,146" />
                    <polygon points="200,130 256,162 236,226 164,226 144,162" />
                    <polygon points="200,170 214,178 209,194 191,194 186,178" />
                    <line x1="200" x2="200" y1="190" y2="50" />
                    <line x1="200" x2="342" y1="190" y2="130" />
                    <line x1="200" x2="292" y1="190" y2="290" />
                    <line x1="200" x2="108" y1="190" y2="290" />
                    <line x1="200" x2="58" y1="190" y2="130" />
                  </g>
                  {/* Role outline */}
                  <polygon className="opacity-50" fill="none" points="200,80 300,146 250,250 136,240 90,146" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="2" />
                  {/* User filled area */}
                  <polygon fill="rgba(37, 99, 235, 0.2)" points="200,50 330,130 280,270 146,260 70,130" stroke="#2563eb" strokeWidth="3" />
                  {/* Labels */}
                  <text className="text-[12px] font-bold" textAnchor="middle" x="200" y="30" fill="#475569" fontSize="12">UX Design</text>
                  <text className="text-[12px] font-bold" textAnchor="start" x="355" y="130" fill="#475569" fontSize="12">Python</text>
                  <text className="text-[12px] font-bold" textAnchor="middle" x="305" y="310" fill="#475569" fontSize="12">Leadership</text>
                  <text className="text-[12px] font-bold" textAnchor="middle" x="95" y="310" fill="#475569" fontSize="12">Strategy</text>
                  <text className="text-[12px] font-bold" textAnchor="end" x="45" y="130" fill="#475569" fontSize="12">Data Analysis</text>
                  {/* Dots */}
                  {[
                    [200, 50], [330, 130], [280, 270], [146, 260], [70, 130]
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="#2563eb" />
                  ))}
                </svg>
              </div>
              {/* Insight note */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-[#2563eb] mt-0.5">info</span>
                <div className="text-sm">
                  <p className="font-bold text-[#0d141b] dark:text-white">Skill Insight</p>
                  <p className="text-[#4c739a] dark:text-slate-400 mt-1">
                    You exceed the role requirements significantly in{' '}
                    <span className="text-[#0d141b] dark:text-white font-semibold">UX Design</span> and{' '}
                    <span className="text-[#0d141b] dark:text-white font-semibold">Data Analysis</span>. The employer specifically values your rare combination of design and coding skills.
                  </p>
                </div>
              </div>
            </div>

            {/* What to Improve */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">What to Improve</h3>
              </div>
              <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-6">While you are a strong candidate, addressing these gaps could increase your match score to 99%.</p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-[#0d141b] dark:text-white">Figma Variables</h4>
                      <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-300 px-2 py-1 rounded">Moderate Gap</span>
                    </div>
                    <p className="text-xs text-[#4c739a] dark:text-slate-400">The job description emphasizes advanced design system management.</p>
                  </div>
                  <button className="text-sm font-medium text-[#2563eb] hover:text-blue-700 dark:hover:text-blue-400 whitespace-nowrap self-start sm:self-center">View Course +</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Match Factors + Culture Fit */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Top Match Factors */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-[#0d141b] dark:text-white text-xl font-bold mb-6">Top Match Factors</h2>
              <div className="flex flex-col gap-4">
                {matchFactors.map((f) => (
                  <div key={f.title} className="flex gap-4 items-start p-4 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-white dark:bg-[#15202b]">
                    <div className={`p-2 rounded-lg ${f.iconBg}`}>
                      <span className="material-symbols-outlined">{f.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-[#0d141b] dark:text-white font-bold text-base leading-tight">{f.title}</h3>
                      <p className="text-[#4c739a] dark:text-slate-400 text-sm mt-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Culture Fit */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#0d141b] dark:text-white text-xl font-bold">Culture Fit</h2>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">High Alignment</span>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-48 h-24 overflow-hidden mb-4">
                  <svg className="w-48 h-48 -rotate-180" viewBox="0 0 100 100">
                    <circle className="text-slate-100 dark:text-slate-700" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="125.6 251.2" strokeWidth="10" />
                    <circle className="text-[#2563eb] transition-all ease-out" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="125.6 251.2" strokeDashoffset="30" strokeLinecap="round" strokeWidth="10" />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 text-center">
                    <span className="text-3xl font-black text-[#0d141b] dark:text-white">88%</span>
                  </div>
                </div>
                <p className="text-center text-sm text-[#4c739a] dark:text-slate-400 px-4">
                  You and TechCorp both highly value{' '}
                  <span className="font-bold text-[#2563eb]">Autonomy</span> and{' '}
                  <span className="font-bold text-[#2563eb]">Continuous Learning</span>.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {cultureTags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`px-3 py-1 rounded-full text-xs font-${tag.matched ? 'bold' : 'medium'} ${tag.matched
                      ? 'border border-[#2563eb] text-[#2563eb] bg-blue-50 dark:bg-blue-900/20'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Pro Tip CTA */}
            <div className="bg-gradient-to-br from-[#2563eb] to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-white/80 text-3xl">lightbulb</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    This analysis helps you tailor your resume. Make sure to highlight your Python leadership in your cover letter!
                  </p>
                  <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors backdrop-blur-sm">
                    Download Analysis Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



