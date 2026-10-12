import { X, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeRequiredModal({
  isOpen,
  onClose,
  job
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUploadResume = () => {
    onClose();
    const resumeUrl = job?.id 
      ? `/candidate/resume?jobId=${job.id}&action=upload` 
      : '/candidate/resume?action=upload';
    navigate(resumeUrl);
  };

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
        aria-labelledby="resume-required-title"
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

        {/* Top Amber Icon Badge */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
          <FileText className="h-8 w-8 text-amber-600" />
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <h3 id="resume-required-title" className="text-xl font-black text-slate-900 tracking-tight">
            Resume Required
          </h3>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed px-2">
            This job requires a resume to apply. You haven’t uploaded a resume yet. Please upload your resume to proceed with your job application.
          </p>
        </div>

        {/* Target Job Info Card */}
        {job && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left space-y-1">
            <p className="text-xs font-black text-slate-900 truncate">
              {job.title}
            </p>
            <p className="text-[11px] font-bold text-slate-500 truncate">
              {job.company || job.companyName} • {job.location || 'Tamil Nadu'}
            </p>
          </div>
        )}

        {/* Action Buttons: Cancel and Upload Resume */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-extrabold text-slate-700 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadResume}
            className="flex-1 py-3 px-5 rounded-xl bg-[#3B00FF] hover:bg-[#3000E0] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}
