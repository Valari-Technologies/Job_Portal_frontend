import { useEffect, useState, useCallback } from 'react';
import { getRecommendedJobs } from '../../../services/candidate/candidateDashboardService';
import CandidateJobCard from './CandidateJobCard';
import { Link } from 'react-router-dom';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRecommendedJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load recommended jobs:', err);
      setError("We couldn't load recommendations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecommendedJobs();
        if (isMounted) {
          setJobs(data || []);
        }
      } catch (err) {
        console.error('Failed to load recommended jobs:', err);
        if (isMounted) {
          setError("We couldn't load recommendations.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section aria-label="Recommended jobs for you" className="space-y-4 font-sans">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Recommended for You
        </h2>
        <Link
          to="/candidate/jobs"
          className="text-xs font-black text-[#3B00FF] hover:underline cursor-pointer"
        >
          See all
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-xs font-bold text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchJobs}
            className="px-4 py-2 rounded-xl bg-white border border-red-200 text-xs font-extrabold text-red-700 hover:bg-red-50 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
          <h3 className="text-sm font-black text-slate-900">No recommendations yet</h3>
          <p className="text-xs font-semibold text-slate-500">
            Complete your profile and job preferences to receive better recommendations.
          </p>
          <Link
            to="/candidate/profile"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-xs"
          >
            Complete Profile
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Grid Layout (2 columns) */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-5">
            {jobs.map(job => (
              <CandidateJobCard key={job.id} job={job} onStatusChange={fetchJobs} />
            ))}
          </div>

          {/* Mobile Touch-Friendly Horizontal Carousel with Scroll-Snap */}
          <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none w-full">
            {jobs.map(job => (
              <div key={job.id} className="w-[82vw] max-w-[300px] shrink-0 snap-start">
                <CandidateJobCard job={job} onStatusChange={fetchJobs} />
              </div>
            ))}
          </div>
        </>
      )}

    </section>
  );
}
