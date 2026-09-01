import { useState } from 'react';
import ReportsTable from '../../../components/superAdmin/superAdminReports/ReportsTable';
import ReportDetailsPanel from '../../../components/superAdmin/superAdminReports/ReportDetailsPanel';

// TODO: Connect Django API:
// GET /api/admin/job-reports/
// Future data source: job_reports, jobs, employers, users and locations.
// Report statuses and moderation rules must follow finalized backend policy.

export default function SuperAdminReports() {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-3xl font-black text-slate-805 tracking-tight">Reports & safety</h1>
        <p className="text-base font-bold text-slate-500 mt-1.5">
          Review reported job posts and help keep the platform trusted.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
          <span className="text-xs font-black text-slate-455 uppercase block">Open reports</span>
          <span className="text-2xl font-black text-slate-800 mt-2 block">0</span>
        </div>
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
          <span className="text-xs font-black text-slate-455 uppercase block">Reports requiring review</span>
          <span className="text-2xl font-black text-slate-800 mt-2 block">0</span>
        </div>
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
          <span className="text-xs font-black text-slate-455 uppercase block">Resolved reports</span>
          <span className="text-2xl font-black text-slate-800 mt-2 block">0</span>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search reports..."
            className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none"
            disabled
          />
        </div>

        <select
          disabled
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-450 cursor-not-allowed"
        >
          <option>Job</option>
        </select>

        <select
          disabled
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-450 cursor-not-allowed"
        >
          <option>Status</option>
        </select>

        <select
          disabled
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-450 cursor-not-allowed"
        >
          <option>Location</option>
        </select>

        <button
          disabled
          title="There are no job reports to export."
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
        >
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export</span>
        </button>
      </div>

      {/* Grid container layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Table */}
        <div className="lg:col-span-2 space-y-6">
          <ReportsTable 
            reports={[]}
            selectedReport={selectedReport}
            onSelectReport={setSelectedReport}
          />
          <div className="text-sm font-bold text-slate-500">
            Showing 0 of 0 reports
          </div>
        </div>

        {/* Right Side details */}
        <div className="space-y-6">
          <ReportDetailsPanel 
            selectedReport={selectedReport}
          />
          
          {/* Changes callout */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-xs font-semibold text-blue-805 leading-relaxed">
            Changes to skills can affect candidate matching and job recommendations.
          </div>
        </div>
      </div>
    </div>
  );
}
