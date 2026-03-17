import React, { useEffect, useState } from 'react';
import PlatformShell from '../components/PlatformShell';
import apiClient from '../../../core/api/apiClient';

const System = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get('/admin/monitoring/health');
        setHealth(response.data);
      } catch {
        setHealth(null);
      }
    };
    load();
  }, []);

  return (
    <PlatformShell active="system">
      <h1 style={{ fontSize: '34px', marginBottom: '8px' }}>System Status</h1>
      <p style={{ color: '#64748b', marginBottom: '14px' }}>System health snapshot linked to backend monitoring endpoint.</p>
      <pre style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', maxWidth: '720px', overflow: 'auto' }}>
        {JSON.stringify(health || { status: 'unavailable' }, null, 2)}
      </pre>
    </PlatformShell>
  );
};

export default System;
