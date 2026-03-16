import React from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

const card = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '18px',
};

const statusStyle = {
  interview: { background: '#dcfce7', color: '#166534' },
  shortlisted: { background: '#ede9fe', color: '#5b21b6' },
  review: { background: '#dbeafe', color: '#1d4ed8' },
  applied: { background: '#f1f5f9', color: '#475569' },
};

const applications = [
  { role: 'Senior Product Designer', company: 'CloudScale Systems', date: 'Oct 15, 2023', status: 'interview' },
  { role: 'Staff Frontend Engineer', company: 'Innovate Labs', date: 'Oct 12, 2023', status: 'shortlisted' },
  { role: 'Product Manager', company: 'SaaSFlow', date: 'Oct 08, 2023', status: 'review' },
  { role: 'UX Researcher', company: 'Designly Inc.', date: 'Oct 05, 2023', status: 'applied' },
];

const statusLabel = {
  interview: 'Interview Scheduled',
  shortlisted: 'Shortlisted',
  review: 'Under Review',
  applied: 'Applied',
};

const Applications = () => {
  return (
    <JobSeekerShell active="applications">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>My Applications</h1>
          <p style={{ color: '#64748b' }}>Manage and track your active job opportunities.</p>
        </div>
        <button className="btn btn-primary">Track New Job</button>
      </div>

      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '10px 6px' }}>Role</th>
              <th style={{ padding: '10px 6px' }}>Company</th>
              <th style={{ padding: '10px 6px' }}>Applied Date</th>
              <th style={{ padding: '10px 6px' }}>Status</th>
              <th style={{ padding: '10px 6px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item) => (
              <tr key={`${item.role}-${item.company}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 6px', fontWeight: 700 }}>{item.role}</td>
                <td style={{ padding: '12px 6px', color: '#475569' }}>{item.company}</td>
                <td style={{ padding: '12px 6px', color: '#64748b' }}>{item.date}</td>
                <td style={{ padding: '12px 6px' }}>
                  <span
                    style={{
                      ...statusStyle[item.status],
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    {statusLabel[item.status]}
                  </span>
                </td>
                <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginTop: '16px' }}>
        {[
          ['Active', '12'],
          ['Interviews', '3'],
          ['Shortlisted', '2'],
          ['Success Rate', '42%'],
        ].map(([label, value]) => (
          <div key={label} style={card}>
            <p style={{ color: '#64748b', fontSize: '13px' }}>{label}</p>
            <p style={{ fontSize: '30px', fontWeight: 800, marginTop: '4px' }}>{value}</p>
          </div>
        ))}
      </div>
    </JobSeekerShell>
  );
};

export default Applications;
