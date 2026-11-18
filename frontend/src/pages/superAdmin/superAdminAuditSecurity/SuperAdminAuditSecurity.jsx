import React from 'react';
import AuditActivityTable from '../../../components/superAdmin/superAdminAuditSecurity/AuditActivityTable';
import SecurityStatusPanel from '../../../components/superAdmin/superAdminAuditSecurity/SecurityStatusPanel';

export default function SuperAdminAuditSecurity() {
  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Audit & security</h1>
        </div>
      </div>

      {/* Grid container layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Table */}
        <div className="lg:col-span-2 space-y-6">
          <AuditActivityTable />
        </div>

        {/* Right Side details */}
        <div className="space-y-6">
          <SecurityStatusPanel />
        </div>
      </div>
    </div>
  );
}
