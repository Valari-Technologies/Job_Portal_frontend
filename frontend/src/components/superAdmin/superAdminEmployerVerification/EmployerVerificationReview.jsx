import { useState } from 'react';

export default function EmployerVerificationReview({ request, onBack, onDecision }) {
  const [modalType, setModalType] = useState(null); // 'APPROVE' | 'REJECT' | 'SUSPEND' | null
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (!request) return null;

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    if ((modalType === 'REJECT' || modalType === 'SUSPEND') && !reason.trim()) {
      setActionError(`A valid reason is required to ${modalType.toLowerCase()} this employer.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await onDecision(request.employer_id, {
        decision: modalType === 'APPROVE' ? 'APPROVED' : modalType === 'REJECT' ? 'REJECTED' : 'SUSPENDED',
        reason: reason.trim(),
        notes: notes.trim() || reason.trim(),
      });

      if (res && !res.success) {
        setActionError(res.message || `Failed to submit ${modalType.toLowerCase()} decision.`);
      } else {
        setModalType(null);
        setReason('');
        setNotes('');
        if (onBack) onBack();
      }
    } catch (err) {
      setActionError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Rejected</span>;
      case 'SUSPENDED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Suspended</span>;
      case 'PENDING':
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-150 pb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Verification Queue
        </button>
        <div className="flex items-center space-x-3">
          {getStatusBadge(request.verification_status)}
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Employer Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-black flex items-center justify-center text-slate-900 font-black text-2xl overflow-hidden shrink-0">
                {request.company_logo ? (
                  <img src={request.company_logo} alt={request.company_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  (request.company_name || 'E').substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900">{request.company_name || 'Unnamed Company'}</h2>
                <p className="text-sm font-bold text-slate-500">{request.designation || 'Employer Account'}</p>
                {request.location_details && (
                  <p className="text-xs font-bold text-slate-600">
                    📍 {request.location_details.full_path || request.location_details.name}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Company Overview</h3>
              <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {request.company_description || 'No description provided by employer.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400">Company Email</span>
                <p className="text-sm font-extrabold text-slate-800">{request.company_email || request.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400">Company Phone</span>
                <p className="text-sm font-extrabold text-slate-800">{request.phone || request.company_phone || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400">Website</span>
                <p className="text-sm font-extrabold text-slate-800">
                  {request.company_website ? (
                    <a href={request.company_website} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">
                      {request.company_website}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400">Full Address</span>
                <p className="text-sm font-extrabold text-slate-800">{request.company_address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Decision History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs space-y-4">
            <h3 className="text-base font-black text-slate-800">Verification History Log</h3>
            {(!request.verification_history || request.verification_history.length === 0) ? (
              <p className="text-xs font-semibold text-slate-400">No prior review decisions recorded for this employer.</p>
            ) : (
              <div className="space-y-3 border-l-2 border-slate-200 pl-4">
                {request.verification_history.map((h) => (
                  <div key={h.id} className="relative space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800">{getStatusBadge(h.verification_status)}</span>
                      <span className="font-semibold text-slate-400">
                        {h.reviewed_at ? new Date(h.reviewed_at).toLocaleString() : (h.submitted_at ? new Date(h.submitted_at).toLocaleString() : 'N/A')}
                      </span>
                    </div>
                    {h.reviewed_by_name && (
                      <p className="font-semibold text-slate-500">
                        Reviewed by: <span className="font-bold text-slate-700">{h.reviewed_by_name} ({h.reviewed_by_email})</span>
                      </p>
                    )}
                    {h.rejection_reason && (
                      <div className="p-2.5 bg-rose-50 border border-rose-150 rounded-lg text-rose-800 font-medium">
                        <span className="font-bold">Reason:</span> {h.rejection_reason}
                      </div>
                    )}
                    {h.notes && h.notes !== h.rejection_reason && (
                      <p className="font-semibold text-slate-600">Notes: {h.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions & Meta */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs space-y-5">
            <h3 className="text-base font-black text-slate-800">Account & Trust Status</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-slate-500">Account Owner</span>
                <span className="font-extrabold text-slate-800">{request.employer_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-slate-500">Account Email</span>
                <span className="font-extrabold text-slate-800">{request.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-slate-500">Account Status</span>
                <span className={`font-black px-2 py-0.5 rounded text-[11px] ${request.account_status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {request.account_status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-slate-500">Profile Completeness</span>
                <span className={`font-black px-2 py-0.5 rounded text-[11px] ${request.is_profile_complete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {request.is_profile_complete ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-slate-500">Trust Level</span>
                <span className="font-extrabold text-slate-800">{request.trust_info?.trust_level || 'NEW'}</span>
              </div>
            </div>

            {/* Moderation Actions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Moderation Decision</h4>

              {request.verification_status !== 'APPROVED' && (
                <button
                  onClick={() => setModalType('APPROVE')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  ✓ Approve Employer Verification
                </button>
              )}

              {request.verification_status !== 'REJECTED' && (
                <button
                  onClick={() => setModalType('REJECT')}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  ✕ Reject Verification Request
                </button>
              )}

              {request.verification_status !== 'SUSPENDED' && (
                <button
                  onClick={() => setModalType('SUSPEND')}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  ⚠ Suspend Employer Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Action Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <h3 className="text-xl font-black text-slate-900">
              {modalType === 'APPROVE' && 'Approve Employer Verification'}
              {modalType === 'REJECT' && 'Reject Employer Verification'}
              {modalType === 'SUSPEND' && 'Suspend Employer Account'}
            </h3>

            <p className="text-xs font-bold text-slate-600">
              {modalType === 'APPROVE' && `Are you sure you want to approve "${request.company_name}"? Once approved, this employer can post jobs.`}
              {modalType === 'REJECT' && `Please provide a clear reason for rejecting "${request.company_name}". The reason will be shown to the employer.`}
              {modalType === 'SUSPEND' && `Suspending "${request.company_name}" will deactivate the employer account and prevent job posting.`}
            </p>

            {actionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800">
                {actionError}
              </div>
            )}

            <form onSubmit={handleActionSubmit} className="space-y-4">
              {(modalType === 'REJECT' || modalType === 'SUSPEND') && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Reason (Required)</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter explicit reason for rejection or suspension..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Internal Review Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Optional moderator notes for audit log..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setModalType(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs ${
                    modalType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : modalType === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {submitting ? 'Saving...' : 'Confirm Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
