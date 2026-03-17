import React, { useEffect, useState } from 'react';
import EmployerShell from '../components/EmployerShell';
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
    <EmployerShell active="interview">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Interview Scheduling</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Calendar and scheduling workflow migrated from legacy interview module.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button className="btn btn-secondary" onClick={quickSchedule}>Quick Schedule</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '8px 6px' }}>Candidate</th>
              <th style={{ padding: '8px 6px' }}>Role</th>
              <th style={{ padding: '8px 6px' }}>Date</th>
              <th style={{ padding: '8px 6px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((i) => (
              <tr key={`${i.candidate}-${i.date}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 6px', fontWeight: 700 }}>{i.candidate}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{i.role}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{i.date}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{i.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployerShell>
  );
};

export default InterviewSchedule;
