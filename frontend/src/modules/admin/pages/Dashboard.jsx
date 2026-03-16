import React from 'react';
import AdminShell from '../components/AdminShell';

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' };

const Dashboard = () => {
  return (
    <AdminShell active="dashboard">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Admin Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Overview of platform health and user activity.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[
          ['Users', '1,284'],
          ['Employers', '432'],
          ['Jobs', '128'],
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
          <li>System uptime remained at 99.9% this week.</li>
        </ul>
      </div>
    </AdminShell>
  );
};

export default Dashboard;
