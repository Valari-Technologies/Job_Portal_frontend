import { X, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileCompletionRequiredModal({
  isOpen,
  onClose,
  job,
  currentCompletion = 40,
  requiredCompletion = 70
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onClose();
    navigate('/candidate/profile');
  };

  const percentage = Math.min(100, Math.max(0, Number(currentCompletion) || 0));
  const needed = Math.max(0, requiredCompletion - percentage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-completion-required-title"
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 space-y-6 z-10 animate-scaleUp text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Purple Icon Badge */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#3B00FF] flex items-center justify-center shadow-xs">
          <UserCheck className="h-8 w-8 text-[#3B00FF]" />
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#3B00FF] text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>70% Profile Completion Required</span>
          </div>
          <h3 id="profile-completion-required-title" className="text-xl font-black text-slate-900 tracking-tight">
            Complete Your Profile
          </h3>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed px-2">
            Recruiters require applicants to have at least <strong className="text-slate-900">70% profile completion</strong> before submitting an application.
          </p>
        </div>

        {/* Profile Completion Progress Visual */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-700">Your Profile Strength</span>
            <span className={percentage >= 70 ? 'text-emerald-600' : 'text-[#3B00FF]'}>
              {percentage}% <span className="text-slate-400 font-semibold">/ {requiredCompletion}%</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentage >= 70 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-[#3B00FF]'
              }`}
              style={{ width: `${Math.max(percentage, 8)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Minimum required: {requiredCompletion}%</span>
            <span className="text-amber-700 font-black">
              {needed > 0 ? `+${needed}% needed` : 'Ready to apply'}
            </span>
          </div>
        </div>

        {/* Target Job Info Card (if provided) */}
        {job && (
          <div className="bg-white border border-slate-150 rounded-2xl p-3 text-left space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">APPLYING FOR</span>
            <p className="text-xs font-black text-slate-900 truncate">
              {job.title}
            </p>
            <p className="text-[11px] font-bold text-slate-500 truncate">
              {job.company || job.companyName || 'Employer'} • {job.location || 'Tamil Nadu'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-extrabold text-slate-700 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGoToProfile}
            className="flex-1 py-3 px-5 rounded-xl bg-[#3B00FF] hover:bg-[#3000E0] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <span>Complete Profile</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
