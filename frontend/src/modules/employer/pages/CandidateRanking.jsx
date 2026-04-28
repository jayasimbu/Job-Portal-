import React from 'react';
import EmployerShell from '../components/EmployerShell';

export default function CandidateRanking() {
  const candidates = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Senior UX Lead at TechFlow',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      score: 98,
      scoreLabel: 'Excellent',
      scoreSub: 'Top 1% of applicants',
      skills: 'Figma, Research, Prototyping',
      match: 95,
      potentialIcon: 'trending_up',
      potentialStatus: 'High Potential',
      potentialSub: 'Fast learner detected',
      potentialColor: 'purple',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      role: 'Product Designer at CreativeInc',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      score: 92,
      scoreLabel: 'Strong',
      scoreSub: 'High skill overlap',
      skills: 'UI Design, Systems, Motion',
      match: 88,
      potentialIcon: 'eco',
      potentialStatus: 'Steady Growth',
      potentialSub: 'Consistent performer',
      potentialColor: 'blue',
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Freelance UI Designer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      score: 85,
      scoreLabel: 'Good Fit',
      scoreSub: 'Culture match',
      skills: 'Visual Design, Branding',
      match: 82,
      potentialIcon: 'bolt',
      potentialStatus: 'Emerging',
      potentialSub: 'Leadership potential',
      potentialColor: 'amber',
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <EmployerShell active="candidates" />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 px-4 mb-4">
              <button className="text-slate-500 hover:text-blue-600 text-sm font-medium leading-normal transition-colors">Jobs</button>
              <span className="text-slate-500 text-sm font-medium leading-normal">/</span>
              <button className="text-slate-500 hover:text-blue-600 text-sm font-medium leading-normal transition-colors">Senior Product Designer #SPD-2024</button>
              <span className="text-slate-500 text-sm font-medium leading-normal">/</span>
              <span className="text-slate-900 dark:text-slate-200 text-sm font-medium leading-normal">Candidate Ranking</span>
            </div>

            {/* Page Heading & Actions */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 p-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                  Candidate Ranking: Senior Product Designer
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  #SPD-2024 • San Francisco, CA (Hybrid)
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center justify-center rounded-xl h-10 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                  <span>Edit Criteria</span>
                </button>
                <button className="flex items-center justify-center rounded-xl h-10 px-6 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                  <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                  <span>Add Candidate</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-2">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">Total Applicants</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">142</p>
                  <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full text-xs font-bold leading-normal">+12% this week</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">Top Tier Matches (&gt;85%)</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">12</p>
                  <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full text-xs font-bold leading-normal">+2 new</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">Avg. AI Fit Score</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">78%</p>
                  <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full text-xs font-bold leading-normal">+5% vs avg</span>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-2 mb-2">
              <div className="flex gap-3 flex-wrap w-full sm:w-auto">
                <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white pl-3 pr-4 shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span className="text-sm font-semibold leading-normal">Top 10% Fit</span>
                </button>
                <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 text-slate-800 dark:text-slate-200 pl-3 pr-4 transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-500">diversity_3</span>
                  <span className="text-sm font-medium leading-normal">Diversity Matches</span>
                </button>
                <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 text-slate-800 dark:text-slate-200 pl-3 pr-4 transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-500">visibility_off</span>
                  <span className="text-sm font-medium leading-normal">Skill-Only (Bias Reduction)</span>
                </button>
              </div>
              <div className="relative flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Sort by:</span>
                <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Highest Fit Score
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </button>
              </div>
            </div>

            {/* Main Candidate List */}
            <div className="flex flex-col gap-4 p-4">
              {/* List Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <div className="col-span-4">Candidate</div>
                <div className="col-span-2">AI Fit Score</div>
                <div className="col-span-3">Top Skills Match</div>
                <div className="col-span-2">Growth Potential</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {candidates.map((cand) => (
                <div key={cand.id} className="group relative flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer">
                  {/* Name & Role */}
                  <div className="col-span-4 w-full flex items-center gap-4">
                    <div className="relative">
                      <div 
                        className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-white dark:border-slate-800 shadow-sm"
                        style={{ backgroundImage: `url(${cand.image})` }}
                      ></div>
                      {cand.score > 95 && (
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                          <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cand.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
                        {cand.role}
                      </p>
                    </div>
                  </div>

                  {/* AI Score */}
                  <div className="col-span-2 w-full flex items-center gap-3">
                    <div className="relative size-12">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                        <path className="text-blue-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${cand.score}, 100`} strokeWidth="3"></path>
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-blue-600 dark:text-blue-400">
                        {cand.score}%
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">{cand.scoreLabel}</span>
                      <span className="text-xs text-slate-500">{cand.scoreSub}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="col-span-3 w-full flex flex-col justify-center gap-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>{cand.skills}</span>
                      <span className="text-slate-900 dark:text-white font-bold">{cand.match}% Match</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${cand.match}%` }}></div>
                    </div>
                  </div>

                  {/* Growth Potential */}
                  <div className="col-span-2 w-full flex items-center gap-2">
                    <div className={`flex items-center justify-center size-8 rounded-full bg-${cand.potentialColor}-100 dark:bg-${cand.potentialColor}-900/30 text-${cand.potentialColor}-600 dark:text-${cand.potentialColor}-400`}>
                      <span className="material-symbols-outlined text-[18px]">{cand.potentialIcon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{cand.potentialStatus}</span>
                      <span className="text-xs text-slate-500">{cand.potentialSub}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 w-full flex items-center justify-end gap-2">
                    <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors" title="Shortlist">
                      <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    </button>
                    <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="More options">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              <div className="flex justify-center mt-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-colors shadow-sm">
                  View 139 More Candidates
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
