import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/core/api/apiClient';
import { useTheme } from '@/core/context/ThemeContext';

const Badge = ({ text, color }) => (
  <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: `${color}22`, color, border: `1px solid ${color}44` }}>{text}</span>
);

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [msg, setMsg] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const fetchCompanies = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, page_size: 20 });
    if (search) params.set('search', search);
    if (verifiedFilter !== '') params.set('verified', verifiedFilter);
    apiClient.get(`/api/admin/companies?${params}`)
      .then(r => {
        setCompanies(r.data.companies || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.total_pages || 1);
      })
      .catch(() => setMsg('Failed to load companies.'))
      .finally(() => setLoading(false));
  }, [page, search, verifiedFilter]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const verifyCompany = async (id, approve) => {
    try {
      await apiClient.put(`/api/admin/companies/${id}/verify`, { approve });
      setMsg(approve ? '✅ Company verified.' : '❌ Company rejected.');
      fetchCompanies();
    } catch { setMsg('Action failed.'); }
  };

  const inputStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', padding: '8px 14px', fontSize: '14px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif", padding: '32px', transition: '0.3s' }} className={isDark ? 'dark' : ''}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>🏢 Company Management</h1>
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
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{total} registered companies</p>

        {msg && (
          <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '12px 18px', marginBottom: '16px', color: '#a5b4fc' }}>
            {msg} <button onClick={() => setMsg('')} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input style={{ ...inputStyle, minWidth: '220px' }} placeholder="🔍 Search companies…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <select style={inputStyle} value={verifiedFilter} onChange={e => { setVerifiedFilter(e.target.value); setPage(1); }}>
            <option value="">All Companies</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                {['Company', 'Email', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
              ) : companies.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No companies found.</td></tr>
              ) : companies.map((c, i) => (
                <tr key={c.id || i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.company_name || c.name || '(Unnamed)'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{c.email || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <Badge text={c.is_verified ? 'Verified' : 'Pending'} color={c.is_verified ? '#4ade80' : '#fbbf24'} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!c.is_verified && (
                        <button onClick={() => verifyCompany(c.id, true)} style={{ background: 'rgba(34,197,94,0.2)', border: 'none', color: '#4ade80', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>✅ Verify</button>
                      )}
                      {c.is_verified && (
                        <button onClick={() => verifyCompany(c.id, false)} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>❌ Revoke</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ padding: '8px 16px', color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
