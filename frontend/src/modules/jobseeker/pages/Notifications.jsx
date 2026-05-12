import React, { useEffect, useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';
import { fetchNotifications } from '../services/jobseekerService';

const ICON_MAP = {
  shortlisted: { icon: 'verified', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  rejected: { icon: 'cancel', color: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  interview_scheduled: { icon: 'event', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  reviewing: { icon: 'visibility', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  application: { icon: 'send', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  recommendation: { icon: 'auto_awesome', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  learning: { icon: 'school', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800' },
};

const Notifications = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id || 1;
    const load = async () => {
      try {
        const response = await fetchNotifications(userId);
        const normalized = (response?.notifications || []).map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title || item.type,
          text: item.message,
          read: item.read ?? true,
          created_at: item.created_at,
        }));
        setNotices(normalized.length > 0 ? normalized : []);
      } catch {
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = notices.filter(n => !n.read).length;

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const seconds = Math.floor((new Date() - d) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <JobSeekerShell active="notifications">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'} · Real-time alerts from your applications.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full  shadow-lg shadow-red-500/30">
            {unreadCount} NEW
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="size-10 rounded-full border-4 border-blue-600 border-t-transparent " />
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-3xl">
          <div className="size-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-blue-400">notifications_off</span>
          </div>
          <h3 className="font-black text-lg">No notifications yet</h3>
          <p className="text-sm text-slate-500 max-w-xs text-center">"Apply to jobs and you'll see real-time updates here when employers shortlist, review, or schedule interviews."</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((n, i) => {
            const cfg = ICON_MAP[n.type] || ICON_MAP.application;
            return (
              <div
                key={n.id || i}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${
                  n.read
                    ? 'bg-white dark:bg-[#1a2632] border-slate-200 dark:border-slate-700'
                    : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm'
                }`}
              >
                <div className={`size-11 rounded-xl flex items-center justify-center border shrink-0 ${cfg.color}`}>
                  <span className="material-symbols-outlined text-xl">{cfg.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h4>
                    {!n.read && (
                      <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{n.text}</p>
                  {n.created_at && (
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">{timeAgo(n.created_at)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </JobSeekerShell>
  );
};

export default Notifications;



