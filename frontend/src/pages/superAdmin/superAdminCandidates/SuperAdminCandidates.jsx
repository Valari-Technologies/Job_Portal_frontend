import { useState, useEffect, useCallback } from 'react';
import { fetchCandidatesService } from '../../../services/superAdmin/superAdminService';
import { useNavigate } from 'react-router-dom';
import CandidateFilters from '../../../components/superAdmin/superAdminCandidates/CandidateFilters';
import CandidateTable from '../../../components/superAdmin/superAdminCandidates/CandidateTable';
import CandidateSidePanel from '../../../components/superAdmin/superAdminCandidates/CandidateSidePanel';
import CandidateModal from '../../../components/superAdmin/superAdminCandidates/CandidateModal';

export default function SuperAdminCandidates({ onToast }) {
  const navigate = useNavigate();
  // Empty State Rule: No candidate has registered yet. Connects later.
  // We initialize candidates as an empty list to represent no data connected.
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Search & filter state values
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [profileStatus, setProfileStatus] = useState('All');
  const [accountStatus, setAccountStatus] = useState('All');

  const loadCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCandidatesService({
        search: searchQuery,
        state: selectedState,
        district: selectedDistrict,
        status: accountStatus
      });
      setCandidates(data);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedState, selectedDistrict, accountStatus]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Side Drawer config
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState('VIEW_PROFILE');
  const [panelTitle, setPanelTitle] = useState('Candidate Workspace');

  // Pagination config
  const [pageSize, setPageSize] = useState(10);

  // Focus Filters card trigger
  const handleFiltersToggle = () => {
    const el = document.getElementById('state-filter');
    if (el) el.focus();
  };

  // CSV export function
  const handleExportCSV = () => {
    onToast('Candidate export features will connect when data models are active.');
  };

  const handleSelectCandidate = (cand) => {
    setSelectedCandidate(cand);
  };

  // Moderation / Creation triggers
  const handleTriggerAction = (actionType, record) => {
    if (actionType === 'VIEW') {
      setSelectedCandidate(record);
      setPanelType('VIEW_PROFILE');
      setPanelTitle('Candidate Profile Workspace');
      setPanelOpen(true);
    } else if (actionType === 'MESSAGE') {
      onToast(`Message client workflow initiated for candidate: ${record.full_name}`);
    } else if (actionType === 'REVIEW') {
      onToast(`Marked ${record.full_name} profile for administrator verification.`);
    } else if (actionType === 'SUSPEND') {
      onToast(`Candidate account: ${record.full_name} suspended successfully.`);
    } else if (actionType === 'ACTIVATE') {
      onToast(`Candidate account: ${record.full_name} activated successfully.`);
    }
  };

  // Drawer panel save / action handler
  const handleActionSubmit = (type, data) => {
    if (type === 'ADD_SAVE') {
      setCandidates(prev => [data, ...prev]);
      setSelectedCandidate(data);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-805 tracking-tight">Candidate management</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Manage candidate accounts, profile quality and activity across the platform.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Header Search input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search name, mobile or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
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
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </button>

          <button
            onClick={() => navigate('/super-admin/candidates/create')}
            aria-label="Add candidate"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4.5 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 transition-colors cursor-pointer"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add candidate</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <CandidateFilters
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        profileStatus={profileStatus}
        setProfileStatus={setProfileStatus}
        accountStatus={accountStatus}
        setAccountStatus={setAccountStatus}
      />

      {/* Workspace Grids layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left main table wrapper */}
        <div className="lg:col-span-2 space-y-6">
          <CandidateTable
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={handleSelectCandidate}
            onTriggerAction={handleTriggerAction}
          />

          {/* Pagination bar */}
          <div className="flex items-center justify-between text-sm font-bold text-slate-500">
            <span>Showing 1 to {candidates.length} of {candidates.length} candidates</span>
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right side analytics indicators cards */}
        <div className="space-y-6">
          {/* Needs Attention Card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Needs attention</h3>
            <div className="space-y-4.5">
              {/* Row Incomplete */}
              <div className="flex items-center justify-between cursor-pointer py-1">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">Incomplete profiles</h4>
                    <p className="text-xs text-slate-450">Profiles below 60% completion</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-800">0</span>
                  <svg className="h-4.5 w-4.5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Row Duplicate */}
              <div className="flex items-center justify-between cursor-pointer py-1">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">Duplicate checks</h4>
                    <p className="text-xs text-slate-450">Potential duplicate accounts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-800">0</span>
                  <svg className="h-4.5 w-4.5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Row Reported */}
              <div className="flex items-center justify-between cursor-pointer py-1">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-750 border border-red-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">Reported accounts</h4>
                    <p className="text-xs text-slate-450">Accounts reported by users</p>
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

          {/* Selected Candidate Card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h4 className="text-sm font-extrabold text-slate-800 mt-3">No candidate selected</h4>
            <p className="text-xs text-slate-500 mt-1">
              Select a candidate from the table list to preview details.
            </p>
          </div>
        </div>
      </div>

      {/* Side drawer Overlay panel */}
      <CandidateSidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        panelType={panelType}
        panelTitle={panelTitle}
        candidate={selectedCandidate}
        onActionSubmit={handleActionSubmit}
        onToast={onToast}
      />
      {/* Candidate Modal Form Overlay */}
      <CandidateModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onToast={onToast} 
      />
    </div>
  );
}
