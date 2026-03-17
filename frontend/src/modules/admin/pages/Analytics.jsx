import React, { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { fetchAdminDashboard, fetchAdminJobs, fetchSystemHealth } from '../services/adminService';

const Analytics = () => {
  const [metrics, setMetrics] = useState({ users: 0, companies: 0, jobs: 0 });
  const [jobsCount, setJobsCount] = useState(0);
  const [apiStatus, setApiStatus] = useState('up');

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboardRes, jobsRes, healthRes] = await Promise.all([
          fetchAdminDashboard(),
          fetchAdminJobs(),
          fetchSystemHealth(),
        ]);
        setMetrics(dashboardRes?.metrics || { users: 0, companies: 0, jobs: 0 });
        setJobsCount((jobsRes?.jobs || []).length);
        setApiStatus(healthRes?.api || 'up');
      } catch {
        setMetrics({ users: 0, companies: 0, jobs: 0 });
      }
    };
    load();
  }, []);

  const tiles = [
    ['Users', String(metrics.users)],
    ['Companies', String(metrics.companies)],
    ['Jobs in DB', String(jobsCount || metrics.jobs)],
    ['API Status', apiStatus.toUpperCase()],
  ];

  return (
    <AdminShell active="analytics">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Platform Analytics</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Cross-module KPI dashboard migrated from legacy admin analytics patterns.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        {tiles.map(([label, value]) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
            <p style={{ color: '#64748b', fontSize: '13px' }}>{label}</p>
            <p style={{ fontSize: '30px', fontWeight: 800, marginTop: '4px' }}>{value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
};

export default Analytics;
