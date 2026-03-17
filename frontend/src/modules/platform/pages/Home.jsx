import React from 'react';
import PlatformShell from '../components/PlatformShell';

const Home = () => {
  return (
    <PlatformShell active="home">
      <h1 style={{ fontSize: '34px', marginBottom: '8px' }}>Smart Job Portal Home</h1>
      <p style={{ color: '#64748b', marginBottom: '14px' }}>Migrated from legacy Platform/Home with React route support.</p>
      <img src="/legacy-assets/images/ai-world-network.jpg" alt="AI world" style={{ width: '100%', maxWidth: '700px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
    </PlatformShell>
  );
};

export default Home;
