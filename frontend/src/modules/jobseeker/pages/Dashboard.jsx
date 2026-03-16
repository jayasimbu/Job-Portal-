import React from 'react';
import JobSeekerShell from '../components/JobSeekerShell';

const card = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '18px',
};

const jobs = [
  { title: 'Senior Frontend Engineer', company: 'ABC Tech Solutions', match: '94%' },
  { title: 'React Developer', company: 'Starlight SaaS', match: '88%' },
  { title: 'Fullstack JS Developer', company: 'Nova Scale Labs', match: '82%' },
];

const Dashboard = () => {
  return (
    <JobSeekerShell active="dashboard">
      <h1 style={{ fontSize: '42px', marginBottom: '6px' }}>Welcome back, Alex</h1>
      <p style={{ color: '#64748b', marginBottom: '18px' }}>Here is what is happening with your job search today.</p>

      <div style={{ ...card, marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Complete your profile</strong>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Improve your AI job recommendations and recruiter visibility.</p>
        </div>
        <button className="btn btn-primary">Finish Now</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '18px' }}>
        {[
          ['Resume Score', '78%'],
          ['Jobs Applied', '24'],
          ['Under Review', '08'],
          ['Interviews', '03'],
        ].map(([label, value]) => (
          <div key={label} style={card}>
            <div style={{ color: '#64748b', fontSize: '13px' }}>{label}</div>
            <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '6px' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3>Recommended Jobs for You</h3>
          <a href="/jobseeker/pages/JobSearch">View all</a>
        </div>
        {jobs.map((job) => (
          <div
            key={job.title}
            style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', padding: '12px 0' }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{job.title}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>{job.company}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#16a34a', fontWeight: 700 }}>AI MATCH: {job.match}</div>
              <button className="btn btn-primary" style={{ marginTop: '8px', padding: '6px 12px' }}>
                View Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </JobSeekerShell>
  );
};

export default Dashboard;
