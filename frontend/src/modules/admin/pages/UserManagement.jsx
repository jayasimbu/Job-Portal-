import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/core/api/apiClient';
import { useTheme } from '@/core/context/ThemeContext';

const PAGE_SIZE = 20;

const Badge = ({ text, color }) => (
  <span style={{
    padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
    background: `${color}22`, color, border: `1px solid ${color}44`,
  }}>{text}</span>
);

const roleColors = { jobseeker: '#60a5fa', employer: '#34d399', admin: '#f472b6' };
const statusColors = { active: '#4ade80', inactive: '#f87171' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, page_size: PAGE_SIZE });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);
    apiClient.get(`/api/admin/users?${params}`)
      .then(r => {
        setUsers(r.data.users || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.total_pages || 1);
      })
      .catch(() => setActionMsg('Failed to load users.'))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateRole = async (userId, newRole) => {
    try {
      await apiClient.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setActionMsg(`Role updated to ${newRole}.`);
      setEditingUser(null);
      fetchUsers();
    } catch {
      setActionMsg('Failed to update role.');
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await apiClient.put(`/api/admin/users/${userId}/status`, { is_active: !currentStatus });
      setActionMsg(!currentStatus ? 'User activated.' : 'User deactivated.');
      fetchUsers();
    } catch {
      setActionMsg('Failed to update status.');
    }
  };

  const inputStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-main)',
    padding: '8px 14px',
    fontSize: '14px',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif", padding: '32px', transition: '0.3s' }} className={isDark ? 'dark' : ''}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>👤 User Management</h1>
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
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{total} total users</p>

        {actionMsg && (
          <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '12px 18px', marginBottom: '16px', color: '#a5b4fc' }}>
            {actionMsg} <button onClick={() => setActionMsg('')} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input style={{ ...inputStyle, minWidth: '220px' }} placeholder="🔍 Search by name or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <select style={inputStyle} value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
          <select style={inputStyle} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No users found.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.first_name} {u.last_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}><Badge text={u.role} color={roleColors[u.role] || '#a78bfa'} /></td>
                  <td style={{ padding: '12px 16px' }}><Badge text={u.is_active ? 'Active' : 'Inactive'} color={u.is_active ? statusColors.active : statusColors.inactive} /></td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {editingUser === u.id ? (
                        <>
                          <select style={{ ...inputStyle, fontSize: '12px', padding: '4px 8px' }} value={editRole} onChange={e => setEditRole(e.target.value)}>
                            <option value="jobseeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button onClick={() => updateRole(u.id, editRole)} style={{ background: 'rgba(99,102,241,0.3)', border: 'none', color: '#a5b4fc', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>Save</button>
                          <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingUser(u.id); setEditRole(u.role); }} style={{ background: 'rgba(99,102,241,0.2)', border: 'none', color: '#a5b4fc', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>✏️ Role</button>
                          <button onClick={() => toggleStatus(u.id, u.is_active)} style={{ background: u.is_active ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: 'none', color: u.is_active ? '#f87171' : '#4ade80', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>
                            {u.is_active ? '🚫 Ban' : '✅ Activate'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page <= 1 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '14px' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page >= totalPages ? 0.4 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
