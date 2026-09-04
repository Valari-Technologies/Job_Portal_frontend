import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CandidateJobsHeader() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/candidate/dashboard');
    }
  };

  return (
    <div className="flex items-center gap-3 py-2 font-sans">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back to previous page"
        className="p-2 text-slate-700 hover:text-[#3B00FF] rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer active:scale-95 shrink-0"
      >
        <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
      </button>

      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
        Find Your Dream Job
      </h1>
    </div>
  );
}
