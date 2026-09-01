export default function AuditSecurityEmptyState() {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-12 text-center shadow-2xs max-w-3xl mx-auto my-12 animate-fadeIn">
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-6">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-slate-800">Audit and security records are not available yet</h3>
        <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
          Security activity will appear here after audit logging, session monitoring, and access-control rules are configured.
        </p>
        <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto pt-2">
          The current database does not yet store audit logs, sessions, alerts, or security-review records.
        </p>
      </div>
    </div>
  );
}
