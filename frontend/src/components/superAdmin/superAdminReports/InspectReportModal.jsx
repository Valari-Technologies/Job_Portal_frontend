import React, { useState } from 'react';

export default function InspectReportModal({
  report,
  isOpen,
  onClose,
  onDecision,
  isSubmitting
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'actions'
  const [jobAction, setJobAction] = useState('CLOSED');
  const [jobModNotes, setJobModNotes] = useState('');
  const [dismissNotes, setDismissNotes] = useState('');
  const [reviewedNotes, setReviewedNotes] = useState('');
  const [actionError, setActionError] = useState('');

  if (!isOpen || !report) return null;

  const isPending = report.status === 'PENDING';

  const handleMarkReviewed = () => {
    setActionError('');
    onDecision(report.id, {
      action: 'REVIEWED',
      notes: reviewedNotes || 'Report inspected and marked reviewed by Super Admin.'
    });
  };

  const handleDismiss = () => {
    if (!dismissNotes.trim()) {
      setActionError('Please enter a note/reason explaining why this report is dismissed.');
      return;
    }
    setActionError('');
    onDecision(report.id, {
      action: 'REJECTED',
      notes: dismissNotes.trim()
    });
  };

  const handleModerateJob = () => {
    setActionError('');
    onDecision(report.id, {
      action: 'REVIEWED',
      job_action: jobAction,
      job_reason: jobModNotes || `Job moderated due to Report #${report.id}.`,
      notes: jobModNotes || `Linked job set to ${jobAction} during Report #${report.id} review.`
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black border border-amber-200 bg-amber-50 text-amber-700 whitespace-nowrap shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black border border-emerald-200 bg-emerald-50 text-emerald-700 whitespace-nowrap shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Action Taken</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black border border-slate-200 bg-slate-100 text-slate-700 whitespace-nowrap shadow-2xs">
            <span>Dismissed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-600 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-black text-sm">
              #{report.id}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black text-slate-805 tracking-tight">Report Details Inspection</h2>
                {getStatusBadge(report.status)}
              </div>
              <p className="text-xs font-semibold text-slate-450 mt-0.5">
                Submitted on {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-150 px-6 bg-white gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-black border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('actions')}
            className={`py-3 text-xs font-black border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'actions'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Moderator Actions</span>
            {isPending && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {actionError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center justify-between">
              <span>{actionError}</span>
              <button 
                type="button" 
                onClick={() => setActionError('')}
                className="text-red-400 hover:text-red-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === 'overview' ? (
            <div className="space-y-6 text-xs">
              {/* Report Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/70">
                  <span className="text-[10px] font-black text-slate-450 uppercase block">Report ID</span>
                  <span className="text-sm font-black text-slate-800 mt-1 block">#{report.id}</span>
                </div>
                <div className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/70 sm:col-span-2">
                  <span className="text-[10px] font-black text-slate-450 uppercase block">Submitted At</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">
                    {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="p-4 rounded-2xl border border-slate-150 bg-white shadow-2xs space-y-2">
                <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block">Reporter Information</span>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-600 text-xs uppercase">
                    {(report.reported_by_name || report.reported_by_email || 'U').charAt(0)}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      {report.reported_by_name || 'Candidate User'}
                    </div>
                    <div className="font-semibold text-slate-500">
                      {report.reported_by_email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason & Description */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block mb-1.5">Reason for Report</span>
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl font-black text-amber-900 text-sm">
                    {report.reason_display || report.reason}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block mb-1.5">Reporter Detailed Explanation</span>
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-slate-700 font-semibold leading-relaxed whitespace-pre-wrap">
                    {report.description || 'No additional explanation provided by reporter.'}
                  </div>
                </div>
              </div>

              {/* Linked Job Posting */}
              <div className="p-4.5 rounded-2xl border border-teal-150 bg-teal-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider block">Reported Job Listing</span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-teal-200 text-teal-800 font-black text-[11px] shadow-2xs">
                    Status: {report.job_status || 'UNKNOWN'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {report.job_title || `Job #${report.job_id || report.job}`}
                  </h4>
                  <div className="text-slate-600 font-bold mt-0.5">
                    Company: {report.company_name || 'N/A'} (Job ID: #{report.job_id || report.job})
                  </div>
                </div>

                {report.job_locations && report.job_locations.length > 0 && (
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 pt-1 border-t border-teal-100">
                    <svg className="h-3.5 w-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      {report.job_locations.map(l => l.formatted || l.city || l.district).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Decision Log (if existing) */}
              {report.reviewed_by_email && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Moderation Decision Record</span>
                  <div className="font-extrabold text-slate-800">
                    Reviewed by: {report.reviewed_by_name || report.reviewed_by_email}
                  </div>
                  <div className="text-slate-500 font-semibold">
                    Reviewed At: {report.reviewed_at ? new Date(report.reviewed_at).toLocaleString() : 'N/A'}
                  </div>
                  {report.notes && (
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 italic">
                      "{report.notes}"
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Moderator Actions Tab */
            <div className="space-y-6 text-xs">
              {/* Action 1: Mark Reviewed */}
              <div className="p-4.5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Action 1: Mark Reviewed (Action Taken)</h4>
                    <p className="text-slate-500 font-semibold mt-0.5">
                      Verify that report has been looked at and legitimate platform action was taken.
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  value={reviewedNotes}
                  onChange={(e) => setReviewedNotes(e.target.value)}
                  placeholder="Optional moderator notes / remarks..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleMarkReviewed}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  Confirm: Mark Reviewed
                </button>
              </div>

              {/* Action 2: Moderate Linked Job */}
              <div className="p-4.5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3">
                <h4 className="font-black text-slate-900 text-sm">Action 2: Moderate Linked Job Posting</h4>
                <p className="text-slate-500 font-semibold">
                  Change the active status of job "{report.job_title}" directly and resolve this report.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Set Job Status To</label>
                    <select
                      value={jobAction}
                      onChange={(e) => setJobAction(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-black text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="CLOSED">CLOSED (Close job listing)</option>
                      <option value="REJECTED">REJECTED (Reject job listing)</option>
                      <option value="SUSPENDED">SUSPENDED (Suspend job listing)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Moderator Audit Note</label>
                    <input
                      type="text"
                      value={jobModNotes}
                      onChange={(e) => setJobModNotes(e.target.value)}
                      placeholder="Reason for job moderation..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleModerateJob}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  Apply Job Status Change & Resolve Report
                </button>
              </div>

              {/* Action 3: Dismiss Report */}
              <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-black text-slate-900 text-sm">Action 3: Dismiss Report</h4>
                <p className="text-slate-500 font-semibold">
                  Dismiss false positives or non-violating reports with mandatory moderator explanation.
                </p>

                <textarea
                  rows={2}
                  value={dismissNotes}
                  onChange={(e) => setDismissNotes(e.target.value)}
                  placeholder="Enter reason for dismissal (required)..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDismiss}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-black text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  Dismiss Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-150 bg-slate-50/60 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500">
            {isPending ? 'Pending review by Super Admin' : `Resolved: ${report.status}`}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
