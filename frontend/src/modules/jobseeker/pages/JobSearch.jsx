import React, { useEffect, useMemo, useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';
import {
  addSearchHistory,
  fetchBookmarks,
  fetchRecommendations,
  fetchSearchHistory,
  toggleBookmarkApi,
} from '../services/jobseekerService';

const card = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '18px',
};

const fallbackJobs = [
  { title: 'Senior Product Designer', company: 'Stripe', location: 'San Francisco, CA', salary: '$160k - $210k', match: '94%' },
  { title: 'Staff Frontend Engineer', company: 'Vercel', location: 'Austin, TX', salary: '$180k - $240k', match: '82%' },
  { title: 'UX Research Lead', company: 'Airbnb', location: 'Remote', salary: '$140k - $190k', match: '76%' },
];

const USER_ID = 1;

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState('frontend engineer');

  useEffect(() => {
    const load = async () => {
      try {
        const [recRes, bookmarkRes, historyRes] = await Promise.all([
          fetchRecommendations(USER_ID),
          fetchBookmarks(USER_ID),
          fetchSearchHistory(USER_ID),
        ]);
        setJobs(recRes?.recommendations || []);
        setBookmarks(bookmarkRes?.bookmarks || []);
        setHistory(historyRes?.history || []);
      } catch {
        setJobs([]);
      }
    };
    load();
  }, []);

  const normalizedJobs = useMemo(() => {
    if (jobs.length === 0) {
      return fallbackJobs.map((job, index) => ({ ...job, id: index + 1 }));
    }
    return jobs.map((job, index) => ({
      id: job.id || index + 1,
      title: job.title || 'Role',
      company: job.company_name || 'Company',
      location: job.location || 'Remote',
      salary: job.salary_range || 'Competitive',
      match: `${Math.round(job.match_score || 0)}%`,
    }));
  }, [jobs]);

  const saveSearch = async () => {
    const result = await addSearchHistory(USER_ID, query);
    setHistory(result?.history || []);
  };

  const toggleBookmark = async (jobId) => {
    const result = await toggleBookmarkApi(USER_ID, jobId);
    setBookmarks(result?.bookmarks || []);
  };

  return (
    <JobSeekerShell active="jobs">
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Recommended for You</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>{normalizedJobs.length} positions found matching your profile</p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '14px' }}>
        <section style={card}>
          <h3 style={{ marginBottom: '12px' }}>AI Match Filter</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Save search query..." style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px' }} />
            <button className="btn btn-secondary" onClick={saveSearch}>
              Save
            </button>
          </div>
          <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Min Match Score: 75%</label>
          <input type="range" min="0" max="100" defaultValue="75" style={{ width: '100%', marginBottom: '14px' }} />
          <div style={{ display: 'grid', gap: '8px' }}>
            <label><input type="checkbox" defaultChecked /> Skill Match</label>
            <label><input type="checkbox" /> Experience Match</label>
            <label><input type="checkbox" /> Industry Match</label>
          </div>
          <div style={{ marginTop: '14px' }}>
            <strong style={{ fontSize: '13px' }}>Search History</strong>
            <ul style={{ marginTop: '6px', color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>
              {history.slice(-3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ display: 'grid', gap: '10px' }}>
          {normalizedJobs.map((job) => (
            <article key={job.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3>{job.title}</h3>
                  <p style={{ color: '#64748b' }}>{job.company} - {job.location}</p>
                </div>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>AI Match: {job.match}</span>
              </div>
              <p style={{ margin: '10px 0', color: '#475569' }}>Competitive role with strong profile alignment.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>{job.salary}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary">Apply Now</button>
                  <button className="btn btn-secondary" onClick={() => toggleBookmark(job.id)}>
                    {bookmarks.includes(job.id) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside style={card}>
          <h3 style={{ marginBottom: '10px' }}>AI Analysis Panel</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Resume vs JD Match: 94%</strong>
          </div>
          <ul style={{ color: '#334155', lineHeight: 1.8 }}>
            <li>Product Design: Match</li>
            <li>Design Systems: Match</li>
            <li>Figma Expert: Match</li>
            <li>React/Next.js: Partial</li>
          </ul>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '14px' }}>
            Customize Resume for this Job
          </button>
        </aside>
      </div>
    </JobSeekerShell>
  );
};

export default JobSearch;
