import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye, ShieldAlert, ShieldCheck, FileText } from 'lucide-react';
import { fetchAuditEvents } from '../../../services/superAdmin/auditSecurityService';
import AuditEventDetailModal from './AuditEventDetailModal';

export default function AuditActivityTable() {
  const [events, setEvents] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filters
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    const res = await fetchAuditEvents({
      page,
      page_size: pageSize,
      search,
      action: actionFilter,
      outcome: outcomeFilter,
    });

    if (res.success) {
      setEvents(res.results);
      setCount(res.count);
    } else {
      setError(res.message || 'Failed to fetch audit events.');
      setEvents([]);
      setCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [page, actionFilter, outcomeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadEvents();
  };

  const totalPages = Math.ceil(count / pageSize) || 1;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-805">Audit activity</h3>
          <p className="text-xs text-slate-455 font-bold mt-0.5">
            Real-time record of authentications, account creation, and moderation decisions.
          </p>
        </div>

        <button
          onClick={loadEvents}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <form onSubmit={handleSearchSubmit} className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search description, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </form>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="w-full py-2 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN_SUCCESS">Login Success</option>
            <option value="LOGIN_FAILED">Login Failed</option>
            <option value="USER_CREATE">User Create</option>
            <option value="USER_REGISTER">User Register</option>
            <option value="USER_STATUS_CHANGE">Status Change</option>
            <option value="EMPLOYER_VERIFY">Employer Verify</option>
            <option value="JOB_REVIEW">Job Review</option>
            <option value="PASSWORD_RESET_REQUEST">Password Reset Request</option>
            <option value="PASSWORD_RESET_CONFIRM">Password Reset Confirm</option>
          </select>
        </div>

        <div>
          <select
            value={outcomeFilter}
            onChange={(e) => { setOutcomeFilter(e.target.value); setPage(1); }}
            className="w-full py-2 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading audit records...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadEvents}
            className="underline hover:text-rose-800 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <FileText className="w-8 h-8 text-slate-350 mx-auto" />
          <p className="text-xs font-extrabold text-slate-600">No audit activity recorded yet</p>
          <p className="text-[11px] text-slate-400 font-semibold max-w-sm mx-auto">
            Platform actions like account creation, logins, and moderation decisions will appear here automatically.
          </p>
        </div>
      )}

      {/* Table Data */}
      {!loading && !error && events.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-2">Timestamp</th>
                <th className="pb-3 px-2">Actor</th>
                <th className="pb-3 px-2">Action</th>
                <th className="pb-3 px-2">Target</th>
                <th className="pb-3 px-2">Outcome</th>
                <th className="pb-3 px-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => {
                const isSuccess = ev.outcome === 'SUCCESS' || ev.outcome === 'APPROVED';
                return (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-semibold text-slate-500 whitespace-nowrap">
                      {formatDate(ev.timestamp)}
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-700 whitespace-nowrap">
                      <div>{ev.actor_name}</div>
                      {ev.actor_email && ev.actor_name !== ev.actor_email && (
                        <div className="text-[10px] text-slate-400 font-medium">{ev.actor_email}</div>
                      )}
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-800 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                        {ev.action}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-600 font-medium max-w-[180px] truncate">
                      {ev.target_repr || (ev.target_type ? `${ev.target_type} #${ev.target_id || ''}` : '-')}
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {ev.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && events.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-sans">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-bold text-slate-500">
            Page <span className="font-extrabold text-slate-800">{page}</span> of{' '}
            <span className="font-extrabold text-slate-800">{totalPages}</span>
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <AuditEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
