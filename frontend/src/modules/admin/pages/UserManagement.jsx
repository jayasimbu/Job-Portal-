import React, { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { fetchAdminUsers } from '../services/adminService';

const fallbackUsers = [
  { name: 'Rahul Sharma', email: 'rahul@email.com', role: 'Job Seeker', status: 'Active' },
  { name: 'Priya Patel', email: 'priya@corp.com', role: 'Employer', status: 'Active' },
  { name: 'Michael Chen', email: 'm.chen@outlook.com', role: 'Job Seeker', status: 'Blocked' },
];

const status = {
  Active: { background: '#dcfce7', color: '#166534' },
  Blocked: { background: '#fee2e2', color: '#991b1b' },
};

const UserManagement = () => {
  const [users, setUsers] = useState(fallbackUsers);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdminUsers();
        const mapped = (response?.users || []).map((user) => ({
          name: user.full_name || `User ${user.id}`,
          email: user.email,
          role: user.role || 'Job Seeker',
          status: user.is_active ? 'Active' : 'Blocked',
        }));
        if (mapped.length > 0) {
          setUsers(mapped);
        }
      } catch {
        setUsers(fallbackUsers);
      }
    };
    load();
  }, []);

  return (
    <AdminShell active="users">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>User Management</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Oversee and manage active users on the platform.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
              <th style={{ padding: '8px 6px' }}>Name</th>
              <th style={{ padding: '8px 6px' }}>Email</th>
              <th style={{ padding: '8px 6px' }}>Role</th>
              <th style={{ padding: '8px 6px' }}>Status</th>
              <th style={{ padding: '8px 6px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 6px', fontWeight: 700 }}>{u.name}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{u.email}</td>
                <td style={{ padding: '10px 6px', color: '#475569' }}>{u.role}</td>
                <td style={{ padding: '10px 6px' }}>
                  <span style={{ ...status[u.status], padding: '4px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
};

export default UserManagement;
