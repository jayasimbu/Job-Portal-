import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  placeholder = "Search jobs, companies, or skills...", 
  onSearch = () => {},
  className = ""
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className={`relative w-full group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
        <Search className="w-5 h-5" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-12 pr-12 h-14 bg-white shadow-sm border-gray-200 group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/5 transition-all"
      />

      {query && (
        <button 
          onClick={() => setQuery('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
