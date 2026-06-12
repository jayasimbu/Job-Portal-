import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, BarChart3, Star, X, 
  ChevronDown, Clock, Filter, SlidersHorizontal, 
  Info, IndianRupee, Building2, Terminal, 
  LayoutGrid, List, ArrowRight, RotateCcw, AlertTriangle, Frown
} from 'lucide-react';
import apiClient from '../../../core/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const LOCATIONS = ['Chennai', 'Bangalore', 'Remote', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

// --- Sub-Components ---
const CheckCircle2 = ({ className }) => (
  <div className={`rounded-full bg-blue-600 flex items-center justify-center ${className}`}>
    <X className="size-2 text-white stroke-[4]" />
  </div>
);

const DropdownFilter = ({ label, icon: Icon, options, selected, onSelect, multi = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = multi ? selected.length > 0 : selected !== null;

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 px-4 flex items-center gap-2 border rounded-xl transition-all font-bold text-xs whitespace-nowrap ${
          hasSelection 
            ? 'bg-blue-50 border-blue-600 text-blue-700' 
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
        }`}
      >
        <Icon className="size-3.5" />
        {label}
        {multi && selected.length > 0 && <span className="bg-blue-600 text-white size-4 rounded-full flex items-center justify-center text-[9px]">{selected.length}</span>}
        <ChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {options.map((opt) => {
                const val = typeof opt === 'object' ? opt.value : opt;
                const lbl = typeof opt === 'object' ? opt.label : opt;
                const isSelected = multi ? selected.includes(val) : selected === val;

                return (
                  <button
                    key={lbl}
                    onClick={() => {
                      onSelect(val);
                      if (!multi) setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold">{lbl}</span>
                    {isSelected && <CheckCircle2 className="size-3.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page ---
export default function JobSearch() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/jobseeker/jobs');
        const rawJobs = response.data?.data?.jobs || response.data?.jobs || [];
        setJobs(rawJobs);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Unable to load jobs at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search Term (Title or Company)
      const matchesSearch = searchTerm === '' || 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Location Match
      const jobLocation = job.location || 'Remote';
      const matchesLocation = selectedLocations.length === 0 || 
        selectedLocations.some(loc => jobLocation.toLowerCase().includes(loc.toLowerCase()));

      // Job Type Match
      const jobType = job.type || job.job_type || 'Full-time';
      const matchesType = selectedTypes.length === 0 || 
        selectedTypes.some(type => jobType.toLowerCase().includes(type.toLowerCase()));

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, selectedLocations, selectedTypes]);

  const toggleFilter = (setFilterState, val) => {
    setFilterState(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocations([]);
    setSelectedTypes([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Discover Opportunities</h1>
        <p className="text-sm font-medium text-slate-500 mb-6">Find your next role with advanced ATS matching.</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
            <input 
              type="text" 
              placeholder="Search by job title or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
          <button onClick={clearFilters} className="h-14 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <DropdownFilter 
            label="Location" 
            icon={MapPin} 
            options={LOCATIONS} 
            selected={selectedLocations} 
            onSelect={(val) => toggleFilter(setSelectedLocations, val)} 
            multi={true} 
          />
          <DropdownFilter 
            label="Job Type" 
            icon={Briefcase} 
            options={JOB_TYPES} 
            selected={selectedTypes} 
            onSelect={(val) => toggleFilter(setSelectedTypes, val)} 
            multi={true} 
          />
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="animate-spin size-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Loading Live Jobs...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-10 text-center space-y-3">
          <AlertTriangle className="size-10 text-rose-500 mx-auto" />
          <h3 className="text-rose-700 font-bold text-lg">Connection Error</h3>
          <p className="text-rose-600/80 font-medium text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors">
            Retry Connection
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-20 text-center space-y-4">
          <Frown className="size-12 text-slate-300 mx-auto" />
          <h3 className="text-slate-700 font-bold text-lg">No Jobs Found</h3>
          <p className="text-slate-500 font-medium text-sm">We couldn't find any positions matching your current filters.</p>
          <button onClick={clearFilters} className="mt-2 text-blue-600 font-bold hover:underline text-sm">Clear all filters</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Showing {filteredJobs.length} results</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <div key={job.id} onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer group flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-blue-600 text-xl border border-slate-200">
                    {(job.company || 'C')[0]}
                  </div>
                  {job.is_live && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">Live</span>
                  )}
                </div>

                <div className="space-y-1 mb-4 flex-1">
                  <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="font-bold text-slate-500 text-sm">{job.company}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 mb-6">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-xs font-bold">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Briefcase size={14} className="text-slate-400" />
                    <span className="text-xs font-bold">{job.type || job.job_type || 'Full-time'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <IndianRupee size={14} className="text-slate-400" />
                    <span className="text-xs font-bold">{job.salary || 'Competitive'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 mb-4">
                  {(job.tags || job.required_skills || []).slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                  {(job.tags || job.required_skills || []).length > 3 && (
                    <span className="px-2 py-1 text-[10px] font-bold text-slate-400">+{job.tags.length - 3}</span>
                  )}
                </div>

                <button className="w-full h-11 bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                  View Role <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
