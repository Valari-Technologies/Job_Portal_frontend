import { useState } from 'react';

export default function ReportDetailsPanel({ 
  selectedReport, 
  onDecision,
  onOpenInspectModal,
  isSubmitting 
}) {
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [showJobModModal, setShowJobModModal] = useState(false);
  const [dismissNotes, setDismissNotes] = useState('');
  const [jobAction, setJobAction] = useState('CLOSED');
  const [jobModNotes, setJobModNotes] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [actionError, setActionError] = useState('');

  if (!selectedReport) {
    return (
      <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs text-center py-12 space-y-4">
        <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-extrabold text-slate-800">No report selected</h4>
          <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-normal">
            Select a reported job from the table to inspect details and perform moderation actions.
          </p>
        </div>
      </div>
    );
  }

  const handleMarkReviewed = () => {
    setActionError('');
    onDecision(selectedReport.id, {
      action: 'REVIEWED',
      notes: generalNotes || 'Report reviewed by moderator.'
    });
  };

  const handleConfirmDismiss = () => {
    if (!dismissNotes.trim()) {
      setActionError('Please enter an explanation for dismissing this report.');
      return;
    }
    setActionError('');
    onDecision(selectedReport.id, {
      action: 'REJECTED',
      notes: dismissNotes.trim()
    });
    setShowDismissModal(false);
    setDismissNotes('');
  };

  const handleConfirmJobModeration = () => {
    setActionError('');
    onDecision(selectedReport.id, {
      action: 'REVIEWED',
      job_action: jobAction,
      job_reason: jobModNotes || 'Job moderated due to user report.',
      notes: jobModNotes || `Linked job set to ${jobAction} during report review.`
    });
    setShowJobModModal(false);
    setJobModNotes('');
  };

  const isPending = selectedReport.status === 'PENDING';

  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-extrabold text-slate-800">Report Details</h3>
          {onOpenInspectModal && (
            <button
              type="button"
              onClick={() => onOpenInspectModal(selectedReport)}
              title="Open full inspector modal"
              className="p-1 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
          selectedReport.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          selectedReport.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {selectedReport.status === 'PENDING' ? 'Pending Review' :
           selectedReport.status === 'REVIEWED' ? 'Action Taken' : 'Dismissed'}
        </span>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
          {actionError}
        </div>
      )}

      {/* Report Info */}
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-150">
          <div>
            <span className="text-[10px] font-black text-slate-450 uppercase block">Report ID</span>
            <span className="font-extrabold text-slate-800">#{selectedReport.id}</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-450 uppercase block">Submitted At</span>
            <span className="font-extrabold text-slate-800">
              {selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black text-slate-450 uppercase block mb-1">Reporter</span>
          <div className="font-bold text-slate-800">{selectedReport.reported_by_name || 'Candidate User'}</div>
          <div className="text-slate-500 font-medium">{selectedReport.reported_by_email}</div>
        </div>

        <div>
          <span className="text-[10px] font-black text-slate-450 uppercase block mb-1">Reason for Report</span>
          <div className="p-2.5 bg-orange-50/50 border border-orange-200/60 rounded-xl font-bold text-orange-900">
            {selectedReport.reason_display || selectedReport.reason}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black text-slate-450 uppercase block mb-1">Description</span>
          <p className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-slate-700 font-medium leading-relaxed">
            {selectedReport.description || 'No detailed description provided by reporter.'}
          </p>
        </div>
      </div>

      {/* Linked Job Info */}
      <div className="border-t border-slate-150 pt-4 space-y-3 text-xs">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Linked Job Posting</span>

        <div className="p-3 bg-teal-50/30 border border-teal-150 rounded-xl space-y-2">
          <div className="font-extrabold text-slate-900 text-sm">{selectedReport.job_title || `Job #${selectedReport.job_id || selectedReport.job}`}</div>
          <div className="flex flex-wrap items-center justify-between text-slate-600 font-semibold gap-2">
            <span>Company: {selectedReport.company_name || 'N/A'}</span>
            <span className="px-2 py-0.5 rounded bg-white border border-teal-200 text-teal-800 font-extrabold text-[10px]">
              Status: {selectedReport.job_status || 'UNKNOWN'}
            </span>
          </div>
          {selectedReport.job_locations && selectedReport.job_locations.length > 0 && (
            <div className="text-slate-500 text-[11px]">
              Location: {selectedReport.job_locations.map(l => l.formatted || l.city || l.district).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Existing Decision / Note Info */}
      {selectedReport.reviewed_by_email && (
        <div className="border-t border-slate-150 pt-4 space-y-2 text-xs">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Moderator Decision</span>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-800">Reviewed by: {selectedReport.reviewed_by_email}</div>
            <div className="text-slate-500">Time: {selectedReport.reviewed_at ? new Date(selectedReport.reviewed_at).toLocaleString() : 'N/A'}</div>
            {selectedReport.notes && <div className="text-slate-700 font-medium italic mt-1">"{selectedReport.notes}"</div>}
          </div>
        </div>
      )}

      {/* Moderation Actions for PENDING report */}
      {isPending && (
        <div className="border-t border-slate-150 pt-4 space-y-3">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Moderator Actions</span>
          
          <div className="space-y-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleMarkReviewed}
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              Mark Reviewed (Action Taken)
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowJobModModal(true)}
              className="w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              Moderate Linked Job Posting
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowDismissModal(true)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              Dismiss Report
            </button>
          </div>
        </div>
      )}

      {/* Modal for Dismiss Report Explanation */}
      {showDismissModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">Dismiss Job Report</h4>
            <p className="text-xs font-semibold text-slate-500">
              Please provide a short explanation for dismissing report #{selectedReport.id}.
            </p>

            <textarea
              rows={3}
              value={dismissNotes}
              onChange={(e) => setDismissNotes(e.target.value)}
              placeholder="Reason for dismissal..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDismissModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDismiss}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-extrabold text-white hover:bg-slate-900"
              >
                Confirm Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Linked Job Moderation */}
      {showJobModModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">Moderate Linked Job Posting</h4>
            <p className="text-xs font-semibold text-slate-500">
              Change the status of job '{selectedReport.job_title}' and resolve report #{selectedReport.id}.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Job Status</label>
              <select
                value={jobAction}
                onChange={(e) => setJobAction(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-extrabold text-slate-800 focus:outline-none"
              >
                <option value="CLOSED">CLOSED (Close job listing)</option>
                <option value="REJECTED">REJECTED (Reject job listing)</option>
                <option value="SUSPENDED">SUSPENDED (Suspend job listing)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Reason / Moderation Notes</label>
              <textarea
                rows={3}
                value={jobModNotes}
                onChange={(e) => setJobModNotes(e.target.value)}
                placeholder="Reason for job moderation action..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowJobModModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmJobModeration}
                className="px-4 py-2 rounded-xl bg-amber-600 text-xs font-extrabold text-white hover:bg-amber-700"
              >
                Apply Job Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
