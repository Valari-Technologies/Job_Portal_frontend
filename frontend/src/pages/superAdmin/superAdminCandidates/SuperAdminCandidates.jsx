import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  fetchCandidatesService,
  deleteCandidateService,
  updateUserStatusService
} from '../../../services/superAdmin/superAdminService';
import { useNavigate } from 'react-router-dom';
import CandidateFilters from '../../../components/superAdmin/superAdminCandidates/CandidateFilters';
import CandidateTable from '../../../components/superAdmin/superAdminCandidates/CandidateTable';
import CandidateSidePanel from '../../../components/superAdmin/superAdminCandidates/CandidateSidePanel';
import CandidateModal from '../../../components/superAdmin/superAdminCandidates/CandidateModal';
import SuperAdminPagination from '../../../components/superAdmin/common/SuperAdminPagination';

export default function SuperAdminCandidates({ onToast }) {
  const navigate = useNavigate();
  // Empty State Rule: No candidate has registered yet. Connects later.
  // We initialize candidates as an empty list to represent no data connected.
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pickedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Search & filter state values
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [profileStatus, setProfileStatus] = useState('All');
  const [accountStatus, setAccountStatus] = useState('All');

  const requestIdRef = useRef(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCandidates = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const data = await fetchCandidatesService({
        search: searchQuery,
        state: selectedState,
        district: selectedDistrict,
        status: accountStatus
      });
      // Ignore out-of-order responses from earlier filter selections
      if (requestId === requestIdRef.current) {
        setCandidates(data);
      }
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [searchQuery, selectedState, selectedDistrict, accountStatus]);

  // Profile status filter: derived from each candidate's real (calculated) profile completion
  const visibleCandidates = useMemo(() => {
    if (profileStatus === 'All') return candidates;
    return candidates.filter((c) => {
      const pct = Number(c.profile_completion ?? 0);
      if (profileStatus === 'Complete') return pct >= 80;
      if (profileStatus === 'Needs review') return pct >= 60 && pct < 80;
      if (profileStatus === 'Incomplete') return pct < 60;
      return true;
    });
  }, [candidates, profileStatus]);

  // Pagination config: 6 candidate details per page
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedDistrict, profileStatus, accountStatus]);

  const totalPages = Math.max(1, Math.ceil(visibleCandidates.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCandidates = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return visibleCandidates.slice(start, start + PAGE_SIZE);
  }, [visibleCandidates, safeCurrentPage]);

  // The preview card always points at a candidate that is still in the visible list (preferably on current page)
  const selectedCandidate = useMemo(
    () => paginatedCandidates.find((c) => c.id === pickedCandidate?.id) || paginatedCandidates[0] || visibleCandidates[0] || null,
    [paginatedCandidates, pickedCandidate, visibleCandidates]
  );

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Side Drawer config
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState('VIEW_PROFILE');
  const [panelTitle, setPanelTitle] = useState('Candidate Workspace');

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
    setPanelType('VIEW_PROFILE');
    setPanelTitle('Candidate Profile Workspace');
    setPanelOpen(true);
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
    } else if (actionType === 'SUSPEND' || actionType === 'ACTIVATE') {
      const newStatus = actionType === 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE';
      updateUserStatusService(record.id, newStatus).then((result) => {
        if (!result.success) {
          onToast(result.message);
          return;
        }
        setCandidates(prev => prev.map(c => (c.id === record.id ? { ...c, status: newStatus } : c)));
        onToast(`Candidate account: ${record.full_name} ${actionType === 'SUSPEND' ? 'suspended' : 'activated'} successfully.`);
      });
    } else if (actionType === 'DELETE') {
      setDeleteTarget(record);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    const result = await deleteCandidateService(deleteTarget.id);
    setIsDeleting(false);
    if (!result.success) {
      onToast(result.message);
      return;
    }
    setCandidates(prev => prev.filter(c => c.id !== deleteTarget.id));
    onToast(`Candidate ${deleteTarget.full_name || deleteTarget.email} deleted successfully.`);
    setDeleteTarget(null);
  };

  // Drawer panel save / action handler
  const handleActionSubmit = (type, data) => {
    if (type === 'ADD_SAVE') {
      setCandidates(prev => [data, ...prev]);
      setSelectedCandidate(data);
    }
  };

  return (
    <div className="space-y-4 font-sans animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Candidate management
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              id="candidate-search-input"
              name="candidateSearch"
              aria-label="Search candidates by name, mobile or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, mobile or ID..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9.5 pr-4 text-xs font-bold text-slate-800 placeholder-slate-400 shadow-2xs focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2.5 text-xs font-bold text-slate-400 shadow-2xs cursor-not-allowed"
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/super-admin/candidates/create')}
              aria-label="Add candidate"
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 sm:gap-2 rounded-xl bg-teal-600 px-3.5 sm:px-4.5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add candidate</span>
            </button>
          </div>
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

      {/* Main Candidate Table & Pagination - Full Width Single-Page View */}
      <div className="space-y-3.5">
        <CandidateTable
          candidates={paginatedCandidates}
          selectedCandidate={selectedCandidate}
          onSelectCandidate={handleSelectCandidate}
          onTriggerAction={handleTriggerAction}
        />

        {/* Pagination bar */}
        <SuperAdminPagination
          currentPage={safeCurrentPage}
          totalItems={visibleCandidates.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemName="candidates"
        />
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
      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => !isDeleting && setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="delete-candidate-title">
            <h3 id="delete-candidate-title" className="text-lg font-extrabold text-slate-900">Delete candidate?</h3>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {deleteTarget.full_name || deleteTarget.email} will be removed from the platform and can no longer sign in. This action cannot be undone from this screen.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-red-700 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Candidate Modal Form Overlay */}
      <CandidateModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onToast={onToast} 
      />
    </div>
  );
}
