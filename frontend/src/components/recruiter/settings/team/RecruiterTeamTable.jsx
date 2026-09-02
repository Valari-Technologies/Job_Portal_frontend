import { Mail, Users } from 'lucide-react';

export default function RecruiterTeamTable({ members = [], pagination, onPrevPage, onNextPage }) {
  if (!members || members.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl p-8 text-center space-y-2 border border-slate-200">
        <Users className="h-8 w-8 text-indigo-600 mx-auto" />
        <h4 className="text-base font-bold text-slate-900">No team members yet</h4>
        <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto">
          Team members associated with your company will appear here once added or invited.
        </p>
      </div>
    );
  }

  const getRoleBadge = (role) => (
    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-bold">
      {role}
    </span>
  );

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Active
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
            Offline
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 text-xs font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
            Pending
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {st}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-600 tracking-wider">
              <th className="py-3.5 px-4">Member</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Last Active</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {member.initials ? (
                      <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-300">
                        {member.initials}
                      </div>
                    ) : member.subtitle ? (
                      <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                        {member.name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-bold text-slate-900">{member.name}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{member.subtitle || member.email}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">{getRoleBadge(member.role)}</td>
                <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-600">{member.last_active}</td>
                <td className="py-4 px-4 text-right">{getStatusBadge(member.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between pt-2 text-sm font-semibold text-slate-600">
          <span>
            Showing {members.length} of {pagination.total_items} members
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.current_page <= 1}
              onClick={onPrevPage}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold disabled:opacity-50 cursor-pointer hover:bg-slate-50 min-h-[38px]"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={pagination.current_page >= pagination.total_pages}
              onClick={onNextPage}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold disabled:opacity-50 cursor-pointer hover:bg-slate-50 min-h-[38px]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
