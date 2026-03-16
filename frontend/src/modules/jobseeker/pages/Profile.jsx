import React from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

const card = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '18px',
};

const tag = {
  display: 'inline-block',
  background: '#e0e7ff',
  color: '#3730a3',
  borderRadius: '999px',
  padding: '4px 10px',
  fontSize: '12px',
  marginRight: '6px',
  marginBottom: '6px',
  fontWeight: 700,
};

const Profile = () => {
  return (
    <JobSeekerShell active="profile">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Profile Setup</h1>
      <p style={{ color: '#64748b', marginBottom: '18px' }}>Keep your profile complete to improve AI ranking and recommendations.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
        <section style={card}>
          <h3 style={{ marginBottom: '10px' }}>Personal Details</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input placeholder="Full name" className="form-control" style={input} defaultValue="Alex Johnson" />
            <input placeholder="Current location" className="form-control" style={input} defaultValue="San Francisco, CA" />
            <input placeholder="Preferred role" className="form-control" style={input} defaultValue="Senior Frontend Engineer" />
            <input placeholder="Expected salary" className="form-control" style={input} defaultValue="$160,000" />
          </div>

          <h3 style={{ margin: '18px 0 10px' }}>Links</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input placeholder="LinkedIn URL" style={input} defaultValue="https://linkedin.com/in/alex" />
            <input placeholder="GitHub URL" style={input} defaultValue="https://github.com/alex" />
            <input placeholder="Portfolio URL" style={input} defaultValue="https://alex.design" />
          </div>

          <button className="btn btn-primary" style={{ marginTop: '16px' }}>
            Save Profile
          </button>
        </section>

        <aside style={card}>
          <h3 style={{ marginBottom: '10px' }}>AI Extracted Summary</h3>
          <p style={{ color: '#64748b', marginBottom: '12px' }}>Resume parsing progress: 65%</p>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', marginBottom: '14px' }}>
            <div style={{ width: '65%', height: '100%', background: '#1d4ed8', borderRadius: '999px' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Detected Skills</strong>
          </div>
          <div>
            {['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'AWS'].map((s) => (
              <span key={s} style={tag}>
                {s}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '16px', color: '#334155' }}>
            <p style={{ marginBottom: '6px' }}><strong>Experience:</strong> Senior Frontend Engineer, 4 years</p>
            <p><strong>Education:</strong> B.S. Computer Science</p>
          </div>
        </aside>
      </div>
    </JobSeekerShell>
  );
};

const input = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  fontSize: '14px',
};

export default Profile;
