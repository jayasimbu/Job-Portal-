import React from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function SkillGapAnalysis() {
  // Static mock data based on the HTML
  const analysisData = {
    targetRole: "Senior Data Scientist",
    matchScore: 72,
    scoreTrend: "+5% this week",
    stats: {
      proficient: 8,
      missing: 3,
      inProgress: 4
    },
    highPriorityGaps: [
      {
        id: 1,
        title: "Cloud Deployment (AWS)",
        status: "Missing",
        desc: "Required for senior roles. You have no verified experience.",
        current: "Novice",
        target: "Expert",
        progress: 5,
        course: {
          title: "AWS Certified Solutions Architect",
          meta: "24h • Intermediate",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZHRgr1tEXhCyuXLRQG8aIGVY8VulwzzqofxD7_gyFcxHAuWDczRcKBqp3ejfwjOmslZ01Dfm7xPtdoqSggqNEBGamh7LfY7vfEg8FO16py57AUhXP7ovCvWKWddSBW4bNCeBEWglvLpzZf6t19wV4PxVOzsewn59dEDJHpKO47DCGnGOmolStf2MAiJfg6OLil9hZflnCp4Gz4usmPvhR7JQ2DcFXDIRf5JwN0IQxd4EMDssPXgC3JWW0s7P_CMJ6hrsa6SVDVizx"
        }
      },
      {
        id: 2,
        title: "Machine Learning Ops (MLOps)",
        status: "Significant Gap",
        desc: "Target requires Level 8. You are currently at Level 3.",
        current: "Beginner",
        target: "Advanced",
        progress: 30, // 30% mapped to Level 3 / Level 8
        targetProgress: 80,
      }
    ],
    technicalSkills: [
      { title: "Python Programming", category: "Data Analysis & Scripting", match: 90 },
      { title: "Data Visualization", category: "Tableau, PowerBI", match: 75 },
      { title: "Deep Learning", category: "TensorFlow, Keras", match: 45, isGap: true }
    ],
    chartData: [
      { label: "Python", match: 90, type: "match" },
      { label: "Data Viz", match: 75, type: "match" },
      { label: "MLOps", match: 30, type: "gap" },
      { label: "Cloud", match: 5, type: "gap" },
      { label: "Stats", match: 60, type: "match" }
    ],
    softSkills: [
      { title: "Communication", status: "Strong", progress: 100, color: "green" },
      { title: "Leadership", status: "Developing", progress: 40, color: "orange" }
    ]
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#101922] text-[#0d141b] dark:text-white transition-colors duration-200">
      <JobSeekerShell active="dashboard" />
      
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8 max-w-[1280px] mx-auto w-full">
        {/* Page Heading & Context */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white dark:bg-[#1A2633] p-8 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a3b4f] mb-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                Target Role
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              {analysisData.targetRole}
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-base font-normal leading-normal">
              Analyze your profile against your target role. Identify gaps
              and bridge them with recommended courses to increase your
              match score.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[200px]">
            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
              Role Match Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">
                {analysisData.matchScore}%
              </span>
              <span className="text-green-600 dark:text-green-400 font-bold text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                {analysisData.scoreTrend}
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
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1A2633] border border-slate-200 dark:border-[#2a3b4f] shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="text-sm font-medium">Proficient Skills</p>
                </div>
                <p className="text-3xl font-bold leading-tight">{analysisData.stats.proficient}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1A2633] border border-orange-200 dark:border-orange-900/40 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                  <span className="material-symbols-outlined">warning</span>
                  <p className="text-sm font-bold">Missing Skills</p>
                </div>
                <p className="text-3xl font-bold leading-tight">{analysisData.stats.missing}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1A2633] border border-slate-200 dark:border-[#2a3b4f] shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                  <span className="material-symbols-outlined">trending_up</span>
                  <p className="text-sm font-medium">In Progress</p>
                </div>
                <p className="text-3xl font-bold leading-tight">{analysisData.stats.inProgress}</p>
              </div>
            </div>

            {/* Missing Skills Section (Priority) */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-500">priority_high</span>
                High Priority Gaps
              </h3>

              {analysisData.highPriorityGaps.map((gap, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1A2633] rounded-xl border border-slate-200 dark:border-[#2a3b4f] border-l-8 border-l-orange-500 p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg">{gap.title}</h4>
                      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded uppercase">
                        {gap.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">{gap.desc}</p>
                    <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2 max-w-xs relative">
                      {gap.targetProgress && (
                        <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500 h-4 -mt-1" style={{ left: `${gap.targetProgress}%` }} title="Target Level"></div>
                      )}
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${gap.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between max-w-xs mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                      <span>Current: {gap.current}</span>
                      <span className={gap.targetProgress ? `pl-[${gap.targetProgress}%]` : ""}>Target: {gap.target}</span>
                    </div>
                  </div>
                  
                  {gap.course ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">Recommended Course</span>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-[#253241] border border-slate-200 dark:border-[#2a3b4f]">
                        <div className="size-10 rounded bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${gap.course.img})` }}></div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight line-clamp-1">{gap.course.title}</span>
                          <span className="text-[10px] text-gray-500">{gap.course.meta}</span>
                        </div>
                      </div>
                      <button className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        Start Learning <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <button className="w-full bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-900 dark:text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        View 3 Courses <span className="material-symbols-outlined text-sm">library_books</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Technical Skills Breakdown */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Technical Skills Analysis</h3>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="bg-white dark:bg-[#1A2633] rounded-xl border border-slate-200 dark:border-[#2a3b4f] p-6 shadow-sm">
                <div className="space-y-6">
                  {analysisData.technicalSkills.map((skill, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="font-bold">{skill.title}</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400">{skill.category}</span>
                        </div>
                        {skill.isGap ? (
                           <div className="flex items-center gap-2">
                             <span className="text-xs text-orange-500 font-medium">Gap Detected</span>
                             <span className="text-blue-600 dark:text-blue-400 font-bold">{skill.match}% Match</span>
                           </div>
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{skill.match}% Match</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-3 relative">
                        {skill.isGap && (
                           <div className="absolute top-0 h-3 right-[20%] w-[35%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2Y5NzMxNiIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIuMiIvPjwvc3ZnPg==')] opacity-20 rounded-r-full"></div>
                        )}
                        <div className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full relative z-10" style={{ width: `${skill.match}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Actions */}
          <div className="flex flex-col gap-6 lg:mt-0 mt-8">
            {/* Visualizer Chart */}
            <div className="bg-white dark:bg-[#1A2633] rounded-xl border border-slate-200 dark:border-[#2a3b4f] p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold">Match Overview</h3>
              <div className="relative h-64 w-full flex items-end justify-center gap-4 px-2 pt-8 border-b border-l border-slate-100 dark:border-slate-800 pb-2 ml-4">
                {analysisData.chartData.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
                    <div className={`relative w-full rounded-t-lg transition-all ${bar.type === 'match' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600'}`} style={{ height: `${bar.match}%` }}>
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
                We've curated a personalized learning path to help you reach Senior Data Scientist in 6 months.
              </p>
              <button className="w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors relative z-10 flex justify-between items-center">
                View Career Path
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-500">rocket_launch</span>
              </button>
            </div>

            {/* Soft Skills Mini-List */}
            <div className="bg-white dark:bg-[#1A2633] rounded-xl border border-slate-200 dark:border-[#2a3b4f] p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold">Soft Skills</h3>
              <div className="space-y-4">
                {analysisData.softSkills.map((skill, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.title}</span>
                      <span className={`font-bold text-${skill.color}-600 dark:text-${skill.color}-500`}>{skill.status}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-1.5 rounded-full w-[${skill.progress}%] ${skill.color === 'green' ? 'bg-green-500' : 'bg-orange-400'}`} style={{width: `${skill.progress}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
