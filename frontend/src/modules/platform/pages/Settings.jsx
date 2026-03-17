import React from 'react';
import PlatformShell from '../components/PlatformShell';

const Settings = () => {
  return (
    <PlatformShell active="settings">
      <h1 style={{ fontSize: '34px', marginBottom: '8px' }}>Settings</h1>
      <p style={{ color: '#64748b', marginBottom: '14px' }}>Account and notification settings from legacy settings center are represented here.</p>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', maxWidth: '520px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" defaultChecked /> Email notifications</label>
        <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" defaultChecked /> ATS insight alerts</label>
        <label style={{ display: 'block' }}><input type="checkbox" /> Weekly summary report</label>
      </div>
    </PlatformShell>
  );
};

export default Settings;
