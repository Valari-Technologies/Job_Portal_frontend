import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import ProfilePhotoCropModal from '../profile/ProfilePhotoCropModal';

const DEFAULT_PROFILE = {
  fullName: '',
  email: '',
  phone: '',
  designation: '',
  department: '',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  orgName: '',
  website: '',
  companySize: '',
  industry: '',
  headquarters: '',
  workModel: ''
};

export default function HrProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isPhotoActionOpen, setIsPhotoActionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);

  // Temp form buffers for edit/cancel behavior
  const [tempProfile, setTempProfile] = useState({ ...DEFAULT_PROFILE });
  const fileInputRef = useRef(null);

  // Initialize and load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hrProfile');
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setTempProfile(parsed);
    } else {
      const auth = JSON.parse(localStorage.getItem('hrAuth') || '{}');
      const initial = {
        ...DEFAULT_PROFILE,
        fullName: auth.fullName || 'HR Manager',
        email: auth.email || 'hr.manager@company.com'
      };
      localStorage.setItem('hrProfile', JSON.stringify(initial));
      setProfile(initial);
      setTempProfile(initial);
      window.dispatchEvent(new Event('hr_profile_updated'));
    }
  }, []);

  useEffect(() => {
    const handleTriggerEdit = () => {
      setTempProfile({ ...profile });
      setIsEditingPersonal(true);
      setActiveTab('Personal');
    };
    const handleTabChange = (e) => {
      setActiveTab(e.detail);
      if (e.detail === 'Organization') {
        setIsEditingOrg(true);
      }
    };
    window.addEventListener('hr_profile_trigger_edit', handleTriggerEdit);
    window.addEventListener('hr_profile_change_tab', handleTabChange);
    return () => {
      window.removeEventListener('hr_profile_trigger_edit', handleTriggerEdit);
      window.removeEventListener('hr_profile_change_tab', handleTabChange);
    };
  }, [profile]);

  const saveProfileUpdate = (updatedData) => {
    setProfile(updatedData);
    localStorage.setItem('hrProfile', JSON.stringify(updatedData));
    window.dispatchEvent(new Event('hr_profile_updated'));
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Only image files (JPG, JPEG, PNG, WEBP) are allowed.');
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Maximum file size is 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result);
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // Profile Completion logic
  const calculateCompletion = () => {
    const personalKeys = ['fullName', 'email', 'phone', 'designation', 'department'];
    const filledPersonal = personalKeys.filter(k => profile[k] && profile[k].trim() !== '').length;
    const personalContribution = (filledPersonal / 5) * 50;

    const orgKeys = ['orgName', 'website', 'companySize', 'industry', 'headquarters', 'workModel'];
    const filledOrg = orgKeys.filter(k => profile[k] && profile[k].trim() !== '').length;
    const orgContribution = (filledOrg / 6) * 50;

    return Math.round(personalContribution + orgContribution);
  };

  const completionRate = calculateCompletion();

  // Personal Info Save / Cancel
  const handleSavePersonal = (e) => {
    e.preventDefault();
    if (!tempProfile.fullName || !tempProfile.email) {
      alert('Full Name and Email are required fields.');
      return;
    }
    saveProfileUpdate(tempProfile);
    setIsEditingPersonal(false);
  };

  const handleCancelPersonal = () => {
    setTempProfile({ ...profile });
    setIsEditingPersonal(false);
  };

  // Org Info Save / Cancel
  const handleSaveOrg = (e) => {
    e.preventDefault();
    if (!tempProfile.orgName || !tempProfile.website) {
      alert('Organization Name and Website are required.');
      return;
    }
    saveProfileUpdate(tempProfile);
    setIsEditingOrg(false);
  };

  const handleCancelOrg = () => {
    setTempProfile({ ...profile });
    setIsEditingOrg(false);
  };

  // Circle Progress configuration
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 w-full text-left relative">
      <div>
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">Profile</h1>
        <p className="text-lg font-bold text-slate-400 mt-1">Manage your HR and organization information</p>
      </div>

      {/* TOP PROFILE CARD */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-visible">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Circular profile image with upload action */}
          <div 
            onClick={() => setIsPhotoActionOpen(true)}
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#8CC63F]/30 shadow-xs relative group cursor-pointer shrink-0"
          >
            <img src={profile.image} alt="HR Manager" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden" 
            />
          </div>

          <div className="leading-tight text-center sm:text-left">
            <h2 className="text-3xl font-black text-slate-800">{profile.fullName}</h2>
            <p className="text-base font-bold text-slate-400 mt-1">{profile.email}</p>
          </div>
        </div>

        {/* Circular profile completion indicator */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r={radius} stroke="#F1F5F9" strokeWidth="5" fill="transparent" />
              <circle 
                cx="28" 
                cy="28" 
                r={radius} 
                stroke="#8CC63F" 
                strokeWidth="5" 
                fill="transparent"
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-sm font-black text-slate-700">{completionRate}%</span>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-wide">Profile Completion</span>
        </div>
      </div>

      {/* TABS ROW */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-px overflow-x-auto scrollbar-none mt-2">
        <button
          onClick={() => { setActiveTab('Personal'); }}
          className={`px-4 py-2.5 text-base font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'Personal' 
              ? 'border-[#8CC63F] text-[#8CC63F]' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => { setActiveTab('Organization'); }}
          className={`px-4 py-2.5 text-base font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'Organization' 
              ? 'border-[#8CC63F] text-[#8CC63F]' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Organization Information
        </button>
      </div>

      {/* TABS WORKSPACE CONTENT */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xs flex flex-col gap-6 text-base font-bold text-slate-500">
        
        {activeTab === 'Personal' && (
          <form onSubmit={handleSavePersonal} className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    value={isEditingPersonal ? tempProfile.fullName : profile.fullName}
                    onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
                    disabled={!isEditingPersonal}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Phone</label>
                  <input 
                    type="text" 
                    value={isEditingPersonal ? tempProfile.phone : profile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    disabled={!isEditingPersonal}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Designation</label>
                  <input 
                    type="text" 
                    value={isEditingPersonal ? tempProfile.designation : profile.designation}
                    onChange={(e) => setTempProfile({ ...tempProfile, designation: e.target.value })}
                    disabled={!isEditingPersonal}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Email</label>
                  <input 
                    type="email" 
                    value={isEditingPersonal ? tempProfile.email : profile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    disabled={!isEditingPersonal}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Department</label>
                  <input 
                    type="text" 
                    value={isEditingPersonal ? tempProfile.department : profile.department}
                    onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })}
                    disabled={!isEditingPersonal}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Action Row buttons */}
            <div className="flex items-center justify-start gap-2.5 mt-4">
              {!isEditingPersonal ? (
                <button
                  type="button"
                  onClick={() => { setTempProfile({ ...profile }); setIsEditingPersonal(true); }}
                  className="px-6 py-2.5 bg-[#8CC63F] hover:bg-[#7db238] text-white text-base font-black rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#8CC63F] hover:bg-[#7db238] text-white text-base font-black rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPersonal}
                    className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-base font-black rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        {activeTab === 'Organization' && (
          <form onSubmit={handleSaveOrg} className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Organization Name</label>
                  <input 
                    type="text" 
                    value={isEditingOrg ? tempProfile.orgName : profile.orgName}
                    onChange={(e) => setTempProfile({ ...tempProfile, orgName: e.target.value })}
                    disabled={!isEditingOrg}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Company Website</label>
                  <input 
                    type="text" 
                    value={isEditingOrg ? tempProfile.website : profile.website}
                    onChange={(e) => setTempProfile({ ...tempProfile, website: e.target.value })}
                    disabled={!isEditingOrg}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Company Size</label>
                  <input 
                    type="text" 
                    value={isEditingOrg ? tempProfile.companySize : profile.companySize}
                    onChange={(e) => setTempProfile({ ...tempProfile, companySize: e.target.value })}
                    disabled={!isEditingOrg}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Industry</label>
                  <input 
                    type="text" 
                    value={isEditingOrg ? tempProfile.industry : profile.industry}
                    onChange={(e) => setTempProfile({ ...tempProfile, industry: e.target.value })}
                    disabled={!isEditingOrg}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Headquarters</label>
                  <input 
                    type="text" 
                    value={isEditingOrg ? tempProfile.headquarters : profile.headquarters}
                    onChange={(e) => setTempProfile({ ...tempProfile, headquarters: e.target.value })}
                    disabled={!isEditingOrg}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-400">Work Model</label>
                  <input 
                    type="text" 
                    value={isEditingOrg ? tempProfile.workModel : profile.workModel}
                    onChange={(e) => setTempProfile({ ...tempProfile, workModel: e.target.value })}
                    disabled={!isEditingOrg}
                    className="px-4 py-2.5 text-base font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#8CC63F] disabled:opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Action Row buttons */}
            <div className="flex items-center justify-start gap-2.5 mt-4">
              {!isEditingOrg ? (
                <button
                  type="button"
                  onClick={() => { setTempProfile({ ...profile }); setIsEditingOrg(true); }}
                  className="px-6 py-2.5 bg-[#8CC63F] hover:bg-[#7db238] text-white text-base font-black rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#8CC63F] hover:bg-[#7db238] text-white text-base font-black rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrg}
                    className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-base font-black rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        <PhotoActionModal
          isOpen={isPhotoActionOpen}
          onClose={() => setIsPhotoActionOpen(false)}
          onUploadNew={() => {
            if (fileInputRef.current) fileInputRef.current.click();
          }}
          onEditCurrent={() => {
            if (profile.image) {
              setCropImageSrc(profile.image);
              setIsCropOpen(true);
            } else {
              alert("No profile photo exists to edit. Please upload a new photo.");
            }
          }}
        />

        <ProfilePhotoCropModal
          isOpen={isCropOpen}
          imageSrc={cropImageSrc}
          onClose={() => setIsCropOpen(false)}
          onSave={(croppedBase64) => {
            const updated = { ...profile, image: croppedBase64 };
            saveProfileUpdate(updated);
            setIsCropOpen(false);
          }}
        />
      </div>
    </div>
  );
}

// Reusable Choice Modal for Upload vs Edit Photo
function PhotoActionModal({ isOpen, onClose, onUploadNew, onEditCurrent }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-fadeIn text-center">
      <div className="bg-white rounded-3xl w-full max-w-xs border border-slate-100 shadow-xl overflow-hidden p-6">
        <h4 className="text-xl font-bold text-slate-800 mb-5">Profile Photo</h4>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { onUploadNew(); onClose(); }}
            className="w-full py-3 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-base font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Upload New Photo
          </button>
          <button
            type="button"
            onClick={() => { onEditCurrent(); onClose(); }}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-base font-semibold border border-slate-150 rounded-xl transition-colors cursor-pointer"
          >
            Edit Current Photo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-500 text-[15px] font-medium rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
