import React from 'react';
import AdminShell from '../components/AdminShell';

const companies = [
  { name: 'CloudScale Systems', industry: 'SaaS', jobs: 8, status: 'Verified' },
  { name: 'Starlight AI', industry: 'AI/ML', jobs: 4, status: 'Pending' },
  { name: 'Designly Inc.', industry: 'Design', jobs: 2, status: 'Verified' },
];

const CompanyManagement = () => {
  return (
    <AdminShell active="companies">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Company Management</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Review employer profiles and verification status.</p>

      <div style={{ display: 'grid', gap: '10px' }}>
        {companies.map((c) => (
          <div key={c.name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{c.name}</h3>
                <p style={{ color: '#64748b' }}>{c.industry} • {c.jobs} active jobs</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: c.status === 'Verified' ? '#166534' : '#92400e' }}>{c.status}</span>
                <button className="btn btn-primary" style={{ padding: '6px 12px' }}>
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
};

export default CompanyManagement;
