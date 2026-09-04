import { useState, useEffect, useRef } from 'react';
import { suggestSpecialization } from '../../../services/candidate/candidateOnboardingService';
import { Lightbulb, Check, X, Send } from 'lucide-react';

export default function SuggestSpecializationModal({ isOpen, onClose, selectedIndustry }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    setName('');
    setDescription('');
    setSuccessMsg(null);
    setErrorMsg(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a specialization name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await suggestSpecialization({
        industryId: selectedIndustry?.id || 'general',
        name,
        description
      });
      setSuccessMsg('Thank you! Your specialization suggestion has been submitted for Admin review.');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to submit suggestion. Please try again.');
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

      {/* Modal Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggest-modal-title"
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-4 space-y-6 z-10 animate-scaleUp"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-150 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 id="suggest-modal-title" className="text-lg font-black text-slate-900 tracking-tight">
                Suggest a Specialization
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                For {selectedIndustry ? selectedIndustry.name : 'your industry'}
              </p>
            </div>
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

        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="spec_name" className="text-xs font-extrabold text-slate-700">
                Suggested Specialization Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={inputRef}
                id="spec_name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cloud Security Architect"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="spec_desc" className="text-xs font-extrabold text-slate-700">
                Description / Context (Optional)
              </label>
              <textarea
                id="spec_desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the key skills or role direction..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 resize-none"
              />
            </div>

            <p className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-150 rounded-xl p-3 leading-relaxed">
              Note: System taxonomy is managed centrally. Suggestions are submitted for review by authorized platform administrators and will not immediately change production taxonomy.
            </p>

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
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Suggestion'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
