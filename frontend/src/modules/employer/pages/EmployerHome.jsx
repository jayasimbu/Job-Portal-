import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Briefcase,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Loader2,
  TrendingUp,
  AlertCircle,
  Star,
  Clock,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { fetchEmployerAnalytics } from '../services/employerService';
import { getCurrentUserId } from '../../../core/auth/session';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Status color
// ─────────────────────────────────────────────────────────────────────────────
const statusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'active') return 'text-emerald-500';
  if (s === 'reviewing') return 'text-amber-500';
  if (s === 'on hold') return 'text-rose-500';
  return 'text-slate-400';
};

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton row for pipeline loading
// ─────────────────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-6 animate-pulse">
    <div className="size-12 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3" />
    </div>
    <div className="h-8 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const EmployerHome = () => {
  const navigate = useNavigate();
  const employerId = getCurrentUserId();

  // ── State ─────────────────────────────────────────────────────────────────
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!employerId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await fetchEmployerAnalytics(employerId);
        setAnalytics(data?.analytics || null);
      } catch {
        setError(true);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [employerId]);

  // ── Derived values (default 0 / empty) ───────────────────────────────────
  const activeJobs     = analytics?.active_jobs    ?? 0;
  const totalApps      = analytics?.total_applicants ?? 0;
  const newApps        = analytics?.new_applicants  ?? 0;
  const interviews     = analytics?.interviews      ?? 0;
  const avgScore       = analytics?.avg_ats_score   ?? 0;
  const pipeline       = analytics?.pipeline        ?? [];   // [{id, title, job_type, candidates}]
  const topJob         = analytics?.top_job         ?? null; // {title, candidates}
  const shortlisted    = analytics?.shortlisted     ?? 0;

  // ── Quick stat cards ──────────────────────────────────────────────────────
  const quickStats = [
    {
      label: 'Active Jobs',
      value: String(activeJobs),
      icon: Briefcase,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800/40',
      color: 'text-blue-600',
    },
    {
      label: 'New Applicants',
      value: String(newApps),
      icon: Users,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-800/40',
      color: 'text-emerald-600',
    },
    {
      label: 'Interviews Today',
      value: String(interviews),
      icon: Calendar,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-800/40',
      color: 'text-amber-600',
    },
    {
      label: 'Avg Match Score',
      value: `${avgScore}%`,
      icon: Zap,
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-100 dark:border-indigo-800/40',
      color: 'text-indigo-600',
    },
  ];

  // ── AI Insight: build dynamic recommendations ─────────────────────────────
  const insightActions = [];
  if (shortlisted > 0) {
    insightActions.push({
      icon: CheckCircle2,
      color: 'text-emerald-500',
      text: `You have ${shortlisted} shortlisted candidate${shortlisted > 1 ? 's' : ''} pending interview scheduling.`,
    });
  }
  if (topJob && topJob.candidates > 0) {
    insightActions.push({
      icon: Star,
      color: 'text-blue-500',
      text: `"${topJob.title}" has the most activity with ${topJob.candidates} applicant${topJob.candidates > 1 ? 's' : ''}.`,
    });
  }
  if (newApps > 0) {
    insightActions.push({
      icon: Sparkles,
      color: 'text-indigo-500',
      text: `${newApps} new application${newApps > 1 ? 's' : ''} waiting for your review.`,
    });
  }
  if (insightActions.length === 0) {
    insightActions.push({
      icon: TrendingUp,
      color: 'text-slate-400',
      text: 'Post a new job to start attracting top talent to your pipeline.',
    });
  }

  const efficiencyText =
    avgScore > 0
      ? `Your AI match average is ${avgScore}%. ${avgScore >= 70 ? 'Great quality pipeline!' : 'Consider refining your job requirements.'}`
      : 'Post jobs and receive applications to see your hiring efficiency stats.';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-20">
      {/* ═══ WELCOME HERO ════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 size-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} />
              Hiring Intelligence Active
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter uppercase">
                Build your <br />
                <span className="text-blue-100">World-Class</span> Team.
              </h1>
              <p className="text-lg text-blue-100 font-medium max-w-xl leading-relaxed">
                {activeJobs > 0
                  ? `You have ${activeJobs} active job${activeJobs > 1 ? 's' : ''} with ${totalApps} total applicant${totalApps !== 1 ? 's' : ''}. Ready to find your next key player?`
                  : 'Welcome back. Post your first job and start building your world-class team.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Dashboard shortcut — left side */}
              <Button
                onClick={() => navigate('/platform/employer/dashboard')}
                variant="ghost"
                className="h-10 px-5 bg-white/15 hover:bg-white/25 font-black rounded-xl text-xs border border-white/30"
                style={{ color: '#ffffff' }}
              >
                Dashboard
              </Button>

              <div className="w-px h-6 bg-white/20" />

              {/* Post a New Job */}
              <Button
                onClick={() => navigate('/platform/employer/post-job')}
                variant="secondary"
                className="h-10 px-5 bg-white hover:bg-blue-50 font-black rounded-xl shadow-md shadow-blue-900/20 border-0 text-xs"
                style={{ color: '#1d4ed8' }}
              >
                Post a New Job
                <UserPlus size={15} />
              </Button>

              {/* Browse Candidates */}
              <Button
                onClick={() => navigate('/platform/employer/candidates')}
                variant="ghost"
                className="h-10 px-5 border border-white/40 hover:bg-white/10 font-black rounded-xl bg-transparent text-xs"
                style={{ color: '#ffffff' }}
              >
                Browse Candidates
              </Button>
            </div>

          </div>

          {/* Right: Dynamic Stat Grid */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, i) => (
                <Card
                  key={i}
                  className="p-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl hover:bg-white/20 transition-all"
                >
                  <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-white">
                    {loading
                      ? <Loader2 size={20} className="animate-spin" />
                      : <stat.icon size={20} />
                    }
                  </div>
                  <p className="text-3xl font-black text-white leading-none">
                    {loading ? '—' : stat.value}
                  </p>
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-2">
                    {stat.label}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MOBILE STAT CARDS ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        {quickStats.map((stat, i) => (
          <Card key={i} className={`p-5 ${stat.bg} border ${stat.border} rounded-3xl`}>
            <div className={`size-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center mb-3 ${stat.color}`}>
              {loading
                ? <Loader2 size={18} className="animate-spin text-slate-400" />
                : <stat.icon size={18} />
              }
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              {loading ? '—' : stat.value}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* ═══ PIPELINE SNAPSHOT + AI INSIGHTS ════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Active Pipeline Snapshot ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Active Pipeline Snapshot
            </h3>
            <Button
              variant="ghost"
              className="text-blue-600 font-black text-xs uppercase"
              onClick={() => navigate('/platform/employer/jobs')}
            >
              View All Jobs
            </Button>
          </div>

          <div className="space-y-4">
            {/* Loading state */}
            {loading && (
              <>
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 flex items-center gap-4 text-rose-500">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">Could not load pipeline data. Please refresh.</p>
              </div>
            )}

            {/* Empty state — no jobs with applicants yet */}
            {!loading && !error && pipeline.filter(j => j.candidates > 0).length === 0 && (
              <div className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4 text-center">
                <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-400">
                  <Briefcase size={28} />
                </div>
                <div>
                  <p className="text-base font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                    {pipeline.length > 0 ? 'No Applicants Yet' : 'No Active Jobs Yet'}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {pipeline.length > 0
                      ? 'Your posted jobs are live. Applicants will appear here once they apply.'
                      : 'Post your first job to start seeing pipeline activity here.'}
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/platform/employer/post-job')}
                  className="mt-2 h-11 px-6 bg-blue-600 text-white font-black rounded-2xl text-xs uppercase"
                >
                  Post a Job
                  <ArrowRight size={14} />
                </Button>
              </div>
            )}

            {/* Dynamic job rows — only show jobs that have at least 1 applicant */}
            {!loading && !error && pipeline.filter(j => j.candidates > 0).map((job, i) => (
              <div
                key={job.id ?? i}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-500/50 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => navigate('/platform/employer/candidates')}
              >
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-none">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold text-slate-500">
                        {job.candidates} Candidate{job.candidates !== 1 ? 's' : ''}
                      </span>
                      <div className="size-1 bg-slate-200 rounded-full" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${statusColor(job.status)}`}>
                        {job.status || 'Active'}
                      </span>
                      <div className="size-1 bg-slate-200 rounded-full" />
                      <span className="text-[10px] font-medium text-slate-400 uppercase">{job.job_type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors">
                  <ArrowRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Insights Sidebar ──────────────────────────────────────── */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            AI Insights
          </h3>
          <Card className="p-8 space-y-8 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 rounded-[32px]">

            {/* Hiring Efficiency */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Zap size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Hiring Efficiency</span>
              </div>
              {loading
                ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg w-full" />
                    <div className="h-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg w-3/4" />
                  </div>
                )
                : (
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {efficiencyText}
                    {avgScore > 0 && (
                      <>
                        {' '}Average ATS score:{' '}
                        <strong className="text-blue-600 text-lg">{avgScore}%</strong>
                      </>
                    )}
                  </p>
                )
              }
            </div>

            {/* Recommended Actions */}
            <div className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Recommended Actions
              </p>
              {loading
                ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2].map(k => (
                      <div key={k} className="flex gap-3">
                        <div className="size-4 rounded-full bg-slate-200 dark:bg-slate-700 mt-0.5 shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )
                : (
                  <ul className="space-y-4">
                    {insightActions.slice(0, 3).map((action, i) => (
                      <li key={i} className="flex gap-3">
                        <div className={`mt-1 ${action.color} shrink-0`}>
                          <action.icon size={16} />
                        </div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {action.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )
              }
            </div>

            {/* Pipeline summary chip */}
            {!loading && totalApps > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-100/60 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
                <Clock size={14} className="text-blue-500 shrink-0" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {totalApps} total applicant{totalApps !== 1 ? 's' : ''} · {shortlisted} shortlisted
                </p>
              </div>
            )}

            <Button
              onClick={() => navigate('/platform/employer/analytics')}
              className="w-full h-12 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/20"
            >
              Full Report
              <ArrowRight size={14} />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerHome;
