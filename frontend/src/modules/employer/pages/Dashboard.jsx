import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, Calendar, Target, ArrowRight,
  CheckCircle2, XCircle, Loader2, AlertCircle,
  TrendingUp, Plus, BarChart3
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { fetchEmployerAnalytics, fetchTopCandidates, updateApplicationStatus } from '../services/employerService';
import { getCurrentUserId } from '../../../core/auth/session';

// ── Skeleton helpers ─────────────────────────────────────────────────────────
const SkeletonBlock = ({ w = 'w-full', h = 'h-4', rounded = 'rounded-lg' }) => (
  <div className={`${w} ${h} ${rounded} bg-slate-200 dark:bg-slate-700 animate-pulse`} />
);

const MetricSkeleton = () => (
  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-3">
    <div className="size-9 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
    <SkeletonBlock w="w-1/2" h="h-3" />
    <SkeletonBlock w="w-16" h="h-7" />
    <SkeletonBlock w="w-24" h="h-3" />
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const employerId = getCurrentUserId();

  // ── State ──────────────────────────────────────────────────────────────────
  const [analytics, setAnalytics] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!employerId) return;
    try {
      setLoading(true);
      setError(false);
      const [analyticsRes, candidatesRes] = await Promise.all([
        fetchEmployerAnalytics(employerId),
        fetchTopCandidates(employerId).catch(() => ({ top_candidates: [] })),
      ]);
      setAnalytics(analyticsRes?.analytics || null);
      setCandidates(candidatesRes?.top_candidates || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [employerId]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const activeJobsCount = analytics?.active_jobs      ?? 0;
  const totalApps       = analytics?.total_applicants ?? 0;
  const avgScore        = analytics?.avg_ats_score    ?? 0;
  const shortlisted     = analytics?.shortlisted      ?? 0;
  const newApps         = analytics?.new_applicants   ?? 0;
  const interviews      = analytics?.interviews       ?? 0;
  const activeJobsList  = analytics?.pipeline         ?? [];  // [{id, title, job_type, candidates}]

  const metrics = [
    {
      label: 'Active Jobs',
      value: loading ? '—' : String(activeJobsCount),
      icon: Briefcase,
      color: 'text-blue-600',
      trend: activeJobsCount > 0 ? `${activeJobsCount} live posting${activeJobsCount > 1 ? 's' : ''}` : 'No active jobs',
      trendColor: activeJobsCount > 0 ? 'text-emerald-500' : 'text-slate-400',
    },
    {
      label: 'Total Applicants',
      value: loading ? '—' : String(totalApps),
      icon: Users,
      color: 'text-purple-600',
      trend: newApps > 0 ? `+${newApps} new (unreviewed)` : 'No new applications',
      trendColor: newApps > 0 ? 'text-emerald-500' : 'text-slate-400',
    },
    {
      label: 'Avg Match Score',
      value: loading ? '—' : `${avgScore}%`,
      icon: Target,
      color: 'text-emerald-600',
      trend: avgScore > 0 ? (avgScore >= 70 ? '↑ Strong match quality' : '↑ Keep refining JDs') : 'No applications yet',
      trendColor: avgScore >= 70 ? 'text-emerald-500' : 'text-amber-500',
    },
    {
      label: 'Shortlisted',
      value: loading ? '—' : String(shortlisted),
      icon: Calendar,
      color: 'text-amber-600',
      trend: interviews > 0 ? `${interviews} interview${interviews > 1 ? 's' : ''} scheduled` : 'Schedule interviews',
      trendColor: interviews > 0 ? 'text-emerald-500' : 'text-slate-400',
    },
  ];

  // ── Pipeline stages computed from applications ─────────────────────────────
  // We derive stage counts from analytics data
  const pipelineStages = [
    { stage: 'New',        count: newApps,                              color: 'bg-blue-500' },
    { stage: 'Reviewing',  count: Math.max(0, totalApps - newApps - shortlisted), color: 'bg-indigo-500' },
    { stage: 'Shortlisted',count: shortlisted,                         color: 'bg-amber-500' },
    { stage: 'Interview',  count: interviews,                           color: 'bg-emerald-500' },
  ];
  const pipelineTotal = pipelineStages.reduce((s, p) => s + p.count, 0);

  // ── Shortlist / Reject handler ─────────────────────────────────────────────
  const handleAction = async (applicationId, status) => {
    if (!applicationId) return;
    setActionLoading(prev => ({ ...prev, [applicationId]: status }));
    try {
      await updateApplicationStatus(applicationId, status);
      // Re-fetch to update counts
      await loadData();
    } catch {
      // silent fail — don't break the UI
    } finally {
      setActionLoading(prev => { const n = { ...prev }; delete n[applicationId]; return n; });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-12 px-6 pt-2">

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-600">
          <AlertCircle size={18} />
          <p className="text-sm font-bold">Could not load dashboard data. <button onClick={loadData} className="underline">Retry</button></p>
        </div>
      )}

      {/* ── METRICS ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
          : metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${m.color}`}>
                <m.icon size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{m.label}</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{m.value}</h4>
                <p className={`text-xs font-semibold mt-0.5 ${m.trendColor}`}>{m.trend}</p>
              </div>
            </div>
          ))
        }
      </div>

      {/* ── HIRING PIPELINE ───────────────────────────────────────────────── */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Hiring Pipeline</h3>
          <span className="text-xs font-semibold text-slate-500">{pipelineTotal} Total Candidates</span>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 w-full" />
            <div className="flex justify-between">
              {[1,2,3,4].map(i => <div key={i} className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />)}
            </div>
          </div>
        ) : pipelineTotal === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-slate-400">
            <BarChart3 size={28} />
            <p className="text-sm font-bold">Pipeline is empty — post jobs and receive applications to see stages here.</p>
          </div>
        ) : (
          <>
            {/* Bar */}
            <div className="flex h-3.5 rounded-full overflow-hidden mb-4">
              {pipelineStages.filter(p => p.count > 0).map(p => (
                <div
                  key={p.stage}
                  className={`${p.color} transition-all`}
                  style={{ width: `${(p.count / pipelineTotal) * 100}%` }}
                  title={`${p.stage}: ${p.count}`}
                />
              ))}
            </div>
            {/* Labels */}
            <div className="flex justify-between">
              {pipelineStages.map(p => (
                <div key={p.stage} className="flex flex-col items-center gap-1">
                  <div className={`size-2.5 rounded-full ${p.color}`} />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{p.stage}</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">{p.count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── MAIN SECTION ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Applicants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Applications</h3>
            <button
              onClick={() => navigate('/platform/employer/candidates')}
              className="text-xs font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                  <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock w="w-1/2" h="h-3" />
                    <SkeletonBlock w="w-1/3" h="h-3" />
                  </div>
                  <SkeletonBlock w="w-12" h="h-6" />
                </div>
              ))
              : candidates.length === 0
                ? (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-center">
                    <Users size={24} />
                    <p className="text-sm font-bold">No applicants yet</p>
                    <p className="text-xs">Post jobs and applicants will appear here.</p>
                  </div>
                )
                : candidates.slice(0, 4).map((cand, idx) => {
                  const initials = (cand.name || 'A').charAt(0).toUpperCase();
                  const score = cand.ats_score ?? cand.score ?? 0;
                  const isActioning = actionLoading[cand.application_id];
                  return (
                    <div
                      key={cand.application_id ?? idx}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 font-black text-base group-hover:scale-105 transition-transform">
                          {initials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{cand.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{cand.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1">
                          {(cand.skills || []).slice(0, 2).map(s => (
                            <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                        <div className="text-right">
                          <p className={`text-base font-black ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {score > 0 ? `${score}%` : '—'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">{cand.status || 'Applied'}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAction(cand.application_id, 'shortlisted')}
                            disabled={!!isActioning}
                            className="size-8 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            title="Shortlist"
                          >
                            {isActioning === 'shortlisted' ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={15} />}
                          </button>
                          <button
                            onClick={() => handleAction(cand.application_id, 'rejected')}
                            disabled={!!isActioning}
                            className="size-8 flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            {isActioning === 'rejected' ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>

        {/* Active Jobs Snapshot */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Active Jobs</h3>
            <button
              onClick={() => navigate('/platform/employer/post-job')}
              className="text-xs font-bold text-blue-600 uppercase tracking-wide hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <Plus size={12} /> Post a Job
            </button>
          </div>

          <div className="space-y-2">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2 animate-pulse">
                  <div className="flex justify-between">
                    <SkeletonBlock w="w-1/2" h="h-4" />
                    <SkeletonBlock w="w-16" h="h-5" rounded="rounded-full" />
                  </div>
                  <SkeletonBlock w="w-1/3" h="h-3" />
                  <SkeletonBlock w="w-full" h="h-1.5" rounded="rounded-full" />
                </div>
              ))
              : activeJobsList.length === 0
                ? (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 text-center">
                    <Briefcase size={24} />
                    <p className="text-sm font-bold">No active jobs</p>
                    <Button
                      onClick={() => navigate('/platform/employer/post-job')}
                      className="h-9 px-5 bg-blue-600 text-white rounded-xl font-black text-xs"
                    >
                      <Plus size={14} /> Post First Job
                    </Button>
                  </div>
                )
                : activeJobsList.map((job, idx) => {
                  const matchPct = avgScore || 0;
                  return (
                    <div
                      key={job.id ?? idx}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate('/platform/employer/candidates')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded uppercase tracking-widest">Active</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-blue-600">{job.candidates} Applicant{job.candidates !== 1 ? 's' : ''}</span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {matchPct > 0 ? `Avg Match: ${matchPct}%` : job.job_type}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: matchPct > 0 ? `${matchPct}%` : job.candidates > 0 ? '20%' : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })
            }
          </div>

          {/* Quick Analytics */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Quick Analytics</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Avg Match Score',
                  value: loading ? '—' : avgScore > 0 ? `${avgScore}%` : '—',
                },
                {
                  label: 'Shortlist Rate',
                  value: loading ? '—' : totalApps > 0 ? `${Math.round((shortlisted / totalApps) * 100)}%` : '—',
                },
                {
                  label: 'Active Pipeline',
                  value: loading ? '—' : String(totalApps),
                },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
