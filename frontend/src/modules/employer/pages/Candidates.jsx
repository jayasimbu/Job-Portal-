import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Candidates() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Mock data representing candidate pool
  const candidates = [
    { id: 1, name: 'Arjun R', role: 'Frontend Dev', exp: '2 Years', skills: ['React', 'Tailwind'], match: 84, status: 'Strong Match' },
    { id: 2, name: 'Priya M', role: 'UI/UX Designer', exp: '4 Years', skills: ['Figma', 'Prototyping'], match: 92, status: 'Top Pick' },
    { id: 3, name: 'Siddharth M', role: 'Backend Engineer', exp: '3 Years', skills: ['Node.js', 'PostgreSQL'], match: 79, status: 'Good Match' },
    { id: 4, name: 'Rahul S', role: 'DevOps Engineer', exp: '5 Years', skills: ['AWS', 'Docker'], match: 71, status: 'Average Match' },
    { id: 5, name: 'Karthik K', role: 'Frontend Dev', exp: '1 Year', skills: ['JavaScript', 'CSS'], match: 65, status: 'Weak Match' }
  ];

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-16 px-6 pt-4">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Candidates Pipeline</h1>
        <p className="text-sm font-medium text-slate-500">Review and filter your talent pool.</p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search candidates by name or skill..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-40 pl-4 pr-8 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Frontend Dev">Frontend Dev</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <Button variant="secondary" className="h-full px-5 text-slate-600 border-slate-300 gap-2">
            <Filter size={16} /> Filters
          </Button>
        </div>
      </div>

      {/* CANDIDATES TABLE */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-4">Candidate</th>
                <th className="p-4">Role</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Skills</th>
                <th className="p-4 text-center">Match</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm font-medium text-slate-500">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 cursor-pointer" onClick={() => navigate(`/platform/employer/candidates/${c.id}`)}>
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{c.role}</td>
                    <td className="p-4 text-sm font-semibold text-slate-500">{c.exp}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {c.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[11px] font-black ${
                        c.match >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                        c.match >= 70 ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {c.match}%
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-500">{c.status}</td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => navigate(`/platform/employer/candidates/${c.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
