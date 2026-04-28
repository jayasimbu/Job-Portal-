import { useState, useEffect } from 'react';
import apiClient from '@/core/api/apiClient';
import { useTheme } from '@/core/context/ThemeContext';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/api/admin/analytics?days=${days}`)
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, [days]);

  const pipeline = data?.application_pipeline || {};
  const userGrowth = data?.user_growth || [];
  const topJobs = data?.top_job_titles || [];

  const maxCount = Math.max(...userGrowth.map(d => d.count || 0), 1);

  const pipelineStatuses = [
    { key: 'pending', label: 'Pending', color: '#94a3b8' },
    { key: 'reviewed', label: 'Reviewed', color: '#60a5fa' },
    { key: 'shortlisted', label: 'Shortlisted', color: '#fbbf24' },
    { key: 'rejected', label: 'Rejected', color: '#f87171' },
    { key: 'hired', label: 'Hired', color: '#4ade80' },
  ];
  const totalApps = Object.values(pipeline).reduce((a, b) => a + b, 0) || 1;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif", padding: '32px', transition: '0.3s' }} className={isDark ? 'dark' : ''}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>📊 Analytics</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Platform metrics over the last {days} days</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: '10px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <select
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', padding: '8px 14px', fontSize: '14px' }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '14px 18px', color: '#f87171', marginBottom: '24px' }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>⏳ Loading analytics…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* User Growth Chart */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: 'var(--primary)' }}>📈 User Growth</h2>
              {userGrowth.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No data for this period.</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px', overflowX: 'auto' }}>
                  {userGrowth.map((d, i) => (
                    <div key={i} title={`${d._id}: ${d.count} users`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '32px' }}>
                      <div style={{
                        height: `${Math.max(4, Math.round((d.count / maxCount) * 120))}px`,
                        width: '24px',
                        background: 'linear-gradient(to top, #6366f1, #a78bfa)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s',
                      }} />
                      <span style={{ fontSize: '9px', color: '#64748b', transform: 'rotate(-45deg)', transformOrigin: 'center', whiteSpace: 'nowrap' }}>{d._id?.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Application Pipeline */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: 'var(--primary)' }}>📋 Application Pipeline</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pipelineStatuses.map(({ key, label, color }) => {
                  const count = pipeline[key] || 0;
                  const pct = Math.round((count / totalApps) * 100);
                  return (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                        <span style={{ color }}>{label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ background: 'var(--bg-page)', borderRadius: '999px', height: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ width: `${pct}%`, background: color, height: '8px', borderRadius: '999px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Job Titles */}
            {topJobs.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>💼 Recent Job Titles</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {topJobs.map((title, i) => (
                    <span key={i} style={{ padding: '6px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)', borderRadius: '999px', color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>{title}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
