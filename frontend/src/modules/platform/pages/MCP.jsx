import React, { useEffect, useState } from "react";
import apiClient from "../../../core/api/apiClient";
import { useToast } from "../../../core/context/ToastContext";

const MCP = () => {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [expandedJob, setExpandedJob] = useState(null);
  const [activeFeed, setActiveFeed] = useState("recommended");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mcpStatus, setMcpStatus] = useState("idle");
  const { showToast } = useToast();

  const feedTabs = [
    { key: "recommended", label: "Recommended for You" },
    { key: "all", label: "All Jobs" },
    { key: "external", label: "External Jobs" },
  ];

  const loadFeed = async (feed = activeFeed) => {
    setLoading(true);
    try {
      const [jobsRes, notificationsRes, statusRes] = await Promise.all([
        apiClient.get(`/mcp/jobs?type=${feed}`),
        apiClient.get("/mcp/notifications"),
        apiClient.get("/mcp/status"),
      ]);

      setDbData(jobsRes.data);
      setNotifications(notificationsRes.data?.notifications || []);
      setUnreadCount(notificationsRes.data?.unreadCount || 0);
      setMcpStatus(statusRes.data?.status || "idle");
    } catch (err) {
      console.error("Failed to load MCP feed", err);
      setDbData({ status: "error", jobs: [], skills: [], total: 0 });
      setNotifications([]);
      setUnreadCount(0);
      setMcpStatus("idle");
    } finally {
      setLoading(false);
      setActiveStep(-1);
    }
  };

  const simulatePipeline = async () => {
    setLoading(true);
    setDbData(null); // Clear data to show simulation
    
    // Simulate steps for UI feedback
    for (let i = 0; i < 3; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    }
    
    try {
      const res = await apiClient.post("/mcp/run");
      setDbData(res.data);
      showToast("Intelligence Pipeline Executed ✔", "success", "mcp-run");
      await loadFeed(activeFeed);
    } catch (err) {
      showToast(err.response?.data?.detail || "Pipeline failed", "error", "mcp-err");
      // Prevent crash by providing empty state
      setDbData({ status: "error", jobs: [], skills: [] });
    } finally {
      setActiveStep(-1);
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    await loadFeed(activeFeed);
  };

  const sendFeedback = async (jobId, action) => {
    try {
      await apiClient.post("/mcp/feedback", { jobId, action });
      showToast(`Feedback "${action}" recorded`, "success", "mcp-fb");
    } catch (err) {
      console.error("Feedback error", err);
    }
  };

  const markAllAlertsRead = async () => {
    try {
      await apiClient.post("/mcp/notifications/read", { notification_ids: [] });
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      setUnreadCount(0);
      showToast("All alerts marked as read", "success", "mcp-read");
      await loadFeed(activeFeed);
    } catch (err) {
      showToast("Failed to mark alerts as read", "error", "mcp-read-err");
    }
  };

  const markRead = async (id) => {
    if (!id) return;
    try {
      await apiClient.post("/mcp/notifications/read", { notification_ids: [id] });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      showToast("Failed to mark alert as read", "error", "mcp-read-one-err");
    }
  };

  // Run on mount
  useEffect(() => {
    fetchStatus();
    // Optional: Real-time feel, refresh every 15 seconds
    // const interval = setInterval(fetchStatus, 15000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dbData !== null) {
      loadFeed(activeFeed);
    }
  }, [activeFeed]);

  // Strict live data only
  const displayData = dbData;
  // If we are actively loading, we want to hide data to show the pipeline working
  const isDataVisible = !loading && dbData && dbData.status !== "error";

  const pipelineSteps = [
    { label: "Upload", icon: "upload_file" },
    { label: "Analyze", icon: "analytics" },
    { label: "Match", icon: "hub" }
  ];

  const hasJobs = displayData?.jobs?.length > 0;
  const topJob = hasJobs ? displayData.jobs[0] : null;
  const topJobSuggestions = Array.isArray(topJob?.explain)
    ? topJob.explain
    : (topJob?.explain?.suggestions || []);
  const topComponents = {
    ats: Math.round(topJob?.components?.ats ?? 0),
    semantic: Math.round(topJob?.components?.semantic ?? 0),
    experience: Math.round(topJob?.components?.experience ?? 0),
    trend: Math.round(topJob?.components?.trend ?? 0),
  };
  const statusActive = mcpStatus === "active";

  // Helper for score breakdown bars
  const ScoreBar = ({ label, value, color }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  return (
    <div className="h-full space-y-6 ">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Master Control Program</h2>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Adaptive Intelligence</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${
            statusActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
          }`}>
            <span className={`size-2 rounded-full ${statusActive ? "bg-emerald-500" : "bg-amber-500"}`} />
            MCP Status: {statusActive ? "Active" : "Idle"}
          </div>
        <button
          onClick={simulatePipeline}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
            loading
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-wait"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95"
          }`}
        >
          <span className={`material-symbols-outlined text-lg ${loading ? "" : ""}`}>
            {loading ? "sync" : "rocket_launch"}
          </span>
          {loading ? "Analyzing..." : "Analyze Profile"}
        </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {feedTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFeed(tab.key);
                setExpandedJob(null);
              }}
              className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFeed === tab.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAlertsRead}
            disabled={unreadCount <= 0}
            className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
              unreadCount > 0
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
            }`}
          >
            Mark Read
          </button>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="material-symbols-outlined text-sm text-blue-600">notifications</span>
          {unreadCount} unread alerts
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===== LEFT COLUMN: Pipeline + Engine Status ===== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pipeline Flow */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
              <span className="material-symbols-outlined text-[8rem]">memory</span>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-blue-600">account_tree</span>
              Live Pipeline Execution
            </h3>
            <div className="relative">
              {pipelineSteps.map((step, idx) => {
                const isCompleted = isDataVisible || (loading && idx < activeStep);
                const isActive = loading && idx === activeStep;
                
                return (
                  <div key={idx} className="relative pl-11 pb-6 last:pb-0 group">
                    {idx !== pipelineSteps.length - 1 && (
                      <div className={`absolute left-[17px] top-9 bottom-0 w-0.5 transition-colors ${isCompleted ? "bg-blue-600" : "bg-slate-100 dark:bg-slate-800"}`} />
                    )}
                    <div className={`absolute left-0 top-0 size-9 rounded-full flex items-center justify-center z-10 transition-all ${
                      isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110 " 
                      : isCompleted ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      <span className={`material-symbols-outlined text-base ${isActive ? "-slow" : ""}`}>{isCompleted ? "check" : step.icon}</span>
                    </div>
                    <div className="pt-1.5 flex items-center justify-between">
                      <h4 className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                        isActive ? "text-blue-600" : isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"
                      }`}>{step.label}</h4>
                      {isActive && <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest ">Running...</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-blue-600">notifications</span>
                MCP Alerts
              </h3>
              <button
                onClick={markAllAlertsRead}
                disabled={unreadCount <= 0}
                className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                  unreadCount > 0
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                }`}
              >
                Mark All Read
              </button>
            </div>

            {!notifications.length ? (
              <div className="py-8 text-center opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No alerts yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.slice(0, 6).map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-xl border p-3 ${
                      notification.isRead
                        ? "bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                        : "bg-blue-50/70 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{notification.title}</p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => markRead(notification.id)}
                          className="shrink-0 rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>

        {/* ===== RIGHT COLUMN: Intelligence Data ===== */}
        <div className={`lg:col-span-8 space-y-6 transition-opacity ${loading ? "opacity-40 pointer-events-none blur-[1px]" : "opacity-100"}`}>

          {/* TOP ROW: Final Intelligence Score & Global Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg shadow-blue-500/20 text-white flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        Top Recommendation
                    </h3>
                    <p className="text-sm font-black tracking-tight">{topJob ? topJob.title : "Analyzing..."}</p>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-black tracking-tighter leading-none">{topJob ? Math.round(topJob.finalScore) : 0}%</span>
                    <span className="block text-[8px] font-black text-blue-200 uppercase tracking-widest mt-1">Final Intelligence Score</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-center col-span-4 md:col-span-2">
              <span className="text-4xl font-black tracking-tighter text-blue-600">{displayData?.total_matches || displayData?.total || 0}</span>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Top Matches</span>
            </div>
          </div>

          {/* SCORE BREAKDOWN & EXPLAINABILITY (Top Match) */}
          {topJob && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-blue-600">tune</span>
                  Deep ATS Breakdown
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/30">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ATS</span>
                  <p className="text-xl font-black text-blue-600 mt-1">{topComponents.ats}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/30">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Semantic</span>
                  <p className="text-xl font-black text-cyan-600 mt-1">{topComponents.semantic}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/30">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience</span>
                  <p className="text-xl font-black text-emerald-600 mt-1">{topComponents.experience}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/30">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trend</span>
                  <p className="text-xl font-black text-amber-600 mt-1">{topComponents.trend}%</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Component Bars */}
                <div className="space-y-4">
                    <ScoreBar label="Keyword Match" value={topJob.components?.keyword_match ?? topJob.components?.ats ?? 0} color="bg-blue-600" />
                    <ScoreBar label="Skills Alignment" value={topJob.components?.skills || 0} color="bg-indigo-500" />
                    <ScoreBar label="Projects/Experience" value={topJob.components?.projects_experience || 0} color="bg-violet-500" />
                    <ScoreBar label="Content Quality" value={topJob.components?.content_quality || 0} color="bg-fuchsia-500" />
                    <ScoreBar label="Format & Length" value={topJob.components?.format || 0} color="bg-pink-500" />
                    <ScoreBar label="Sections" value={topJob.components?.sections || 0} color="bg-rose-500" />
                    <ScoreBar label="Semantic Match" value={topJob.components?.semantic || 0} color="bg-cyan-500" />
                    <ScoreBar label="Experience Fit" value={topJob.components?.experience || 0} color="bg-emerald-500" />
                    <ScoreBar label="Market Trend" value={topJob.components?.trend || 0} color="bg-amber-500" />
                </div>
                {/* Right: Explainability Insights */}
                <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Top Match Reasoning</h4>
                    <div className="space-y-2.5">
                        <div className={`flex items-start gap-2.5 p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-700 dark:text-emerald-300`}>
                            <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                            <span className="text-[11px] font-bold leading-relaxed">Strong match based on skills and experience</span>
                        </div>
                        {/* Dynamic Suggestions from ATS Scorer */}
                        {topJobSuggestions.map((sugg, idx) => (
                           <div key={idx} className={`flex items-start gap-2.5 p-3 rounded-xl border bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20 text-amber-700 dark:text-amber-300`}>
                              <span className="material-symbols-outlined text-sm shrink-0">lightbulb</span>
                              <span className="text-[11px] font-bold leading-relaxed">{sugg}</span>
                           </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* RANKED JOBS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-emerald-500">format_list_numbered</span>
              Adaptive Job Recommendations
            </h3>

            {!hasJobs ? (
              <div className="py-16 flex flex-col items-center justify-center text-center opacity-50">
                <span className="material-symbols-outlined text-5xl mb-3">insights</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Run pipeline to generate adaptive rankings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayData.jobs.map((job, i) => {
                  const isExpanded = expandedJob === i;
                  return (
                    <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/20">
                      {/* Job Row */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer group bg-white dark:bg-slate-900"
                        onClick={() => { setExpandedJob(isExpanded ? null : i); if (!isExpanded) sendFeedback(job.jobId, "click"); }}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                            job.category === "primary"
                              ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600"
                              : "bg-amber-100 dark:bg-amber-900/20 text-amber-600"
                          }`}>
                            #{i + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                              {job.company} · {job.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            job.category === "primary"
                              ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
                              : "bg-amber-50 dark:bg-amber-900/10 text-amber-600 border border-amber-200 dark:border-amber-800"
                          }`}>
                            {job.category}
                          </span>
                          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round(job.finalScore)}%</span>
                          <span className={`material-symbols-outlined text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                        </div>
                      </div>

                      {/* Expanded Detail - Focused on Action & Skill Gap */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-4 border-t border-slate-100 dark:border-slate-800 duration-300">
                            {/* Dynamic Skill Gap UI */}
                            <div>
                              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-xs text-amber-500">upgrade</span>
                                Profile Evolution Path
                              </h5>
                              {job.skillGap?.missing?.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                      <div className="flex flex-wrap gap-1.5">
                                        {job.skillGap.missing.map((skill, si) => (
                                          <span key={si} className="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-tight rounded-lg border border-rose-200 dark:border-rose-900/30 shadow-sm flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">add</span> {skill}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                        Projected Boost <span className="text-sm tracking-tighter ml-1">{job.skillGap.impact}</span>
                                      </div>
                                  </div>
                                  {job.skillGap.learningPath?.length > 0 && (
                                    <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Recommended Learning Path</span>
                                      {job.skillGap.learningPath.map((pathObj, pi) => (
                                        <div key={pi} className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                                <span className="material-symbols-outlined text-sm text-blue-500">school</span>
                                                {pathObj.skill} Mastery
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Watch</span>
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[10px] text-red-500">play_circle</span> {pathObj.course}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Build</span>
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[10px] text-emerald-500">code</span> {pathObj.project}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 text-center flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
                                  <span className="material-symbols-outlined text-lg">verified</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest">Full Skill Coverage Detected</span>
                                </div>
                              )}
                            </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6">
                            <button
                              onClick={(e) => { e.stopPropagation(); sendFeedback(job.jobId, "apply"); }}
                              className="flex-1 h-10 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">send</span> 1-Click Apply
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); sendFeedback(job.jobId, "ignore"); }}
                              className="h-10 px-5 border border-slate-200 dark:border-slate-700 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 shadow-sm"
                            >
                              <span className="material-symbols-outlined text-sm">visibility_off</span> Ignore Match
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SKILL MATRIX */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-indigo-500">fingerprint</span>
              Skills Identified
            </h3>
            {!displayData?.skills?.length ? (
              <div className="py-10 text-center opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">fingerprint</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload resume to detect skills</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {displayData.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-tight rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MCP;



