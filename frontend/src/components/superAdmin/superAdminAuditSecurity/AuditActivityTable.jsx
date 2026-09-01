export default function AuditActivityTable() {
  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-4">
      <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">Audit activity</h3>
      <p className="text-xs text-slate-455 font-bold leading-normal">
        No active logging profiles are connected to the platform workspace.
      </p>
    </div>
  );
}
