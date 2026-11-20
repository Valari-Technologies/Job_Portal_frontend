import { useCandidateUser } from '../../../context/CandidateUserContext';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CandidateProfileCompletion() {
  const { profile } = useCandidateUser();
  const percentage = Math.min(100, Math.max(0, profile?.completionPercentage ?? 0));

  return (
    <div className="rounded-3xl border border-indigo-150 bg-[#EEF2FF] p-5 sm:p-6 shadow-xs font-sans space-y-4">
      
      {/* Top Content Row */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-[#3B00FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#3B00FF]/20">
          <Rocket className="h-6 w-6 stroke-[2.2]" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight">
            Complete {percentage}% of your profile
          </h3>
          <p className="text-xs font-extrabold text-slate-500 leading-relaxed">
            Stand out to recruiters and get better job recommendations
          </p>
        </div>
      </div>

      {/* Progress Bar Row */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-black text-[#3B00FF]">
          <div 
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion progress"
            className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden mr-3"
          >
            <div 
              className="h-full bg-[#3B00FF] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="shrink-0">{percentage}%</span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        to="/candidate/profile"
        className="w-full mt-2 py-3 rounded-xl border-2 border-[#3B00FF] bg-white text-[#3B00FF] hover:bg-[#3B00FF] hover:text-white transition-all text-xs font-black flex items-center justify-center shadow-xs cursor-pointer active:scale-98"
      >
        <span>{percentage === 100 ? 'View Profile' : 'Complete Profile'}</span>
      </Link>
    </div>
  );
}
