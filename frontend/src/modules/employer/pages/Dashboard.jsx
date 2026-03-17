import React, { useEffect, useState } from 'react';
import EmployerShell from '../components/EmployerShell';
import { fetchEmployerAnalytics } from '../services/employerService';

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' };

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    active_jobs: 0,
    total_applicants: 0,
    shortlisted: 0,
    interviews: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchEmployerAnalytics(1);
        setMetrics(response?.analytics || metrics);
      } catch {
        setMetrics({ active_jobs: 5, total_applicants: 42, shortlisted: 8, interviews: 3 });
      }
    };
    load();
  }, []);

  return (
    <EmployerShell active="dashboard">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Employer Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Track your jobs, talent pipeline, and interviews.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[
          ['Active Jobs', String(metrics.active_jobs ?? 0)],
          ['Total Applicants', String(metrics.total_applicants ?? 0)],
          ['Shortlisted', String(metrics.shortlisted ?? 0)],
          ['Interviews', String(metrics.interviews ?? 0)],
        ].map(([k, v]) => (
          <div key={k} style={card}>
            <div style={{ color: '#64748b', fontSize: '13px' }}>{k}</div>
            <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '4px' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <h3 style={{ marginBottom: '10px' }}>Recent Activity</h3>
        <ul style={{ color: '#334155', lineHeight: 1.8 }}>
          <li>New application received for Product Manager role.</li>
          <li>Interview scheduled with Sarah Jenkins.</li>
          <li>Two jobs marked as featured today.</li>
        </ul>
      </div>
    </EmployerShell>
  );
};

export default Dashboard;
