import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import ImageCropModal from '../../components/shared/ImageCropModal';
import CustomDropdown from '../../components/shared/CustomDropdown';
import { useCandidateUser } from '../../context/CandidateUserContext';
import {
  getCandidateProfile,
  updateCandidateProfile,
  uploadCandidateProfilePhoto,
  removeCandidateProfilePhoto,
  updateCandidateExperience,
  updateCandidateEducation,
  updateCandidateCertifications,
  updateCandidateSkills,
  updateCandidateLinks
} from '../../services/candidate/candidateProfileService';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import { INDIA_STATES, getDistrictsForState, parseLocationString } from '../../data/indiaLocations';
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Star,
  Plus,
  Code2,
  Cloud,
  Briefcase,
  GraduationCap,
  Award,
  Camera,
  Trash2,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CandidateProfilePage() {
  const navigate = useNavigate();
  const { profile: contextProfile, refreshProfile, updatePhoto, removePhoto } = useCandidateUser();
  const fileInputRef = useRef(null);

  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Full Profile State
  const [profile, setProfile] = useState(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState('personal'); // 'personal' | 'skills' | 'experience' | 'education' | 'links'

  // Photo Upload & Crop Modal State
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    fullName: '',
    headline: '',
    state: '',
    district: '',
    location: '',
    phone: '',
    summary: ''
  });

  const [skillsForm, setSkillsForm] = useState({
    languagesStr: '',
    technologiesStr: ''
  });

  const [experiencesForm, setExperiencesForm] = useState([]);
  const [educationForm, setEducationForm] = useState([]);
  const [certificationsForm, setCertificationsForm] = useState([]);
  const [linksForm, setLinksForm] = useState({
    github: '',
    linkedin: '',
    portfolio: '',
    expectedSalary: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Check Onboarding Guard (Direct access to profile without route lockout)
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

  // Initialize Edit Forms from Profile data
  const initEditForms = useCallback((data) => {
    if (!data) return;
    const parsed = parseLocationString(data.location || '');
    const stateVal = data.state || parsed.state || 'Tamil Nadu';
    const districtVal = data.district || parsed.district || '';

    setPersonalForm({
      fullName: data.fullName || '',
      headline: data.headline || '',
      state: stateVal,
      district: districtVal,
      location: data.location || (districtVal ? `${districtVal}, ${stateVal}` : stateVal),
      phone: data.phone || '',
      summary: data.summary || ''
    });

    setSkillsForm({
      languagesStr: (data.programmingLanguages || []).join(', '),
      technologiesStr: (data.technologies || []).join(', ')
    });

    setExperiencesForm(data.experiences || []);
    setEducationForm(data.education || []);
    setCertificationsForm(data.certifications || []);
    setLinksForm({
      github: data.links?.github || '',
      linkedin: data.links?.linkedin || '',
      portfolio: data.links?.portfolio || '',
      expectedSalary: data.links?.expectedSalary || ''
    });
  }, []);

  // 2. Fetch Candidate Profile Data
  const loadProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCandidateProfile();
      setProfile(data);
      initEditForms(data);
    } catch (err) {
      console.error('Failed to load candidate profile:', err);
      setError("We couldn't load your profile details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [initEditForms]);

  useEffect(() => {
    let isMounted = true;
    if (isCheckingOnboarding) return;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCandidateProfile();
        if (isMounted) {
          setProfile(data);
          initEditForms(data);
        }
      } catch (err) {
        console.error('Failed to load candidate profile:', err);
        if (isMounted) setError("We couldn't load your profile details. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isCheckingOnboarding, initEditForms]);

  // Open Edit Modal with target tab
  const handleOpenEditModal = (tab = 'personal') => {
    if (profile) initEditForms(profile);
    setActiveEditTab(tab);
    setIsEditModalOpen(true);
  };

  // Photo Selection & Crop Modal Trigger
  const handleSelectPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Image file size must be less than 5MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedPhotoUrl(previewUrl);
    setShowCropModal(true);
    e.target.value = '';
  };

  // Confirm Crop & Upload Photo
  const handleCropComplete = async (croppedBlob) => {
    setIsUploadingPhoto(true);

    try {
      const res = await updatePhoto(croppedBlob);
      if (res && res.success) {
        setProfile(prev => ({ 
          ...prev, 
          ...(res.profile || {}), 
          avatarUrl: res.avatarUrl 
        }));
        await refreshProfile();
        triggerToast('Profile picture uploaded successfully!');
      } else {
        triggerToast(res?.message || 'Failed to upload photo.');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      triggerToast('Failed to upload photo.');
    } finally {
      setIsUploadingPhoto(false);
      if (selectedPhotoUrl) {
        URL.revokeObjectURL(selectedPhotoUrl);
        setSelectedPhotoUrl(null);
      }
      setShowCropModal(false);
    }
  };

  // Remove Photo
  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    try {
      const res = await removePhoto();
      if (res && res.success) {
        setProfile(prev => ({ 
          ...prev, 
          ...(res.profile || {}), 
          avatarUrl: null 
        }));
        await refreshProfile();
        triggerToast('Profile picture removed.');
      }
    } catch (err) {
      console.error('Error removing photo:', err);
      triggerToast('Failed to remove photo.');
    }
  };

  // State & District change handlers
  const handleStateChange = (newState) => {
    const dists = getDistrictsForState(newState);
    const newDistrict = dists.includes(personalForm.district) ? personalForm.district : '';
    const newLoc = newDistrict ? `${newDistrict}, ${newState}` : newState;
    setPersonalForm(prev => ({
      ...prev,
      state: newState,
      district: newDistrict,
      location: newLoc
    }));
  };

  const handleDistrictChange = (newDistrict) => {
    const newLoc = newDistrict ? `${newDistrict}, ${personalForm.state}` : (personalForm.state || '');
    setPersonalForm(prev => ({
      ...prev,
      district: newDistrict,
      location: newLoc
    }));
  };

  // Save Personal Details Form
  const handleSavePersonal = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...personalForm,
        location: personalForm.district ? `${personalForm.district}, ${personalForm.state}` : (personalForm.state || '')
      };
      const res = await updateCandidateProfile(payload);
      if (res.success) {
        setProfile(res.profile);
        refreshProfile(); // Sync name and info globally across Candidate pages
        triggerToast('Personal details updated!');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      triggerToast('Failed to update personal details.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Skills Form
  const handleSaveSkills = async () => {
    setIsSaving(true);
    try {
      const langs = skillsForm.languagesStr.split(',').map(s => s.trim()).filter(Boolean);
      const techs = skillsForm.technologiesStr.split(',').map(s => s.trim()).filter(Boolean);

      const res = await updateCandidateSkills(langs, techs);
      if (res.success) {
        setProfile(res.profile);
        refreshProfile();
        triggerToast('Skills & Technologies updated!');
      }
    } catch (err) {
      console.error('Error saving skills:', err);
      triggerToast('Failed to update skills.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Experience Form
  const handleSaveExperience = async () => {
    setIsSaving(true);
    try {
      const res = await updateCandidateExperience(experiencesForm);
      if (res.success) {
        setProfile(res.profile);
        refreshProfile();
        triggerToast('Experience timeline updated!');
      }
    } catch (err) {
      console.error('Error saving experience:', err);
      triggerToast('Failed to update experience.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Education & Certifications
  const handleSaveEduCert = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateCandidateEducation(educationForm),
        updateCandidateCertifications(certificationsForm)
      ]);
      const updated = await getCandidateProfile();
      setProfile(updated);
      refreshProfile();
      triggerToast('Education & Certifications updated!');
    } catch (err) {
      console.error('Error saving education/certifications:', err);
      triggerToast('Failed to update education or certifications.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Links & Preferences
  const handleSaveLinks = async () => {
    setIsSaving(true);
    try {
      const res = await updateCandidateLinks(linksForm);
      if (res.success) {
        setProfile(res.profile);
        refreshProfile();
        triggerToast('Portfolio links & preferences updated!');
      }
    } catch (err) {
      console.error('Error saving links:', err);
      triggerToast('Failed to update links.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper: Add Experience item
  const handleAddExperienceItem = () => {
    setExperiencesForm([
      ...experiencesForm,
      {
        id: `exp_${Date.now()}`,
        roleTitle: '',
        companyName: '',
        period: '',
        location: '',
        description: ''
      }
    ]);
  };

  // Helper: Remove Experience item
  const handleRemoveExperienceItem = (id) => {
    setExperiencesForm(experiencesForm.filter(e => e.id !== id));
  };

  // Helper: Add Education item
  const handleAddEducationItem = () => {
    setEducationForm([
      ...educationForm,
      {
        id: `edu_${Date.now()}`,
        degree: '',
        institution: '',
        period: ''
      }
    ]);
  };

  // Helper: Remove Education item
  const handleRemoveEducationItem = (id) => {
    setEducationForm(educationForm.filter(e => e.id !== id));
  };

  // Helper: Add Certification item
  const handleAddCertificationItem = () => {
    setCertificationsForm([
      ...certificationsForm,
      {
        id: `cert_${Date.now()}`,
        title: '',
        issuedYear: ''
      }
    ]);
  };

  // Helper: Remove Certification item
  const handleRemoveCertificationItem = (id) => {
    setCertificationsForm(certificationsForm.filter(c => c.id !== id));
  };

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading candidate profile...</span>
        </div>
      </CandidateLayout>
    );
  }

  const activeAvatar = profile?.avatarUrl || contextProfile?.avatarUrl;
  const fullName = profile?.fullName || contextProfile?.fullName || 'Candidate';
  const headline = profile?.headline ?? '';
  const location = profile?.location ?? '';
  const completionPct = profile?.completionPercentage ?? 0;

  return (
    <CandidateLayout>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans pb-12">
        
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
              Candidate Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={() => handleOpenEditModal('personal')}
            className="px-3.5 py-1.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-xs cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* --- DESKTOP HEADER (hidden sm:block matching screenshot reference) --- */}
        <div className="hidden sm:flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Candidate Profile
          </h1>

          <button
            type="button"
            onClick={() => handleOpenEditModal('personal')}
            className="px-6 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* --- MAIN 2-COLUMN PROFILE GRID --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 h-96 bg-slate-200 animate-pulse rounded-3xl" />
            <div className="lg:col-span-8 h-96 bg-slate-200 animate-pulse rounded-3xl" />
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load your profile</h3>
            <p className="text-xs font-semibold text-slate-500">{error}</p>
            <button
              type="button"
              onClick={loadProfileData}
              className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-[#3000E0] mx-auto cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* ================= LEFT COLUMN: IDENTITY & PROFILE STRENGTH ================= */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* IDENTITY CARD (Matching Reference Screenshot) */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl text-center shadow-2xs space-y-3 font-sans relative">
                
                {/* Photo Avatar with Camera trigger */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-28 w-28 rounded-full border-2 border-black shadow-sm mx-auto overflow-hidden bg-white flex items-center justify-center group cursor-pointer"
                  title="Click to change profile picture"
                >
                  {activeAvatar ? (
                    <img src={activeAvatar} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-slate-900">
                      {fullName.charAt(0)}
                    </span>
                  )}

                  {/* Hover Camera Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold gap-1">
                    <Camera className="h-5 w-5" />
                    <span>Change</span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleSelectPhoto}
                  className="hidden"
                />

                {/* Candidate Name & Info (Editable like LinkedIn) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {fullName}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('personal')}
                      className="p-1 text-slate-400 hover:text-[#3B00FF] transition-colors cursor-pointer"
                      title="Edit Personal Details"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5">
                    <p className={`text-xs ${headline ? 'font-bold text-slate-600' : 'font-normal italic text-slate-400'}`}>
                      {headline || 'Add your professional headline'}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('personal')}
                      className="p-1 text-slate-400 hover:text-[#3B00FF] transition-colors cursor-pointer"
                      title="Edit Headline (Role Designation)"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className={`text-xs ${location ? 'font-bold text-slate-500' : 'font-normal italic text-slate-400'}`}>
                      {location || 'Add location'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('personal')}
                      className="p-1 text-slate-400 hover:text-[#3B00FF] transition-colors cursor-pointer"
                      title="Edit Location"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {activeAvatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[11px] font-bold text-rose-500 hover:underline pt-2 block mx-auto cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {/* PROFILE STRENGTH CARD (Matching Screenshot) */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs space-y-4 font-sans">
                
                {/* Header: Title + Percentage */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Profile Strength
                  </span>
                  <span className="text-xs font-black text-[#3B00FF]">
                    {completionPct}%
                  </span>
                </div>

                {/* SVG Circular Donut Progress Ring */}
                <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-indigo-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#3B00FF]"
                      strokeDasharray={`${completionPct}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <Star className="absolute h-6 w-6 text-[#3B00FF] fill-[#3B00FF]/10 stroke-[2.2]" />
                </div>

                {/* MISSING SECTIONS TO STAND OUT */}
                {profile?.missingSections && profile.missingSections.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-150">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      MISSING SECTIONS TO STAND OUT
                    </span>

                    <div className="space-y-2">
                      {profile.missingSections.map((sec) => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => handleOpenEditModal(sec.sectionKey === 'github' || sec.sectionKey === 'expectedSalary' ? 'links' : 'personal')}
                          className="w-full text-left flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-[#3B00FF] transition-colors group cursor-pointer"
                        >
                          <div className="h-4 w-4 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                            <Plus className="h-3 w-3 stroke-[3]" />
                          </div>
                          <span className="truncate">{sec.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* ================= RIGHT COLUMN: SKILLS, EXPERIENCE, EDU, CERTS ================= */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* TOP ROW SKILLS GRID (Programming Languages & Technologies) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* PROGRAMMING LANGUAGES CARD */}
                <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4.5 w-4.5 text-[#3B00FF]" />
                      <h3 className="text-xs font-black text-slate-900">
                        Programming Languages
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('skills')}
                      className="p-1 text-slate-400 hover:text-[#3B00FF] transition-colors cursor-pointer"
                      title="Edit Programming Languages"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(profile?.programmingLanguages || []).length > 0 ? (
                      profile.programmingLanguages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-extrabold text-slate-800"
                        >
                          {lang}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1">No programming languages added yet</p>
                    )}
                  </div>
                </div>

                {/* TECHNOLOGIES CARD */}
                <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4.5 w-4.5 text-[#3B00FF]" />
                      <h3 className="text-xs font-black text-slate-900">
                        Technologies
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('skills')}
                      className="p-1 text-slate-400 hover:text-[#3B00FF] transition-colors cursor-pointer"
                      title="Edit Technologies"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(profile?.technologies || []).length > 0 ? (
                      profile.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-extrabold text-slate-800"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1">No technologies added yet</p>
                    )}
                  </div>
                </div>

              </div>

              {/* EXPERIENCE TIMELINE SECTION (Matching Screenshot) */}
              <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl shadow-2xs space-y-5 font-sans relative">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#3B00FF]" />
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Experience
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal('experience')}
                    className="p-2 text-[#3B00FF] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                    title="Edit Experience"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>

                {/* Timeline items list */}
                {(profile?.experiences || []).length > 0 ? (
                  <div className="space-y-6 border-l-2 border-indigo-100 pl-5 ml-2.5 pt-1">
                    {profile.experiences.map((exp) => (
                      <div key={exp.id} className="relative space-y-1">
                        {/* Purple Timeline Dot */}
                        <div className="h-2.5 w-2.5 rounded-full bg-[#3B00FF] absolute -left-[26px] top-1.5 ring-4 ring-white" />

                        <h4 className="text-sm font-black text-slate-900 leading-snug">
                          {exp.roleTitle}
                        </h4>

                        <p className="text-xs font-bold text-slate-500">
                          {exp.companyName} | {exp.period}
                        </p>

                        <p className="text-xs text-slate-600 font-normal leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-xs text-slate-400 font-medium">No work experience added yet</p>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('experience')}
                      className="mt-2 text-xs font-bold text-[#3B00FF] hover:underline cursor-pointer"
                    >
                      + Add Experience
                    </button>
                  </div>
                )}

              </div>

              {/* BOTTOM ROW GRID (Education & Certifications) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* EDUCATION CARD */}
                <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4.5 w-4.5 text-[#3B00FF]" />
                      <h3 className="text-xs font-black text-slate-900">
                        Education
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('education')}
                      className="p-1 text-slate-400 hover:text-[#3B00FF] transition-colors cursor-pointer"
                      title="Edit Education"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(profile?.education || []).length > 0 ? (
                      profile.education.map((edu) => (
                        <div key={edu.id} className="space-y-0.5">
                          <h4 className="text-xs font-black text-slate-900">
                            {edu.degree}
                          </h4>
                          <p className="text-[11px] font-semibold text-slate-500">
                            {edu.institution}, {edu.period}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1">No education added yet</p>
                    )}
                  </div>
                </div>

                {/* CERTIFICATIONS CARD */}
                <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4.5 w-4.5 text-[#3B00FF]" />
                      <h3 className="text-xs font-black text-slate-900">
                        Certifications
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('education')}
                      className="p-1 text-slate-400 hover:text-[#3B00FF] transition-colors cursor-pointer"
                      title="Edit Certifications"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(profile?.certifications || []).length > 0 ? (
                      profile.certifications.map((cert) => (
                        <div key={cert.id} className="space-y-0.5">
                          <h4 className="text-xs font-black text-slate-900">
                            {cert.title}
                          </h4>
                          <p className="text-[11px] font-semibold text-slate-500">
                            {cert.issuedYear}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1">No certifications added yet</p>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= PHOTO CROP & CONFIRM MODAL ================= */}
        {showCropModal && selectedPhotoUrl && (
          <ImageCropModal
            imageSrc={selectedPhotoUrl}
            onCropComplete={handleCropComplete}
            onClose={() => {
              if (selectedPhotoUrl) {
                URL.revokeObjectURL(selectedPhotoUrl);
                setSelectedPhotoUrl(null);
              }
              setShowCropModal(false);
            }}
          />
        )}

        {/* ================= EDIT PROFILE MAIN MODAL ================= */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp border border-slate-100 max-h-[90vh] overflow-y-auto font-sans">
              
              {/* Modal Top Header */}
              <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Edit Candidate Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
                {[
                  { id: 'personal', label: 'Personal Info' },
                  { id: 'skills', label: 'Skills & Tech' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'education', label: 'Edu & Certs' },
                  { id: 'links', label: 'Links & Prefs' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveEditTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                      activeEditTab === tab.id
                        ? 'bg-[#3B00FF] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: PERSONAL INFO */}
              {activeEditTab === 'personal' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Full Name *</label>
                    <input
                      type="text"
                      value={personalForm.fullName}
                      onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Headline / Role Designation</label>
                    <input
                      type="text"
                      value={personalForm.headline}
                      onChange={(e) => setPersonalForm({ ...personalForm, headline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">State</label>
                      <CustomDropdown
                        value={personalForm.state || ''}
                        placeholder="Select State"
                        searchable={true}
                        onChange={(e) => handleStateChange(e.target.value)}
                        options={INDIA_STATES}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">District</label>
                      <CustomDropdown
                        value={personalForm.district || ''}
                        disabled={!personalForm.state}
                        placeholder={personalForm.state ? 'Select District' : 'Select State first'}
                        searchable={true}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        options={getDistrictsForState(personalForm.state) || []}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Phone Number</label>
                    <input
                      type="text"
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Professional Summary</label>
                    <textarea
                      rows={3}
                      value={personalForm.summary}
                      onChange={(e) => setPersonalForm({ ...personalForm, summary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePersonal}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold hover:bg-[#3000D6] disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Personal Details'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SKILLS */}
              {activeEditTab === 'skills' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      Programming Languages (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JavaScript / TS, Python, Go, Java"
                      value={skillsForm.languagesStr}
                      onChange={(e) => setSkillsForm({ ...skillsForm, languagesStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      Technologies & Frameworks (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, AWS, Docker, Kubernetes"
                      value={skillsForm.technologiesStr}
                      onChange={(e) => setSkillsForm({ ...skillsForm, technologiesStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSkills}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold hover:bg-[#3000D6] disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Skills'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: EXPERIENCE */}
              {activeEditTab === 'experience' && (
                <div className="space-y-4">
                  {experiencesForm.map((exp, idx) => (
                    <div key={exp.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveExperienceItem(exp.id)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 cursor-pointer"
                        title="Remove experience"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-600 block">Role Title</label>
                          <input
                            type="text"
                            value={exp.roleTitle}
                            onChange={(e) => {
                              const updated = [...experiencesForm];
                              updated[idx].roleTitle = e.target.value;
                              setExperiencesForm(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-extrabold text-slate-600 block">Company Name</label>
                          <input
                            type="text"
                            value={exp.companyName}
                            onChange={(e) => {
                              const updated = [...experiencesForm];
                              updated[idx].companyName = e.target.value;
                              setExperiencesForm(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-600 block">Period</label>
                          <input
                            type="text"
                            placeholder="e.g. 2021 - Present"
                            value={exp.period}
                            onChange={(e) => {
                              const updated = [...experiencesForm];
                              updated[idx].period = e.target.value;
                              setExperiencesForm(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-extrabold text-slate-600 block">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              const updated = [...experiencesForm];
                              updated[idx].location = e.target.value;
                              setExperiencesForm(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block">Description</label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...experiencesForm];
                            updated[idx].description = e.target.value;
                            setExperiencesForm(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white resize-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddExperienceItem}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-extrabold text-[#3B00FF] hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Another Experience</span>
                  </button>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveExperience}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold hover:bg-[#3000D6] disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Experience'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: EDUCATION & CERTS */}
              {activeEditTab === 'education' && (
                <div className="space-y-5">
                  
                  {/* Education Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Education</h4>
                    {educationForm.map((edu, idx) => (
                      <div key={edu.id || idx} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveEducationItem(edu.id)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Degree / Qualification"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...educationForm];
                              updated[idx].degree = e.target.value;
                              setEducationForm(updated);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Institution & Period"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...educationForm];
                              updated[idx].institution = e.target.value;
                              setEducationForm(updated);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddEducationItem}
                      className="text-xs font-extrabold text-[#3B00FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Education
                    </button>
                  </div>

                  {/* Certifications Section */}
                  <div className="space-y-3 pt-2 border-t border-slate-150">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Certifications</h4>
                    {certificationsForm.map((cert, idx) => (
                      <div key={cert.id || idx} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveCertificationItem(cert.id)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Certification Title"
                            value={cert.title}
                            onChange={(e) => {
                              const updated = [...certificationsForm];
                              updated[idx].title = e.target.value;
                              setCertificationsForm(updated);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Issued Year (e.g. Issued: 2022)"
                            value={cert.issuedYear}
                            onChange={(e) => {
                              const updated = [...certificationsForm];
                              updated[idx].issuedYear = e.target.value;
                              setCertificationsForm(updated);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCertificationItem}
                      className="text-xs font-extrabold text-[#3B00FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Certification
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEduCert}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold hover:bg-[#3000D6] disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Edu & Certs'}
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 5: LINKS & PREFERENCES */}
              {activeEditTab === 'links' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">GitHub Portfolio URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={linksForm.github}
                      onChange={(e) => setLinksForm({ ...linksForm, github: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linksForm.linkedin}
                      onChange={(e) => setLinksForm({ ...linksForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Portfolio / Website URL</label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.dev"
                      value={linksForm.portfolio}
                      onChange={(e) => setLinksForm({ ...linksForm, portfolio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Expected Salary / CTC</label>
                    <input
                      type="text"
                      placeholder="e.g. $130,000 / year or 18 LPA"
                      value={linksForm.expectedSalary}
                      onChange={(e) => setLinksForm({ ...linksForm, expectedSalary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLinks}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold hover:bg-[#3000D6] disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Links & Preferences'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </CandidateLayout>
  );
}
