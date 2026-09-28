import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Users, Lock, Key, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { fetchSecurityPosture, fetchAccessReviews } from '../../../services/superAdmin/auditSecurityService';

export default function SecurityStatusPanel() {
  const [posture, setPosture] = useState(null);
  const [postureLoading, setPostureLoading] = useState(true);
  const [postureError, setPostureError] = useState(null);

  const [accessUsers, setAccessUsers] = useState([]);
  const [accessCount, setAccessCount] = useState(0);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessError, setAccessError] = useState(null);
  const [accessPage, setAccessPage] = useState(1);
  const accessPageSize = 5;

  const loadPosture = async () => {
    setPostureLoading(true);
    setPostureError(null);
    const res = await fetchSecurityPosture();
    if (res.success) {
      setPosture(res.data);
    } else {
      setPostureError(res.message);
    }
    setPostureLoading(false);
  };

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
    loadPosture();
  }, []);

  useEffect(() => {
    loadAccess();
  }, [accessPage]);

  const accessTotalPages = Math.ceil(accessCount / accessPageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Security Posture Card */}
      <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-805">Security posture</h3>
            <p className="text-xs text-slate-455 font-bold mt-0.5">
              Verified system controls and account metrics.
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200">
            Active JWT
          </span>
        </div>

        {postureLoading && (
          <div className="py-6 text-center text-xs font-bold text-slate-400 animate-pulse">
            Checking system controls...
          </div>
        )}

        {!postureLoading && postureError && (
          <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold">
            {postureError}
          </div>
        )}

        {!postureLoading && posture && (
          <div className="space-y-4">
            {/* Real Account Breakdown Stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-xl font-black text-slate-800">
                  {posture.accounts_summary?.total_users || 0}
                </div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
                  Total Users
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <div className="text-xl font-black text-emerald-700">
                  {posture.accounts_summary?.active_users || 0}
                </div>
                <div className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mt-0.5">
                  Active Users
                </div>
              </div>

              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
                <div className="text-xl font-black text-rose-700">
                  {posture.accounts_summary?.suspended_users || 0}
                </div>
                <div className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider mt-0.5">
                  Suspended
                </div>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl">
                <div className="text-xl font-black text-teal-700">
                  {posture.accounts_summary?.privileged_users || 0}
                </div>
                <div className="text-[10px] font-extrabold text-teal-600 uppercase tracking-wider mt-0.5">
                  Privileged Roles
                </div>
              </div>
            </div>

            {/* Implemented Control Facts */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-slate-700">Auth & Session Mechanism</div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {posture.auth_controls?.auth_mechanism}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Access Token: {posture.auth_controls?.access_token_lifetime} | Refresh: {posture.auth_controls?.refresh_token_lifetime}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-slate-700">24-Hour Failed Logins</div>
                  <div className="text-[11px] font-bold text-slate-700">
                    {posture.failed_logins_24h || 0} failed login attempts recorded
                  </div>
                </div>
              </div>

              {/* Unconfigured / Out-of-Scope Controls (Truthful Display) */}
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-150 space-y-1.5 text-[11px]">
                <div className="font-extrabold text-slate-500 uppercase tracking-wider text-[9px]">
                  Unconfigured Security Controls
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold">
                  <span>Session Revocation / Blacklist</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md font-extrabold">Not configured</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold">
                  <span>Multi-Factor Auth (MFA)</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md font-extrabold">Not configured</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold">
                  <span>Automated Intrusion Alerts</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md font-extrabold">Not configured</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Access Reviews Card */}
      <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-805">Access reviews</h3>
            <p className="text-xs text-slate-455 font-bold mt-0.5">
              Read-only review of accounts with privileged access.
            </p>
          </div>
          <UserCheck className="w-4 h-4 text-teal-600" />
        </div>

        {accessLoading && (
          <div className="py-6 text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading privileged accounts...
          </div>
        )}

        {!accessLoading && accessError && (
          <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold">
            {accessError}
          </div>
        )}

        {!accessLoading && !accessError && accessUsers.length === 0 && (
          <p className="text-xs text-slate-400 font-semibold text-center py-4">
            No privileged accounts found.
          </p>
        )}

        {!accessLoading && !accessError && accessUsers.length > 0 && (
          <div className="space-y-3">
            <div className="divide-y divide-slate-100">
              {accessUsers.map((u) => {
                const creator = u.created_by_info;
                const assignedRoles = u.roles_assigned || [];
                return (
                  <div key={u.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 text-xs">{u.name}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800">
                        {u.role}
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-slate-500">{u.email}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Status: <strong className="text-slate-600">{u.status}</strong></span>
                      {creator ? (
                        <span>Created by: <strong className="text-slate-600">{creator.name || creator.email}</strong></span>
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

            {/* Pagination for Access Reviews */}
            {accessTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                <span className="text-[11px]">Page {accessPage} of {accessTotalPages}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setAccessPage((p) => Math.max(1, p - 1))}
                    disabled={accessPage === 1}
                    className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setAccessPage((p) => Math.min(accessTotalPages, p + 1))}
                    disabled={accessPage >= accessTotalPages}
                    className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
