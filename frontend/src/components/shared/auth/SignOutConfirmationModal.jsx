import { useEffect, useRef } from 'react';
import { LogOut } from 'lucide-react';

export default function SignOutConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isSigningOut, 
  error 
}) {
  const cancelButtonRef = useRef(null);
  const triggerElementRef = useRef(null);

  // Lock background scroll & handle focus + Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Remember trigger element to restore focus on cancel
    triggerElementRef.current = document.activeElement;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus cancel button
    setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSigningOut) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to original trigger
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen, isSigningOut, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      {/* Dark Translucent Viewport Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => !isSigningOut && onClose()}
      />

      {/* Centered Modal Card Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-modal-title"
        aria-describedby="signout-modal-desc"
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 space-y-6 z-10 animate-scaleUp"
      >
        {/* Modal Header & Icon */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <LogOut className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 id="signout-modal-title" className="text-xl font-black text-slate-900 tracking-tight">
              Sign out?
            </h3>
            <p id="signout-modal-desc" className="text-sm font-semibold text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to sign out of your account? You will need to sign in again to continue.
            </p>
          </div>
        </div>

        {/* Error Alert Message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={isSigningOut}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSigningOut}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-extrabold shadow-md shadow-red-600/20 transition-all flex items-center gap-2 cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            <LogOut className="h-4 w-4" />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
