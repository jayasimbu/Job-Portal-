import React, { useEffect, useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';
import { fetchNotifications } from '../services/jobseekerService';

const fallbackNotices = [
  { type: 'Application', text: 'Your application for Senior Product Designer moved to Interview Scheduled.' },
  { type: 'Recommendation', text: '3 new high-match roles were added for your profile today.' },
  { type: 'Learning', text: 'New recommended course: Advanced React Architecture.' },
];

const Notifications = () => {
  const [notices, setNotices] = useState(fallbackNotices);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchNotifications(1);
        const normalized = (response?.notifications || []).map((item) => ({
          type: item.type,
          text: item.message,
        }));
        if (normalized.length > 0) {
          setNotices(normalized);
        }
      } catch {
        setNotices(fallbackNotices);
      }
    };
    load();
  }, []);

  return (
    <JobSeekerShell active="notifications">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Notifications</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Notification center migrated from legacy job seeker alerts module.</p>

      <div style={{ display: 'grid', gap: '10px' }}>
        {notices.map((n) => (
          <div key={n.text} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1d4ed8', marginBottom: '4px' }}>{n.type}</div>
            <div style={{ color: '#334155' }}>{n.text}</div>
          </div>
        ))}
      </div>
    </JobSeekerShell>
  );
};

export default Notifications;
