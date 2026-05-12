import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function SkillsAnalysis() {
  return (
    <PageTemplate
      title="AI-Powered Skill Analysis"
      subtitle="Analyze your resume against industry standards to identify and bridge critical skill gaps."
      features={[
        "Precision Keyword Extraction",
        "Deterministic ATS Scoring",
        "Personalized Learning Paths",
        "Industry Benchmark Matching"
      ]}
      steps={[
        "Securely upload your resume",
        "Our AI engine parses your technical stack",
        "Get a detailed report with action items"
      ]}
      benefit="Empowers you to optimize your profile for high-match roles and premium hiring filters."
    >
      <div className="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-600/10 transition-all " />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <span className="material-symbols-outlined text-xl">psychology</span>
              </div>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">The AI Growth Engine</span>
            </div>
            
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
              Don't guess. <span className="text-blue-600">Know</span> exactly what's missing.
            </h3>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              Our advanced analysis engine doesn't just scan for keywords. It understands the context of your experience and matches it against millions of data points to give you a definitive readiness score.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/auth/signup"
                className="h-14 px-8 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95"
              >
                Start Free Analysis
                <span className="material-symbols-outlined">trending_flat</span>
              </a>
              <a 
                href="/auth/login"
                className="h-14 px-8 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Sign In
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Keyword Score', value: '30%', icon: 'key', color: 'blue' },
              { label: 'Skill Match', value: '20%', icon: 'star', color: 'emerald' },
              { label: 'Experience', value: '20%', icon: 'work', color: 'indigo' },
              { label: 'Format Quality', value: '10%', icon: 'format_paint', color: 'amber' }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all ">
                <div className={`size-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center mb-4`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}



