import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Cpu,
  Brain,
  Lock
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const JobseekerHome = () => {
  const navigate = useNavigate();

  const features = [
    { 
      title: 'Smarter Resume Analysis', 
      desc: 'Understand how your profile compares to industry standards with actionable feedback.',
      icon: Cpu,
    },
    { 
      title: 'Better Job Matching', 
      desc: 'Discover roles that actually fit your skills and career trajectory, not just keywords.',
      icon: Brain,
    },
    { 
      title: 'Real-time Visibility', 
      desc: 'Know exactly where you stand with applications and how recruiters see your profile.',
      icon: BarChart3,
    },
    { 
      title: 'Verified Profiles', 
      desc: 'Stand out with a verified profile that builds instant trust with innovative employers.',
      icon: ShieldCheck,
    },
    { 
      title: 'Career Insights', 
      desc: 'Get specific advice on skills to learn and projects to build to reach your next goal.',
      icon: Sparkles,
    },
    { 
      title: 'Simple Applications', 
      desc: 'Apply to top companies with one click using your unified, professional LINKUP profile.',
      icon: Zap,
    }
  ];

  const steps = [
    { title: 'Upload', desc: 'Securely upload your resume for analysis.' },
    { title: 'Discover', desc: 'Explore roles matched to your unique profile.' },
    { title: 'Apply', desc: 'Apply to jobs with a single click.' },
    { title: 'Connect', desc: 'Directly interact with interested recruiters.' },
    { title: 'Grow', desc: 'Follow personalized paths to upskill.' }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* ═══ HERO SECTION ═══════════════════════════════════════════════ */}
      <section className="pt-20 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter uppercase">
                Find better opportunities with <span className="text-blue-600">smarter matching.</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
                LINKUP helps candidates understand their resume strength, discover matching roles, and improve hiring visibility. Zero guesswork, just progress.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
              <Button 
                onClick={() => navigate('/platform/jobseeker/dashboard')}
                className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20"
                variant="primary"
              >
                Dashboard
                <ArrowRight size={18} />
              </Button>
              <Button 
                onClick={() => navigate('/platform/jobseeker/jobs')}
                className="h-14 px-8 text-base border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                variant="outline"
              >
                Explore Jobs
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
               <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Join 20,000+ Professionals</p>
                  <p className="text-xs text-slate-500 font-medium">Discover your next career move</p>
               </div>
            </div>
          </div>

          {/* REAL PRODUCT PREVIEW */}
          <div>
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden p-8 scale-105 transform transition-all hover:scale-110">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Dashboard Overview</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Live Profile Performance</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                    Strong Fit
                  </div>
                </div>

                {/* Score & Insights */}
                <div className="grid grid-cols-5 gap-6 items-center">
                  <div className="col-span-2 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-widest">Resume Strength</div>
                    <div className="text-4xl font-black text-blue-600 tracking-tight">82%</div>
                  </div>
                  <div className="col-span-3 space-y-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Matched Expertise</div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Tailwind', 'Node.js', 'System Design'].map(s => (
                        <span key={s} className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Applications Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Applications</p>
                     <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">View All</span>
                   </div>
                   <div className="space-y-2">
                      {[
                        { company: 'Zoho', role: 'Frontend Engineer', status: 'Reviewing', match: 87 },
                        { company: 'Stripe', role: 'Product Developer', status: 'Applied', match: 92 }
                      ].map((app, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                             <div className="size-8 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-300 uppercase">
                               {app.company[0]}
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{app.role}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{app.company} • {app.status}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-blue-600">{app.match}%</p>
                             <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">Match</p>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Actionable Insight */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl space-y-2">
                   <div className="flex items-center gap-2">
                     <Zap size={14} className="text-blue-600" />
                     <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest">Recommendation</p>
                   </div>
                   <p className="text-sm text-blue-900 dark:text-blue-200 font-medium leading-relaxed">
                     Adding <strong>Docker</strong> to your profile could improve your match for 12 new backend roles in your area.
                   </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══════════════════════════════════════════ */}
      <section className="px-8 max-w-[1400px] mx-auto space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
             Where clarity meets <span className="text-blue-600">Opportunity.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            LINKUP provides the tools you need to navigate your career with confidence and reach your full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="size-12 rounded-xl flex items-center justify-center mb-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-blue-600">
                <f.icon size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight uppercase">{f.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ WORKFLOW SECTION ════════════════════════════════════════════ */}
      <section className="px-8 bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Engineered for results.
            </h3>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              A streamlined pipeline designed to move you from application to interview faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="space-y-4 relative">
                {/* Connector Line (hidden on mobile) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-16 w-[calc(100%-1rem)] h-px bg-slate-200 dark:bg-slate-700" />
                )}
                <div className="size-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md relative z-10">
                  {i + 1}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase">{s.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═════════════════════════════════════════════════ */}
      <section className="px-8 max-w-[1200px] mx-auto mb-10">
        <div className="py-12 px-8 bg-blue-600 dark:bg-blue-900/40 rounded-3xl text-center space-y-8 shadow-2xl">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h3 className="text-5xl font-black text-white tracking-tight leading-[1.1] uppercase">
              Ready to scale your Career?
            </h3>
            <p className="text-lg text-blue-100 font-medium">
              Join 20,000+ professionals and top companies using LINKUP to define the future of recruitment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/platform/jobseeker/jobs')}
              className="h-12 px-6 text-sm bg-white text-blue-600 hover:bg-slate-50 shadow-sm"
              variant="secondary"
            >
              Explore Jobs
            </Button>
            <Button 
              onClick={() => navigate('/platform/jobseeker/profile')}
              className="h-12 px-6 text-sm border-white/30 text-white hover:bg-white/10"
              variant="outline"
            >
              Update Profile
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobseekerHome;
