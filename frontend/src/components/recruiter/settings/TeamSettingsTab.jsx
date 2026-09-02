import { UserPlus, Mail } from 'lucide-react';

export default function TeamSettingsTab({ members = [] }) {
  const getRoleBadge = (role) => {
    return (
      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-extrabold">
        {role}
      </span>
    );
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-extrabold">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Offline
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-extrabold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
            {st}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Team Management</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Manage your recruitment team members and roles.</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-150 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-150 text-[11px] font-black uppercase text-slate-400 tracking-wider">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Member Details */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {member.initials ? (
                      <div className="h-9 w-9 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center border border-slate-300">
                        {member.initials}
                      </div>
                    ) : member.subtitle ? (
                      <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                        <Mail className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200">
                        {member.name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-black text-slate-900">{member.name}</p>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{member.subtitle || member.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="py-3.5 px-4">{getRoleBadge(member.role)}</td>

                {/* Last Active */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{member.last_active}</td>

                {/* Status */}
                <td className="py-3.5 px-4 text-right">{getStatusBadge(member.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-500">
        <span>Showing 1 to {members.length} of {members.length} members</span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs font-bold disabled:opacity-60 cursor-not-allowed"
          >
            Prev
          </button>
          <button
            type="button"
            disabled
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs font-bold disabled:opacity-60 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
