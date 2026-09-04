import { Link } from 'react-router-dom';
import { Bookmark, Search, MapPin, Sparkles, RefreshCw } from 'lucide-react';

export default function CandidateJobsEmptyState({ tab, hasFilters, onClearFilters }) {
  if (hasFilters) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 font-sans max-w-lg mx-auto my-6 shadow-2xs">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center mx-auto">
          <Search className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900">No jobs match your filters</h3>
          <p className="text-xs font-semibold text-slate-500">
            Try changing or clearing some filters to expand your job search.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/20 hover:bg-[#3000E0] transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>
    );
  }

  if (tab === 'saved') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 font-sans max-w-lg mx-auto my-6 shadow-2xs">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center mx-auto">
          <Bookmark className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900">No saved jobs yet</h3>
          <p className="text-xs font-semibold text-slate-500">
            Jobs you save will appear here for easy access and quick applications.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/20 hover:bg-[#3000E0] transition-all cursor-pointer"
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  if (tab === 'nearby') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 font-sans max-w-lg mx-auto my-6 shadow-2xs">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center mx-auto">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900">No nearby jobs found</h3>
          <p className="text-xs font-semibold text-slate-500">
            Update your preferred location or expand your search criteria to find jobs nearby.
          </p>
        </div>
        <Link
          to="/candidate/profile"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/20"
        >
          Update Location Preferences
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 font-sans max-w-lg mx-auto my-6 shadow-2xs">
      <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center mx-auto">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-slate-900">No recommendations yet</h3>
        <p className="text-xs font-semibold text-slate-500">
          Complete your profile and job preferences to receive better job recommendations.
        </p>
      </div>
      <Link
        to="/candidate/profile"
        className="inline-block px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/20"
      >
        Complete Profile
      </Link>
    </div>
  );
}
