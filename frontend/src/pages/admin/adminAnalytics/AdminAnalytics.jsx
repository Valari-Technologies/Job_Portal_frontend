import { useState } from 'react';
import AnalyticsEmptyState from '../../../components/admin/adminAnalytics/AnalyticsEmptyState';
import AnalyticsMetricGrid from '../../../components/admin/adminAnalytics/AnalyticsMetricGrid';
import AnalyticsChartsSection from '../../../components/admin/adminAnalytics/AnalyticsChartsSection';

// TODO: Connect Django API:
// GET /api/admin/analytics/?range=30d&state=tamil-nadu
// Future data source: users, candidates, employers, jobs, applications,
// employer_verifications, job_categories, job_locations and job_reports.

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('30');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-805 tracking-tight">Platform analytics</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Understand platform activity and trends over time.
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 shadow-2xs focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Metric Cards summary */}
      <AnalyticsMetricGrid />

      {/* Main Empty view card */}
      <AnalyticsEmptyState />

      {/* Charts trend containers */}
      <AnalyticsChartsSection />
    </div>
  );
}
