// Future Django integration:
// Map these adapters to the verified versioned Auth, User/Recruiter,
// Notification Preference, Company Membership, Invitation, and Permission APIs.
// Never replace missing backend data with hardcoded frontend records.

export async function getGeneralSettings() {
  // Future API GET /api/v1/account/settings/general/
  return {
    avatar_url: null,
    full_name: "",
    email: "",
    email_editable: false,
    language: "English (US)",
    timezone: "Pacific Time (PT)",
    supported_languages: ["English (US)", "English (UK)", "Spanish", "French", "German"],
    supported_timezones: [
      "Pacific Time (PT)",
      "Eastern Time (ET)",
      "Central Time (CT)",
      "Mountain Time (MT)",
      "Asia/Kolkata (IST)",
      "UTC"
    ]
  };
}

export async function updateGeneralSettings(changes) {
  // Future API PATCH /api/v1/account/settings/general/
  console.log("Updating General Settings:", changes);
  return { success: true, changes };
}

export async function uploadRecruiterAvatar(file) {
  // Future API POST /api/v1/account/avatar/
  console.log("Uploading Recruiter Avatar:", file.name);
  return { success: true, avatar_url: URL.createObjectURL(file) };
}

export async function removeRecruiterAvatar() {
  // Future API DELETE /api/v1/account/avatar/
  console.log("Removing Recruiter Avatar");
  return { success: true };
}

export async function getNotificationPreferences() {
  // Future API GET /api/v1/notifications/preferences/
  return {
    definitions: [
      { key: 'new_applications', label: 'New Applications', description: 'Email notifications when a new candidate applies.', channel: 'EMAIL', enabled: true, category: 'application_alerts' },
      { key: 'in_app_alerts', label: 'In-App Alerts', description: 'Pop-up notifications within the dashboard.', channel: 'IN_APP', enabled: true, category: 'application_alerts' },
      { key: 'daily_digest', label: 'Daily Digest', description: "Receive a morning summary of today's interviews.", channel: 'EMAIL', enabled: false, category: 'interview_reminders' },
      { key: 'fifteen_min_warning', label: '15-Minute Warning', description: 'In-app reminder before an interview starts.', channel: 'IN_APP', enabled: true, category: 'interview_reminders' },
      { key: 'product_updates', label: 'Product Updates', description: 'Occasional emails about new features and improvements.', channel: 'EMAIL', enabled: false, category: 'system_updates' }
    ]
  };
}

export async function updateNotificationPreferences(changes) {
  // Future API PATCH /api/v1/notifications/preferences/
  console.log("Updating Notification Preferences:", changes);
  return { success: true };
}

export async function changePassword(payload) {
  // Future API POST /api/v1/auth/password/change/
  console.log("Changing Password:", payload ? "Password payload submitted" : "No payload");
  return { success: true };
}

export async function getTwoFactorStatus() {
  // Future API GET /api/v1/auth/2fa/status/
  return {
    two_factor_supported: true,
    two_factor_enabled: false
  };
}

export async function startTwoFactorSetup(payload) {
  // Future API POST /api/v1/auth/2fa/setup/
  console.log("Starting 2FA Setup:", payload);
  return { success: true };
}

export async function confirmTwoFactorSetup(payload) {
  // Future API POST /api/v1/auth/2fa/confirm/
  console.log("Confirming 2FA Setup:", payload);
  return { success: true };
}

export async function disableTwoFactor(payload) {
  // Future API POST /api/v1/auth/2fa/disable/
  console.log("Disabling 2FA:", payload);
  return { success: true };
}

export async function getTeamMembers(params = {}) {
  // Future API GET /api/v1/company/members/
  console.log("Fetching team members with params:", params);
  return {
    supported: true,
    can_manage: true,
    can_invite_members: true,
    available_roles: ["Admin", "Recruiter", "Sourcer"],
    results: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      page_size: 10
    }
  };
}

export async function getAvailableTeamRoles() {
  return ["Admin", "Recruiter", "Sourcer"];
}

export async function inviteTeamMember(payload) {
  // Future API POST /api/v1/company/invitations/
  console.log("Inviting team member:", payload);
  return { success: true };
}

export async function resendTeamInvitation(invitationId) {
  console.log("Resending invitation:", invitationId);
  return { success: true };
}

export async function cancelTeamInvitation(invitationId) {
  console.log("Cancelling invitation:", invitationId);
  return { success: true };
}

export async function updateTeamMemberRole(memberId, payload) {
  console.log("Updating member role:", memberId, payload);
  return { success: true };
}

export async function removeTeamMember(memberId) {
  console.log("Removing team member:", memberId);
  return { success: true };
}
