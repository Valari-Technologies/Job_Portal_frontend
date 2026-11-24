import React, { useState, useEffect } from 'react';
import { UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAccessReviews } from '../../../services/superAdmin/auditSecurityService';

export default function SecurityStatusPanel() {
  const [accessUsers, setAccessUsers] = useState([]);
  const [accessCount, setAccessCount] = useState(0);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessError, setAccessError] = useState(null);
  const [accessPage, setAccessPage] = useState(1);
  const accessPageSize = 6;

  const loadAccess = async () => {
    setAccessLoading(true);
    setAccessError(null);
    const res = await fetchAccessReviews({ page: accessPage, page_size: accessPageSize });
    if (res.success) {
      setAccessUsers(res.results);
      setAccessCount(res.count);
    } else {
      setAccessError(res.message);
    }
    setAccessLoading(false);
  };

  useEffect(() => {
    loadAccess();
  }, [accessPage]);

  const accessTotalPages = Math.ceil(accessCount / accessPageSize) || 1;

  const getRoleBadgeClass = (role) => {
    if (role === 'SUPER_ADMIN') {
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    }
    if (role === 'ADMIN') {
      return 'bg-teal-50 text-teal-700 border border-teal-200';
    }
    if (role === 'HR') {
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Access reviews</h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Read-only review of accounts with privileged access.
            </p>
          </div>
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-start">
        {accessLoading && (
          <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading privileged accounts...
          </div>
        )}

        {!accessLoading && accessError && (
          <div className="p-3 my-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold">
            {accessError}
          </div>
        )}

        {!accessLoading && !accessError && accessUsers.length === 0 && (
          <p className="text-xs text-slate-400 font-semibold text-center py-12">
            No privileged accounts found.
          </p>
        )}

        {!accessLoading && !accessError && accessUsers.length > 0 && (
          <div className="divide-y divide-slate-100">
            {accessUsers.map((u) => {
              const creator = u.created_by_info;
              const assignedRoles = u.roles_assigned || [];
              return (
                <div key={u.id} className="py-2.5 first:pt-2 last:pb-2 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-800 text-xs truncate">{u.name}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${getRoleBadgeClass(u.role)}`}>
                      {u.role}
                    </span>
                  </div>

                  <div className="text-[11px] font-medium text-slate-500 truncate">{u.email}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Status: <strong className="text-emerald-600 font-bold">{u.status}</strong></span>
                    {creator ? (
                      <span className="truncate max-w-[150px]">
                        Created by: <strong className="text-slate-600">{creator.name || creator.email}</strong>
                      </span>
                    ) : (
                      <span>System Root / Seed</span>
                    )}
                  </div>

                  {assignedRoles.length > 0 && (
                    <div className="text-[10px] text-slate-400 font-medium">
                      RBAC Role: <span className="text-slate-600 font-bold">{assignedRoles.join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls pinned at bottom */}
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <div className="flex items-center justify-between text-xs font-sans">
          <button
            type="button"
            onClick={() => setAccessPage((p) => Math.max(1, p - 1))}
            disabled={accessPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs shadow-2xs"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-bold text-slate-500">
            Page <span className="font-extrabold text-slate-800">{accessPage}</span> of{' '}
            <span className="font-extrabold text-slate-800">{accessTotalPages}</span>
          </span>
          <button
            type="button"
            onClick={() => setAccessPage((p) => Math.min(accessTotalPages, p + 1))}
            disabled={accessPage >= accessTotalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs shadow-2xs"
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
