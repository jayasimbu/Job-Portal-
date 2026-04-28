import { useState, useEffect } from 'react';
import apiClient from '@/core/api/apiClient';
import { useTheme } from '@/core/context/ThemeContext';

const StatCard = ({ label, value, sub, color = '#6366f1', icon }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  }}>
    <div style={{ fontSize: '28px' }}>{icon}</div>
    <div style={{ fontSize: '32px', fontWeight: 700, color }}>{value ?? '—'}</div>
    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{label}</div>
    {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</div>}
  </div>
);

const HealthBadge = ({ ok, label }) => (
  <span style={{
    padding: '4px 12px',
    borderRadius: '999px',
    background: ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
    color: ok ? '#4ade80' : '#f87171',
    fontSize: '13px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  }}>
    <span>{ok ? '●' : '○'}</span> {label}
  </span>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    apiClient.get('/api/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(() => setError('Could not load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {};
  const users = s.users || {};
  const jobs = s.jobs || {};
  const apps = s.applications || {};
  const resumes = s.resumes || {};
  const companies = s.companies || {};
  const health = s.system_health || {};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-page)',
      color: 'var(--text-main)',
      transition: '0.3s',
      fontFamily: "'Inter', sans-serif",
      padding: '32px',
    }} className={isDark ? 'dark' : ''}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>🛡️ Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>System overview and live statistics</p>
          </div>
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
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p>Loading dashboard…</p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '20px',
            color: '#f87171',
            marginBottom: '24px',
          }}>{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* System Health */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontWeight: 600, marginRight: '8px', color: 'var(--text-main)' }}>System Health:</span>
              <HealthBadge ok={health.database} label="Database" />
              <HealthBadge ok={health.ollama} label="Ollama AI" />
              <HealthBadge ok={health.api} label="API" />
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <StatCard icon="👥" label="Total Users" value={users.total} sub={`${users.new_this_week || 0} new this week`} color="#a78bfa" />
              <StatCard icon="🎓" label="Job Seekers" value={users.jobseekers} color="#60a5fa" />
              <StatCard icon="🏢" label="Employers" value={users.employers} color="#34d399" />
              <StatCard icon="💼" label="Active Jobs" value={jobs.active} sub={`${jobs.total || 0} total`} color="#fbbf24" />
              <StatCard icon="📋" label="Applications" value={apps.total} color="#f472b6" />
              <StatCard icon="📄" label="Resumes" value={resumes.total} sub={`${resumes.pending_verification || 0} pending review`} color="#fb923c" />
              <StatCard icon="✅" label="Verified Companies" value={companies.verified} sub={`of ${companies.total || 0} total`} color="#4ade80" />
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: '👤 Manage Users', href: '/platform/admin/users' },
                { label: '🏢 Companies', href: '/platform/admin/companies' },
                { label: '📋 Verification Queue', href: '/platform/admin/verification' },
                { label: '📊 Analytics', href: '/platform/admin/analytics' },
                { label: '📝 System Logs', href: '/platform/admin/logs' },
              ].map(btn => (
                <a key={btn.label} href={btn.href} style={{
                  padding: '10px 20px',
                  background: 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  borderRadius: '10px',
                  color: '#a5b4fc',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>{btn.label}</a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
