import React from 'react';
import PlatformShell from '../components/PlatformShell';

const Intelligence = () => {
  return (
    <PlatformShell active="intelligence">
      <h1 style={{ fontSize: '34px', marginBottom: '8px' }}>Intelligence</h1>
      <p style={{ color: '#64748b', marginBottom: '14px' }}>ATS scoring explanation, feature intelligence overview, and interactive flow migrated to React tabs roadmap.</p>
      <ul style={{ lineHeight: 1.9, color: '#334155' }}>
        <li>About the intelligence platform</li>
        <li>ATS score calculation explained</li>
        <li>Feature intelligence overview</li>
        <li>Interactive how-it-works guide</li>
      </ul>
    </PlatformShell>
  );
};

export default Intelligence;



