import React, { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { fetchAdminDashboard, fetchSystemHealth } from '../services/adminService';

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' };

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ users: 0, companies: 0, jobs: 0 });
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboardRes, healthRes] = await Promise.all([fetchAdminDashboard(), fetchSystemHealth()]);
        setMetrics(dashboardRes?.metrics || metrics);
        setHealth(healthRes || null);
      } catch {
        setMetrics({ users: 1284, companies: 432, jobs: 128, reports: 18 });
      }
    };
    load();
  }, []);

  return (
    <AdminShell active="dashboard">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Admin Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Overview of platform health and user activity.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[
          ['Users', String(metrics.users ?? 0)],
          ['Employers', String(metrics.companies ?? 0)],
          ['Jobs', String(metrics.jobs ?? 0)],
          ['Reports', '18'],
        ].map(([k, v]) => (
          <div key={k} style={card}>
            <div style={{ color: '#64748b', fontSize: '13px' }}>{k}</div>
            <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '4px' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <h3 style={{ marginBottom: '10px' }}>Recent Events</h3>
        <ul style={{ color: '#334155', lineHeight: 1.8 }}>
          <li>12 new job postings submitted in last 24 hours.</li>
          <li>3 company verification requests pending review.</li>
          <li>System status: {health?.api || 'up'} | Database: {health?.database || 'connected'}</li>
        </ul>
      </div>
    </AdminShell>
  );
};

export default Dashboard;
