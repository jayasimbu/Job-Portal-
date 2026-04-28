import { useNavigate } from 'react-router-dom';

const courses = [
  {
    id: 1,
    provider: 'Coursera',
    providerIcon: 'school',
    providerIconColor: 'text-blue-600',
    title: 'Applied Data Science with Python Specialization',
    meta: 'University of Michigan • 4.8 ★ (21k reviews)',
    tags: ['Intermediate', '34 Hours', 'Certificate'],
    matchBoost: '+20% Role Match',
    why: 'Bridges your Python gap specifically for data manipulation, directly impacting your ability to perform EDA tasks required in 85% of job postings.',
    ctaLabel: 'Go to Coursera',
    imgGradient: 'from-blue-800 to-blue-600',
    imgIcon: 'data_object',
  },
  {
    id: 2,
    provider: 'Udemy',
    providerIcon: 'play_circle',
    providerIconColor: 'text-purple-600',
    title: 'The Complete SQL Bootcamp: Go from Zero to Hero',
    meta: 'Jose Portilla • 4.7 ★ (156k reviews)',
    tags: ['Beginner', '22 Hours'],
    matchBoost: '+15% Role Match',
    why: 'Addresses your SQL knowledge gap. SQL is the #1 requested skill for Data Scientists, allowing you to query databases directly.',
    ctaLabel: 'Go to Udemy',
    imgGradient: 'from-purple-800 to-purple-600',
    imgIcon: 'storage',
  },
  {
    id: 3,
    provider: 'Coursera',
    providerIcon: 'school',
    providerIconColor: 'text-blue-600',
    title: 'Machine Learning Specialization',
    meta: 'Stanford University & DeepLearning.AI • 4.9 ★ (12k reviews)',
    tags: ['Advanced', '40 Hours', 'Andrew Ng'],
    matchBoost: '+12% Role Match',
    why: 'This is the gold standard for ML concepts. Mastering this closes your theoretical gaps in supervised and unsupervised learning algorithms.',
    ctaLabel: 'Go to Coursera',
    imgGradient: 'from-blue-800 to-blue-600',
    imgIcon: 'psychology',
  },
];

export default function LearningHub() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f0f4f8] dark:bg-[#0d141b] font-sans text-slate-900 dark:text-slate-50 min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center w-full px-4 md:px-10 py-8 max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="w-full mb-8">
          <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
            {/* Left Image Panel */}
            <div className="w-full md:w-1/3 aspect-video rounded-lg relative overflow-hidden group bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-6xl opacity-60">school</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-[#2563eb] px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Target Role</span>
                <p className="mt-1 font-bold text-lg">Data Scientist</p>
              </div>
            </div>
            {/* Right Content */}
            <div className="flex flex-col justify-center gap-4 flex-1">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                  Recommended Learning Path
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                  You have{' '}
                  <span className="font-bold text-[#2563eb]">3 critical skill gaps</span>{' '}
                  (Python, SQL, Machine Learning) to bridge for your target role. We found high-impact modules to help you close them.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  <span>Accelerate promotion by 6mo</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100 dark:border-green-800">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Certified Providers</span>
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate('/jobseeker/profile/gaps')}
                  className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                  <span>View My Full Skill Analysis</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div className="w-full mb-6 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {[
              { label: 'Provider: All', icon: 'expand_more', active: true },
              { label: 'Duration: Any', icon: 'expand_more' },
              { label: 'Skill Type', icon: 'expand_more' },
              { label: 'Impact Score', icon: 'expand_more' },
            ].map((filter) => (
              <button
                key={filter.label}
                className={`flex h-9 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors text-sm font-medium ${filter.active ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-900 dark:text-slate-100'}`}
              >
                <span>{filter.label}</span>
                <span className="material-symbols-outlined text-[18px]">{filter.icon}</span>
              </button>
            ))}
            <div className="w-px h-8 self-center bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="flex h-9 items-center justify-center gap-x-2 text-slate-500 hover:text-[#2563eb] px-2 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="w-full flex justify-between items-end mb-4 px-1">
          <h2 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">
            Top Recommendations ({courses.length})
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Sorted by Career Impact</span>
        </div>

        {/* Course Cards */}
        <div className="w-full grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Course Image */}
                <div className={`w-full md:w-64 md:min-w-[280px] h-48 md:h-auto bg-gradient-to-br ${course.imgGradient} relative flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-white text-6xl opacity-40">{course.imgIcon}</span>
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-sm">
                    <span className={`material-symbols-outlined text-[14px] ${course.providerIconColor}`}>{course.providerIcon}</span>
                    {course.provider}
                  </div>
                </div>
                {/* Course Content */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{course.title}</h3>
                      <div className="shrink-0 bg-blue-50 dark:bg-blue-900/30 text-[#2563eb] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
                        {course.matchBoost}
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{course.meta}</p>
                    <div className="flex flex-wrap gap-2 my-2">
                      {course.tags.map((tag) => (
                        <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">{tag}</span>
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 leading-relaxed border-l-2 border-blue-400 pl-3">
                      <span className="font-semibold text-[#2563eb]">Why this matters:</span>{' '}
                      {course.why}
                    </p>
                  </div>
                  <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <a
                      href="#"
                      className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-600 text-white text-sm font-bold py-2 px-5 rounded-lg transition-colors"
                    >
                      <span>{course.ctaLabel}</span>
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center max-w-2xl px-4">
          <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed">
            Disclaimer: You are viewing external course recommendations. By clicking "Go to Course", you will be redirected to a third-party website. We may earn an affiliate commission on qualifying purchases at no extra cost to you.
          </p>
        </div>
      </main>
    </div>
  );
}
