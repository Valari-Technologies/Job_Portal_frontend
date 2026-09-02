import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterSettingsHeader from '../../components/recruiter/settings/RecruiterSettingsHeader';
import RecruiterSettingsNav from '../../components/recruiter/settings/RecruiterSettingsNav';

import RecruiterGeneralSettings from '../../components/recruiter/settings/general/RecruiterGeneralSettings';
import RecruiterNotificationSettings from '../../components/recruiter/settings/notifications/RecruiterNotificationSettings';
import RecruiterSecuritySettings from '../../components/recruiter/settings/security/RecruiterSecuritySettings';
import RecruiterTeamSettings from '../../components/recruiter/settings/team/RecruiterTeamSettings';

import {
  getGeneralSettings,
  updateGeneralSettings,
  getNotificationPreferences,
  updateNotificationPreferences,
  changePassword,
  getTwoFactorStatus,
  getTeamMembers,
  inviteTeamMember
} from '../../services/recruiter/recruiterSettingsService';

export default function RecruiterSettings() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path
  const getTabFromPath = (pathname) => {
    if (pathname.includes('/settings/notifications')) return 'notifications';
    if (pathname.includes('/settings/security')) return 'security';
    if (pathname.includes('/settings/team')) return 'team';
    return 'general';
  };

  const activeTab = getTabFromPath(location.pathname);

  // Redirect /recruiter/settings to /recruiter/settings/general
  useEffect(() => {
    if (location.pathname === '/recruiter/settings' || location.pathname === '/recruiter/settings/') {
      navigate('/recruiter/settings/general', { replace: true });
    }
  }, [location.pathname, navigate]);

  // State management
  const [generalData, setGeneralData] = useState(null);
  const [notificationData, setNotificationData] = useState(null);
  const [twoFactorData, setTwoFactorData] = useState({ two_factor_supported: true, two_factor_enabled: false });
  const [teamData, setTeamData] = useState(null);

  // Load initial data from service boundary
  useEffect(() => {
    async function loadData() {
      const general = await getGeneralSettings();
      setGeneralData(general);

      const notifs = await getNotificationPreferences();
      setNotificationData(notifs);

      const tfa = await getTwoFactorStatus();
      setTwoFactorData(tfa);

      const team = await getTeamMembers();
      setTeamData(team);
    }
    loadData();
  }, []);

  const handleSaveGeneral = async (changes) => {
    const res = await updateGeneralSettings(changes);
    if (res.success) {
      setGeneralData((prev) => ({ ...prev, ...changes }));
    }
  };

  const handleSaveNotifications = async (changes) => {
    await updateNotificationPreferences(changes);
  };

  const handleUpdatePassword = async (payload) => {
    await changePassword(payload);
  };

  const handleInviteTeamMember = async (payload) => {
    await inviteTeamMember(payload);
    const updatedTeam = await getTeamMembers();
    setTeamData(updatedTeam);
  };

  return (
    <RecruiterLayout activeTab="settings">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <RecruiterSettingsHeader />

        {/* Main Settings Container: Left Nav + Right Active View */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Inner Navigation */}
          <RecruiterSettingsNav activeTab={activeTab} />

          {/* Right Active Tab Content */}
          {activeTab === 'general' && (
            <RecruiterGeneralSettings
              serverSnapshot={generalData}
              onSave={handleSaveGeneral}
            />
          )}

          {activeTab === 'notifications' && (
            <RecruiterNotificationSettings
              serverSnapshot={notificationData}
              onSave={handleSaveNotifications}
            />
          )}

          {activeTab === 'security' && (
            <RecruiterSecuritySettings
              twoFactorSupported={twoFactorData.two_factor_supported}
              twoFactorEnabled={twoFactorData.two_factor_enabled}
              onUpdatePassword={handleUpdatePassword}
              onManage2FA={() => alert('2FA Management endpoint pending integration.')}
            />
          )}

          {activeTab === 'team' && (
            <RecruiterTeamSettings
              teamData={teamData}
              onInviteMember={handleInviteTeamMember}
            />
          )}
        </div>
      </main>
    </RecruiterLayout>
  );
}
