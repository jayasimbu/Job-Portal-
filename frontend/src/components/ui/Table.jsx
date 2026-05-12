import React from 'react';

export function Table({ children, className = "" }) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 ${className}`}>
      {children}
    </thead>
  );
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`h-[72px] border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableHeadCell({ children, className = "" }) {
  return (
    <th className={`px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 ${className}`}>
      {children}
    </td>
  );
}

export const DataTable = ({ columns, data, loading, emptyMessage = "No data found" }) => {
  if (loading) return (
    <div className="w-full h-64 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl ">
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading records...</p>
    </div>
  );

  if (!data || data.length === 0) return (
    <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{emptyMessage}</p>
    </div>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHeadCell key={i}>{col.header}</TableHeadCell>
          ))}
        </TableRow>
      </TableHeader>
      <tbody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {columns.map((col, j) => (
              <TableCell key={j}>
                {col.render ? col.render(row) : row[col.accessor]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export const CandidateTable = ({ candidates }) => (
  <DataTable 
    data={candidates}
    columns={[
      { 
        header: 'Candidate', 
        render: (c) => (
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
              {c.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white leading-none">{c.name}</p>
              <p className="text-[10px] text-slate-400 mt-1">{c.email}</p>
            </div>
          </div>
        )
      },
      { header: 'Match Score', render: (c) => <span className="font-black text-blue-600">{c.score}%</span> },
      { header: 'Experience', accessor: 'experience' },
      { 
        header: 'Status', 
        render: (c) => (
          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
            c.status === 'hired' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {c.status}
          </span>
        )
      },
    ]}
  />
);

export const ApplicationsTable = ({ applications }) => (
  <DataTable 
    data={applications}
    columns={[
      { header: 'Job Title', accessor: 'title' },
      { header: 'Company', accessor: 'company' },
      { header: 'Applied On', accessor: 'date' },
      { 
        header: 'Result', 
        render: (a) => (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600" style={{ width: `${a.progress}%` }} />
            </div>
            <span className="text-[10px] font-black text-slate-400">{a.progress}%</span>
          </div>
        )
      },
    ]}
  />
);



