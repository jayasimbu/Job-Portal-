import React, { useState, useEffect } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';
import { fetchResumeInsights, fetchLearningRecommendations } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';

export default function SkillGapAnalysis() {
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const userId = getCurrentUserId();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [insightData, recData] = await Promise.all([
          fetchResumeInsights(),
          fetchLearningRecommendations(userId)
        ]);
        setInsight(insightData);
        setRecommendations(recData.learning || []);
      } catch (err) {
        console.error('Failed to load skill gap data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-[#101922] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full "></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Quantifying your skills...</p>
        </div>
      </div>
    );
  }

  // Map backend data to frontend structure
  const breakdown = insight?.breakdown || { skills: 0, experience: 0, keywords: 0 };
  const missingKeywords = insight?.missing_keywords || [];
  
  const chartData = [
    { label: "Skills", match: breakdown.skills, type: "match" },
    { label: "Experience", match: breakdown.experience, type: "match" },
    { label: "Keywords", match: breakdown.keywords || 0, type: "match" },
  ];

  // Map high priority gaps (missing keywords to recommended courses)
  const highPriorityGaps = missingKeywords.slice(0, 3).map((keyword, idx) => {
    const matchedCourse = recommendations.find(r => r.matchReason.includes(keyword));
    return {
      title: keyword,
      status: "Gap Detected",
      desc: `Industry benchmark requires proficiency in ${keyword}. This was not detected in your recent resume.`,
      current: "Novice",
      target: "Proficient",
      progress: 5,
      course: matchedCourse
    };
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-[#101922] text-[#0d141b] dark:text-white transition-colors ">
      <JobSeekerShell active="dashboard" />
      
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8 max-w-[1280px] mx-auto w-full">
        {/* Page Heading & Context */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-50 dark:bg-[#1A2633] p-8 rounded-xl shadow-sm border border-slate-300 dark:border-[#2a3b4f] mb-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                Current Analysis
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Skill Gap Analysis
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-base font-normal leading-normal">
              Analyze your profile against industry standards. Identify gaps
              and bridge them with recommended courses to increase your
              ATS match score.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[200px]">
            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
              Global Match Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">
                {insight?.ats_score || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Skill Breakdown */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-[#1A2633] border border-slate-300 dark:border-[#2a3b4f] shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="text-sm font-medium">Matched Skills</p>
                </div>
                <p className="text-3xl font-bold leading-tight">{insight?.skills_match?.length || 0}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-[#1A2633] border border-orange-200 dark:border-orange-900/40 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                  <span className="material-symbols-outlined">warning</span>
                  <p className="text-sm font-bold">Missing Keywords</p>
                </div>
                <p className="text-3xl font-bold leading-tight">{missingKeywords.length}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-[#1A2633] border border-slate-300 dark:border-[#2a3b4f] shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                  <span className="material-symbols-outlined">trending_up</span>
                  <p className="text-sm font-medium">In Progress</p>
                </div>
                <p className="text-3xl font-bold leading-tight">{recommendations.filter(r => r.progress > 0).length}</p>
              </div>
            </div>

            {/* Missing Skills Section (Priority) */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-500">priority_high</span>
                High Priority Gaps
              </h3>

              {highPriorityGaps.length > 0 ? highPriorityGaps.map((gap, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#1A2633] rounded-xl border border-slate-300 dark:border-[#2a3b4f] border-l-8 border-l-orange-500 p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg">{gap.title}</h4>
                      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded uppercase">
                        {gap.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">{gap.desc}</p>
                    <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2 max-w-xs relative">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${gap.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between max-w-xs mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                      <span>Current: {gap.current}</span>
                      <span>Target: {gap.target}</span>
                    </div>
                  </div>
                  
                  {gap.course ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">Recommended Course</span>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-[#253241] border border-slate-300 dark:border-[#2a3b4f]">
                        <div className="size-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 text-xl">{gap.course.imgIcon || 'school'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight line-clamp-1">{gap.course.title}</span>
                          <span className="text-[10px] text-gray-500">{gap.course.provider} • {gap.course.duration}</span>
                        </div>
                      </div>
                      <a href={gap.course.url || "#"} target="_blank" rel="noopener noreferrer" className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        Start Learning <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <button onClick={() => navigate('/jobseeker/learning')} className="w-full bg-slate-50 dark:bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-900 dark:text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        Find Courses <span className="material-symbols-outlined text-sm">library_books</span>
                      </button>
                    </div>
                  )}
                </div>
              )) : (
                <div className="bg-slate-50 dark:bg-[#1A2633] rounded-xl border border-slate-300 dark:border-[#2a3b4f] p-8 text-center">
                    <p className="text-slate-500 dark:text-gray-400">No high-priority gaps detected. Great job!</p>
                </div>
              )}
            </div>

            {/* Technical Skills Breakdown */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Matched Skills Analysis</h3>
              </div>
              <div className="bg-slate-50 dark:bg-[#1A2633] rounded-xl border border-slate-300 dark:border-[#2a3b4f] p-6 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  {insight?.skills_match?.length > 0 ? insight.skills_match.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800 font-medium text-sm">
                        {skill}
                    </span>
                  )) : (
                    <p className="text-slate-500 dark:text-gray-400 text-sm">No matched skills detected yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Actions */}
          <div className="flex flex-col gap-6 lg:mt-0 mt-8">
            {/* Visualizer Chart */}
            <div className="bg-slate-50 dark:bg-[#1A2633] rounded-xl border border-slate-300 dark:border-[#2a3b4f] p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold">Match Overview</h3>
              <div className="relative h-64 w-full flex items-end justify-center gap-4 px-2 pt-8 border-b border-l border-slate-200 dark:border-slate-700 pb-2 ml-4">
                {chartData.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
                    <div className={`relative w-full rounded-t-lg transition-all bg-blue-600 hover:bg-blue-700`} style={{ height: `${bar.match}%` }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20">
                        {bar.match}% Match
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-center text-slate-500 dark:text-gray-400 uppercase mt-1 absolute -bottom-6">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Path Promotion */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#101922] dark:to-[#2b3c4f] rounded-xl p-6 shadow-lg text-white relative overflow-hidden mt-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Ready to level up?</h3>
              <p className="text-slate-300 text-sm mb-4 relative z-10">
                Bridge your current gaps to reach a 95%+ match score for premium roles.
              </p>
              <button onClick={() => navigate('/jobseeker/learning')} className="w-full bg-slate-50 text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors relative z-10 flex justify-between items-center">
                Open Learning Hub
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-500">rocket_launch</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



