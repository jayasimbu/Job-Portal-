import React from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

export default function EligibilityFeedback() {
  // Static mock data for gap analysis based on the HTML
  const gapData = {
    jobTitle: "Senior Frontend Engineer",
    applicationDate: "Oct 24, 2023",
    matchScore: 75,
    gapsDetected: 2,
    timeToEligibility: "3 Months",
    requirements: [
      {
        id: 1,
        title: "React.js & Modern Frameworks",
        reqLevel: "Advanced",
        userLevel: "Expert",
        status: "Match", // Match, Significant Gap, Missing
        icon: "code",
        progress: 95
      },
      {
        id: 2,
        title: "UI/UX Implementation",
        reqLevel: "Intermediate",
        userLevel: "Advanced",
        status: "Match",
        icon: "brush",
        progress: 85
      },
      {
        id: 3,
        title: "System Design",
        reqLevel: "Advanced",
        userLevel: "Novice",
        status: "Significant Gap",
        icon: "dns",
        progress: 35,
        info: "Role requires experience designing scalable microservices."
      },
      {
        id: 4,
        title: "AWS Certification",
        reqLevel: "Certified Dev",
        userLevel: "None",
        status: "Missing",
        icon: "cloud",
        progress: 5
      },
      {
        id: 5,
        title: "Agile Methodology",
        reqLevel: "Proficient",
        userLevel: "Proficient",
        status: "Match",
        icon: "group",
        progress: 80
      }
    ],
    recommendations: [
      {
        id: 1,
        gapType: "System Design",
        title: "Advanced System Design for Frontends",
        provider: "Udemy",
        duration: "12 Hours",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHqrQsuc8FCyKTAMbrGN8LdLEA_MvQaImWdOPXyGE2xxYxv6xVUQZ8UVqew6TCAU_12WcxS6Xx31c502ELYH1uSuJRUZl8y3D8CMtF4zlyf4T2UnhclXprSrlRwdDwfb7Slqd9UHRnm-6aDp7s5T1enfpcOxFalfggAHvGJfNJ7w15kXD5e6Ydmxwn5cQIvsvZa6I3v2s3tfjkwN6Ys-7ONG39CK8CW-Q0IVKr8VwIcr3PerXSQCQr2OGqJ2Qwn6rHygkXM7LoayZq"
      },
      {
        id: 2,
        gapType: "AWS",
        title: "AWS Certified Developer - Associate",
        provider: "AWS Training",
        duration: "8 Weeks",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw98MAtNkH4AVVcY6qRze8tUG_S8CGmWvXq7Fwq2AqEm947QvOE9xkGXaFMkI902vzXI_zsTKpk9DGBcohLgcY8fhznsgSQ-EStX2BROHI7vg5hbmuCywyxGVVzQY0xv63FlL76LYiCQyz3VSeC7ohdT7QlbMJ9MG9b2VQ46ZRuUVvwT66gy0L7ddjv5hvvwqtaf4yRaC1L4XS0P-_WsQ41gNhXZV-8mG1JUmKO-vNtp1UhkD-PdFfJK_4VSH7bfoBayajY3jiIaAI"
      }
    ]
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#101922] text-[#0d141b] dark:text-white transition-colors ">
      <JobSeekerShell active="dashboard" />
      
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8 max-w-[1280px] mx-auto w-full">
        {/* Page Heading & Context */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#1a2634] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a3441]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  Analysis Complete
                </span>
                <span className="text-slate-500 dark:text-gray-400 text-sm font-normal">
                  Application Date: {gapData.applicationDate}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                Application Analysis: {gapData.jobTitle}
              </h1>
              <p className="text-slate-500 dark:text-gray-400 text-base max-w-3xl">
                While you aren't a match for this specific role yet, you are
                close. We've analyzed your profile against the core requirements
                to provide transparent feedback and a path forward.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#2a3441] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-[#354150] transition-colors text-sm font-bold">
                <span className="material-symbols-outlined text-[20px]">description</span>
                <span>Original Job Post</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2634] border border-slate-200 dark:border-[#2a3441] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Overall Match
                </p>
                <span className="material-symbols-outlined text-blue-500">pie_chart</span>
              </div>
              <p className="text-4xl font-black leading-tight">{gapData.matchScore}%</p>
              <p className="text-sm text-slate-500 dark:text-gray-400">Top 20% of applicants</p>
            </div>
            
            <div className="flex flex-col gap-2 rounded-xl p-6 border border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <p className="text-orange-700 dark:text-orange-400 text-sm font-bold uppercase tracking-wide">
                  Core Gaps Detected
                </p>
                <span className="material-symbols-outlined text-orange-500">warning</span>
              </div>
              <p className="text-4xl font-black leading-tight relative z-10">{gapData.gapsDetected}</p>
              <p className="text-sm text-orange-700 dark:text-orange-400 relative z-10">Critical requirements missing</p>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-200 dark:bg-orange-800/20 rounded-full blur-xl"></div>
            </div>
            
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2634] border border-slate-200 dark:border-[#2a3441] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Est. Time to Eligibility
                </p>
                <span className="material-symbols-outlined text-blue-500">schedule</span>
              </div>
              <p className="text-4xl font-black leading-tight">{gapData.timeToEligibility}</p>
              <p className="text-sm text-slate-500 dark:text-gray-400">Based on recommended learning path</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Detailed Gap Analysis */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-[#2a3441] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-[#2a3441]">
                <h2 className="text-xl font-bold">Gap Analysis &amp; Core Requirements</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  Detailed breakdown of your skills versus role expectations.
                </p>
              </div>
              <div className="flex flex-col p-6 gap-8">
                {gapData.requirements.map(req => (
                  req.status === 'Match' ? (
                    <div key={req.id} className="flex flex-col gap-3">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-[20px]">{req.icon}</span>
                          </div>
                          <div>
                            <p className="font-bold text-base">{req.title}</p>
                            <p className="text-slate-500 dark:text-gray-400 text-xs">
                              Required: {req.reqLevel} | You: {req.userLevel}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Match</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#2a3441] rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${req.progress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <div key={req.id} className="flex flex-col gap-3 p-4 -mx-4 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-lg text-orange-500">
                            <span className="material-symbols-outlined text-[20px]">{req.icon}</span>
                          </div>
                          <div>
                            <p className="font-bold text-base">{req.title}</p>
                            <p className="text-slate-500 dark:text-gray-400 text-xs">
                              Required: {req.reqLevel} | You: {req.userLevel}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                          <span className="material-symbols-outlined text-[16px]">
                            {req.status === 'Missing' ? 'block' : 'error'}
                          </span>
                          <span>{req.status}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#2a3441] rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${req.progress}%` }}></div>
                      </div>
                      {req.info && (
                        <p className="text-xs text-orange-700 dark:text-orange-400 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          {req.info}
                        </p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Path to Eligibility */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Future Eligibility</h3>
                <p className="text-blue-100 text-sm mb-6">
                  Complete the suggested actions below to boost your match score to <span className="font-bold text-white">95%</span>.
                </p>
                <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  Remind Me in 3 Months
                </button>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">school</span>
                Path to Eligibility
              </h3>

              {gapData.recommendations.map(rec => (
                <div key={rec.id} className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-[#2a3441] p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div 
                      className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0" 
                      style={{ backgroundImage: `url(${rec.img})` }}></div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full uppercase">
                          To Close Gap: {rec.gapType}
                        </span>
                      </div>
                      <h4 className="font-bold leading-tight mb-1">{rec.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">{rec.provider} • {rec.duration}</p>
                      <a href="#" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">
                        View Course <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tip Card */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30 mt-2">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-1">lightbulb</span>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Quick Resume Win</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                      Your profile mentions "Cloud Experience". Be more specific by listing tools like <strong>Docker</strong> or <strong>Kubernetes</strong> if you have used them.
                    </p>
                    <button className="mt-3 text-xs font-bold bg-white dark:bg-[#1a2634] border border-slate-200 dark:border-[#2a3441] px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#233040] transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



