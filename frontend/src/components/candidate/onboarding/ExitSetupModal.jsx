import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';

export default function ExitSetupModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExitConfirm = () => {
    onClose();
    // Navigate to candidate login / home route while preserving incomplete onboarding status
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      {/* Dark Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Centered Modal Card Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-setup-title"
        aria-describedby="exit-setup-desc"
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 space-y-6 z-10 animate-scaleUp"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 id="exit-setup-title" className="text-xl font-black text-slate-900 tracking-tight">
                Exit setup?
              </h3>
              <p className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                Incomplete Profile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p id="exit-setup-desc" className="text-xs font-semibold text-slate-600 leading-relaxed">
          Your profile setup is incomplete. You can return and continue your onboarding at any time later.
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
          >
            Continue Setup
          </button>
          <button
            type="button"
            onClick={handleExitConfirm}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-md transition-colors cursor-pointer min-h-[44px]"
          >
            Exit for Now
          </button>
        </div>
      </div>
    </div>
  );
}
