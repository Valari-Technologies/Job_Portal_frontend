import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import RecruiterTeamTable from './RecruiterTeamTable';
import RecruiterInviteMemberDialog from './RecruiterInviteMemberDialog';

export default function RecruiterTeamSettings({
  teamData,
  onInviteMember,
  onPrevPage,
  onNextPage
}) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const supported = teamData?.supported ?? true;
  const canInvite = teamData?.can_invite_members ?? true;
  const members = teamData?.results || [];
  const pagination = teamData?.pagination;
  const availableRoles = teamData?.available_roles || ["Admin", "Recruiter", "Sourcer"];

  if (!supported) {
    return (
      <div className="bg-white rounded-2xl border border-slate-150 p-8 shadow-xs text-center space-y-3 flex-1">
        <h2 className="text-base font-black text-slate-900">Team Management Unavailable</h2>
        <p className="text-xs font-medium text-slate-450 max-w-sm mx-auto">
          Team management is not available for this account yet. Team members will appear after company team support is connected.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Team Management</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Manage your recruitment team members and roles.</p>
        </div>

        {canInvite && (
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Team Table */}
      <RecruiterTeamTable
        members={members}
        pagination={pagination}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />

      {/* Invite Member Modal */}
      <RecruiterInviteMemberDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={onInviteMember}
        availableRoles={availableRoles}
      />
    </div>
  );
}
