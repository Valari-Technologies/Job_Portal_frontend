import { useState } from 'react';
import EmployerLayout from '../../../components/employer/common/EmployerLayout';
import OverviewStats from '../../../components/employer/employerOverview/OverviewStats';
import OverviewTrends from '../../../components/employer/employerOverview/OverviewTrends';

// Future Django API:
// GET /api/employer/overview/
// Data will replace the empty state after authenticated Employer data is available.

export default function EmployerOverview() {
  const [overview] = useState(null); // Initial empty state
  const profilePercent = overview?.company?.profile_completion || 0;

  return (
    <EmployerLayout activeTab="overview" breadcrumbTitle="Overview">
      {/* Main Content Layout Grid */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">

        {/* Heading block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Welcome to TN Jobz Employer Portal</h1>
            <p className="text-sm md:text-base font-bold text-slate-500 mt-1">Complete your company profile and verification to begin hiring.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="#profile" className="w-full md:w-auto text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-3 text-sm transition-colors shadow-xs">
              Complete company profile
            </a>
            <button
              disabled
              className="w-full md:w-auto rounded-xl bg-slate-200 text-slate-400 font-extrabold px-5 py-3 text-sm cursor-not-allowed transition-colors"
              title="Verify your company profile to post new job vacancies"
            >
              + Post a job
            </button>
          </div>
        </div>

        {/* Overview Stats widgets */}
        <OverviewStats profilePercent={profilePercent} />

        {/* Overview Trends details */}
        <OverviewTrends />

      </main>
    </EmployerLayout>
  );
}
