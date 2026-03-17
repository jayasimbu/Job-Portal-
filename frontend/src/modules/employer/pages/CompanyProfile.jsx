import React, { useState } from 'react';
import EmployerShell from '../components/EmployerShell';
import { upsertCompanyProfile } from '../services/employerService';

const input = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  marginTop: '6px',
};

const CompanyProfile = () => {
  const [form, setForm] = useState({
    company_name: 'CloudScale Systems',
    website: 'https://cloudscale.com',
    industry: 'SaaS',
    size: '200-500',
    description: 'We build cloud productivity tools for distributed teams.',
  });
  const [status, setStatus] = useState('');

  const onSave = async () => {
    try {
      await upsertCompanyProfile(1, {
        company_name: form.company_name,
        website: form.website,
        description: `${form.description} | Industry: ${form.industry} | Size: ${form.size}`,
      });
      setStatus('Company profile saved');
    } catch {
      setStatus('Failed to save company profile');
    }
  };

  return (
    <EmployerShell active="profile">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Company Profile</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Maintain your brand and hiring identity for better applicant quality.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label>Company Name</label>
            <input style={input} value={form.company_name} onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))} />
          </div>
          <div>
            <label>Website</label>
            <input style={input} value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
          </div>
          <div>
            <label>Industry</label>
            <input style={input} value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} />
          </div>
          <div>
            <label>Company Size</label>
            <input style={input} value={form.size} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1 / span 2' }}>
            <label>About Company</label>
            <textarea style={{ ...input, minHeight: '120px' }} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '14px' }} onClick={onSave}>
          Save Company Profile
        </button>
        {status ? <p style={{ marginTop: '10px', color: '#0f766e', fontWeight: 600 }}>{status}</p> : null}
      </div>
    </EmployerShell>
  );
};

export default CompanyProfile;
