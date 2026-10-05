import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import { useCandidateUser } from '../../context/CandidateUserContext';
import {
  getCandidateSettings,
  updateCandidateGeneralSettings,
  changeCandidatePassword,
  toggle2FASetting,
  revokeOtherSessions,
  requestCandidateDataArchive,
  requestAccountDeletion
} from '../../services/candidate/candidateSettingsService';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import {
  ArrowLeft,
  Lock,
  Shield,
  Laptop,
  Smartphone,
  Megaphone,
  Eye,
  Share2,
  Download,
  Sparkles,
  History,
  EyeOff,
  Link2,
  Globe,
  FileText,
  Pencil,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Check
} from 'lucide-react';

export default function CandidateSettingsPage() {
  const navigate = useNavigate();
  const { profile: contextProfile, refreshProfile } = useCandidateUser();

  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settings State
  const [settings, setSettings] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Profile Management Form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    headline: '',
    summary: '',
    linkedin: '',
    portfolio: ''
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Danger Zone Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmForm, setDeleteConfirmForm] = useState({
    password: '',
    confirmationText: ''
  });
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Check Onboarding Guard (Allow direct access)
  useEffect(() => {
    let isMounted = true;
    async function checkGuard() {
      try {
        await getCandidateOnboardingStatus();
        if (isMounted) setIsCheckingOnboarding(false);
      } catch (err) {
        console.error('Failed to verify candidate onboarding status:', err);
        if (isMounted) setIsCheckingOnboarding(false);
      }
    }
    checkGuard();
    return () => { isMounted = false; };
  }, []);

  const initProfileForm = useCallback((prof) => {
    if (!prof) return;
    setProfileForm({
      firstName: prof.firstName || (prof.fullName ? prof.fullName.split(' ')[0] : 'Candidate'),
      lastName: prof.lastName || (prof.fullName ? prof.fullName.split(' ').slice(1).join(' ') : ''),
      fullName: prof.fullName || 'Candidate',
      email: prof.email || '',
      headline: prof.headline || 'Candidate',
      summary: prof.summary || '',
      linkedin: prof.links?.linkedin || '',
      portfolio: prof.links?.portfolio || ''
    });
  }, []);

  // 2. Load Candidate Settings & Profile Data
  const loadSettingsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCandidateSettings();
      setSettings(data);
      initProfileForm(data.profile);
    } catch (err) {
      console.error('Failed to load candidate settings:', err);
      setError("We couldn't load your settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [initProfileForm]);

  useEffect(() => {
    let isMounted = true;
    if (isCheckingOnboarding) return;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCandidateSettings();
        if (isMounted) {
          setSettings(data);
          initProfileForm(data.profile);
        }
      } catch (err) {
        console.error('Failed to load candidate settings:', err);
        if (isMounted) setError("We couldn't load your settings. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isCheckingOnboarding, initProfileForm]);

  // Mark form dirty when preferences change
  const handleFormChange = (updater) => {
    setProfileForm(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      setIsDirty(true);
      return updated;
    });
  };

  const handleSettingsToggle = (category, key) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: !prev[category][key]
        }
      };
      setIsDirty(true);
      return updated;
    });
  };

  const handleQuietHoursChange = (field, val) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        quietHours: {
          ...prev.quietHours,
          [field]: val
        }
      };
      setIsDirty(true);
      return updated;
    });
  };

  const handlePrivacyVisibilityChange = (val) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        privacy: {
          ...prev.privacy,
          profileVisibility: val
        }
      };
      setIsDirty(true);
      return updated;
    });
  };

  // Action: Save General Settings & Profile Summary
  const handleSaveGeneralSettings = async () => {
    setIsSavingGeneral(true);
    try {
      const fullNameCombined = `${profileForm.firstName} ${profileForm.lastName}`.trim();
      const profilePayload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        fullName: fullNameCombined,
        headline: profileForm.headline,
        summary: profileForm.summary,
        links: {
          linkedin: profileForm.linkedin,
          portfolio: profileForm.portfolio
        }
      };

      const settingsPayload = {
        notifications: settings.notifications,
        quietHours: settings.quietHours,
        privacy: settings.privacy
      };

      const res = await updateCandidateGeneralSettings({ profilePayload, settingsPayload });
      if (res.success) {
        setSettings(prev => ({ ...prev, ...res.settings, profile: res.profile }));
        refreshProfile(); // Sync profile details globally across headers/sidebars
        setIsDirty(false);
        triggerToast('General preferences & profile updated!');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      triggerToast('Failed to save settings.');
    } finally {
      setIsSavingGeneral(false);
    }
  };

  // Action: Change Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    try {
      const res = await changeCandidatePassword(passwordForm);
      if (res.success) {
        triggerToast(res.message);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        triggerToast(res.message);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      triggerToast('Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Action: Toggle 2FA
  const handleToggle2FA = async () => {
    try {
      const res = await toggle2FASetting();
      if (res.success) {
        setSettings(prev => ({
          ...prev,
          security: { ...prev.security, mfaEnabled: res.mfaEnabled }
        }));
        triggerToast(res.message);
      }
    } catch (err) {
      console.error('Error toggling 2FA:', err);
    }
  };

  // Action: Revoke Other Sessions
  const handleRevokeSessions = async () => {
    if (!window.confirm('Log out from all other active devices?')) return;
    try {
      const res = await revokeOtherSessions();
      if (res.success) {
        setSettings(prev => ({ ...prev, sessions: res.sessions }));
        triggerToast(res.message);
      }
    } catch (err) {
      console.error('Error revoking sessions:', err);
      triggerToast('Failed to revoke sessions.');
    }
  };

  // Action: Request Data Archive
  const handleRequestDataArchive = async () => {
    try {
      const res = await requestCandidateDataArchive();
      if (res.success) {
        setSettings(prev => ({ ...prev, dataArchive: res.dataArchive }));
        triggerToast(res.message);
      }
    } catch (err) {
      console.error('Error requesting data archive:', err);
    }
  };

  // Action: Delete Account
  const handleSubmitDeleteAccount = async (e) => {
    e.preventDefault();
    setIsSubmittingDelete(true);
    try {
      const res = await requestAccountDeletion(deleteConfirmForm);
      if (res.success) {
        triggerToast(res.message);
        setDeleteModalOpen(false);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        triggerToast(res.message);
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      triggerToast('Failed to submit deletion request.');
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading settings...</span>
        </div>
      </CandidateLayout>
    );
  }

  const activeAvatar = settings?.profile?.avatarUrl || contextProfile?.avatarUrl;
  const fullName = profileForm.fullName || contextProfile?.fullName || 'Candidate';
  const headline = profileForm.headline || 'Senior Product Designer';
  const completionPct = settings?.profile?.completionPercentage ?? 85;

  return (
    <CandidateLayout>
      <div className="space-y-8 animate-fadeIn font-sans pb-16 max-w-6xl mx-auto">
        
        {/* --- TOAST NOTIFICATION --- */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 animate-slideDown">
            <div className="bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* --- MOBILE COMPACT HEADER (sm:hidden) --- */}
        <div className="sm:hidden flex items-center justify-between py-2 border-b border-slate-150">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/candidate/dashboard')}
              aria-label="Go back to dashboard"
              className="p-1.5 text-slate-700 hover:text-[#3B00FF] rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Settings
            </h1>
          </div>

          <button
            type="button"
            onClick={handleSaveGeneralSettings}
            disabled={!isDirty || isSavingGeneral}
            className="px-4 py-1.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSavingGeneral ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* --- DESKTOP HEADER (hidden sm:flex matching Image 1) --- */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Settings
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Manage your preferences, security, and career tools.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveGeneralSettings}
            disabled={!isDirty || isSavingGeneral}
            className="px-6 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] disabled:opacity-50 text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
          >
            {isSavingGeneral ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
            <div className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load your settings</h3>
            <p className="text-xs font-semibold text-slate-500">{error}</p>
            <button
              type="button"
              onClick={loadSettingsData}
              className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-[#3000E0] mx-auto cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* ================= SECTION 1: PROFILE MANAGEMENT (Image 1) ================= */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-200 pb-3">
                Profile Management
              </h2>

              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xs">
                
                {/* Profile Completion Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-150">
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-slate-900">Profile Completion</span>
                      <span className="text-[#3B00FF]">{completionPct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div 
                        className="h-full bg-[#3B00FF] rounded-full transition-all duration-300"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to="/candidate/profile"
                    className="px-5 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white font-extrabold text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Complete Profile
                  </Link>
                </div>

                {/* Avatar & Summary Header */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full border-2 border-slate-200 bg-indigo-50 overflow-hidden flex items-center justify-center shrink-0">
                    {activeAvatar ? (
                      <img src={activeAvatar} alt={fullName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl font-black text-[#3B00FF]">{fullName.charAt(0)}</span>
                    )}

                    <Link
                      to="/candidate/profile"
                      className="absolute bottom-0 right-0 p-1 rounded-full bg-[#3B00FF] text-white shadow-xs"
                      title="Edit photo in Profile"
                    >
                      <Pencil className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-lg font-black text-slate-900 truncate">{fullName}</h3>
                    <p className="text-xs font-bold text-slate-500 truncate">{headline}</p>
                  </div>
                </div>

                {/* Profile Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => handleFormChange(prev => ({
                        ...prev,
                        firstName: e.target.value,
                        fullName: `${e.target.value} ${prev.lastName}`
                      }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => handleFormChange(prev => ({
                        ...prev,
                        lastName: e.target.value,
                        fullName: `${prev.firstName} ${e.target.value}`
                      }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={profileForm.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-xs font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Professional Title</label>
                    <input
                      type="text"
                      value={profileForm.headline}
                      onChange={(e) => handleFormChange(prev => ({ ...prev, headline: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Professional Summary</label>
                  <textarea
                    rows={3}
                    value={profileForm.summary}
                    onChange={(e) => handleFormChange(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF] resize-none"
                  />
                </div>

                {/* Social Profiles Sub-section */}
                <div className="space-y-3 pt-3 border-t border-slate-150">
                  <span className="text-xs font-black text-slate-900 tracking-wider uppercase block">
                    Social Profiles
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 block">LinkedIn</label>
                      <div className="relative">
                        <Link2 className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={profileForm.linkedin}
                          onChange={(e) => handleFormChange(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 block">Portfolio / Website</label>
                      <div className="relative">
                        <Globe className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={profileForm.portfolio}
                          onChange={(e) => handleFormChange(prev => ({ ...prev, portfolio: e.target.value }))}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= SECTION 2: ACCOUNT SECURITY (Image 2) ================= */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-200 pb-3">
                Account Security
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Change Password Card */}
                <div className="lg:col-span-6 bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#3B00FF]" />
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Change Password
                    </h3>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Enter current password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Enter new password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Confirm new password"
                          value={passwordForm.confirmNewPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="px-5 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] disabled:opacity-50 text-white text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
                      >
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Stack: 2FA & Active Sessions */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* 2FA Card */}
                  <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#3B00FF]" />
                        <h3 className="text-base font-black text-slate-900">2FA</h3>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={handleToggle2FA}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          settings?.security?.mfaEnabled ? 'bg-[#3B00FF]' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings?.security?.mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Require an authentication code when you log in from a new device.
                    </p>

                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-2 text-xs font-extrabold text-slate-800">
                      <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>{settings?.security?.mfaEnabled ? '2FA is enabled' : '2FA is disabled'}</span>
                    </div>
                  </div>

                  {/* Active Sessions Card */}
                  <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-5 w-5 text-[#3B00FF]" />
                      <h3 className="text-base font-black text-slate-900">Active Sessions</h3>
                    </div>

                    <div className="space-y-3">
                      {(settings?.sessions || []).map((sess) => (
                        <div key={sess.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-indigo-100/80 text-[#3B00FF] flex items-center justify-center shrink-0">
                            {sess.iconType === 'mobile' ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-black text-slate-900">{sess.device}</h4>
                            <p className={`text-[11px] font-bold ${sess.isCurrent ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {sess.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleRevokeSessions}
                      className="w-full py-2.5 rounded-xl border border-rose-400 text-rose-600 hover:bg-rose-50 font-extrabold text-xs transition-colors cursor-pointer text-center"
                    >
                      Log out all other devices
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* ================= SECTION 3: NOTIFICATION PREFERENCES (Image 2) ================= */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-200 pb-3">
                Notification Preferences
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* New Job Alerts Card */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center shrink-0">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">New Job Alerts</h3>
                      <p className="text-xs font-semibold text-slate-500">Get notified when matching roles are posted.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Option 1: Email Notifications */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Email Notifications</h4>
                        <p className="text-[11px] font-semibold text-slate-500">Sent to your primary address</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSettingsToggle('notifications', 'emailNotifications')}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          settings?.notifications?.emailNotifications ? 'bg-[#3B00FF]' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings?.notifications?.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Option 2: SMS Alerts */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">SMS Alerts</h4>
                        <p className="text-[11px] font-semibold text-slate-500">Instant texts for high-match jobs</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSettingsToggle('notifications', 'smsAlerts')}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          settings?.notifications?.smsAlerts ? 'bg-[#3B00FF]' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings?.notifications?.smsAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Option 3: Push Notifications */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Push Notifications</h4>
                        <p className="text-[11px] font-semibold text-slate-500">Browser or app notifications</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSettingsToggle('notifications', 'pushNotifications')}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          settings?.notifications?.pushNotifications ? 'bg-[#3B00FF]' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings?.notifications?.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quiet Hours Card */}
                <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Quiet Hours</h3>
                      <p className="text-xs font-semibold text-slate-500">Pause non-critical notifications.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSettingsToggle('quietHours', 'enabled')}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        settings?.quietHours?.enabled ? 'bg-[#3B00FF]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings?.quietHours?.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">From</label>
                      <input
                        type="text"
                        placeholder="10:00 PM"
                        value={settings?.quietHours?.fromTime || '10:00 PM'}
                        onChange={(e) => handleQuietHoursChange('fromTime', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">To</label>
                      <input
                        type="text"
                        placeholder="08:00 AM"
                        value={settings?.quietHours?.toTime || '08:00 AM'}
                        onChange={(e) => handleQuietHoursChange('toTime', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= SECTION 4: PRIVACY SETTINGS (Image 3) ================= */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-200 pb-3">
                Privacy Settings
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Profile Visibility Card */}
                <div className="lg:col-span-6 bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-[#3B00FF]" />
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Profile Visibility
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Public */}
                    <div 
                      onClick={() => handlePrivacyVisibilityChange('PUBLIC')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        settings?.privacy?.profileVisibility === 'PUBLIC'
                          ? 'border-[#3B00FF] bg-indigo-50/40 ring-1 ring-[#3B00FF]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        checked={settings?.privacy?.profileVisibility === 'PUBLIC'}
                        onChange={() => handlePrivacyVisibilityChange('PUBLIC')}
                        className="mt-0.5 text-[#3B00FF] focus:ring-[#3B00FF]"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Public</h4>
                        <p className="text-[11px] font-semibold text-slate-500">Visible to anyone, including search engines.</p>
                      </div>
                    </div>

                    {/* Option 2: Only Recruiters [Recommended] */}
                    <div 
                      onClick={() => handlePrivacyVisibilityChange('RECRUITERS_ONLY')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                        settings?.privacy?.profileVisibility === 'RECRUITERS_ONLY'
                          ? 'border-[#3B00FF] bg-indigo-50/40 ring-1 ring-[#3B00FF]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        checked={settings?.privacy?.profileVisibility === 'RECRUITERS_ONLY'}
                        onChange={() => handlePrivacyVisibilityChange('RECRUITERS_ONLY')}
                        className="mt-0.5 text-[#3B00FF] focus:ring-[#3B00FF]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900">Only Recruiters</h4>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-[#3B00FF] text-[10px] font-black">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500">Visible only to verified employers on the platform.</p>
                      </div>
                    </div>

                    {/* Option 3: Private */}
                    <div 
                      onClick={() => handlePrivacyVisibilityChange('PRIVATE')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        settings?.privacy?.profileVisibility === 'PRIVATE'
                          ? 'border-[#3B00FF] bg-indigo-50/40 ring-1 ring-[#3B00FF]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        checked={settings?.privacy?.profileVisibility === 'PRIVATE'}
                        onChange={() => handlePrivacyVisibilityChange('PRIVATE')}
                        className="mt-0.5 text-[#3B00FF] focus:ring-[#3B00FF]"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Private</h4>
                        <p className="text-[11px] font-semibold text-slate-500">Visible only to you and applied companies.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Stack: Data Sharing & Danger Zone */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Data Sharing Card */}
                  <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-[#3B00FF]" />
                      <h3 className="text-base font-black text-slate-900">Data Sharing</h3>
                    </div>

                    <div className="space-y-3">
                      {/* Toggle 1: Share Application History */}
                      <div className="flex items-center justify-between py-1">
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Share Application History</h4>
                          <p className="text-[11px] font-semibold text-slate-500">Help employers understand your interests.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingsToggle('privacy', 'shareApplicationHistory')}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            settings?.privacy?.shareApplicationHistory ? 'bg-[#3B00FF]' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            settings?.privacy?.shareApplicationHistory ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Toggle 2: AI Resume Training */}
                      <div className="flex items-center justify-between py-1 border-t border-slate-150 pt-3">
                        <div>
                          <h4 className="text-xs font-black text-slate-900">AI Resume Training</h4>
                          <p className="text-[11px] font-semibold text-slate-500">Allow anonymous data to improve our AI.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingsToggle('privacy', 'aiResumeTraining')}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            settings?.privacy?.aiResumeTraining ? 'bg-[#3B00FF]' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            settings?.privacy?.aiResumeTraining ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRequestDataArchive}
                      className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>{settings?.dataArchive?.status === 'PROCESSING' ? 'Archive Request Processing...' : 'Request Data Archive'}</span>
                    </button>
                  </div>

                  {/* Danger Zone Card */}
                  <div className="bg-rose-50/60 border border-rose-200 p-6 sm:p-7 rounded-3xl space-y-3 shadow-2xs">
                    <h3 className="text-base font-black text-rose-600">Danger Zone</h3>
                    <p className="text-xs font-semibold text-slate-600">
                      Permanently remove your account and all associated data.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDeleteModalOpen(true)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Delete Account
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* ================= SECTION 5: RESUME MANAGEMENT (Image 3) ================= */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-200 pb-3">
                Resume Management
              </h2>

              {/* Active Resume Card */}
              <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-5 shadow-2xs relative">
                
                {/* Top Badge & Document Icon */}
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                    • Active Profile
                  </span>

                  <div className="h-12 w-10 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-600 relative">
                    <FileText className="h-5 w-5" />
                    <span className="text-[8px] font-black uppercase bg-blue-600 text-white px-1 rounded-xs absolute -bottom-1">PDF</span>
                  </div>
                </div>

                {/* Resume Title & Last Updated */}
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900">
                    {settings?.resume?.activeResumeTitle || 'Senior Product Designer - Tech'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    Last updated: {settings?.resume?.lastUpdated || '2 days ago'}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* ATS Score Box */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                      <Sparkles className="h-3.5 w-3.5 text-[#3B00FF]" />
                      <span>ATS Score</span>
                    </div>
                    <p className="text-2xl font-black text-[#3B00FF]">
                      {settings?.resume?.atsScore || 85} <span className="text-xs font-bold text-slate-400">/100</span>
                    </p>
                    <div className="h-1.5 rounded-full bg-indigo-200 overflow-hidden">
                      <div className="h-full bg-[#3B00FF] rounded-full" style={{ width: `${settings?.resume?.atsScore || 85}%` }} />
                    </div>
                  </div>

                  {/* Keyword Match Box */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                      <History className="h-3.5 w-3.5 text-[#3B00FF]" />
                      <span>Keyword Match</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {(settings?.resume?.keywordMatches || ['Figma', 'UX Research', 'Design Systems']).map((kw, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-md bg-white border border-indigo-150 text-[10px] font-bold text-slate-700">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/candidate/resume')}
                    className="px-5 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Optimize</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/candidate/resume')}
                    className="px-5 py-2.5 rounded-xl border border-[#3B00FF] text-[#3B00FF] hover:bg-purple-50 text-xs font-black flex items-center justify-center cursor-pointer"
                  >
                    Upload New
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= ACCOUNT DELETION MODAL ================= */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp border border-slate-100 font-sans">
              
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h3 className="text-base font-black text-rose-600">
                  Delete Candidate Account
                </h3>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                This action is irreversible. All your candidate profile records, saved applications, resume versions, and settings will be permanently removed.
              </p>

              <form onSubmit={handleSubmitDeleteAccount} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Password Confirmation *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={deleteConfirmForm.password}
                    onChange={(e) => setDeleteConfirmForm({ ...deleteConfirmForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Type DELETE to confirm *</label>
                  <input
                    type="text"
                    required
                    placeholder="DELETE"
                    value={deleteConfirmForm.confirmationText}
                    onChange={(e) => setDeleteConfirmForm({ ...deleteConfirmForm, confirmationText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingDelete}
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-extrabold hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingDelete ? 'Deleting...' : 'Confirm Deletion'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </CandidateLayout>
  );
}
