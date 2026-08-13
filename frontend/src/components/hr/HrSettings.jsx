import React, { useState, useEffect } from 'react';
import CustomSelect from '../CustomSelect';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  LogOut, 
  KeyRound, 
  CheckCircle2 
} from 'lucide-react';

export default function HrSettings() {
  const [activeTab, setActiveTab] = useState('Account');
  const [toastMessage, setToastMessage] = useState('');
  
  // Common edit mode flag for active tab
  const [isEditing, setIsEditing] = useState(false);

  // Account Form State
  const [accountForm, setAccountForm] = useState({
    fullName: 'HR Manager',
    workEmail: 'hr.manager@company.com',
    phone: '+91 98765 43210',
    designation: 'HR Manager',
    department: 'Human Resources',
    orgName: 'TN Jobz Pvt Ltd'
  });
  const [tempAccount, setTempAccount] = useState({ ...accountForm });

  // Notifications State
  const [notifs, setNotifs] = useState({
    newApplications: true,
    interviewReminders: true,
    candidateMessages: true,
    jobExpiryAlerts: false,
    teamActivity: true,
    weeklyReports: false,
    emailNotifications: true,
    smsNotifications: false
  });
  const [tempNotifs, setTempNotifs] = useState({ ...notifs });

  // Security State
  const [security, setSecurity] = useState({
    twoFactor: true,
    loginAlerts: true
  });
  const [tempSecurity, setTempSecurity] = useState({ ...security });

  // Preferences State
  const [preferences, setPreferences] = useState({
    defaultJobView: 'Card View',
    defaultFilter: 'All Applications',
    dateFormat: 'DD MMM, YYYY',
    language: 'English'
  });
  const [tempPreferences, setTempPreferences] = useState({ ...preferences });

  // Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    // Attempt to read from consolidated hrProfile first for Account Details
    const hrProfileStored = localStorage.getItem('hrProfile');
    const storedNotifs = localStorage.getItem('hr_settings_notifs');
    const storedPref = localStorage.getItem('hr_settings_preferences');
    const stored2FA = localStorage.getItem('hr_settings_2fa');
    const storedLoginAlerts = localStorage.getItem('hr_settings_loginalerts');

    if (hrProfileStored) {
      const parsed = JSON.parse(hrProfileStored);
      const acc = {
        fullName: parsed.fullName || '',
        workEmail: parsed.email || '',
        phone: parsed.phone || '',
        designation: parsed.designation || '',
        department: parsed.department || '',
        orgName: parsed.orgName || ''
      };
      setAccountForm(acc);
      setTempAccount(acc);
    } else {
      const storedAccount = localStorage.getItem('hr_settings_account');
      if (storedAccount) {
        const parsed = JSON.parse(storedAccount);
        setAccountForm(parsed);
        setTempAccount(parsed);
      }
    }

    if (storedNotifs) {
      const parsed = JSON.parse(storedNotifs);
      setNotifs(parsed);
      setTempNotifs(parsed);
    }
    if (storedPref) {
      const parsed = JSON.parse(storedPref);
      setPreferences(parsed);
      setTempPreferences(parsed);
    }

    const sec = {
      twoFactor: stored2FA ? JSON.parse(stored2FA) : true,
      loginAlerts: storedLoginAlerts ? JSON.parse(storedLoginAlerts) : true
    };
    setSecurity(sec);
    setTempSecurity(sec);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Reset editing mode whenever active tab changes
  useEffect(() => {
    setIsEditing(false);
    // Sync temps
    setTempAccount({ ...accountForm });
    setTempNotifs({ ...notifs });
    setTempSecurity({ ...security });
    setTempPreferences({ ...preferences });
  }, [activeTab]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    // Revert temps to current saved values
    setTempAccount({ ...accountForm });
    setTempNotifs({ ...notifs });
    setTempSecurity({ ...security });
    setTempPreferences({ ...preferences });
    setIsEditing(false);
  };

  const handleSaveClick = (e) => {
    if (e) e.preventDefault();

    if (activeTab === 'Account') {
      if (!tempAccount.fullName || !tempAccount.workEmail) {
        alert('Full Name and Work Email are required.');
        return;
      }
      setAccountForm(tempAccount);
      localStorage.setItem('hr_settings_account', JSON.stringify(tempAccount));

      // Also merge changes back to consolidated hrProfile and dispatch event
      const currentProfile = JSON.parse(localStorage.getItem('hrProfile') || '{}');
      const updatedProfile = {
        ...currentProfile,
        fullName: tempAccount.fullName,
        email: tempAccount.workEmail,
        phone: tempAccount.phone,
        designation: tempAccount.designation,
        department: tempAccount.department,
        orgName: tempAccount.orgName
      };
      localStorage.setItem('hrProfile', JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('hr_profile_updated'));

    } else if (activeTab === 'Notifications') {
      setNotifs(tempNotifs);
      localStorage.setItem('hr_settings_notifs', JSON.stringify(tempNotifs));
    } else if (activeTab === 'Security') {
      setSecurity(tempSecurity);
      localStorage.setItem('hr_settings_2fa', JSON.stringify(tempSecurity.twoFactor));
      localStorage.setItem('hr_settings_loginalerts', JSON.stringify(tempSecurity.loginAlerts));
    } else if (activeTab === 'Preferences') {
      setPreferences(tempPreferences);
      localStorage.setItem('hr_settings_preferences', JSON.stringify(tempPreferences));
    }

    setIsEditing(false);
    triggerToast('Changes saved successfully.');
  };

  // Toggle Switch reusable sub-component
  const Toggle = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={() => { if (!disabled) onChange(!checked); }}
      disabled={disabled}
      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-[#8CC63F]' : 'bg-slate-200'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-xs ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );

  return (
    <div className="flex flex-col gap-6 w-full text-left relative">
      
      {/* Toast Notification popup */}
      {toastMessage && (
        <div className="fixed top-24 right-8 bg-[#8CC63F] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-50 text-base font-black animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">Settings</h1>
      </div>

      {/* Main Settings Card Panel */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-xs flex flex-col gap-6 relative min-h-[480px]">
        
        {/* Tabs switcher row */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-px overflow-x-auto scrollbar-none">
          {['Account', 'Notifications', 'Security', 'Preferences'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-base font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-[#8CC63F] text-[#8CC63F]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Workspace content */}
        <div className="flex-grow">
          {activeTab === 'Account' && (
            <div className="flex flex-col gap-6 text-base font-bold text-slate-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    value={tempAccount.fullName}
                    onChange={(e) => setTempAccount({ ...tempAccount, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Work Email</label>
                  <input 
                    type="email" 
                    value={tempAccount.workEmail}
                    onChange={(e) => setTempAccount({ ...tempAccount, workEmail: e.target.value })}
                    disabled={!isEditing}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Phone Number</label>
                  <input 
                    type="text" 
                    value={tempAccount.phone}
                    onChange={(e) => setTempAccount({ ...tempAccount, phone: e.target.value })}
                    disabled={!isEditing}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Designation</label>
                  <input 
                    type="text" 
                    value={tempAccount.designation}
                    onChange={(e) => setTempAccount({ ...tempAccount, designation: e.target.value })}
                    disabled={!isEditing}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Department</label>
                  <input 
                    type="text" 
                    value={tempAccount.department}
                    onChange={(e) => setTempAccount({ ...tempAccount, department: e.target.value })}
                    disabled={!isEditing}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Organization Name</label>
                  <input 
                    type="text" 
                    value={tempAccount.orgName}
                    onChange={(e) => setTempAccount({ ...tempAccount, orgName: e.target.value })}
                    disabled={!isEditing}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="flex flex-col gap-4 text-base font-bold text-slate-500">
              <h3 className="text-xl font-black text-slate-800 tracking-tight border-b border-slate-50 pb-2 mb-2">Notification Preferences</h3>
              {[
                { key: 'newApplications', label: 'New Applications', desc: 'Notify me immediately when candidates apply' },
                { key: 'interviewReminders', label: 'Interview Reminders', desc: 'Send reminders for upcoming scheduled interview slots' },
                { key: 'candidateMessages', label: 'Candidate Messages', desc: 'Direct alerts when candidates send a message' },
                { key: 'jobExpiryAlerts', label: 'Job Expiry Alerts', desc: 'Alert when posted listings are close to expiring' },
                { key: 'teamActivity', label: 'Team Activity', desc: 'Updates on team changes and role delegation logs' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Compile a weekly summary digest of all actions' },
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send notifications to my registered email address' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Deliver updates on the phone number via text' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50/50">
                  <div className="text-left">
                    <p className="text-slate-700 text-base font-black">{item.label}</p>
                    <p className="text-sm font-bold text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle 
                    checked={tempNotifs[item.key]} 
                    onChange={(val) => setTempNotifs({ ...tempNotifs, [item.key]: val })}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="flex flex-col gap-6 text-base font-bold text-slate-500">
              {/* Change Password row */}
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <div className="text-left flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-slate-700 text-base font-black">Change Password</p>
                    <p className="text-sm font-bold text-slate-400 mt-0.5">Revamp security credentials for your credentials periodically</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-base font-black rounded-xl cursor-pointer"
                >
                  Change Password
                </button>
              </div>

              {/* 2FA row */}
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <div className="text-left flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-slate-700 text-base font-black">Two-Factor Authentication</p>
                    <p className="text-sm font-bold text-slate-400 mt-0.5">Double credentials safeguard validation checks</p>
                  </div>
                </div>
                <Toggle 
                  checked={tempSecurity.twoFactor} 
                  onChange={(val) => setTempSecurity({ ...tempSecurity, twoFactor: val })} 
                  disabled={!isEditing}
                />
              </div>

              {/* Active Sessions */}
              <div className="flex flex-col gap-3 py-3 border-b border-slate-50">
                <p className="text-slate-700 text-base font-black">Active Sessions</p>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-[#8CC63F]" />
                      <div className="text-left">
                        <p className="text-slate-700 font-black text-base">Chrome on Windows (Current Session)</p>
                        <p className="text-sm text-slate-400 font-bold">Chennai, Tamil Nadu, India • Active now</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div className="text-left">
                        <p className="text-slate-600 font-black text-base">Safari on iPhone</p>
                        <p className="text-sm text-slate-400 font-bold">Mumbai, Maharashtra, India • 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Alerts row */}
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <div className="text-left">
                  <p className="text-slate-700 text-base font-black">Login Alerts</p>
                  <p className="text-sm font-bold text-slate-400 mt-0.5">Alert me when my account is logged in from a new machine</p>
                </div>
                <Toggle 
                  checked={tempSecurity.loginAlerts} 
                  onChange={(val) => setTempSecurity({ ...tempSecurity, loginAlerts: val })} 
                  disabled={!isEditing}
                />
              </div>

              {/* Logout from all devices */}
              <div className="flex items-center justify-between py-3">
                <div className="text-left">
                  <p className="text-slate-700 text-base font-black">Logout from All Devices</p>
                  <p className="text-sm font-bold text-slate-400 mt-0.5">Force sign out of other active machines worldwide</p>
                </div>
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-base font-black rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout All</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Preferences' && (
            <div className="flex flex-col gap-5 text-base font-bold text-slate-500">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-black text-slate-500 text-left">Default Job View</label>
                <CustomSelect 
                  value={tempPreferences.defaultJobView}
                  onChange={(val) => setTempPreferences({ ...tempPreferences, defaultJobView: val })}
                  disabled={!isEditing}
                  options={['Card View', 'Table View']}
                  accentColor="#8CC63F"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-black text-slate-500 text-left">Default Application Filter</label>
                <CustomSelect 
                  value={tempPreferences.defaultFilter}
                  onChange={(val) => setTempPreferences({ ...tempPreferences, defaultFilter: val })}
                  disabled={!isEditing}
                  options={['All Applications', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected']}
                  accentColor="#8CC63F"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-black text-slate-500 text-left">Date Format</label>
                <CustomSelect 
                  value={tempPreferences.dateFormat}
                  onChange={(val) => setTempPreferences({ ...tempPreferences, dateFormat: val })}
                  disabled={!isEditing}
                  options={['DD MMM, YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY']}
                  accentColor="#8CC63F"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-black text-slate-500 text-left">Language</label>
                <CustomSelect 
                  value={tempPreferences.language}
                  onChange={(val) => setTempPreferences({ ...tempPreferences, language: val })}
                  disabled={!isEditing}
                  options={['English', 'Tamil', 'Hindi']}
                  accentColor="#8CC63F"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action button row at the bottom */}
        <div className="flex justify-center border-t border-slate-100 pt-6 mt-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEditClick}
              className="px-8 py-3 bg-[#8CC63F] hover:bg-[#80b835] text-white text-base font-black rounded-xl transition-all shadow-xs cursor-pointer min-w-[200px]"
            >
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveClick}
                className="px-8 py-3 bg-[#8CC63F] hover:bg-[#80b835] text-white text-base font-black rounded-xl transition-all shadow-xs cursor-pointer min-w-[140px]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-base font-black rounded-xl transition-all cursor-pointer min-w-[140px]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-scaleUp">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-base font-bold text-slate-500">
              <div className="flex flex-col gap-1.5">
                <label className="text-left font-black text-sm">Current Password</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50 border border-slate-200 focus:border-[#8CC63F] focus:outline-none rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-left font-black text-sm">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50 border border-slate-200 focus:border-[#8CC63F] focus:outline-none rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-left font-black text-sm">Confirm Password</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50 border border-slate-200 focus:border-[#8CC63F] focus:outline-none rounded-xl"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 text-base font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newPassword !== confirmPassword) {
                    alert('Passwords do not match.');
                    return;
                  }
                  alert('Password changed successfully.');
                  setIsPasswordModalOpen(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 bg-[#8CC63F] hover:bg-[#80b835] text-white text-base font-black rounded-xl cursor-pointer shadow-xs"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-scaleUp">
            <div className="p-6 text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Logout all other sessions?</h3>
                <p className="text-base font-bold text-slate-400 mt-1">This will log you out of all devices except this one.</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-base font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Successfully logged out of all other devices.');
                  setIsLogoutModalOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-base font-black rounded-xl cursor-pointer shadow-xs"
              >
                Logout All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
