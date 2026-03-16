import React from 'react';
import EmployerShell from '../components/EmployerShell';

const input = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  marginTop: '6px',
};

const PostJob = () => {
  return (
    <EmployerShell active="post">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Post New Job</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Create a role and let AI rank incoming candidates.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label>Job Title</label>
            <input style={input} placeholder="Senior ML Engineer" />
          </div>
          <div>
            <label>Location</label>
            <input style={input} placeholder="Remote" />
          </div>
          <div>
            <label>Salary Range</label>
            <input style={input} placeholder="$120k - $180k" />
          </div>
          <div>
            <label>Experience</label>
            <input style={input} placeholder="5+ years" />
          </div>
          <div style={{ gridColumn: '1 / span 2' }}>
            <label>Description</label>
            <textarea style={{ ...input, minHeight: '120px' }} placeholder="Describe responsibilities and requirements..." />
          </div>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn btn-secondary">Save Draft</button>
          <button className="btn btn-primary">Publish Job</button>
        </div>
      </div>
    </EmployerShell>
  );
};

export default PostJob;
