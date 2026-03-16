import React from 'react';
import AdminShell from '../components/AdminShell';

const logs = [
  { time: '22:12:08', level: 'INFO', event: 'User login successful', source: 'auth-service' },
  { time: '22:11:01', level: 'WARN', event: 'Company verification pending review', source: 'admin-service' },
  { time: '22:10:16', level: 'ERROR', event: 'Failed background email retry', source: 'notification-worker' },
];

const levelColor = {
  INFO: '#1d4ed8',
  WARN: '#b45309',
  ERROR: '#b91c1c',
};

const SystemLogs = () => {
  return (
    <AdminShell active="logs">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>System Logs</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Operational events and platform diagnostics.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        {logs.map((l) => (
          <div
            key={`${l.time}-${l.event}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 80px 1fr 180px',
              gap: '10px',
              borderBottom: '1px solid #f1f5f9',
              padding: '10px 0',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#64748b', fontSize: '13px' }}>{l.time}</span>
            <span style={{ color: levelColor[l.level], fontWeight: 700, fontSize: '12px' }}>{l.level}</span>
            <span style={{ color: '#334155' }}>{l.event}</span>
            <span style={{ color: '#64748b', fontSize: '13px' }}>{l.source}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
};

export default SystemLogs;
