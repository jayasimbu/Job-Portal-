import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  Zap,
  ArrowDownNarrowWide,
  Target
} from 'lucide-react';
import { useCandidateAnalysis } from '../../../hooks/useCandidateAnalysis';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import SearchBar from '../../../components/shared/SearchBar';
import FilterTabs from '../../../components/shared/FilterTabs';
import CandidateCard from '../../../components/shared/CandidateCard';
import SectionTitle from '../../../components/shared/SectionTitle';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import EmptyState from '../../../components/shared/EmptyState';
import Button from '../../../components/ui/Button';

export default function Candidates() {
  const navigate = useNavigate();
  const { isAnalyzing, candidates, fetchCandidates } = useCandidateAnalysis();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeJobId, setActiveJobId] = useState('all');

  useEffect(() => {
    fetchCandidates(activeJobId);
  }, [activeJobId, fetchCandidates]);

  const filteredCandidates = candidates.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const jobFilters = [
    { id: 'all', label: 'All Candidates' },
    { id: 'ai-eng', label: 'Lead AI Engineer' },
    { id: 'react-dev', label: 'React Developer' },
    { id: 'devops', label: 'DevOps Lead' }
  ];

  return (
    <div className="space-y-8 pt-4 pb-20">
      
      <PageHeader 
        title="Candidate Pipeline" 
        subtitle="Manage and rank talent across your active job postings."
        breadcrumbs={["Platform", "Employer", "Candidates"]}
      />

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
         <div className="w-full lg:w-1/3">
           <SearchBar 
             placeholder="Search by name, skill, or role..." 
             onSearch={setSearchTerm}
           />
         </div>
         <div className="w-full lg:w-auto flex gap-3">
            <FilterTabs 
              tabs={jobFilters}
              activeTab={activeJobId}
              onTabChange={setActiveJobId}
            />
            <Button variant="secondary" className="rounded-xl h-11 px-4 border-gray-100 dark:border-gray-800">
               <ArrowDownNarrowWide size={16} className="mr-2" /> Match %
            </Button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         
         {/* Left: Summary & Stats */}
         <div className="xl:col-span-1 space-y-6">
            <div className="card-premium p-6 space-y-6">
               <SectionTitle title="Pipeline Insight" />
               <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <div className="flex items-center gap-2 text-primary mb-1">
                        <Target size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Top Role Match</span>
                     </div>
                     <p className="body-sm font-bold text-gray-900 dark:text-white">Lead AI Engineer</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Avg Score: 88%</p>
                  </div>
                  
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate Breakdown</p>
                     <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="body-sm text-gray-500 font-medium">New Applications</span>
                        <span className="text-sm font-black text-gray-900 dark:text-white">12</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="body-sm text-gray-500 font-medium">Shortlisted</span>
                        <span className="text-sm font-black text-primary">8</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="body-sm text-gray-500 font-medium">Scheduled</span>
                        <span className="text-sm font-black text-warning">4</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="card-premium p-6 bg-gray-900 dark:bg-black border-gray-800 text-center space-y-4">
                <div className="size-12 bg-primary/20 rounded-2xl mx-auto flex items-center justify-center text-primary border border-primary/20">
                   <Sparkles size={24} />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest leading-tight">AI Talent Discovery</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                   "We found 3 passive candidates in our global pool matching your <strong>Lead AI Engineer</strong> requirements."
                </p>
                <Button variant="primary" className="w-full rounded-xl text-[10px] h-10 uppercase font-black">Invite Candidates</Button>
            </div>
         </div>

         {/* Right: Candidate List */}
         <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2">
               <SectionTitle 
                 title={`${filteredCandidates.length} Candidates`} 
                 description="Ranked by AI semantic alignment score."
               />
               <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  <button className="p-1.5 rounded-md bg-white dark:bg-gray-900 shadow-sm text-primary"><LayoutGrid size={14} /></button>
                  <button className="p-1.5 rounded-md text-gray-400"><List size={14} /></button>
               </div>
            </div>

            <div className="space-y-4">
               {isAnalyzing ? (
                 <LoadingSkeleton type="card" count={4} />
               ) : filteredCandidates.length > 0 ? (
                 filteredCandidates.map(candidate => (
                   <CandidateCard 
                     key={candidate.id || candidate._id} 
                     candidate={candidate}
                     onViewDetails={() => navigate(`/platform/employer/candidates/${candidate.id || candidate._id}`)}
                   />
                 ))
               ) : (
                 <EmptyState 
                   title="No candidates found" 
                   description="Try adjusting your filters or search terms to broaden your search."
                 />
               )}
            </div>
         </div>

      </div>
    </div>
  );
}
