import { useState } from 'react';

export function EmployerVerificationQueue({
  requests = [],
  loading = false,
  error = null,
  totalCount = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  onRetry,
  statusFilter = 'PENDING',
  onStatusFilterChange,
  searchQuery = '',
  onSearchChange,
  onSelectRequest,
  onQuickAction,
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(localSearch);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      case 'SUSPENDED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Suspended</span>;
      case 'PENDING':
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">Pending Review</span>;
    }
  };

  const statusTabs = [
    { id: 'PENDING', label: 'Pending Review' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'SUSPENDED', label: 'Suspended' },
    { id: 'ALL', label: 'All Requests' },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-2xs space-y-4">
        {/* Status Tabs */}
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

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by company name, employer email, phone, location..."
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
          <p className="text-sm font-bold text-slate-500">Loading employer verification queue...</p>
        </div>
      )}

      {/* Empty States */}
      {!loading && !error && requests.length === 0 && (
        <div className="rounded-2xl border border-slate-150 bg-white p-12 text-center shadow-2xs max-w-3xl mx-auto">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800">
              {searchQuery || statusFilter !== 'ALL'
                ? "No matching verification requests"
                : "No verification requests yet"}
            </h3>
            <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
              {searchQuery || statusFilter !== 'ALL'
                ? "There are no employer verification requests matching your selected status filter or search query."
                : "Employer verification requests will appear here after employers register and submit their company information for review."}
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

      {/* Requests Queue List */}
      {!loading && !error && requests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Showing {requests.length} of {totalCount} verification request(s)</span>
          </div>

          <div className="grid gap-4">
            {requests.map((r) => {
              const latestVer = r.latest_verification || {};
              const submittedDate = latestVer.submitted_at
                ? new Date(latestVer.submitted_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                : (r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A');

              return (
                <div
                  key={r.employer_id}
                  className="p-5 bg-white border border-slate-150 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      {/* Logo or placeholder */}
                      <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-black text-lg overflow-hidden shrink-0">
                        {r.company_logo ? (
                          <img src={r.company_logo} alt={r.company_name} className="w-full h-full object-cover" />
                        ) : (
                          (r.company_name || 'E').substring(0, 2).toUpperCase()
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-black text-slate-900">
                            {r.company_name || 'Unnamed Company'}
                          </h4>
                          {getStatusBadge(r.verification_status)}
                          {r.account_status === 'SUSPENDED' && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800">
                              Account Suspended
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-slate-600">
                          {r.employer_name} ({r.email})
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 pt-1">
                          {r.phone && <span>📞 {r.phone}</span>}
                          {r.company_website && (
                            <a href={r.company_website} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">
                              🌐 {r.company_website}
                            </a>
                          )}
                          {r.location_details && (
                            <span>📍 {r.location_details.full_path || r.location_details.name}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      <p className="text-xs font-bold text-slate-400">
                        Submitted: <span className="text-slate-700">{submittedDate}</span>
                      </p>
                      <p className="text-xs font-semibold text-slate-400">
                        Trust Level: <span className="font-bold text-slate-700">{r.trust_info?.trust_level || 'NEW'}</span>
                      </p>
                      {r.is_profile_complete ? (
                        <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ Profile Complete
                        </span>
                      ) : (
                        <span className="inline-block text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          ⚠ Incomplete Info
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rejection / Decision Note Preview if present */}
                  {latestVer.rejection_reason && (
                    <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-xs text-rose-800 space-y-1">
                      <p className="font-bold">Prior Rejection Reason:</p>
                      <p className="font-semibold">{latestVer.rejection_reason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-3">
                    <div className="flex items-center space-x-2">
                      {r.verification_status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => onQuickAction && onQuickAction(r, 'APPROVE')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onQuickAction && onQuickAction(r, 'REJECT')}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.verification_status !== 'SUSPENDED' && (
                        <button
                          onClick={() => onQuickAction && onQuickAction(r, 'SUSPEND')}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
                        >
                          Suspend Account
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectRequest && onSelectRequest(r)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Review & Details →
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

export default EmployerVerificationQueue;
