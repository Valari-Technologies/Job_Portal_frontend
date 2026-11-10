import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import JobReviewQueue from '../../../components/superAdmin/superAdminJobReview/JobReviewQueue';
import JobReviewDetails from '../../../components/superAdmin/superAdminJobReview/JobReviewDetails';
import {
  fetchJobReviewsService,
  reviewJobDecisionService
} from '../../../services/superAdmin/jobReviewService';

export default function SuperAdminJobReview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const targetJobId = searchParams.get('jobId') || searchParams.get('id') || location.state?.jobId;

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
  });

  const handleBackToQueue = useCallback(() => {
    setSelectedJob(null);
    if (searchParams.has('jobId') || searchParams.has('id')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('jobId');
      newParams.delete('id');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const loadJobQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJobReviewsService({
        status: statusFilter,
        search: searchQuery,
        page,
      });
      setJobs(res.results);
      setTotalPages(res.totalPages);
      setTotalCount(res.count);

      // Auto-select target job if query param or state is set
      if (targetJobId) {
        const found = res.results.find(j => String(j.id) === String(targetJobId));
        if (found) {
          setSelectedJob(found);
        } else {
          try {
            const allRes = await fetchJobReviewsService({ status: 'ALL' });
            const direct = (allRes.results || []).find(j => String(j.id) === String(targetJobId));
            if (direct) setSelectedJob(direct);
          } catch (_) {}
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load job review queue.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page, targetJobId]);

  useEffect(() => {
    loadJobQueue();
  }, [loadJobQueue]);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleDecisionSubmit = async (jobId, payload) => {
    const res = await reviewJobDecisionService(jobId, payload);
    if (res.success) {
      handleBackToQueue();
      loadJobQueue();
    }
    return res;
  };

  const handleQuickAction = (job, actionType) => {
    if (actionType === 'APPROVE') {
      setConfirmModal({
        isOpen: true,
        title: 'Approve & Publish Job',
        message: `Are you sure you want to approve and publish "${job.title}"?`,
        action: async () => {
          await handleDecisionSubmit(job.id, {
            action: 'APPROVED',
            notes: 'Quick approve from job review queue',
          });
          setConfirmModal({ isOpen: false, title: '', message: '', action: null });
        }
      });
    } else {
      setSelectedJob(job);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header title */}
      {!selectedJob && (
        <div className="border-b border-slate-150 pb-5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Job review</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Review job submissions before publication.
          </p>
        </div>
      )}

      {/* Dynamic Display Panel details */}
      {selectedJob ? (
        <JobReviewDetails
          job={selectedJob}
          onBack={handleBackToQueue}
          onDecision={handleDecisionSubmit}
        />
      ) : (
        <JobReviewQueue
          jobs={jobs}
          loading={loading}
          error={error}
          totalCount={totalCount}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          onRetry={loadJobQueue}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSelectJob={(j) => setSelectedJob(j)}
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
