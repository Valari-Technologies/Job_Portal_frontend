import { useState } from 'react';
import EmployerFilters from '../../../components/admin/adminEmployers/EmployerFilters';
import EmployerTable from '../../../components/admin/adminEmployers/EmployerTable';
import EmployerSidePanel from '../../../components/admin/adminEmployers/EmployerSidePanel';

// TODO: Replace empty employers array with Django API:
// GET /api/admin/employers/
// Data source: users, employers, employer_verifications,
// employer_trust, jobs and locations.

export default function AdminEmployers() {
  // Filters dropdown state
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [verificationStatus, setVerificationStatus] = useState('All');
  const [trustLevel, setTrustLevel] = useState('All');
  const [jobStatus, setJobStatus] = useState('All');

  // Sidebar Focus filters trigger
  const handleFiltersToggle = () => {
    const el = document.getElementById('verification-status-filter');
    if (el) el.focus();
  };

  // Side Drawer details trigger
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState('EMPTY_PROFILE');
  const [panelTitle, setPanelTitle] = useState('Employer Workspace');

  const handleOpenSignal = (type, title) => {
    setPanelType(type);
    setPanelTitle(title);
    setPanelOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-805 tracking-tight">Employer management</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Monitor employers, verification and trust status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search company / employer ID..."
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-850 focus:border-teal-500 focus:outline-none"
              disabled
            />
          </div>

          <button
            onClick={handleFiltersToggle}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <svg className="h-4.5 w-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>

          <button
            disabled
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </button>

          <button
            disabled
            title="Employers are added through the Employer Registration flow."
            className="flex items-center gap-2 rounded-xl bg-teal-600/50 px-4.5 py-2.5 text-sm font-extrabold text-white cursor-not-allowed"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add employer</span>
          </button>
        </div>
      </div>

      {/* Dropdown Filters */}
      <EmployerFilters
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        verificationStatus={verificationStatus}
        setVerificationStatus={setVerificationStatus}
        trustLevel={trustLevel}
        setTrustLevel={setTrustLevel}
        jobStatus={jobStatus}
        setJobStatus={setJobStatus}
      />

      {/* Grid Dashboard items */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Table main */}
        <div className="lg:col-span-2 space-y-6">
          <EmployerTable />

          <div className="flex items-center justify-between text-sm font-bold text-slate-500">
            <span>Showing 0 of 0 employers</span>
          </div>

          {/* Progressive trust model card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600 shrink-0">
                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-base font-extrabold text-slate-800">Progressive trust model</h4>
                <p className="text-sm font-bold text-slate-500">
                  Employers build trust over time based on document verification, job quality, compliance, and platform activity.
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleOpenSignal('TRUST_INFO', 'Progressive Trust Model')}
              className="text-sm font-black text-teal-650 hover:text-teal-700 whitespace-nowrap shrink-0"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Right side analytics column */}
        <div className="space-y-6">
          {/* Employer signals */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Employer signals</h3>
            <div className="space-y-4.5">
              {/* Row verification */}
              <div 
                onClick={() => handleOpenSignal('SIGNAL_PENDING', 'Pending employer verifications')}
                className="flex items-center justify-between cursor-pointer py-1"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-850">Pending verification</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-800">0</span>
                  <svg className="h-4.5 w-4.5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Row job approval */}
              <div 
                onClick={() => handleOpenSignal('SIGNAL_JOBS', 'Jobs waiting for approval')}
                className="flex items-center justify-between cursor-pointer py-1"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-850">Job approval queue</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-800">0</span>
                  <svg className="h-4.5 w-4.5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Row trusted */}
              <div 
                onClick={() => handleOpenSignal('SIGNAL_TRUSTED', 'Trusted employers')}
                className="flex items-center justify-between cursor-pointer py-1"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-850">Trusted employers</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-800">0</span>
                  <svg className="h-4.5 w-4.5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Employer preview */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs text-center py-12 space-y-4">
            <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold text-slate-800">No employer selected</h4>
              <p className="text-sm font-bold text-slate-500">
                Select an employer from the list to view verification, trust and job activity.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4 text-left space-y-2">
              <span className="text-xs font-black text-slate-500 block uppercase">Trust progress</span>
              <p className="text-xs font-bold text-slate-450 leading-relaxed">
                Trust progress will appear after employer verification and platform activity.
              </p>
            </div>
            <button 
              disabled 
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
            >
              View full profile
            </button>
          </div>

          {/* Recent Approved Jobs Card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800">Recent approved jobs</h3>
              <button 
                disabled 
                className="text-xs font-bold text-slate-400 cursor-not-allowed"
              >
                View all jobs
              </button>
            </div>
            <div className="py-6 text-center space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-750">No approved jobs yet</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Approved employer jobs will appear here after employer verification and job moderation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side panel view */}
      <EmployerSidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        panelType={panelType}
        panelTitle={panelTitle}
      />
    </div>
  );
}
