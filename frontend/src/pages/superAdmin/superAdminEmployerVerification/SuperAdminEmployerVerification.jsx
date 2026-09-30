import { useState, useEffect, useCallback } from 'react';
import EmployerVerificationQueue from '../../../components/superAdmin/superAdminEmployerVerification/EmployerVerificationQueue';
import EmployerVerificationReview from '../../../components/superAdmin/superAdminEmployerVerification/EmployerVerificationReview';
import {
  fetchEmployerVerificationsService,
  verifyEmployerDecisionService
} from '../../../services/superAdmin/employerVerificationService';

export default function SuperAdminEmployerVerification() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
  });

  const loadVerificationQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEmployerVerificationsService({
        status: statusFilter,
        search: searchQuery,
        page,
      });
      setRequests(res.results);
      setTotalPages(res.totalPages);
      setTotalCount(res.count);
    } catch (err) {
      setError(err.message || 'Failed to load verification queue.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  useEffect(() => {
    loadVerificationQueue();
  }, [loadVerificationQueue]);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleDecisionSubmit = async (employerId, payload) => {
    const res = await verifyEmployerDecisionService(employerId, payload);
    if (res.success) {
      loadVerificationQueue();
      setSelectedRequest(null);
    }
    return res;
  };

  const handleQuickAction = (request, actionType) => {
    if (actionType === 'APPROVE') {
      setConfirmModal({
        isOpen: true,
        title: 'Approve Employer Verification',
        message: `Are you sure you want to approve "${request.company_name || 'this employer'}"? Once approved, this employer can post jobs.`,
        action: async () => {
          await handleDecisionSubmit(request.employer_id, {
            decision: 'APPROVED',
            notes: 'Quick approve from queue list',
          });
          setConfirmModal({ isOpen: false, title: '', message: '', action: null });
        }
      });
    } else {
      setSelectedRequest(request);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      {!selectedRequest && (
        <div className="border-b border-slate-150 pb-5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Employer verification</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Review employer profiles and company verification requests.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      {selectedRequest ? (
        <EmployerVerificationReview
          request={selectedRequest}
          onBack={() => setSelectedRequest(null)}
          onDecision={handleDecisionSubmit}
        />
      ) : (
        <EmployerVerificationQueue
          requests={requests}
          loading={loading}
          error={error}
          totalCount={totalCount}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          onRetry={loadVerificationQueue}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSelectRequest={(r) => setSelectedRequest(r)}
          onQuickAction={handleQuickAction}
        />
      )}

      {/* Center Screen Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900">{confirmModal.title}</h3>
            </div>

            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmModal.action && confirmModal.action()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
