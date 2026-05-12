import React, { useState } from 'react';
import PlatformShell from '../components/PlatformShell';

const Search = () => {
  const [query, setQuery] = useState('react developer remote');
  return (
    <PlatformShell active="search">
      <h1 style={{ fontSize: '34px', marginBottom: '8px' }}>Advanced Search</h1>
      <p style={{ color: '#64748b', marginBottom: '14px' }}>Legacy advanced filtering and recommendation history moved into React search module.</p>
      <input value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '100%', maxWidth: '520px', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px' }} />
      <div style={{ color: '#334155' }}>Current query: {query}</div>
    </PlatformShell>
  );
};

export default Search;



