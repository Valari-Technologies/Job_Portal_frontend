import React, { useState, useEffect, useRef } from 'react';
import { getProfile, saveProfile } from '../../components/superadmin/profile/profileData';
import ChangePasswordModal from '../../components/superadmin/profile/ChangePasswordModal';
import ProfilePhotoCropModal from '../../components/profile/ProfilePhotoCropModal';

export default function SuperAdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isPhotoActionOpen, setIsPhotoActionOpen] = useState(false);
  
  // Form edit states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDesignation, setEditDesignation] = useState('');

  // Password Modal
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Load profile on mount
  useEffect(() => {
    const data = getProfile();
    setProfile(data);
    
    setEditName(data.name);
    setEditEmail(data.email);
    setEditPhone(data.phone);
    setEditDesignation(data.designation);
  }, []);

  if (!profile) return null;

  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
    setEditDesignation(profile.designation);
    setIsEditing(false);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!editName || !editEmail || !editPhone || !editDesignation) {
      alert('Please fill out all profile fields.');
      return;
    }
    const updated = {
      ...profile,
      name: editName,
      email: editEmail,
      phone: editPhone,
      designation: editDesignation
    };
    setProfile(updated);
    saveProfile(updated);
    setIsEditing(false);
  };

  // Image Upload File Picker Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please select a valid image file (JPG, JPEG, PNG, WEBP).');
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Maximum file size is 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target.result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerFileSelect = () => {
    setIsPhotoActionOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Profile</h2>
      </div>

      {/* Main glass card layout matching Figma */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-8 flex flex-col lg:flex-row gap-12 w-full">
        
        {/* Hidden File Picker Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
          accept="image/png, image/jpeg, image/jpg" 
          className="hidden"
        />

        {/* Left Column: Avatar & Basic Information */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:w-[35%] lg:border-r lg:border-slate-100/50 lg:pr-12 shrink-0">
          
          {/* Avatar Photo */}
          <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
            <img 
              src={profile.photo} 
              alt="Super Admin Profile" 
              className="w-32 h-32 rounded-full object-cover border border-slate-100/80 shadow-xs transition-opacity group-hover:opacity-85" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-white text-xs font-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Change Photo
            </div>
          </div>

          {/* Read-only / Editable Contact Fields */}
          <div className="w-full flex flex-col gap-3 font-semibold text-sm">
            {isEditing ? (
              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{profile.name}</h3>
                <span className="text-[#8CC63F] font-bold text-sm block mt-1 hover:underline select-all">{profile.email}</span>
                <span className="text-slate-400 font-bold text-sm block">{profile.phone}</span>
              </div>
            )}
          </div>

          {/* Divider Line */}
          <div className="h-[1px] w-full bg-slate-100/50"></div>

          {/* Designation */}
          <div className="w-full">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Designation</span>
            {isEditing ? (
              <input
                type="text"
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
              />
            ) : (
              <span className="text-slate-700 font-black text-base leading-tight block">
                {profile.designation}
              </span>
            )}
          </div>

        </div>

        {/* Right Column: Account Information Table & Actions */}
        <div className="flex-grow flex flex-col gap-6">
          
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Account Information</h3>

          {/* Account Table Container */}
          <div className="border border-slate-100/50 rounded-2xl overflow-hidden bg-white/[0.03] shadow-3xs">
            <div className="divide-y divide-slate-100/30 text-sm font-bold text-slate-600">
              
              {/* Role */}
              <div className="flex items-center justify-between p-4.5">
                <span className="text-indigo-600 font-black">Role</span>
                <span className="text-slate-700">{profile.role}</span>
              </div>

              {/* Account Status */}
              <div className="flex items-center justify-between p-4.5">
                <span className="text-indigo-600 font-black">Account Status</span>
                <span className="text-slate-700">{profile.status}</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between p-4.5">
                <span className="text-indigo-600 font-black">Created Date</span>
                <span className="text-slate-700">{profile.createdDate}</span>
              </div>

              {/* Last Login */}
              <div className="flex items-center justify-between p-4.5">
                <span className="text-indigo-600 font-black">Last Login</span>
                <span className="text-slate-700">{profile.lastLogin}</span>
              </div>

            </div>
          </div>

          {/* Divider Line */}
          <div className="h-[1px] w-full bg-slate-100/50 my-2"></div>

          {/* Form Actions footer */}
          <div className="flex items-center gap-3.5 flex-wrap">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveClick}
                  className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelClick}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 text-xs font-black rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditClick}
                  className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsPasswordOpen(true)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black rounded-xl transition-colors cursor-pointer"
                >
                  Change Password
                </button>
                <button
                  onClick={triggerFileSelect}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black rounded-xl transition-colors cursor-pointer"
                >
                  Change Photo
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />

      <PhotoActionModal
        isOpen={isPhotoActionOpen}
        onClose={() => setIsPhotoActionOpen(false)}
        onUploadNew={() => {
          if (fileInputRef.current) fileInputRef.current.click();
        }}
        onEditCurrent={() => {
          if (profile.photo) {
            setCropImageSrc(profile.photo);
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
          const updated = { ...profile, photo: croppedBase64 };
          setProfile(updated);
          saveProfile(updated);
          setIsCropOpen(false);
        }}
      />
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
