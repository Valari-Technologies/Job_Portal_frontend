import { useState } from 'react';
import { useSuperAdminUser } from '../../../context/SuperAdminUserContext';
import { changeSuperAdminPassword, revokeOtherSessions } from '../../../services/superAdmin/superAdminProfileService';
import { 
  Sliders, 
  ShieldCheck, 
  Bell, 
  Laptop, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldAlert 
} from 'lucide-react';

export default function SuperAdminAccountSettings() {
  const { profile, updateSettings, isLoadingProfile } = useSuperAdminUser();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security' | 'notifications' | 'sessions'
  const [toastFeedback, setToastFeedback] = useState(null);

  // General Tab State initialized directly from profile
  const [generalForm, setGeneralForm] = useState({
    display_name: profile?.display_name || profile?.full_name || 'Super Admin',
    preferred_language: profile?.preferred_language || 'en-US',
    time_zone: profile?.time_zone || 'Asia/Kolkata',
    date_format: profile?.date_format || 'DD/MM/YYYY'
  });
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Security Tab State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notifications Tab State initialized directly from profile
  const [notifPrefForm, setNotifPrefForm] = useState({
    in_app: profile?.notification_preferences?.in_app ?? true,
    email: profile?.notification_preferences?.email ?? true,
    security_alerts: true, // locked
    admin_events: profile?.notification_preferences?.admin_events ?? true,
    employer_verifications: profile?.notification_preferences?.employer_verifications ?? true,
    job_moderation: profile?.notification_preferences?.job_moderation ?? true,
    system_updates: profile?.notification_preferences?.system_updates ?? true
  });
  const [isNotifModified, setIsNotifModified] = useState(false);
  const [isSavingNotif, setIsSavingNotif] = useState(false);

  // Sessions Tab State
  const [sessions, setSessions] = useState(profile?.active_sessions || []);
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);

  if (isLoadingProfile || !profile) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-12 w-full bg-slate-200 rounded-2xl" />
        <div className="h-64 w-full bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  const showToast = (msg, type = 'success') => {
    setToastFeedback({ msg, type });
    setTimeout(() => setToastFeedback(null), 4000);
  };

  // General Form submit
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    try {
      await updateSettings({
        display_name: generalForm.display_name,
        preferred_language: generalForm.preferred_language,
        time_zone: generalForm.time_zone,
        date_format: generalForm.date_format
      });
      showToast('General preferences updated successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to update general preferences.', 'error');
    } finally {
      setIsSavingGeneral(false);
    }
  };

  // Password Submit
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeSuperAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password updated successfully.');
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || 'Unable to update password. Please check your credentials.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Notifications Form toggle
  const handleNotifToggle = (key) => {
    if (key === 'security_alerts') return; // Locked mandatory
    setNotifPrefForm(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setIsNotifModified(true);
      return updated;
    });
  };

  const handleSaveNotificationPreferences = async () => {
    setIsSavingNotif(true);
    try {
      await updateSettings({ notification_preferences: notifPrefForm });
      setIsNotifModified(false);
      showToast('Notification preferences saved.');
    } catch (err) {
      console.error(err);
      showToast('Failed to save notification preferences.', 'error');
    } finally {
      setIsSavingNotif(false);
    }
  };

  // Revoke other sessions
  const handleRevokeSessions = async () => {
    if (window.confirm('Are you sure you want to sign out all other active sessions?')) {
      setIsRevokingSessions(true);
      try {
        const updated = await revokeOtherSessions();
        setSessions(updated.active_sessions || []);
        showToast('All other active sessions have been revoked.');
      } catch (err) {
        console.error(err);
        showToast('Failed to revoke active sessions.', 'error');
      } finally {
        setIsRevokingSessions(false);
      }
    }
  };

  return (
    <div className="space-y-8 font-sans animate-fadeIn max-w-5xl mx-auto">
      {/* Page Title Header */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Manage security, notification preferences, system defaults, and active sessions.
        </p>
      </div>

      {/* Toast Feedback */}
      {toastFeedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xs animate-slideDown ${
          toastFeedback.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            {toastFeedback.type === 'error' ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <Check className="h-4 w-4 text-emerald-600" />}
            <span>{toastFeedback.msg}</span>
          </div>
          <button onClick={() => setToastFeedback(null)} className="p-1 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'general'
              ? 'border-teal-600 text-teal-700 bg-teal-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-teal-600 text-teal-700 bg-teal-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Security & 2FA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-teal-600 text-teal-700 bg-teal-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'sessions'
              ? 'border-teal-600 text-teal-700 bg-teal-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Laptop className="h-4 w-4" />
          <span>Sessions & Devices</span>
        </button>
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h3 className="text-base font-extrabold text-slate-900">General Preferences</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Customize your display name and portal localization standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label htmlFor="display_name" className="text-xs font-extrabold text-slate-700">Display Name</label>
              <input
                id="display_name"
                type="text"
                value={generalForm.display_name}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, display_name: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label htmlFor="preferred_language" className="text-xs font-extrabold text-slate-700">Portal Language</label>
              <select
                id="preferred_language"
                value={generalForm.preferred_language}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, preferred_language: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                <option value="en-US">English (US)</option>
                <option value="ta-IN">Tamil (தமிழ்)</option>
              </select>
            </div>

            {/* Time Zone */}
            <div className="space-y-1.5">
              <label htmlFor="time_zone" className="text-xs font-extrabold text-slate-700">Time Zone</label>
              <select
                id="time_zone"
                value={generalForm.time_zone}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, time_zone: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                <option value="Asia/Kolkata">India Standard Time (IST - UTC+05:30)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <label htmlFor="date_format" className="text-xs font-extrabold text-slate-700">Date & Time Format</label>
              <select
                id="date_format"
                value={generalForm.date_format}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, date_format: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 04/09/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/04/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-150">
            <button
              type="submit"
              disabled={isSavingGeneral}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <Check className="h-4 w-4" />
              <span>{isSavingGeneral ? 'Saving...' : 'Save General Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          {/* Change Password Card */}
          <form onSubmit={handleChangePasswordSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-150 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-5 w-5 text-teal-600" />
                <h3 className="text-base font-extrabold text-slate-900">Change Password</h3>
              </div>
            </div>

            {passwordError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {passwordError}
              </div>
            )}

            <div className="space-y-4 max-w-lg">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label htmlFor="currentPassword" className="text-xs font-extrabold text-slate-700">Current Password</label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPw ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-xs font-extrabold text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPw ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-extrabold text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirement Guidance */}
              <div className="rounded-2xl bg-slate-50 border border-slate-150 p-4 space-y-2">
                <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Password Requirements</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${passwordForm.newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>Minimum 8 characters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(passwordForm.newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>At least one uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(passwordForm.newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>At least one number or special character</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-150">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <Check className="h-4 w-4" />
                <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication Status Card (Mandatory Policy Enforced) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-150 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-5 w-5 text-teal-600" />
                <h3 className="text-base font-extrabold text-slate-900">Two-Factor Authentication (2FA)</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                2FA MANDATORY & ENFORCED
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-teal-950">
                  Mandatory Security Policy Enforced
                </p>
                <p className="text-xs font-medium text-slate-650 leading-relaxed">
                  Per State Jobz Technical Requirements (TRD), Two-Factor Authentication is mandatory for all Super Admin and Admin accounts. Simple disabling is restricted by platform policy.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs font-extrabold text-slate-800">Security Keys & Backup Authentication</p>
                <p className="text-xs text-slate-500 mt-0.5">Manage authenticator apps, security hardware tokens, and emergency backup codes.</p>
              </div>
              <button
                type="button"
                onClick={() => showToast('2FA key management protocol accessed.')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-extrabold text-slate-700 transition-colors cursor-pointer min-h-[44px]"
              >
                Manage 2FA Keys
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h3 className="text-base font-extrabold text-slate-900">Notification Preferences</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Control how and when you receive system, moderation, and account notifications.</p>
          </div>

          <div className="space-y-6">
            {/* Channel Toggles */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Delivery Channels</h4>
              
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 bg-slate-50/50">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">In-App Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Show popups and badge count inside the portal header.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotifToggle('in_app')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifPrefForm.in_app ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifPrefForm.in_app ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 bg-slate-50/50">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">Email Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Send critical updates to admin@statejobz.tn.gov.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotifToggle('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifPrefForm.email ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifPrefForm.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Event Category Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-150">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Event Categories</h4>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-extrabold text-slate-800">Security & Authentication Alerts</p>
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Suspicious logins, password changes, and 2FA events.</p>
                </div>
                <button
                  type="button"
                  disabled
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600/70 cursor-not-allowed opacity-80"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 bg-slate-50/50">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">Employer Verification Requests</p>
                  <p className="text-xs text-slate-500 mt-0.5">Notifications when new employers submit documents for verification.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotifToggle('employer_verifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifPrefForm.employer_verifications ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifPrefForm.employer_verifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 bg-slate-50/50">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">Job Moderation & Review</p>
                  <p className="text-xs text-slate-500 mt-0.5">Alerts when new job postings are submitted for review.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotifToggle('job_moderation')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifPrefForm.job_moderation ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifPrefForm.job_moderation ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 bg-slate-50/50">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">Admin Account Events</p>
                  <p className="text-xs text-slate-500 mt-0.5">Notifications for new Admin creations, suspensions, or role modifications.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotifToggle('admin_events')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifPrefForm.admin_events ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifPrefForm.admin_events ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-150">
              <button
                type="button"
                onClick={handleSaveNotificationPreferences}
                disabled={!isNotifModified || isSavingNotif}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all min-h-[44px] ${
                  isNotifModified 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="h-4 w-4" />
                <span>{isSavingNotif ? 'Saving...' : 'Save Notification Preferences'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sessions & Devices */}
      {activeTab === 'sessions' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-150 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Active Sessions & Authorized Devices</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Inspect devices currently logged into your Super Admin account.</p>
            </div>

            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleRevokeSessions}
                disabled={isRevokingSessions}
                className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-extrabold text-red-700 transition-colors cursor-pointer min-h-[44px]"
              >
                Sign Out All Other Sessions
              </button>
            )}
          </div>

          <div className="space-y-4">
            {sessions.map((sess) => (
              <div 
                key={sess.id} 
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  sess.is_current ? 'border-teal-300 bg-teal-50/30' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-teal-600 shadow-2xs">
                    <Laptop className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900">{sess.device}</h4>
                      {sess.is_current && (
                        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-black text-teal-800">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {sess.location} • IP: {sess.ip_address}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      Last Active: {sess.last_active}
                    </p>
                  </div>
                </div>

                {!sess.is_current && (
                  <button
                    type="button"
                    onClick={() => {
                      setSessions(prev => prev.filter(s => s.id !== sess.id));
                      showToast('Session revoked successfully.');
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer min-h-[40px]"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
