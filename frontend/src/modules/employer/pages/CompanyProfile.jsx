import React from 'react';
import EmployerShell from '../components/EmployerShell';

const input = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  marginTop: '6px',
};

const CompanyProfile = () => {
  return (
    <EmployerShell active="profile">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Company Profile</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Maintain your brand and hiring identity for better applicant quality.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label>Company Name</label>
            <input style={input} defaultValue="CloudScale Systems" />
          </div>
          <div>
            <label>Website</label>
            <input style={input} defaultValue="https://cloudscale.com" />
          </div>
          <div>
            <label>Industry</label>
            <input style={input} defaultValue="SaaS" />
          </div>
          <div>
            <label>Company Size</label>
            <input style={input} defaultValue="200-500" />
          </div>
          <div style={{ gridColumn: '1 / span 2' }}>
            <label>About Company</label>
            <textarea style={{ ...input, minHeight: '120px' }} defaultValue="We build cloud productivity tools for distributed teams." />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '14px' }}>
          Save Company Profile
        </button>
      </div>
    </EmployerShell>
  );
};

export default CompanyProfile;
