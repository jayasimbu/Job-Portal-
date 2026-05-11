import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../core/components/EmptyState';
import { useToast } from '../../../core/context/ToastContext';
import { fetchRecommendations, applyForJob } from '../../jobseeker/services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';

// Import Global UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

// Import Jobseeker Specific Components
import { JobCard, FilterDropdown, SectionHeader } from '../../jobseeker/components/DesignSystem';

const Jobs = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isApplying, setIsApplying] = useState({});
  const userId = getCurrentUserId();

  // Filters State
  const [filters, setFilters] = useState({
    location: 'Any Location',
    workMode: 'Any Mode',
    jobType: 'Any Type',
    experience: 'Any Experience'
  });

  useEffect(() => {
    const loadJobs = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchRecommendations(userId);
        const jobs = (data.recommendations || []).map(j => ({
            ...j,
            platform: j.platform || (j.id > 100 ? 'LinkedIn' : 'Internal')
        }));
        setAllJobs(jobs);
        setFilteredJobs(jobs);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [userId]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = search.toLowerCase().trim();
    let filtered = allJobs;

    if (query) {
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(query) || 
        (j.company || '').toLowerCase().includes(query) ||
        (j.description || '').toLowerCase().includes(query)
      );
    }

    // Apply basic filter logic
    if (filters.location !== 'Any Location') {
      filtered = filtered.filter(j => j.location === filters.location);
    }

    setFilteredJobs(filtered);
  };

  const handleApply = async (jobId, companyName) => {
    try {
      setIsApplying(prev => ({ ...prev, [jobId]: true }));
      await applyForJob(userId, jobId);
      showToast(`Application sent to ${companyName} ✅`);
      setAllJobs(prev => prev.map(j => j.id === jobId ? { ...j, hasApplied: true } : j));
      setFilteredJobs(prev => prev.map(j => j.id === jobId ? { ...j, hasApplied: true } : j));
    } catch (err) {
      showToast(err.response?.data?.detail || "Application failed ❌");
    } finally {
      setIsApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <CardBody className="h-64 bg-slate-50/50" />
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Heading level={1}>Job Marketplace</Heading>
          <Text variant="lead">Discover roles optimized for your professional profile.</Text>
        </div>
        <Badge variant="primary" className="py-1.5 px-4">
          {filteredJobs.length} Positions Available
        </Badge>
      </div>

      {/* Search & Filters */}
      <Card className="p-2">
        <CardBody className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 group focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-600 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-600">search</span>
              <input 
                type="text" 
                placeholder="Search roles, companies, or industry keywords..." 
                className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={() => handleSearch()} size="lg" className="px-10">
              Find Opportunities
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterDropdown 
              label="Location" 
              value={filters.location} 
              icon="location_on"
              options={['Any Location', 'Remote', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Global']}
              onChange={(v) => setFilters({...filters, location: v})}
            />
            <FilterDropdown 
              label="Work Mode" 
              value={filters.workMode} 
              icon="home_work"
              options={['Any Mode', 'Full-time', 'Contract', 'Hybrid', 'Freelance']}
              onChange={(v) => setFilters({...filters, workMode: v})}
            />
            <FilterDropdown 
              label="Job Type" 
              value={filters.jobType} 
              icon="badge"
              options={['Any Type', 'Permanent', 'Internship', 'Advisory']}
              onChange={(v) => setFilters({...filters, jobType: v})}
            />
            <FilterDropdown 
              label="Experience" 
              value={filters.experience} 
              icon="bolt"
              options={['Any Experience', 'Entry Level', 'Mid Senior', 'Director', 'Founder']}
              onChange={(v) => setFilters({...filters, experience: v})}
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}/analysis`)}
                onApply={() => handleApply(job.id, job.company)}
                isApplying={isApplying[job.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
               <span className="material-symbols-outlined text-4xl">search_off</span>
            </div>
            <div className="space-y-2">
               <Heading level={3}>No Matches Found</Heading>
               <Text className="max-w-xs mx-auto">Try broadening your search or adjusting your filters to discover more roles.</Text>
            </div>
            <Button 
              variant="secondary"
              onClick={() => { setSearch(''); setFilters({location:'Any Location', workMode:'Any Mode', jobType:'Any Type', experience:'Any Experience'}); setFilteredJobs(allJobs); }}
            >
               Reset Intelligence Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
