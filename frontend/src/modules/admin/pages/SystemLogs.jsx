import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/core/api/apiClient';
import { useTheme } from '@/core/context/ThemeContext';

const levelColors = {
  INFO: '#60a5fa',
  WARNING: '#fbbf24',
  ERROR: '#f87171',
  CRITICAL: '#e879f9',
};

const Badge = ({ text, color }) => (
  <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: `${color}22`, color, border: `1px solid ${color}44`, fontFamily: 'monospace' }}>{text}</span>
);

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const fetchLogs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, page_size: 50 });
    if (levelFilter) params.set('level', levelFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    apiClient.get(`/api/admin/logs?${params}`)
      .then(r => {
        setLogs(r.data.logs || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.total_pages || 1);
      })
      .catch(() => setError('Failed to load logs.'))
      .finally(() => setLoading(false));
  }, [page, levelFilter, categoryFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const exportCSV = () => {
    if (!logs.length) return;
    const header = 'Timestamp,Level,Category,Message,User';
    const rows = logs.map(l =>
      [l.timestamp, l.level, l.category, `"${(l.message || '').replace(/"/g, '""')}"`, l.user_email || ''].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'system_logs.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', padding: '7px 12px', fontSize: '13px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif", padding: '32px', transition: '0.3s' }} className={isDark ? 'dark' : ''}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>📝 System Logs</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>{total} entries</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
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
            <button onClick={exportCSV} style={{ padding: '10px 20px', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
              ⬇️ Export CSV
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 18px', color: '#f87171', marginBottom: '16px' }}>{error}</div>}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select style={inputStyle} value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }}>
            <option value="">All Levels</option>
            {['INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select style={inputStyle} value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {['auth', 'job', 'resume', 'system', 'ai', 'admin'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={fetchLogs} style={{ ...inputStyle, cursor: 'pointer', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontWeight: 600 }}>🔄 Refresh</button>
        </div>

        {/* Log Table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                {['Timestamp', 'Level', 'Category', 'Message', 'User'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading…</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No logs found.</td></tr>
              ) : logs.map((l, i) => (
                <tr key={l.id || i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{l.timestamp ? l.timestamp.replace('T', ' ').slice(0, 19) : '—'}</td>
                  <td style={{ padding: '10px 14px' }}><Badge text={l.level || 'INFO'} color={levelColors[l.level] || '#94a3b8'} /></td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{l.category || '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--text-main)', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.message}>{l.message || '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>{l.user_email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ padding: '8px 16px', color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
