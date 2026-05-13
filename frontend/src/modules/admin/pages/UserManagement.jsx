import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, Shield, User, Building2, Trash2, Ban, Eye } from 'lucide-react';
import apiClient from '@/core/api/apiClient';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

const PAGE_SIZE = 20;

const ROLE_CONFIG = {
  jobseeker: { variant: 'info', icon: User, label: 'Candidate' },
  employer: { variant: 'success', icon: Building2, label: 'Employer' },
  admin: { variant: 'primary', icon: Shield, label: 'Admin' },
};

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: "101", first_name: "Jaya", last_name: "Simbu", email: "jayasimbu.dev@linkup.com", role: "jobseeker", is_active: true, created_at: "2023-10-12T10:00:00Z" },
    { id: "102", first_name: "Priya", last_name: "Mani", email: "priya.ux@design.in", role: "jobseeker", is_active: true, created_at: "2023-11-05T10:00:00Z" },
    { id: "103", first_name: "Arjun", last_name: "Reddy", email: "arjun.backend@tech.com", role: "jobseeker", is_active: true, created_at: "2024-01-20T10:00:00Z" },
    { id: "104", first_name: "Kavya", last_name: "S", email: "kavya.data@analyst.in", role: "jobseeker", is_active: true, created_at: "2023-09-15T10:00:00Z" },
    { id: "105", first_name: "Siddharth", last_name: "V", email: "sid.devops@infra.com", role: "jobseeker", is_active: true, created_at: "2023-12-01T10:00:00Z" }
  ]);
  const navigate = useNavigate();
  const [total, setTotal] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, page_size: PAGE_SIZE });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);
    
    apiClient.get(`/admin/users?${params}`)
      .then(r => {
        setUsers(r.data.users || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.total_pages || 1);
      })
      .catch(() => console.error('Failed to load users.'))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await apiClient.put(`/admin/users/${userId}/status`, { is_active: !currentStatus });
      fetchUsers();
    } catch {
      console.error('Failed to update status.');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage registered job seekers and employers.
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <Card className="border-slate-300 shadow-sm overflow-visible">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl w-full">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={roleFilter} 
              onChange={e => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-slate-600"
            >
              <option value="">All Roles</option>
              <option value="jobseeker">Candidates</option>
              <option value="employer">Employers</option>
              <option value="admin">Admins</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-slate-600"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* USERS TABLE */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700">
                {['Name', 'Role', 'Status', 'Joined Date', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6 h-16 bg-slate-100/50" />
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">No users found.</td>
                </tr>
              ) : users.map(u => {
                const role = ROLE_CONFIG[u.role] || ROLE_CONFIG.jobseeker;
                return (
                  <tr key={u.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/platform/admin/users/${u.id}`}
                        className="flex items-center gap-3 group/item cursor-pointer no-underline"
                      >
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 uppercase">
                          {u.first_name?.[0]}{u.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover/item:text-blue-600 transition-colors">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <role.icon size={14} className="text-slate-400" />
                         <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{role.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.is_active ? 'success' : 'danger'} className="text-[9px] px-2 py-0.5">
                        {u.is_active ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="size-8 p-0">
                          <Eye size={14} className="text-slate-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`size-8 p-0 ${u.is_active ? 'hover:text-rose-600' : 'hover:text-emerald-600'}`}
                          onClick={() => toggleStatus(u.id, u.is_active)}
                        >
                          <Ban size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="size-8 p-0 hover:text-rose-600">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800/50 border-t border-slate-300 dark:border-slate-700 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
           <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-8 text-[10px] uppercase font-black"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="h-8 text-[10px] uppercase font-black"
              >
                Next
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}



