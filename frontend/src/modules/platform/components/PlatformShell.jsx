import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { key: 'home', label: 'Home', to: '/platform/pages/Home' },
  { key: 'intelligence', label: 'Intelligence', to: '/platform/pages/Intelligence' },
  { key: 'legal', label: 'Legal', to: '/platform/pages/Legal' },
  { key: 'search', label: 'Search', to: '/platform/pages/Search' },
  { key: 'settings', label: 'Settings', to: '/platform/pages/Settings' },
  { key: 'system', label: 'System', to: '/platform/pages/System' },
];

const PlatformShell = ({ active, children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '22px', color: '#1e3a8a' }}>Platform Hub</div>
        <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {links.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              style={{
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: '999px',
                border: active === item.key ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                color: active === item.key ? '#1d4ed8' : '#334155',
                fontWeight: 700,
                fontSize: '12px',
                background: active === item.key ? '#dbeafe' : '#fff',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main style={{ padding: '24px' }}>{children}</main>
    </div>
  );
};

export default PlatformShell;
