import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchEmployersService } from '../../../services/superAdmin/superAdminService';
import { getActionQueues } from '../superAdminOverview/superAdminOverviewService';
import { useNavigate } from 'react-router-dom';
import EmployerFilters from '../../../components/superAdmin/superAdminEmployers/EmployerFilters';
import EmployerTable from '../../../components/superAdmin/superAdminEmployers/EmployerTable';
import EmployerSidePanel from '../../../components/superAdmin/superAdminEmployers/EmployerSidePanel';
import SuperAdminPagination from '../../../components/superAdmin/common/SuperAdminPagination';

export default function SuperAdminEmployers() {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters dropdown state
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [pendingJobsCount, setPendingJobsCount] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('All');
  const [trustLevel, setTrustLevel] = useState('All');
  const [jobStatus, setJobStatus] = useState('All');

  // Selected Employer for detail panel
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  // Side Drawer details trigger
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState('EMPTY_PROFILE');
  const [panelTitle, setPanelTitle] = useState('');

  // Pagination config: 7 employers per page (tight, clean fit without extra space)
  const PAGE_SIZE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedDistrict, verificationStatus, trustLevel, jobStatus]);

  const totalPages = Math.max(1, Math.ceil(employers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedEmployers = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return employers.slice(start, start + PAGE_SIZE);
  }, [employers, safeCurrentPage]);

  const requestIdRef = useRef(0);

  const loadEmployers = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const data = await fetchEmployersService({
        search: searchQuery,
        state: selectedState,
        district: selectedDistrict,
        verification_status: verificationStatus,
        trust_level: trustLevel,
        job_status: jobStatus,
      });
      // Ignore out-of-order responses from earlier filter selections
      if (requestId !== requestIdRef.current) return;
      setEmployers(data);
      setSelectedEmployer((prev) => data.find((e) => e.id === prev?.id) || data[0] || null);
    } catch (err) {
      console.error("Failed to fetch employers:", err);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [searchQuery, selectedState, selectedDistrict, verificationStatus, trustLevel, jobStatus]);

  useEffect(() => {
    loadEmployers();
  }, [loadEmployers]);

  // Live job approval queue size
  useEffect(() => {
    let active = true;
    getActionQueues()
      .then((q) => { if (active) setPendingJobsCount(q.jobsPendingReview?.count ?? 0); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Sidebar Focus filters trigger
  const handleFiltersToggle = () => {
    const el = document.getElementById('verification-status-filter');
    if (el) el.focus();
  };

  const handleOpenSignal = (type, title) => {
    setPanelType(type);
    setPanelTitle(title);
    setPanelOpen(true);
  };

  const handleSelectEmployer = (emp) => {
    setSelectedEmployer(emp);
    setPanelType('EMPLOYER_DETAILS');
    setPanelTitle(emp.company_name || emp.full_name);
    setPanelOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Employer management
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              id="employer-search-input"
              name="employerSearch"
              aria-label="Search employers by company or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company / email"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9.5 pr-4 text-xs font-bold text-slate-800 placeholder-slate-400 shadow-2xs focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              disabled 
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2.5 text-xs font-bold text-slate-400 shadow-2xs cursor-not-allowed"
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>

            <button 
              onClick={() => navigate('/super-admin/employers/create')}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 sm:gap-2 rounded-xl bg-teal-600 px-3.5 sm:px-4.5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add employer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters section */}
      <EmployerFilters
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        verificationStatus={verificationStatus}
        setVerificationStatus={setVerificationStatus}
        trustLevel={trustLevel}
        setTrustLevel={setTrustLevel}
        jobStatus={jobStatus}
        setJobStatus={setJobStatus}
      />

      {/* Main Layout Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Table column */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="w-full bg-white rounded-2xl border border-slate-150 p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent align-[-0.125em]"></div>
              <p className="mt-3 text-sm font-bold text-slate-500">Loading employers...</p>
            </div>
          ) : (
            <EmployerTable 
              employers={paginatedEmployers} 
              onSelectEmployer={handleSelectEmployer} 
              selectedEmployer={selectedEmployer}
            />
          )}

          <SuperAdminPagination
            currentPage={safeCurrentPage}
            totalItems={employers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemName="employers"
          />
        </div>

        {/* Right side analytics column */}
        <div className="space-y-4">
          {/* Employer signals */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Employer signals</h3>
            <div className="space-y-3.5">
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
                  <span className="text-base font-extrabold text-slate-800">
                    {employers.filter(e => e.verification_status === 'PENDING').length}
                  </span>
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
                  <span className="text-base font-extrabold text-slate-800">{pendingJobsCount}</span>
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
                  <span className="text-base font-extrabold text-slate-800">
                    {employers.filter(e => e.trust_level === 'TRUSTED' || e.trust_level === 'HIGH').length}
                  </span>
                  <svg className="h-4.5 w-4.5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Employer preview card */}
          {selectedEmployer ? (
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
                {selectedEmployer.company_logo ? (
                  <img src={selectedEmployer.company_logo} alt="" className="h-11 w-11 rounded-full object-cover border-2 border-black bg-white shrink-0" />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-white border-2 border-black text-slate-900 font-extrabold text-base flex items-center justify-center shrink-0">
                    {(selectedEmployer.company_name || selectedEmployer.full_name || 'E').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-extrabold text-slate-900 truncate">{selectedEmployer.company_name || selectedEmployer.full_name}</h4>
                  <p className="text-xs text-slate-500 font-medium truncate">{selectedEmployer.company_email || selectedEmployer.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Designation</span>
                  <span className="font-extrabold text-slate-800">{selectedEmployer.designation || 'HR Manager'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Location</span>
                  <span className="font-extrabold text-slate-800 truncate max-w-[180px]">{selectedEmployer.location?.full_path || selectedEmployer.location?.name || selectedEmployer.company_address || 'All Locations'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Verification</span>
                  <span className="font-extrabold uppercase text-amber-700">{selectedEmployer.verification_status || 'PENDING'}</span>
                </div>
              </div>

              <button 
                onClick={() => handleSelectEmployer(selectedEmployer)}
                className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-2.5 shadow-md shadow-teal-600/10 transition-colors cursor-pointer"
              >
                View full profile
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs text-center py-10 space-y-3.5">
              <div className="h-11 w-11 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10" />
                </svg>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-800">No employer selected</h4>
                <p className="text-xs font-bold text-slate-500">
                  Select an employer from the list to view verification, trust and job activity.
                </p>
              </div>
              <button 
                disabled 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
              >
                View full profile
              </button>
            </div>
          )}

          {/* Recent Approved Jobs Card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-extrabold text-slate-800">Recent approved jobs</h3>
              <button 
                disabled 
                className="text-xs font-bold text-slate-400 cursor-not-allowed"
              >
                View all jobs
              </button>
            </div>
            <div className="py-4 text-center space-y-1">
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
        selectedEmployer={selectedEmployer}
      />
    </div>
  );
}
