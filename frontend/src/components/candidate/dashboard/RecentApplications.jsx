import { useEffect, useState } from 'react';
import { getCandidateApplications, getStatusConfig } from '../../../services/candidate/candidateApplicationsService';
import { Building2, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const res = await getCandidateApplications({ page: 1, pageSize: 5 });
        if (isMounted) {
          setApplications(res.applications || []);
        }
      } catch (err) {
        console.error('Failed to load recent applications:', err);
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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs font-sans space-y-4">
      
      {/* Header */}
      <h3 className="text-xl font-black text-slate-900 tracking-tight">
        Recent Applications
      </h3>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(n => (
            <div key={n} className="h-16 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <FolderKanban className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-xs font-extrabold text-slate-500">No applications yet</p>
          <p className="text-[11px] font-semibold text-slate-400">Jobs you apply for will appear here.</p>
          <Link
            to="/candidate/jobs"
            className="inline-block pt-1 text-xs font-black text-[#3B00FF] hover:underline"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.slice(0, 3).map((app) => {
            const config = getStatusConfig(app.status);
            return (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-[#3B00FF] font-black">
                    {app.company?.initials || 'C'}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {app.jobTitle}
                    </h4>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1 truncate">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      <span>{app.companyName}</span>
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 border ${config.badgeClass}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Footer Link */}
      <div className="pt-2 text-center border-t border-slate-150">
        <Link
          to="/candidate/applications"
          className="text-xs font-extrabold text-[#3B00FF] hover:underline inline-block"
        >
          View all applications
        </Link>
      </div>

    </div>
  );
}
