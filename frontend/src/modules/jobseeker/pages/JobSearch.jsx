import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  LayoutGrid, 
  Search,
  X
} from 'lucide-react';
import { getCurrentUserId } from '../../../core/auth/session';
import { fetchJobSeekerProfile, fetchRecommendations } from '../services/jobseekerService';
import apiClient from '../../../core/api/apiClient';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import JobCard from '../../../components/shared/JobCard';
import SearchBar from '../../../components/shared/SearchBar';
import FilterTabs from '../../../components/shared/FilterTabs';
import EmptyState from '../../../components/shared/EmptyState';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import Button from '../../../components/ui/Button';

export default function JobSearch() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]); // Store original list
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Profile for match calculation (if logged in)
      if (userId) {
        const profileRes = await fetchJobSeekerProfile(userId);
        setUserProfile(profileRes?.profile);
      }

      // 2. Fetch Jobs
      const response = await apiClient.get('/jobseeker/jobs');
      const jobsData = response.data?.data || response.data || [];
      
      // Transform backend jobs to match UI needs if necessary
      const formattedJobs = jobsData.map(job => ({
        id: job.id || job._id,
        title: job.title,
        company: job.company || "Enterprise Corp",
        location: job.location || "Remote",
        type: job.job_type || "Full-time",
        salary: job.salary || "$80k - $120k",
        matchScore: job.match_score || 0,
        matchedSkills: job.required_skills?.slice(0, 3) || [],
        missingSkills: []
      }));

      setJobs(formattedJobs);
      setAllJobs(formattedJobs);
    } catch (err) {
      console.error("[JobSearch] Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setJobs(allJobs);
      return;
    }
    const filtered = allJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase())
    );
    setJobs(filtered);
  };

  const tabs = [
    { id: 'all', label: 'All Jobs', count: allJobs.length },
    { id: 'recommended', label: 'AI Matches', count: allJobs.filter(j => j.matchScore > 70).length },
    { id: 'remote', label: 'Remote', count: allJobs.filter(j => j.location?.toLowerCase().includes('remote')).length }
  ];

  return (
    <div className="space-y-8 pt-4 pb-20">
      <PageHeader 
        title="Explore Opportunities" 
        subtitle="Find your next career move with AI-matched precision."
        breadcrumbs={["Platform", "Jobseeker", "Jobs"]}
      />

      {/* Global Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <SearchBar 
          onSearch={handleSearch} 
          className="flex-grow"
          placeholder="Search by title, company, or tech stack..."
        />
        <FilterTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      {/* Active Filters Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">
          <MapPin size={12} /> Any Location <X size={10} className="ml-1 cursor-pointer" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
          <Briefcase size={12} /> Full-time <X size={10} className="ml-1 cursor-pointer" />
        </div>
        <Button variant="ghost" className="text-[10px] uppercase font-black text-gray-400">
          Clear All
        </Button>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {loading ? (
          <LoadingSkeleton type="card" count={5} />
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {jobs
              .filter(job => {
                if (activeTab === 'recommended') return job.matchScore > 70;
                if (activeTab === 'remote') return job.location?.toLowerCase().includes('remote');
                return true;
              })
              .map(job => (
                <JobCard 
                  key={job.id} 
                  job={job}
                  matchScore={job.matchScore}
                  onApply={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                  onSave={() => console.log("Save job:", job.id)}
                />
              ))
            }
          </div>
        ) : (
          <EmptyState 
            title="No jobs matching your search" 
            description="Try expanding your search criteria or removing filters to see more results."
            action={
              <Button variant="secondary" onClick={() => handleSearch('')}>
                Reset Search
              </Button>
            }
          />
        )}
      </div>

      {/* Pagination / Load More */}
      {jobs.length > 0 && (
        <div className="flex justify-center pt-8">
          <Button variant="secondary" className="px-12 rounded-xl text-xs uppercase font-bold tracking-widest">
            Load More Opportunities
          </Button>
        </div>
      )}
    </div>
  );
}
