import { useState, useEffect } from 'react';
import { AlertCircle, Camera } from 'lucide-react';
import { getAdminProfile } from '../../services/admin/adminProfileService';
import { getProfilePhotoFromStorage, saveProfilePhotoToStorage, subscribeProfilePhoto } from '../../services/admin/profilePhotoSync';

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  
  // Future Django integration:
  // Name and email initially come from the Super Admin-created account.
  // Other profile fields are initially empty.
  // Load and save the authenticated Admin's profile here.
  // Replace confirmed UI data only after backend success.
  const [profile, setProfile] = useState({
    fullName: 'Alice Smith',
    email: 'alice.smith@tnjobz.gov.in',
    phoneNumber: '',
    addressLine: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    profilePhoto: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    profilePhoto: null
  });
  
  const [error, setError] = useState(null);
  const [saveWarning, setSaveWarning] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showPhotoDropdown, setShowPhotoDropdown] = useState(false);

  useEffect(() => {
    // Sync external profile photo updates
    const unsubscribe = subscribeProfilePhoto((newPhoto) => {
      setProfile(prev => ({ ...prev, profilePhoto: newPhoto }));
    });

    getAdminProfile().then((res) => {
      if (res) {
        setProfile(prev => ({ ...prev, ...res }));
      }
      // Load current saved photo from localStorage
      const savedPhoto = getProfilePhotoFromStorage('current-admin');
      if (savedPhoto) {
        setProfile(prev => ({ ...prev, profilePhoto: savedPhoto }));
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 font-sans text-xs text-slate-500">
        Loading Profile...
      </div>
    );
  }

  const handleEdit = () => {
    setFormState({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      addressLine: profile.addressLine,
      city: profile.city,
      district: profile.district,
      state: profile.state,
      pinCode: profile.pinCode,
      profilePhoto: profile.profilePhoto
    });
    setSaveWarning(null);
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSaveWarning(null);
  };

  // Crop controls
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    setShowPhotoDropdown(false);
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be 2MB or less.");
      return;
    }
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setIsCropOpen(true);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = () => {
    // Process crop image using browser canvas
    const img = new Image();
    img.src = cropImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Simple centered crop calculation applying zoom and offsets
      const size = Math.min(img.width, img.height) / zoom;
      const sx = (img.width - size) / 2 - position.x;
      const sy = (img.height - size) / 2 - position.y;

      ctx.drawImage(img, sx, sy, size, size, 0, 0, 512, 512);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      // Save directly to localStorage to keep profile synced immediately
      const saved = saveProfilePhotoToStorage(compressedDataUrl, 'current-admin');
      if (saved) {
        setProfile(prev => ({ ...prev, profilePhoto: compressedDataUrl }));
        if (isEditing) {
          setFormState(prev => ({ ...prev, profilePhoto: compressedDataUrl }));
        }
      }
      setIsCropOpen(false);
    };
  };

  const handleRemovePhoto = () => {
    setShowPhotoDropdown(false);
    if (confirm("Remove profile photo? Your initials will be shown instead.")) {
      saveProfilePhotoToStorage(null, 'current-admin');
      setProfile(prev => ({ ...prev, profilePhoto: null }));
      if (isEditing) {
        setFormState(prev => ({ ...prev, profilePhoto: null }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.fullName || !formState.fullName.trim()) {
      setError("Full Name is required and cannot contain only whitespace.");
      return;
    }
    
    setProfile({
      fullName: formState.fullName,
      email: profile.email,
      phoneNumber: formState.phoneNumber,
      addressLine: formState.addressLine,
      city: formState.city,
      district: formState.district,
      state: formState.state,
      pinCode: formState.pinCode,
      profilePhoto: profile.profilePhoto
    });

    setSaveWarning("Backend is not connected. Your changes are not permanently saved yet.");
  };

  // Drag logic for crop window
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const initials = profile.fullName
    ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm font-medium text-slate-600 mt-1">
          View and complete your Admin profile information.
        </p>
      </div>

      {/* Main layout grid pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl items-start">
        
        {/* Left Column - Profile summary card */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 p-6 flex flex-col items-center text-center space-y-5">
          <div className="relative group shrink-0">
            {profile.profilePhoto ? (
              <img 
                src={profile.profilePhoto} 
                alt="Profile Avatar" 
                className="h-20 w-20 rounded-full object-cover border border-slate-200" 
              />
            ) : initials ? (
              <div className="h-20 w-20 bg-indigo-50 border border-slate-200 flex items-center justify-center rounded-full text-[#4A1DDF] font-bold text-xl">
                {initials}
              </div>
            ) : (
              <div className="h-20 w-20 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-full text-slate-400">
                <Camera className="h-9 w-9" />
              </div>
            )}

            {/* Photo edit options popover camera button */}
            <div className="absolute bottom-0 right-0">
              <button 
                type="button"
                onClick={() => setShowPhotoDropdown(!showPhotoDropdown)}
                className="h-7 w-7 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4A1DDF]/40"
                aria-label="Edit Profile Picture"
              >
                <Camera className="h-3.5 w-3.5 text-slate-600" />
              </button>

              {showPhotoDropdown && (
                <div className="absolute left-0 mt-1 w-44 bg-white rounded-lg border border-slate-200 shadow-xl py-1 text-left z-20">
                  <label className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                    Upload New Photo
                    <input 
                      type="file" 
                      accept=".png,.jpg,.jpeg,.webp" 
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                  </label>
                  {profile.profilePhoto && (
                    <button 
                      type="button" 
                      onClick={handleRemovePhoto}
                      className="w-full block px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left border-none bg-transparent cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => setShowPhotoDropdown(false)}
                    className="w-full block px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-50 text-left border-none bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5 w-full">
            <h3 className="text-[16px] font-bold text-slate-905 truncate">{profile.fullName}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold tracking-wide bg-indigo-50 text-[#4A1DDF]">
              Admin
            </span>
          </div>
          <p className="text-[13px] font-normal text-slate-500 break-all w-full">{profile.email}</p>
          
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="w-full rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] text-white text-[13px] font-bold py-2.5 transition-colors cursor-pointer min-h-[44px]"
            >
              Complete Profile
            </button>
          )}
        </div>

        {/* Right Column - Profile details & edit forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-[16px] font-semibold text-slate-900">Personal Information</h3>
                {!isEditing && (
                  <button 
                    type="button"
                    onClick={handleEdit}
                    className="text-[13px] font-bold text-[#4A1DDF] hover:underline cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-lg bg-red-50 border border-red-150 text-[13px] font-medium text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {saveWarning && (
                <div className="flex items-center gap-2 p-3.5 rounded-lg bg-yellow-50 border border-yellow-150 text-[13px] font-medium text-yellow-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{saveWarning}</span>
                </div>
              )}

              {/* Account Information Section */}
              <div className="space-y-4">
                <h4 className="text-[15px] font-semibold text-slate-805">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-705">Full Name *</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formState.fullName}
                        onChange={(e) => setFormState(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter full name"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-800 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                      />
                    ) : (
                      <p className="text-[14px] font-medium text-slate-800 py-1.5">
                        {profile.fullName || <span className="text-slate-400 font-normal italic">Enter full name</span>}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-750">Email Address *</label>
                    <p className="text-[14px] font-medium text-slate-800 py-1.5 break-all">
                      {profile.email || <span className="text-slate-400 font-normal italic">Enter email address</span>}
                    </p>
                    {isEditing && (
                      <span className="text-[11px] font-normal text-slate-455 block">
                        Contact the Super Admin to change your login email.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h3 className="text-[15px] font-bold text-slate-805">Contact & Verification Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-705">Phone Number</label>
                    {isEditing ? (
                      <input 
                        type="tel"
                        value={formState.phoneNumber}
                        onChange={(e) => setFormState(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="Enter phone number"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-800 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                      />
                    ) : (
                      <p className="text-[14px] font-medium text-slate-800 py-1.5">
                        {profile.phoneNumber || <span className="text-slate-400 font-normal italic">Enter phone number</span>}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-705">PIN Code</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formState.pinCode}
                        onChange={(e) => setFormState(prev => ({ ...prev, pinCode: e.target.value }))}
                        placeholder="Enter PIN code"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-800 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                      />
                    ) : (
                      <p className="text-[14px] font-medium text-slate-800 py-1.5">
                        {profile.pinCode || <span className="text-slate-400 font-normal italic">Enter PIN code</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h3 className="text-[15px] font-bold text-slate-805">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-semibold text-slate-705">Address Line</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formState.addressLine}
                        onChange={(e) => setFormState(prev => ({ ...prev, addressLine: e.target.value }))}
                        placeholder="Enter address"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-800 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                      />
                    ) : (
                      <p className="text-[14px] font-medium text-slate-800 py-1.5">
                        {profile.addressLine || <span className="text-slate-400 font-normal italic">Enter address</span>}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-705">City / Town</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formState.city}
                        onChange={(e) => setFormState(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Enter city or town"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-805 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                      />
                    ) : (
                      <p className="text-[14px] font-medium text-slate-800 py-1.5">
                        {profile.city || <span className="text-slate-400 font-normal italic">Enter city or town</span>}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-705">District</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formState.district}
                        onChange={(e) => setFormState(prev => ({ ...prev, district: e.target.value }))}
                        placeholder="Enter district"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-800 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                      />
                    ) : (
                      <p className="text-[14px] font-medium text-slate-800 py-1.5">
                        {profile.district || <span className="text-slate-400 font-normal italic">Enter district</span>}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-705">State</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formState.state}
                        onChange={(e) => setFormState(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Enter state"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-800 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                      />
                    ) : (
                      <p className="text-[14px] font-medium text-slate-800 py-1.5">
                        {profile.state || <span className="text-slate-400 font-normal italic">Enter state</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action draft controls buttons */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-slate-200 px-4.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] px-5 py-2 text-[13px] font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

      </div>

      {/* Center Crop Preview Modal Dialog */}
      {isCropOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center font-sans">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsCropOpen(false)} />
          
          <div 
            role="dialog"
            aria-modal="true"
            className="relative bg-white rounded-lg border border-slate-200 shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4 z-10"
          >
            <h3 className="text-[15px] font-bold text-slate-900">Crop Profile Photo</h3>
            
            <div 
              className="relative w-full aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-move select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={cropImageSrc} 
                alt="Original source crop preview" 
                draggable="false"
                className="absolute origin-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  objectFit: 'cover'
                }}
              />
              {/* Target circular mask overlay highlights */}
              <div className="absolute inset-0 border-[32px] border-slate-900/40 pointer-events-none flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-white" />
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-650">Zoom</label>
              <input 
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#4A1DDF]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCropOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] text-white px-5 py-2 text-[13px] font-semibold cursor-pointer min-h-[44px]"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
