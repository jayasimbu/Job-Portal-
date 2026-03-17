import React, { useState } from 'react';
import EmployerShell from '../components/EmployerShell';
import { createJobPosting } from '../services/employerService';

const input = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  marginTop: '6px',
};

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    salary: '',
    experience: '',
    description: '',
  });
  const [status, setStatus] = useState('');

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onPublish = async () => {
    try {
      await createJobPosting({
        employer_id: 1,
        title: form.title,
        description: form.description,
        required_skills: [],
        min_experience: Number(form.experience) || 0,
        education_required: null,
        location: form.location,
        employment_type: 'full_time',
      });
      setStatus('Job published successfully');
    } catch {
      setStatus('Unable to publish job now');
    }
  };

  return (
    <EmployerShell active="post">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Post New Job</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Create a role and let AI rank incoming candidates.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label>Job Title</label>
            <input style={input} placeholder="Senior ML Engineer" value={form.title} onChange={(e) => onChange('title', e.target.value)} />
          </div>
          <div>
            <label>Location</label>
            <input style={input} placeholder="Remote" value={form.location} onChange={(e) => onChange('location', e.target.value)} />
          </div>
          <div>
            <label>Salary Range</label>
            <input style={input} placeholder="$120k - $180k" value={form.salary} onChange={(e) => onChange('salary', e.target.value)} />
          </div>
          <div>
            <label>Experience</label>
            <input style={input} placeholder="5+ years" value={form.experience} onChange={(e) => onChange('experience', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / span 2' }}>
            <label>Description</label>
            <textarea style={{ ...input, minHeight: '120px' }} placeholder="Describe responsibilities and requirements..." value={form.description} onChange={(e) => onChange('description', e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn btn-secondary">Save Draft</button>
          <button className="btn btn-primary" onClick={onPublish}>Publish Job</button>
        </div>
        {status ? <p style={{ marginTop: '10px', color: '#0f766e', fontWeight: 600 }}>{status}</p> : null}
      </div>
    </EmployerShell>
  );
};

export default PostJob;
