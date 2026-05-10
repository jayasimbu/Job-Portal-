import React from 'react';

export function Table({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`bg-slate-50 border-b border-slate-200 ${className}`}>
      {children}
    </thead>
  );
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`h-[72px] border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableHeadCell({ children, className = "" }) {
  return (
    <th className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 text-sm text-slate-600 ${className}`}>
      {children}
    </td>
  );
}
