import React from 'react';
import AuditActivityTable from '../../../components/superAdmin/superAdminAuditSecurity/AuditActivityTable';
import SecurityStatusPanel from '../../../components/superAdmin/superAdminAuditSecurity/SecurityStatusPanel';

export default function SuperAdminAuditSecurity() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-3xl font-black text-slate-805 tracking-tight">Audit & security</h1>
        <p className="text-base font-bold text-slate-500 mt-1.5">
          Monitor sensitive platform activity, system access, and security controls.
        </p>
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
