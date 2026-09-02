import { useState } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterCandidatesHeader from '../../components/recruiter/candidates/RecruiterCandidatesHeader';
import RecruiterCandidateFilters from '../../components/recruiter/candidates/RecruiterCandidateFilters';
import RecruiterCandidateGrid from '../../components/recruiter/candidates/RecruiterCandidateGrid';
import { getRecruiterCandidatesData } from '../../services/recruiter/recruiterCandidatesService';

export default function RecruiterCandidates() {
  const [data, setData] = useState(() => getRecruiterCandidatesData());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterState, setFilterState] = useState({
    jobId: 'ALL',
    status: 'ALL',
    minExp: '',
    maxExp: '',
    location: ''
  });

  const candidates = data?.candidates || [];
  const jobs = data?.filters?.jobs || [];
  const statuses = data?.filters?.statuses || [];
  const pagination = data?.pagination || { current_page: 1, total_pages: 1, total_items: 0, page_size: 12 };

  const handlePageChange = (page) => {
    setData(prev => ({
      ...prev,
      pagination: { ...prev.pagination, current_page: page }
    }));
  };

  const activeFiltersCount = Object.values(filterState).filter(val => val && val !== 'ALL').length;

  return (
    <RecruiterLayout activeTab="candidates">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 1. Header with Filters Button (NO Add Candidate button!) */}
        <RecruiterCandidatesHeader 
          onToggleFilters={() => setFiltersOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />

        {/* 2. Candidates Grid / Empty State */}
        <RecruiterCandidateGrid 
          candidates={candidates}
          pagination={pagination}
          onPageChange={handlePageChange}
        />

        {/* 3. Filter Drawer Panel */}
        <RecruiterCandidateFilters 
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filterState={filterState}
          setFilterState={setFilterState}
          jobs={jobs}
          statuses={statuses}
        />
      </main>
    </RecruiterLayout>
  );
}
