import React, { useState, useEffect, useCallback } from 'react';
import AuditActivityTable from '../../../components/superAdmin/superAdminAuditSecurity/AuditActivityTable';
import SecurityStatusPanel from '../../../components/superAdmin/superAdminAuditSecurity/SecurityStatusPanel';
import SecurityKpiCards from '../../../components/superAdmin/superAdminAuditSecurity/SecurityKpiCards';
import { fetchSecurityPosture } from '../../../services/superAdmin/auditSecurityService';
import { RefreshCw } from 'lucide-react';

export default function SuperAdminAuditSecurity() {
  const [posture, setPosture] = useState(null);
  const [postureLoading, setPostureLoading] = useState(true);
  const [postureError, setPostureError] = useState(null);

  const loadPosture = useCallback(async () => {
    setPostureLoading(true);
    setPostureError(null);
    const res = await fetchSecurityPosture();
    if (res.success) {
      setPosture(res.data);
    } else {
      setPostureError(res.message);
    }
    setPostureLoading(false);
  }, []);

  useEffect(() => {
    loadPosture();
  }, [loadPosture]);

  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Audit & security
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Real-time system events and privileged access reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPosture}
          disabled={postureLoading}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
          title="Refresh metrics"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${postureLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <SecurityKpiCards 
        posture={posture} 
        loading={postureLoading} 
        error={postureError} 
      />

      {/* Main Grid: Left Table & Right Access Reviews (Equal Height) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        {/* Left Side: Audit Activity Table */}
        <div className="lg:col-span-2 flex flex-col">
          <AuditActivityTable />
        </div>

        {/* Right Side: Access Reviews */}
        <div className="lg:col-span-1 flex flex-col">
          <SecurityStatusPanel />
        </div>
      </div>
    </div>
  );
}
