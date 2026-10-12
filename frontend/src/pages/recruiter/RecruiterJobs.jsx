import { useState, useEffect } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterJobsHeader from '../../components/recruiter/jobs/RecruiterJobsHeader';
import RecruiterJobsFilters from '../../components/recruiter/jobs/RecruiterJobsFilters';
import RecruiterJobsMetrics from '../../components/recruiter/jobs/RecruiterJobsMetrics';
import RecruiterJobsList from '../../components/recruiter/jobs/RecruiterJobsList';
import { getRecruiterJobsData, fetchRecruiterJobsFromApi } from '../../services/recruiter/recruiterJobsService';

export default function RecruiterJobs() {
  const [data, setData] = useState(() => getRecruiterJobsData());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  useEffect(() => {
    fetchRecruiterJobsFromApi().then(freshData => {
      if (freshData) setData(freshData);
    });
  }, []);

  const metrics = data?.metrics || { active_jobs: 0, total_applications: 0, interviews_scheduled: 0 };
  const jobs = data?.jobs || [];
  const pagination = data?.pagination || { current_page: 1, total_pages: 1, total_items: 0, page_size: 10 };

  const handlePageChange = (page) => {
    setData(prev => ({
      ...prev,
      pagination: { ...prev.pagination, current_page: page }
    }));
  };

  return (
    <RecruiterLayout activeTab="jobs">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 1. Header (Title, Subtitle & Post New Job button) */}
        <RecruiterJobsHeader />

        {/* 2. Search & Filters Bar */}
        <RecruiterJobsFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* 3. Metric Cards (Active Jobs, Total Applications, Interviews Scheduled) */}
        <RecruiterJobsMetrics metrics={metrics} />

        {/* 4. Jobs List or Empty State */}
        <RecruiterJobsList 
          jobs={jobs} 
          pagination={pagination} 
          onPageChange={handlePageChange} 
        />
      </main>
    </RecruiterLayout>
  );
}
