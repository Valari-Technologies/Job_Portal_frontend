import AuditSecurityEmptyState from '../../../components/superAdmin/superAdminAuditSecurity/AuditSecurityEmptyState';
import AuditActivityTable from '../../../components/superAdmin/superAdminAuditSecurity/AuditActivityTable';
import SecurityStatusPanel from '../../../components/superAdmin/superAdminAuditSecurity/SecurityStatusPanel';

// TODO: Connect Django API:
// GET /api/admin/audit-logs/
// Future models required:
// - audit_logs (actor_user_id, action_type, module, target_type, target_id, metadata, created_at)
// - admin_sessions (admin_user_id, session_identifier, device_info, ip_address, last_active_at, ended_at)
// - security_alerts (alert_type, severity, related_user_id, status, created_at, resolved_at)

export default function SuperAdminAuditSecurity() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-3xl font-black text-slate-805 tracking-tight">Audit & security</h1>
        <p className="text-base font-bold text-slate-500 mt-1.5">
          Monitor sensitive platform activity and future security controls.
        </p>
      </div>

      {/* Main Empty view card */}
      <AuditSecurityEmptyState />

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
