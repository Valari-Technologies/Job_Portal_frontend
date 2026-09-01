import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import EmployerLayout from '../../../components/employer/common/EmployerLayout';
import ApplicationsFilters from '../../../components/employer/employerApplications/ApplicationsFilters';
import ApplicationsStats from '../../../components/employer/employerApplications/ApplicationsStats';
import ApplicationsList from '../../../components/employer/employerApplications/ApplicationsList';

// Future Django API:
// GET /api/employer/applications/
// Data will replace the empty state after authenticated Employer data is available.

export default function EmployerApplications() {
  const [applicationsList] = useState([]); // Initial empty state
  const [selectedApp, setSelectedApp] = useState(null); // No selected application initially

  // Filter controls mapping state (UI only)
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  return (
    <EmployerLayout activeTab="applications" breadcrumbTitle="Applications">
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        
        {/* Page Heading & Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Applications</h1>
            <p className="text-sm md:text-base font-bold text-slate-500 mt-1">Review candidates and move hiring forward.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter applications</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics Cards Grid */}
        <ApplicationsStats />

        {/* Filter Controls Panel */}
        <ApplicationsFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          jobFilter={jobFilter}
          setJobFilter={setJobFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />

        {/* Candidate lists view */}
        <ApplicationsList 
          applicationsList={applicationsList}
          selectedApp={selectedApp}
          setSelectedApp={setSelectedApp}
        />

      </main>
    </EmployerLayout>
  );
}
