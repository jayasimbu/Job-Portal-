import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc' },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  body: { display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 61px)' },
  side: { background: '#fff', borderRight: '1px solid #e5e7eb', padding: '16px' },
  sideLink: {
    display: 'block',
    padding: '10px 12px',
    textDecoration: 'none',
    color: '#475569',
    borderRadius: '8px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  sideLinkActive: { background: '#1d4ed8', color: '#fff' },
  main: { padding: '24px' },
};

const nav = [
  { key: 'dashboard', to: '/admin/pages/Dashboard', label: 'Dashboard' },
  { key: 'users', to: '/admin/pages/UserManagement', label: 'Users' },
  { key: 'companies', to: '/admin/pages/CompanyManagement', label: 'Companies' },
  { key: 'jobs', to: '/admin/pages/JobManagement', label: 'Jobs' },
  { key: 'analytics', to: '/admin/pages/Analytics', label: 'Analytics' },
  { key: 'logs', to: '/admin/pages/SystemLogs', label: 'System Logs' },
];

const AdminShell = ({ active, children }) => {
  return (
    <div style={styles.page}>
      <header style={styles.top}>
        <div style={{ fontWeight: 800, fontSize: '24px', color: '#1e3a8a' }}>Admin Console</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input
            placeholder="Search users, jobs..."
            style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '9px 12px', width: '280px' }}
          />
          <Link to="/auth/pages/Login" style={{ textDecoration: 'none', color: '#334155', fontWeight: 700 }}>
            Logout
          </Link>
        </div>
      </header>

      <div style={styles.body}>
        <aside style={styles.side}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '14px' }}>ADMIN MENU</div>
          {nav.map((item) => (
            <Link key={item.key} to={item.to} style={{ ...styles.sideLink, ...(active === item.key ? styles.sideLinkActive : {}) }}>
              {item.label}
            </Link>
          ))}
        </aside>

        <main style={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default AdminShell;
