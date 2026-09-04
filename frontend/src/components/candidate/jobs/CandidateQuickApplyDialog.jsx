import { useState } from 'react';
import { X, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CandidateQuickApplyDialog({
  isOpen,
  onClose,
  job,
  onConfirmApply
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen || !job) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await onConfirmApply(job.id);
      if (res && res.success) {
        onClose();
      } else {
        setErrorMsg(res?.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Content */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 space-y-6 z-10 animate-scaleUp"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-150 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 fill-[#3B00FF]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Quick Apply</h3>
              <p className="text-xs font-bold text-slate-500">{job.company}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <h4 className="text-sm font-black text-slate-900">{job.title}</h4>
          <div className="text-xs font-semibold text-slate-500 space-y-1">
            <p>📍 Location: <span className="text-slate-800 font-bold">{job.location}</span></p>
            <p>💼 Work Mode: <span className="text-slate-800 font-bold">{job.workMode || 'Full-Time'}</span></p>
          </div>
          <p className="text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-200">
            Your candidate profile and default resume will be attached to this application.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-50 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#3B00FF] hover:bg-[#3000E0] shadow-md shadow-[#3B00FF]/20 flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
