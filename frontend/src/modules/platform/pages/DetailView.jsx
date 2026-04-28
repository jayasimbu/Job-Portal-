import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlatformShell from '../components/PlatformShell';

const DETAIL_CONTENT = {
  // CANDIDATES
  'ai-matcher': {
    title: 'AI Matcher',
    icon: 'psychology',
    desc: 'Our flagship neural matching engine that connects your unique skill profile with the perfect opportunities.',
    highlights: [
      'Semantic understanding of your experience',
      'Real-time job market compatibility analysis',
      'Personalized career path recommendations',
      'Bias-free algorithmic matching'
    ],
    cta: 'Find Your Match'
  },
  'resume-builder': {
    title: 'Resume Builder',
    icon: 'edit_document',
    desc: 'Craft a high-performance resume that communicates your value directly to both AI filters and human recruiters.',
    highlights: [
      'ATS-optimized templates',
      'AI-powered bullet point suggestions',
      'Keyword density analysis',
      'One-click export to PDF and JSON'
    ],
    cta: 'Build My Resume'
  },
  'skills-analysis': {
    title: 'Skills Analysis',
    icon: 'monitoring',
    desc: 'Deep dive into your technical and soft skill sets to identify growth areas and competitive advantages.',
    highlights: [
      'Competency mapping',
      'Skill gap identification',
      'Industry benchmark comparisons',
      'Learning pathway suggestions'
    ],
    cta: 'Analyze Skills'
  },
  'applications': {
    title: 'Applications',
    icon: 'send',
    desc: 'Centralized command center for managing every stage of your job application journey.',
    highlights: [
      'Real-time status tracking',
      'Interview preparation guides',
      'Follow-up automation',
      'Historical performance analytics'
    ],
    cta: 'View Dashboard'
  },

  // EMPLOYERS
  'sourcing': {
    title: 'Talent Sourcing',
    icon: 'person_search',
    desc: 'Automate your top-of-funnel discovery with ultra-targeted AI search across our verified candidate pool.',
    highlights: [
      'Automated outreach campaigns',
      'Verified project verification',
      'Candidate intent scoring',
      'Multi-channel talent acquisition'
    ],
    cta: 'Start Sourcing'
  },
  'ranking': {
    title: 'AI Ranking',
    icon: 'leaderboard',
    desc: 'Reduce time-to-hire by 70% with objective, data-driven candidate ranking based on project proof.',
    highlights: [
      'Objective merit scoring',
      'Customizable rubric weighting',
      'Automated initial screening',
      'Blind-hiring mode integration'
    ],
    cta: 'View Rankings'
  },
  'ats': {
    title: 'ATS Integration',
    icon: 'terminal',
    desc: 'Seamlessly connect Career Auto intelligence with your existing Applicant Tracking System.',
    highlights: [
      'Native Greenhouse & Lever sync',
      'Custom API accessibility',
      'Zero-data-loss migration',
      'Unified candidate viewing'
    ],
    cta: 'Learn More'
  },
  'enterprise': {
    title: 'Enterprise Solution',
    icon: 'corporate_fare',
    desc: 'Scalable HR tech infrastructure designed for global teams and high-volume recruitment needs.',
    highlights: [
      'Role-based access control',
      'Custom data residency options',
      'Advanced reporting & ROI tracking',
      'Dedicated success management'
    ],
    cta: 'Request Demo'
  },

  // PLATFORM
  'global-search': {
    title: 'Global Search',
    icon: 'language',
    desc: 'Search our entire ecosystem for jobs, talent, projects, and career insights.',
    highlights: [
      'Instant type-ahead results',
      'Advanced boolean filtering',
      'Geographical talent mapping',
      'Saved search alerts'
    ],
    cta: 'Search Now'
  },
  'career-insights': {
    title: 'Career Insights',
    icon: 'lightbulb',
    desc: 'Make data-driven career moves with real-time salary data and industry trend reports.',
    highlights: [
      'Salary benchmarking by role',
      'Remote-work demand analysis',
      'Skills trending reports',
      'Regional hiring forecasts'
    ],
    cta: 'Explore Insights'
  },
  'safety-center': {
    title: 'Safety Center',
    icon: 'verified_user',
    desc: 'Ensuring a secure, verified, and transparent environment for both talent and hiring teams.',
    highlights: [
      'Project verification protocols',
      'Identity protection measures',
      'Fraud detection algorithms',
      'Reporting & escalation workflows'
    ],
    cta: 'Learn More'
  },
  'system-status': {
    title: 'System Status',
    icon: 'settings_suggest',
    desc: 'Real-time performance metrics and operational logs for all Career Auto services.',
    highlights: [
      '99.99% uptime tracking',
      'API response time metrics',
      'Scheduled maintenance alerts',
      'Incident report history'
    ],
    cta: 'Check Status'
  },

  // LEGAL
  'privacy': {
    title: 'Privacy Policy',
    icon: 'lock',
    desc: 'We are committed to protecting your data and ensuring complete transparency in how it is used.',
    highlights: [
      'Full GDPR/CCPA compliance',
      'Your data, your control policy',
      'Zero third-party data selling',
      'Encrypted transit & storage'
    ],
    cta: 'Read Full Policy'
  },
  'terms': {
    title: 'Terms of Service',
    icon: 'gavel',
    desc: 'The guidelines and agreements that govern the use of the Career Auto platform and services.',
    highlights: [
      'User conduct expectations',
      'Service level agreements',
      'Intellectual property rights',
      'Liability and indemnity terms'
    ],
    cta: 'Read Full Terms'
  }
};

const DetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const content = DETAIL_CONTENT[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!content) {
    return (
      <PlatformShell active="none">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error_outline</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-slate-500 mt-2 mb-8">The detail page you are looking for does not exist.</p>
          <button 
            onClick={() => navigate('/platform/home')}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </PlatformShell>
    );
  }

  return (
    <PlatformShell active="none">
      <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Header Section */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-2xl">
              <span className="material-symbols-outlined">{content.icon}</span>
              <span className="text-xs font-black uppercase tracking-widest">{content.title}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              {content.title}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {content.desc}
            </p>

            <div className="pt-6">
              <button 
                onClick={() => navigate('/auth?tab=role')}
                className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
              >
                {content.cta}
              </button>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="w-full md:w-80 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Key Highlights</h3>
            {content.highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-start gap-3 shadow-sm"
              >
                <span className="material-symbols-outlined text-blue-600 text-sm mt-0.5">check_circle</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder for More Detailed Body Content if needed */}
        <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Intelligence-First Approach</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                At Career Auto, we believe in a world where talent is recognized by what they can do, not where they come from. Our {content.title} solution is built with this philosophy at its core.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Enterprise-Grade Security</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Built on high-performance architecture, our platform ensures your data remains secure and your privacy is never compromised, regardless of the scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
};

export default DetailView;
