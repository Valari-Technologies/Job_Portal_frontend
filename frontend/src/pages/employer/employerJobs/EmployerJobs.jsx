import { useState } from 'react';
import EmployerLayout from '../../../components/employer/common/EmployerLayout';
import JobsFilters from '../../../components/employer/employerJobs/JobsFilters';
import JobsStats from '../../../components/employer/employerJobs/JobsStats';
import JobsTable from '../../../components/employer/employerJobs/JobsTable';

// Future Django API:
// GET /api/employer/jobs/
// Data will replace the empty state after authenticated Employer data is available.

export default function EmployerJobs() {
  const [jobsList] = useState([]); // Initial no-data state

  // Filters state mapping (UI only)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  return (
    <EmployerLayout activeTab="jobs" breadcrumbTitle="Jobs">
      {/* Main Content Layout Grid */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">

        {/* Heading block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Jobs</h1>
            <p className="text-sm md:text-base font-bold text-slate-500 mt-1">Create, manage and track your job posts.</p>
          </div>
          <button 
            disabled 
            className="w-full md:w-auto rounded-xl bg-slate-200 text-slate-400 font-extrabold px-5 py-3 text-sm cursor-not-allowed transition-colors"
            title="Verify your company profile to post new job vacancies"
          >
            + Post a job
          </button>
        </div>

        {/* Filters Panel Component */}
        <JobsFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />

        {/* Jobs Metric stats indicators */}
        <JobsStats />

        {/* Jobs Posts table list */}
        <JobsTable jobsList={jobsList} />

      </main>
    </EmployerLayout>
  );
}
