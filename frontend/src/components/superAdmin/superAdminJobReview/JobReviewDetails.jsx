import { useState } from 'react';

export default function JobReviewDetails({ job, onBack, onDecision }) {
  const [modalType, setModalType] = useState(null); // 'APPROVE' | 'REJECT' | null
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (!job) return null;

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    if (modalType === 'REJECT' && !reason.trim()) {
      setActionError('A valid rejection reason is required to reject this job submission.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await onDecision(job.id, {
        action: modalType === 'APPROVE' ? 'APPROVED' : 'REJECTED',
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
      case 'PUBLISHED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Published</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Rejected</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">Closed</span>;
      case 'PENDING_REVIEW':
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">Pending Review</span>;
    }
  };

  const emp = job.employer || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-150 pb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Job Review Queue
        </button>
        <div className="flex items-center space-x-3">
          {getStatusBadge(job.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-black text-slate-400">
                <span>JOB ID #{job.id}</span>
                <span>•</span>
                <span>Submitted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 pt-1">
                {job.category_info?.name && <span className="px-3 py-1 bg-slate-100 rounded-lg">📁 {job.category_info.name}</span>}
                {job.work_mode_info?.name && <span className="px-3 py-1 bg-slate-100 rounded-lg">💻 {job.work_mode_info.name}</span>}
                {job.application_type && <span className="px-3 py-1 bg-slate-100 rounded-lg">📋 {job.application_type}</span>}
              </div>
            </div>

            {/* Salary & Experience metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400">Salary Range</span>
                <p className="font-extrabold text-slate-800 text-sm">
                  {(job.salary_min || job.salary_max) ? (
                    `₹${Number(job.salary_min || 0).toLocaleString()} - ₹${Number(job.salary_max || 0).toLocaleString()} ${job.salary_period ? `/${job.salary_period}` : ''}`
                  ) : 'Not Disclosed'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-400">Experience Required</span>
                <p className="font-extrabold text-slate-800 text-sm">
                  {job.experience_min !== null && job.experience_max !== null
                    ? `${job.experience_min} - ${job.experience_max} Years`
                    : `${job.experience_required || 0}+ Years`}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-400">Application Deadline</span>
                <p className="font-extrabold text-slate-800 text-sm">
                  {job.application_deadline || 'No Deadline Set'}
                </p>
              </div>
            </div>

            {/* Locations */}
            {job.locations && job.locations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Job Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {job.locations.map((loc) => (
                    <span key={loc.id} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold">
                      📍 {loc.full_path || loc.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((sk) => (
                    <span key={sk.id} className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold">
                      ⚡ {sk.name} {sk.is_required ? '(Required)' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Responsibilities */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Job Description</h3>
              <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.responsibilities && (
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Key Responsibilities</h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            )}

            {job.education_requirement && (
              <div className="border-t border-slate-100 pt-5 space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Education Requirement</h3>
                <p className="text-sm font-bold text-slate-800">{job.education_requirement}</p>
              </div>
            )}
          </div>

          {/* Job Review Decision History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs space-y-4">
            <h3 className="text-base font-black text-slate-800">Job Moderation History</h3>
            {(!job.review_history || job.review_history.length === 0) ? (
              <p className="text-xs font-semibold text-slate-400">No prior review decisions recorded for this job.</p>
            ) : (
              <div className="space-y-3 border-l-2 border-slate-200 pl-4">
                {job.review_history.map((h) => (
                  <div key={h.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-extrabold px-2 py-0.5 rounded ${h.action === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {h.action}
                      </span>
                      <span className="font-semibold text-slate-400">
                        {h.created_at ? new Date(h.created_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    {h.reviewer_name && (
                      <p className="font-semibold text-slate-500">
                        Moderator: <span className="font-bold text-slate-700">{h.reviewer_name} ({h.reviewer_email})</span>
                      </p>
                    )}
                    {h.reason && (
                      <div className="p-2.5 bg-rose-50 border border-rose-150 rounded-lg text-rose-800 font-medium">
                        <span className="font-bold">Reason:</span> {h.reason}
                      </div>
                    )}
                    {h.notes && h.notes !== h.reason && (
                      <p className="font-semibold text-slate-600">Notes: {h.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Employer Information & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs space-y-5">
            <h3 className="text-base font-black text-slate-800">Employer Information</h3>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-black text-lg shrink-0 overflow-hidden">
                {emp.company_logo ? (
                  <img src={emp.company_logo} alt={emp.company_name} className="w-full h-full object-cover" />
                ) : (
                  (emp.company_name || 'E').substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900">{emp.company_name || 'Unnamed Employer'}</h4>
                <p className="text-xs font-bold text-slate-500">{emp.contact_name}</p>
                <p className="text-xs font-medium text-slate-400">{emp.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center py-1.5">
                <span className="font-bold text-slate-500">Employer Verification</span>
                <span className={`font-black px-2 py-0.5 rounded text-[11px] ${emp.verification_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {emp.verification_status || 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="font-bold text-slate-500">Account Status</span>
                <span className={`font-black px-2 py-0.5 rounded text-[11px] ${emp.account_status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {emp.account_status || 'ACTIVE'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="font-bold text-slate-500">Employer Trust Level</span>
                <span className="font-extrabold text-slate-800">{emp.trust_level || 'NEW'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Moderation Decision</h4>

              {job.status !== 'PUBLISHED' && (
                <button
                  onClick={() => setModalType('APPROVE')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  ✓ Approve & Publish Job
                </button>
              )}

              {job.status !== 'REJECTED' && (
                <button
                  onClick={() => setModalType('REJECT')}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  ✕ Reject Job Submission
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <h3 className="text-xl font-black text-slate-900">
              {modalType === 'APPROVE' ? 'Approve & Publish Job' : 'Reject Job Submission'}
            </h3>

            <p className="text-xs font-bold text-slate-600">
              {modalType === 'APPROVE'
                ? `Are you sure you want to approve "${job.title}"? Once approved, the job will become publicly visible.`
                : `Please provide a clear reason for rejecting "${job.title}". The feedback will be shared with the employer for resubmission.`}
            </p>

            {actionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800">
                {actionError}
              </div>
            )}

            <form onSubmit={handleActionSubmit} className="space-y-4">
              {modalType === 'REJECT' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Rejection Reason (Required)</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide explicit feedback on why this job submission was rejected..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Moderator Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Optional internal notes..."
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
                    modalType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
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
