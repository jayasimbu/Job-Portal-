import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000';

const MOCK_COURSES = [
  { id: 1, title: 'React & Next.js Mastery', provider: 'Coursera', duration: '8 weeks', level: 'Intermediate', match: 95, url: 'https://coursera.org', skill: 'React', free: false },
  { id: 2, title: 'TypeScript for JavaScript Developers', provider: 'Udemy', duration: '4 weeks', level: 'Beginner', match: 88, url: 'https://udemy.com', skill: 'TypeScript', free: false },
  { id: 3, title: 'Docker & Kubernetes for Developers', provider: 'freeCodeCamp', duration: '5 weeks', level: 'Intermediate', match: 82, url: 'https://freecodecamp.org', skill: 'DevOps', free: true },
  { id: 4, title: 'Full Stack Web Development', provider: 'Odin Project', duration: '12 weeks', level: 'Beginner', match: 79, url: 'https://theodinproject.com', skill: 'Full Stack', free: true },
  { id: 5, title: 'GraphQL API Design', provider: 'Apollo', duration: '3 weeks', level: 'Advanced', match: 74, url: 'https://apollographql.com', skill: 'GraphQL', free: false },
  { id: 6, title: 'Redis for Backend Developers', provider: 'Redis University', duration: '2 weeks', level: 'Intermediate', match: 70, url: 'https://university.redis.com', skill: 'Redis', free: true },
];

const LEVEL_COLORS = {
  Beginner: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
};

export default function Learning() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | free | paid

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || '';
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    if (!userId) { setCourses(MOCK_COURSES); setLoading(false); return; }
    fetch(`${API}/api/jobseeker/learning/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => setCourses(d.learning?.length > 0 ? d.learning : MOCK_COURSES))
      .catch(() => setCourses(MOCK_COURSES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? courses : courses.filter(c => filter === 'free' ? c.free : !c.free);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-[#0d141b] dark:text-white">
      <div className="bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold">AI-Driven Course Recommendations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Courses tailored to your skill gaps</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-6">
        {/* Filter tabs */}
        <div className="flex gap-2 bg-white dark:bg-[#1a2632] p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
          {['all', 'free', 'paid'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors
                ${filter === f ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
              {f === 'all' ? '📚 All Courses' : f === 'free' ? '🆓 Free Only' : '💳 Paid'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(course => (
              <div key={course.id} className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[course.level] || ''}`}>{course.level}</span>
                      {course.free && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">FREE</span>}
                    </div>
                    <h3 className="font-bold leading-tight">{course.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{course.provider}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-black text-blue-600">{course.match}%</p>
                    <p className="text-xs text-slate-400">skill match</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    {course.skill}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.match}%` }} />
                </div>
                <a href={course.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-9 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Start Learning
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
