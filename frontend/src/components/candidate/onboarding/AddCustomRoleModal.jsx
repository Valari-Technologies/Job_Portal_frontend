import { useState, useEffect, useRef, useCallback } from 'react';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { X, ArrowRight, AlertCircle } from 'lucide-react';

export default function AddCustomRoleModal({ isOpen, onClose }) {
  const { selectCustomSpecializationAndContinue, specializations, industryPayload } = useCandidateOnboarding();
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef(null);

  const handleClose = useCallback(() => {
    setTitle('');
    setErrorMsg(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting, handleClose]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMsg('Please enter a specialization title.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setErrorMsg('Specialization title must not exceed 100 characters.');
      return;
    }

    // Check for case-insensitive duplicate against current industry specializations
    const isDuplicate = specializations.some(
      spec => spec.name.toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMsg('This specialization already exists. Select it from the available options.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await selectCustomSpecializationAndContinue(trimmedTitle);
      handleClose();
    } catch (err) {
      console.error('Failed to submit custom specialization:', err);
      setErrorMsg("We couldn't save your specialization. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => !isSubmitting && handleClose()}
      />

      {/* Centered Modal Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-specialization-title"
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 space-y-6 z-10 animate-scaleUp"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-150 pb-4">
          <div>
            <h3 id="custom-specialization-title" className="text-xl font-black text-slate-900 tracking-tight">
              Add Custom Specialization
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Specify specialization for {industryPayload?.title || 'selected industry'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Single input field: Specialization Title */}
          <div className="space-y-1.5">
            <label htmlFor="custom_spec_title" className="text-xs font-extrabold text-slate-700">
              Specialization Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={inputRef}
              id="custom_spec_title"
              type="text"
              value={title}
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={errorMsg ? "custom_spec_error" : undefined}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter specialization title"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#3B00FF] focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white flex items-center gap-2 transition-all min-h-[44px] ${
                title.trim() && !isSubmitting
                  ? 'bg-[#3B00FF] hover:bg-[#3000E0] shadow-md shadow-[#3B00FF]/25 cursor-pointer active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{isSubmitting ? 'Saving...' : 'Add & Continue'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

