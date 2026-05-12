import React from 'react';
import PlatformShell from '../components/PlatformShell';

const Legal = () => {
  return (
    <PlatformShell active="legal">
      <h1 style={{ fontSize: '34px', marginBottom: '8px' }}>Legal</h1>
      <p style={{ color: '#64748b', marginBottom: '14px' }}>Legacy legal and consent pages migrated into React section structure.</p>
      <ul style={{ lineHeight: 1.9, color: '#334155' }}>
        <li>AI and resume analysis consent</li>
        <li>External redirection consent</li>
        <li>Vision and platform objectives</li>
      </ul>
    </PlatformShell>
  );
};

export default Legal;



