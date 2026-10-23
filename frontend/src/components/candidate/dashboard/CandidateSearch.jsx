import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function CandidateSearch() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/candidate/jobs?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/candidate/jobs');
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full font-sans">
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, skills, companies..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-[#3B00FF] focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/10 shadow-2xs transition-all"
          />
        </div>
        <button
          type="submit"
          aria-label="Filter and search jobs"
          className="shrink-0 h-[48px] w-[48px] rounded-2xl bg-[#3B00FF] hover:bg-[#3000E0] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <SlidersHorizontal className="h-4.5 w-4.5 stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
}
