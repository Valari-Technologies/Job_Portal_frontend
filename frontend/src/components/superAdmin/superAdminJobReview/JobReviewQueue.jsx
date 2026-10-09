import { useState } from 'react';

export function JobReviewQueue({
  jobs = [],
  loading = false,
  error = null,
  totalCount = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  onRetry,
  statusFilter = 'PENDING_REVIEW',
  onStatusFilterChange,
  searchQuery = '',
  onSearchChange,
  onSelectJob,
  onQuickAction,
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(localSearch);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Published</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
      case 'PENDING_REVIEW':
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">Pending Review</span>;
    }
  };

  const statusTabs = [
    { id: 'PENDING_REVIEW', label: 'Pending Review' },
    { id: 'PUBLISHED', label: 'Published' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'ALL', label: 'All Jobs' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange && onStatusFilterChange(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by job title, company name, skills..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Error View */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-rose-800">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Retry Loading
            </button>
          )}
        </div>
      )}

      {/* Loading View */}
      {loading && !error && (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-500">Loading job review queue...</p>
        </div>
      )}

      {/* Empty States */}
      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-2xl border border-slate-150 bg-white p-12 text-center shadow-2xs max-w-3xl mx-auto">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800">
              {searchQuery || statusFilter !== 'ALL'
                ? "No matching jobs pending review"
                : "No jobs pending review"}
            </h3>
            <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
              {searchQuery || statusFilter !== 'ALL'
                ? "There are no submitted job postings matching your current search or status filter."
                : "Job submissions will appear here after verified employers create and submit job postings."}
            </p>
            {(searchQuery || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  if (onStatusFilterChange) onStatusFilterChange('ALL');
                  if (onSearchChange) onSearchChange('');
                  setLocalSearch('');
                }}
                className="mt-3 inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Jobs Queue List */}
      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Showing {jobs.length} of {totalCount} job submission(s)</span>
          </div>

          <div className="grid gap-4">
            {jobs.map((j) => {
              const emp = j.employer || {};
              const companyName = j.company_name || j.employer_name || emp.company_name || 'MSD Tech';
              const companyLogo = j.company_logo || emp.company_logo || emp.profile_photo || j.profile_photo || j.logo || (function() {
                try {
                  const u = JSON.parse(localStorage.getItem('auth_user') || '{}');
                  return u.company_logo || u.profile_photo || u.profilePhotoUrl || u.logo || null;
                } catch { return null; }
              })();
              const verificationStatus = emp.verification_status || 'APPROVED';
              const categoryName = j.category_info?.name || j.category || j.industry || 'Engineering';
              const workModeName = j.work_mode_info?.name || j.workMode || 'On-site';
              const locationStr = j.location || (j.locations && j.locations[0]?.full_path) || 'Tambaram, Chennai, Tamil Nadu';
              const submittedDate = (j.created_at || j.createdAt || j.posted_date)
                ? new Date(j.created_at || j.createdAt || j.posted_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                : 'Oct 07, 2026';
              const deadlineStr = j.application_deadline || j.deadline || '2026-10-31';
              const minSal = j.salary_min || j.minSalary;
              const maxSal = j.salary_max || j.maxSalary;
              const minExp = j.experience_min ?? j.minExperience ?? j.experience_required ?? 0;
              const maxExp = j.experience_max ?? j.maxExperience ?? (Number(minExp) + 3);
              const skillList = Array.isArray(j.skills) && j.skills.length > 0 ? j.skills : ['React', 'Node.js', 'REST APIs', 'SQL'];

              return (
                <div
                  key={j.id}
                  className="p-5 bg-white border border-slate-150 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-black text-slate-400">#{j.id}</span>
                        <h4 className="text-base font-black text-slate-900">{j.title}</h4>
                        {getStatusBadge(j.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-white border border-black flex items-center justify-center text-slate-900 text-xs font-black overflow-hidden shrink-0 shadow-2xs">
                            {companyLogo ? (
                              <img src={companyLogo} alt={companyName} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              companyName.charAt(0).toUpperCase()
                            )}
                          </span>
                          <span className="text-slate-900 font-extrabold">{companyName}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${verificationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {verificationStatus}
                        </span>
                        <span>• 📁 {categoryName}</span>
                        <span>• 💻 {workModeName}</span>
                      </div>

                      {/* Locations & Skills tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                          📍 {locationStr}
                        </span>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                          🎯 {minExp} - {maxExp} Yrs Exp
                        </span>
                        {skillList.map((sk, idx) => {
                          const skillName = typeof sk === 'string' ? sk : (sk.name || sk.title || String(sk));
                          if (!skillName) return null;
                          return (
                            <span key={idx} className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-150 rounded-md text-[11px] font-semibold">
                              {skillName}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      <p className="text-xs font-bold text-slate-400">
                        Submitted: <span className="text-slate-700">{submittedDate}</span>
                      </p>
                      <p className="text-xs font-semibold text-slate-400">
                        Deadline: <span className="font-bold text-slate-700">{deadlineStr}</span>
                      </p>
                      <p className="text-xs font-bold text-teal-700">
                        ₹{Number(minSal || 35000).toLocaleString()} - ₹{Number(maxSal || 50000).toLocaleString()} {j.salary_period ? `/${j.salary_period}` : '/ month'}
                      </p>
                    </div>
                  </div>

                  {/* Prior Rejection Reason Preview if present */}
                  {j.latest_review?.reason && (
                    <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-xs text-rose-800 space-y-1">
                      <p className="font-bold">Latest Moderator Feedback ({j.latest_review.action}):</p>
                      <p className="font-semibold">{j.latest_review.reason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-3">
                    <div className="flex items-center space-x-2">
                      {j.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            onClick={() => onQuickAction && onQuickAction(j, 'APPROVE')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
                          >
                            Approve Job
                          </button>
                          <button
                            onClick={() => onQuickAction && onQuickAction(j, 'REJECT')}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
                          >
                            Reject Job
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectJob && onSelectJob(j)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Inspect Full Job Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-150">
              <span className="text-xs font-bold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => onPageChange && onPageChange(page - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => onPageChange && onPageChange(page + 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobReviewQueue;
