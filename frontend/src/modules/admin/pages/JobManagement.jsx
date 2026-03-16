import React from 'react';
import AdminShell from '../components/AdminShell';

const jobs = [
  { title: 'Frontend Developer', company: 'ABC Tech', date: '10 Mar 2026', applicants: 23, status: 'Active' },
  { title: 'Backend Engineer', company: 'CloudScale', date: '08 Mar 2026', applicants: 15, status: 'Active' },
  { title: 'UI/UX Designer', company: 'Creative Hub', date: '05 Mar 2026', applicants: 42, status: 'Closed' },
];

const JobManagement = () => {
  return (
    <AdminShell active="jobs">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Job Management</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Moderate and manage all job postings platform-wide.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
              <th style={{ padding: '8px 6px' }}>Job</th>
              <th style={{ padding: '8px 6px' }}>Company</th>
              <th style={{ padding: '8px 6px' }}>Posted</th>
              <th style={{ padding: '8px 6px' }}>Applicants</th>
              <th style={{ padding: '8px 6px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={`${j.title}-${j.company}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 6px', fontWeight: 700 }}>{j.title}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{j.company}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{j.date}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{j.applicants}</td>
                <td style={{ padding: '10px 6px', fontWeight: 700, color: j.status === 'Active' ? '#166534' : '#64748b' }}>{j.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
};

export default JobManagement;
