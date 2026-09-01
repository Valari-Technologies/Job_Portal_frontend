import { useEffect, useRef } from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';

export default function AdminLogoutConfirmationModal({ isOpen, onClose, onConfirm, isLoggingOut, error }) {
  const modalRef = useRef(null);

  // Trap focus and handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
      {/* Dark translucent backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Centered Modal Content Card */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-desc"
        className="relative bg-white rounded-lg border border-slate-200 shadow-2xl p-6 max-w-sm w-full mx-4 space-y-5 animate-scaleUp z-10"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 id="logout-modal-title" className="text-[16px] font-bold text-slate-900">Log out?</h3>
            <p id="logout-modal-desc" className="text-[13px] font-normal text-slate-500 mt-0.5">
              Are you sure you want to log out of your Admin account?
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-150 text-[12px] font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="rounded-lg border border-slate-200 px-4.5 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2.5 text-[13px] font-semibold transition-colors flex items-center gap-2 cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
