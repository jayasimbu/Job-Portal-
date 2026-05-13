import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Target,
  Brain
} from 'lucide-react';
import Button from '../../../components/ui/Button';

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-32 pb-32">
      {/* ═══ HERO SECTION ═══════════════════════════════════════════════ */}
      <section className="pt-40 px-4 md:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent -z-10" />
        
        <div className="max-w-[1200px] mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest animate-fade-in">
            <Sparkles size={14} />
            The AI-Powered Bridge to Your Future
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter uppercase">
              Revolutionizing <span className="text-blue-600">Recruitment</span> <br />
              with Intelligence.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              LINKUP connects top talent with visionary companies through data-driven matching and AI-powered insights. Zero noise, just growth.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button 
              onClick={() => navigate('/auth/signup?role=jobseeker')}
              className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/20 rounded-2xl"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Button>
            <Button 
              onClick={() => navigate('/about')}
              className="h-16 px-10 text-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl"
              variant="outline"
            >
              How it Works
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ ROLE SELECTION SECTION ═══════════════════════════════════════ */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidates */}
          <div className="group p-12 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
            <div className="size-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Users size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">For Candidates</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
              Stop searching, start matching. Our AI analyzes your skills and helps you land roles where you'll actually thrive.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'AI Resume Analysis & ATS Scoring',
                'Hyper-Personalized Job Matching',
                'Direct-to-Recruiter Communication',
                'Skill-Gap Learning Paths'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
                  <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => navigate('/auth/signup?role=jobseeker')}
              className="w-full h-14 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black"
            >
              Find Your Next Role
            </Button>
          </div>

          {/* Employers */}
          <div className="group p-12 rounded-[40px] bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
            <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Building2 size={32} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">For Companies</h2>
            <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed">
              Hire with confidence. Use our intelligence engine to rank candidates, remove bias, and build world-class teams.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Smart Candidate Ranking & Filtering',
                'Automated Bias-Free Screening',
                'Integrated Interview Scheduling',
                'Employer Brand Intelligence'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400 font-bold">
                  <div className="size-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Target size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => navigate('/auth/signup?role=employer')}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black"
            >
              Hire Top Talent
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ TRUST SECTION ═══════════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-32 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Powered by Intelligent Design</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              Our platform uses state-of-the-art AI models to ensure transparency and fairness in the recruitment process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Brain, title: 'Neural Matching', desc: 'Go beyond keywords. Our neural network understands context, culture, and potential.' },
              { icon: Zap, title: 'Instant Insights', desc: 'Get real-time feedback on your profile strength or your hiring pipeline performance.' },
              { icon: BarChart3, title: 'Data Sovereignty', desc: 'Your data is encrypted and protected. You maintain full control over your profile.' }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 text-center">
                <div className="size-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto text-blue-600">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase">{feature.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══════════════════════════════════════════════════ */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="relative p-12 md:p-24 rounded-[60px] bg-blue-600 overflow-hidden text-center">
          <div className="absolute top-0 right-0 size-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 size-96 bg-blue-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              The Future of <br /> Hiring is Here.
            </h2>
            <p className="text-xl text-blue-100 font-medium max-w-xl mx-auto">
              Join the 20,000+ professionals and companies already using LINKUP to define their success.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
               <Button 
                onClick={() => navigate('/auth/signup')}
                className="h-16 px-12 bg-white text-blue-600 hover:bg-blue-50 font-black text-lg rounded-2xl"
               >
                 Create Free Account
               </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
