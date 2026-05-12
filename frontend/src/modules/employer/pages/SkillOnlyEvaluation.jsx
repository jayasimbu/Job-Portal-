import React from 'react';
import EmployerShell from '../components/EmployerShell';

export default function SkillOnlyEvaluation() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 transition-colors ">
      <EmployerShell active="candidates" />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Hero Section */}
        <section className="relative w-full px-4 py-12 md:py-20 lg:py-24 bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col max-w-[960px] mx-auto items-center text-center gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
              <span className="material-symbols-outlined !text-sm">verified_user</span>
              AI Transparency
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
              Pure Merit, <span className="text-blue-600 dark:text-blue-500">Zero Bias</span>
            </h1>
            <h2 className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              Our Skill-Only Evaluation engine strips 100% of personal identifiers before a human decision is ever made, ensuring fair play for every candidate.
            </h2>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                <span className="truncate">View Anonymized Demo</span>
              </button>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-base font-bold leading-normal hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <span className="truncate">Scan My Resume</span>
              </button>
            </div>
          </div>
        </section>

        {/* Process Section Headline */}
        <section className="px-4 py-16 bg-white dark:bg-slate-900">
          <div className="max-w-[960px] mx-auto">
            <h2 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-12">
              The De-Identification Process
            </h2>
            
            {/* Step 1: Input */}
            <div className="mb-12 relative group">
              <div className="absolute left-[30px] top-16 bottom-[-48px] w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
              <div className="flex flex-col md:flex-row items-start gap-8 rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all shadow-sm">
                <div className="hidden md:flex flex-col items-center gap-2 z-10 shrink-0">
                  <div className="size-16 rounded-full bg-white dark:bg-slate-700 border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center shadow-sm text-slate-400 dark:text-slate-300">
                    <span className="material-symbols-outlined !text-3xl">upload_file</span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase shrink-0">Step 1</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Input Stage: Raw Data</h3>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-sm">
                      {/* Resume simulation */}
                      <div className="flex gap-4 items-start opacity-50 blur-[1px]">
                        <div className="size-12 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0"></div>
                        <div className="flex-1 space-y-2.5">
                          <div className="h-4 bg-slate-800 dark:bg-slate-600 w-1/2 rounded"></div>
                          <div className="h-3 bg-slate-400 dark:bg-slate-600 w-1/3 rounded"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 w-full rounded mt-3"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 w-5/6 rounded"></div>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 dark:bg-white/5">
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 dark:border-red-800/50 flex items-center gap-1.5 shadow-sm">
                          <span className="material-symbols-outlined !text-[16px]">warning</span>
                          Detecting Bias Triggers
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                      <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        The system ingests the raw resume containing personal identifiers like name, gender, location, and university prestige markers.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-red-500 !text-xl">cancel</span>
                          Removed: Name & Photo
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-red-500 !text-xl">cancel</span>
                          Removed: Graduation Year (Age)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Processing */}
            <div className="mb-12 relative group">
              <div className="absolute left-[30px] top-16 bottom-[-48px] w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
              <div className="flex flex-col md:flex-row items-start gap-8 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="hidden md:flex flex-col items-center gap-2 z-10 shrink-0">
                  <div className="size-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="material-symbols-outlined !text-3xl ">auto_awesome</span>
                  </div>
                </div>
                
                <div className="flex-1 w-full z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase shrink-0">Step 2</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Processing Stage: Sanitization</h3>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center gap-5 relative shadow-inner">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-sm font-semibold tracking-wide">
                        <span className="material-symbols-outlined !text-lg ">sync</span>
                        Sanitizing Data...
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-2/3 rounded-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                      <div className="flex justify-between w-full text-xs text-slate-400 font-mono font-medium">
                        <span>INPUT: RAW</span>
                        <span>OUTPUT: CLEAN</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                      <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        Our AI filter actively identifies and scrubs implicit bias triggers. It converts text descriptions into standardized skill vectors.
                      </p>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <span className="px-2.5 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 text-xs font-semibold">Standardizing Titles</span>
                        <span className="px-2.5 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 text-xs font-semibold">Extracting Tech Stack</span>
                        <span className="px-2.5 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 text-xs font-semibold">Measuring Impact</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Output */}
            <div className="mb-0 relative group">
              <div className="flex flex-col md:flex-row items-start gap-8 rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-green-500/30 transition-all shadow-sm">
                <div className="hidden md:flex flex-col items-center gap-2 z-10 shrink-0">
                  <div className="size-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
                    <span className="material-symbols-outlined !text-3xl">check_circle</span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-xs font-bold text-green-700 dark:text-green-400 uppercase shrink-0">Step 3</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Output Stage: Skill Profile</h3>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="font-bold text-lg text-slate-900 dark:text-white">Candidate #8492</div>
                        <div className="text-green-700 dark:text-green-400 font-bold text-sm bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md border border-green-200 dark:border-green-800/50">
                          98% Match
                        </div>
                      </div>
                      <div className="space-y-4">
                        <SkillBar name="Python Development" percentage={92} />
                        <SkillBar name="System Architecture" percentage={85} />
                        <SkillBar name="Team Leadership" percentage={78} />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                      <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        The final profile displays only competency badges and experience graphs. Hiring managers make interview decisions based purely on projected performance.
                      </p>
                      <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-bold flex items-center gap-2.5">
                          <span className="material-symbols-outlined !text-xl">trending_up</span>
                          Result: 40% Increase in Interview Diversity
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features / Trust Section */}
        <section className="w-full px-4 py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-[960px] mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon="blind" 
                title="Reduced Bias" 
                desc="By removing visual and demographic cues, we force the brain to focus on data, eliminating unconscious bias in the screening phase." 
              />
              <FeatureCard 
                icon="model_training" 
                title="Predictive Performance" 
                desc="Our algorithms are trained on successful hire outcomes, prioritizing skills that actually correlate with job performance." 
              />
              <FeatureCard 
                icon="diversity_3" 
                title="Diversity Growth" 
                desc="Focusing on merit naturally surfaces a wider range of candidates from diverse backgrounds who might otherwise be overlooked." 
              />
            </div>
          </div>
        </section>

        {/* Comparison Graph Section */}
        <section className="w-full px-4 py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-[960px] mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Competency Ranking Grid</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-lg">
                  Traditional hiring ranks candidates by prestige. We rank by potential. See how Candidate A (Non-Target School) outperforms Candidate B (Ivy League) in practical coding tests.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-green-500 !text-lg">verified</span>
                    GDPR Compliant
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-green-500 !text-lg">verified</span>
                    EEOC Standard
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">Technical Assessment Scores</h4>
                
                {/* Chart Items */}
                <div className="space-y-6">
                  <ChartItem name="Candidate A (State Univ.)" score="92" isHighlight />
                  <ChartItem name="Candidate B (Ivy League)" score="78" />
                  <ChartItem name="Candidate C (Bootcamp)" score="85" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-[960px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center bg-blue-600 text-white rounded-2xl p-8 md:p-12 shadow-xl shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="relative z-10 max-w-lg mb-8 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Ready to Hire on Merit?</h2>
                <p className="text-blue-100 text-lg">Join 500+ companies removing bias from their hiring pipeline today.</p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button className="h-12 px-8 rounded-xl bg-white text-blue-600 font-bold leading-normal hover:bg-slate-50 transition-colors shadow-lg shadow-black/5 w-full sm:w-auto">
                  Start Free Trial
                </button>
                <button className="h-12 px-8 rounded-xl bg-blue-700 text-white font-bold leading-normal hover:bg-blue-800 transition-colors border border-blue-500 shadow-sm w-full sm:w-auto">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function SkillBar({ name, percentage }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">
        <span>{name}</span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="flex flex-col gap-4 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all hover:-translate-y-1 group">
      <div className="size-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all shadow-sm">
        <span className="material-symbols-outlined !text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ChartItem({ name, score, isHighlight }) {
  return (
    <div className={`group ${!isHighlight ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}>
      <div className="flex justify-between text-sm mb-2.5">
        <span className={`font-bold ${isHighlight ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{name}</span>
        <span className={`font-bold ${isHighlight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{score}/100</span>
      </div>
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full rounded-full relative overflow-hidden ${isHighlight ? 'bg-blue-600 shadow-lg shadow-blue-500/40' : 'bg-slate-400 dark:bg-slate-600'}`} 
          style={{ width: `${score}%` }}
        >
          {isHighlight && <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>}
        </div>
      </div>
    </div>
  );
}



