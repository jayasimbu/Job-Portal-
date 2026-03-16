import React from 'react';
import EmployerShell from '../components/EmployerShell';

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' };

const Dashboard = () => {
  return (
    <EmployerShell active="dashboard">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Employer Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Track your jobs, talent pipeline, and interviews.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[
          ['Active Jobs', '5'],
          ['Total Applicants', '42'],
          ['Shortlisted', '8'],
          ['Interviews', '3'],
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
