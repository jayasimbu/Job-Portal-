import React from 'react';
import EmployerShell from '../components/EmployerShell';

const candidates = [
  { name: 'Alex Rivera', exp: '5 years', score: '92%', status: 'Shortlisted' },
  { name: 'Sarah Chen', exp: '3 years', score: '78%', status: 'Under Review' },
  { name: 'James Wilson', exp: '8 years', score: '45%', status: 'Interview Scheduled' },
];

const badge = {
  Shortlisted: { background: '#dbeafe', color: '#1d4ed8' },
  'Under Review': { background: '#fef3c7', color: '#92400e' },
  'Interview Scheduled': { background: '#ede9fe', color: '#5b21b6' },
};

const Candidates = () => {
  return (
    <EmployerShell active="candidates">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Refined Candidate Management</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Review AI-ranked candidates and schedule interviews quickly.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '8px 6px' }}>Name</th>
              <th style={{ padding: '8px 6px' }}>Experience</th>
              <th style={{ padding: '8px 6px' }}>AI Match</th>
              <th style={{ padding: '8px 6px' }}>Status</th>
              <th style={{ padding: '8px 6px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((item) => (
              <tr key={item.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 6px', fontWeight: 700 }}>{item.name}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{item.exp}</td>
                <td style={{ padding: '10px 6px', color: '#16a34a', fontWeight: 700 }}>{item.score}</td>
                <td style={{ padding: '10px 6px' }}>
                  <span style={{ ...badge[item.status], borderRadius: '999px', fontSize: '12px', padding: '4px 8px', fontWeight: 700 }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                  <button className="btn btn-primary" style={{ padding: '6px 12px' }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployerShell>
  );
};

export default Candidates;
