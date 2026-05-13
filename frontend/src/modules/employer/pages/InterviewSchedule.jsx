import React, { useEffect, useState } from 'react';
import { fetchInterviews, scheduleInterview } from '../services/employerService';

const fallbackInterviews = [
  { candidate: 'Alex Rivera', role: 'Frontend Developer', date: '2026-03-18', time: '10:30' },
  { candidate: 'Sarah Chen', role: 'Backend Engineer', date: '2026-03-19', time: '14:00' },
];

const InterviewSchedule = () => {
  const [interviews, setInterviews] = useState(fallbackInterviews);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchInterviews(1);
        if ((response?.interviews || []).length > 0) {
          setInterviews(
            response.interviews.map((item) => ({
              candidate: item.candidate_name,
              role: item.role_title,
              date: item.date,
              time: item.time,
            }))
          );
        }
      } catch {
        setInterviews(fallbackInterviews);
      }
    };
    load();
  }, []);

  const quickSchedule = async () => {
    const payload = {
      job_id: 1,
      candidate_name: 'New Candidate',
      role_title: 'Product Engineer',
      date: '2026-03-25',
      time: '11:00',
    };
    const response = await scheduleInterview(payload);
    const normalized = (response?.interviews || []).map((item) => ({
      candidate: item.candidate_name,
      role: item.role_title,
      date: item.date,
      time: item.time,
    }));
    if (normalized.length > 0) {
      setInterviews(normalized);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden duration-700">
      <header className="flex-shrink-0 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Interview Scheduling</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Calendar and scheduling workflow.</p>
        </div>
        <button
          onClick={quickSchedule}
          className="h-10 px-6 bg-purple-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Quick Schedule
        </button>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50">
                <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-4">Candidate</th>
                <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-4">Role</th>
                <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-4">Date</th>
                <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((i) => (
                <tr key={`${i.candidate}-${i.date}`} className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-black text-sm text-slate-900 dark:text-white">{i.candidate}</td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-500">{i.role}</td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-500">{i.date}</td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-500">{i.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;



