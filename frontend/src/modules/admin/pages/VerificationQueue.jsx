import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/core/api/apiClient';
import { useTheme } from '@/core/context/ThemeContext';

const riskColors = { low: '#4ade80', medium: '#fbbf24', high: '#f87171' };
const statusColors = { pending: '#94a3b8', approved: '#4ade80', flagged: '#f87171', rejected: '#fb923c' };

const Badge = ({ text, color }) => (
  <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: `${color}22`, color, border: `1px solid ${color}44`, textTransform: 'capitalize' }}>{text}</span>
);

export default function VerificationQueue() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [msg, setMsg] = useState('');
  const [reviewNote, setReviewNote] = useState({});
  const { isDark, toggleTheme } = useTheme();

  const fetchQueue = useCallback(() => {
    setLoading(true);
    apiClient.get(`/api/admin/resumes/queue?status=${statusFilter}&page=${page}&page_size=15`)
      .then(r => {
        setItems(r.data.items || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.total_pages || 1);
      })
      .catch(() => setMsg('Failed to load verification queue.'))
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const reviewItem = async (id, action) => {
    try {
      await apiClient.put(`/api/admin/resumes/${id}/review`, { action, notes: reviewNote[id] || '' });
      setMsg(`Item ${action}.`);
      fetchQueue();
    } catch { setMsg('Action failed.'); }
  };

  const inputStyle = { background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', padding: '7px 12px', fontSize: '13px', width: '100%', marginTop: '8px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif", padding: '32px', transition: '0.3s' }} className={isDark ? 'dark' : ''}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>📋 Verification Queue</h1>
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
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{total} items</p>

        {msg && (
          <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '12px 18px', marginBottom: '16px', color: '#a5b4fc' }}>
            {msg} <button onClick={() => setMsg('')} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['pending', 'approved', 'flagged', 'rejected', 'all'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
              padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              background: statusFilter === s ? 'var(--primary)' : 'var(--bg-card)',
              color: statusFilter === s ? '#fff' : 'var(--text-muted)', textTransform: 'capitalize',
            }}>{s}</button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading…</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <p style={{ color: '#94a3b8' }}>No items in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(item => (
              <div key={item.id} style={{
                background: 'var(--bg-card)',
                border: `1px solid ${riskColors[item.risk_level] || 'var(--border)'}44`,
                borderRadius: '16px',
                padding: '20px 24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)' }}>{item.user_name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{item.user_email}</div>
                    {item.certificate_name && <div style={{ marginTop: '6px', fontSize: '13px', color: '#a5b4fc' }}>📜 {item.certificate_name}</div>}
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Badge text={`Risk: ${item.risk_level}`} color={riskColors[item.risk_level] || '#94a3b8'} />
                      <Badge text={item.status} color={statusColors[item.status] || '#94a3b8'} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Submitted: {item.submitted_at ? new Date(item.submitted_at).toLocaleString() : '—'}</div>
                    {item.notes && <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Note: {item.notes}</div>}
                  </div>

                  {item.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
                      <input
                        style={inputStyle}
                        placeholder="Optional notes…"
                        value={reviewNote[item.id] || ''}
                        onChange={e => setReviewNote(prev => ({ ...prev, [item.id]: e.target.value }))}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => reviewItem(item.id, 'approved')} style={{ flex: 1, background: 'rgba(34,197,94,0.2)', border: 'none', color: '#4ade80', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>✅ Approve</button>
                        <button onClick={() => reviewItem(item.id, 'flagged')} style={{ flex: 1, background: 'rgba(251,191,36,0.2)', border: 'none', color: '#fbbf24', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>🚩 Flag</button>
                        <button onClick={() => reviewItem(item.id, 'rejected')} style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>❌ Reject</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ padding: '8px 16px', color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
