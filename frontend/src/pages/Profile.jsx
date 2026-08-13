import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, GraduationCap, Briefcase, FileText, Camera, AlertTriangle, Download, RefreshCw, Upload, Globe, Eye, Edit2, Plus, Trash2, X, Calendar, Award, CheckCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

export default function Profile() {
  // Profile Photo states
  const [profileImage, setProfileImage] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const photoInputRef = useRef(null);

  // Resume States
  const [resumeName, setResumeName] = useState('');
  const [resumeSize, setResumeSize] = useState('');
  const [resumeData, setResumeData] = useState(''); 
  const [resumeError, setResumeError] = useState('');
  const resumeInputRef = useRef(null);

  // Tab State
  const [activeTab, setActiveTab] = useState('Personal Info'); 

  // Personal Info edit states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: ''
  });
  const [infoForm, setInfoForm] = useState({ ...personalInfo });

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isDobOpen, setIsDobOpen] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [dobPickerMode, setDobPickerMode] = useState('days'); // 'days' | 'years' | 'months'

  const formatDateString = (day, month, year) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(month + 1).padStart(2, '0');
    const yyyy = year;
    return `${dd}-${mm}-${yyyy}`;
  };

  const genderRef = useRef(null);
  const dobRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (genderRef.current && !genderRef.current.contains(e.target)) {
        setIsGenderOpen(false);
      }
      if (dobRef.current && !dobRef.current.contains(e.target)) {
        setIsDobOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Education edit states
  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [eduFormList, setEduFormList] = useState([]);

  // Experience edit states
  const [isEditingExp, setIsEditingExp] = useState(false);
  const [experienceList, setExperienceList] = useState([]);
  const [expFormList, setExpFormList] = useState([]);

  // Skills states with levels (Beginner, Intermediate, Advanced)
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillsList, setSkillsList] = useState([]);
  const [skillsFormList, setSkillsFormList] = useState([]);

  // Certifications states
  const [certifications, setCertifications] = useState([]);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  
  // Cert Modal fields
  const [certName, setCertName] = useState('');
  const [certPlatform, setCertPlatform] = useState('');
  const [certSkills, setCertSkills] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certImgData, setCertImgData] = useState('');
  const [certPdfData, setCertPdfData] = useState('');
  const [certPdfName, setCertPdfName] = useState('');
  const [certValidationMsg, setCertValidationMsg] = useState('');

  // Image Preview Modal states
  const [previewImgUrl, setPreviewImgUrl] = useState(null);

  // Dynamic success toast state
  const [toastMessage, setToastMessage] = useState('');

  // Helper function to fire custom sync event to header
  const triggerHeaderSync = () => {
    window.dispatchEvent(new Event('profileUpdate'));
  };

  // Helper function to save to consolidated profile object
  const saveCandidateProfile = (updatedFields) => {
    const current = JSON.parse(localStorage.getItem('candidateProfile') || '{}');
    const merged = { ...current, ...updatedFields };
    localStorage.setItem('candidateProfile', JSON.stringify(merged));
    triggerHeaderSync();
  };

  // Load state from localStorage on mount
  useEffect(() => {
    let profile = null;
    const stored = localStorage.getItem('candidateProfile');
    if (stored) {
      profile = JSON.parse(stored);
    } else {
      const auth = JSON.parse(localStorage.getItem('candidateAuth') || '{}');
      profile = {
        fullName: auth.fullName || 'Mohamed Thoufiq',
        email: auth.email || 'thoufiq@example.com',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        resumeName: '',
        resumeSize: '',
        resumeData: '',
        profileImage: ''
      };
      localStorage.setItem('candidateProfile', JSON.stringify(profile));
      triggerHeaderSync();
    }

    if (profile) {
      setProfileImage(profile.profileImage || null);
      setResumeName(profile.resumeName || '');
      setResumeSize(profile.resumeSize || '');
      setResumeData(profile.resumeData || '');
      
      const pInfo = {
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dob: profile.dob || '',
        gender: profile.gender || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || ''
      };
      setPersonalInfo(pInfo);
      setInfoForm(pInfo);

      setEducationList(profile.education || []);
      setEduFormList(profile.education || []);
      setExperienceList(profile.experience || []);
      setExpFormList(profile.experience || []);
      setSkillsList(profile.skills || []);
      setSkillsFormList(profile.skills || []);
      setCertifications(profile.certifications || []);
    }
  }, []);

  // Compute dynamic Profile Completion Percentage based on weights:
  // - Personal Info = 25% (Considered complete if fullName, email, phone are filled)
  // - Experience = 20%
  // - Skills = 20%
  // - Resume = 20%
  // - Certifications = 15%
  const calculateCompletion = () => {
    let score = 0;
    if (personalInfo.fullName && personalInfo.fullName.trim() !== '') score += 10;
    if (personalInfo.email && personalInfo.email.trim() !== '') score += 10;
    if (personalInfo.phone && personalInfo.phone.trim() !== '') score += 5;
    if (experienceList.length > 0) score += 20;
    if (skillsList.length > 0) score += 20;
    if (resumeData && resumeData !== '') score += 20;
    if (certifications.length > 0) score += 15;
    return score;
  };

  const completionPercentage = calculateCompletion();

  // Compute Missing Items list dynamically
  const missingItems = [];
  if (experienceList.length === 0) {
    missingItems.push({ id: 'experience', label: 'Add Work Experience', tab: 'Experience' });
  }
  if (skillsList.length === 0) {
    missingItems.push({ id: 'skills', label: 'Add Skills', tab: 'Skills' });
  }
  if (!resumeData || resumeData === '') {
    missingItems.push({ id: 'resume', label: 'Upload Resume', isResume: true });
  }
  if (certifications.length === 0) {
    missingItems.push({ id: 'certs', label: 'Add Certifications', tab: 'Certifications' });
  }

  // Handle Improve Profile navigation click
  const handleImproveProfile = () => {
    if (missingItems.length > 0) {
      const firstItem = missingItems[0];
      if (firstItem.isResume) {
        triggerResumePicker();
      } else if (firstItem.tab) {
        setActiveTab(firstItem.tab);
      }
    } else {
      setToastMessage('Your profile is already fully optimized.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Handle Photo upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoError('');
    if (!file.type.startsWith('image/')) {
      setPhotoError('Only image files (JPG, JPEG, PNG) are allowed.');
      return;
    }
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setPhotoError('Maximum file size is 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      setProfileImage(base64Data);
      saveCandidateProfile({ profileImage: base64Data });
    };
    reader.readAsDataURL(file);
  };

  // Handle Resume Upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeError('');
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setResumeError('Only .pdf, .doc, and .docx files are allowed.');
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setResumeError('Maximum file size is 5 MB.');
      return;
    }
    const sizeString = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      setResumeName(file.name);
      setResumeSize(sizeString);
      setResumeData(base64Data);
      saveCandidateProfile({
        resumeName: file.name,
        resumeSize: sizeString,
        resumeData: base64Data
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadResume = () => {
    if (!resumeData) return;
    const link = document.createElement('a');
    link.href = resumeData;
    link.download = resumeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPhotoPicker = () => {
    if (photoInputRef.current) photoInputRef.current.click();
  };

  const triggerResumePicker = () => {
    if (resumeInputRef.current) resumeInputRef.current.click();
  };

  // Save Handlers
  const handleInfoSave = (e) => {
    e.preventDefault();
    setPersonalInfo({ ...infoForm });
    saveCandidateProfile(infoForm);
    setIsEditingInfo(false);
  };

  const handleEduSave = (e) => {
    e.preventDefault();
    setEducationList([...eduFormList]);
    saveCandidateProfile({ education: eduFormList });
    setIsEditingEdu(false);
  };

  const handleExpSave = (e) => {
    e.preventDefault();
    setExperienceList([...expFormList]);
    saveCandidateProfile({ experience: expFormList });
    setIsEditingExp(false);
  };

  const handleSkillsSave = (e) => {
    e.preventDefault();
    setSkillsList([...skillsFormList]);
    saveCandidateProfile({ skills: skillsFormList });
    setIsEditingSkills(false);
  };

  // Helper lists modifications
  const updateEduField = (index, field, value) => {
    const updated = [...eduFormList];
    updated[index][field] = value;
    setEduFormList(updated);
  };

  const addEduRow = () => {
    setEduFormList([...eduFormList, { id: Date.now(), examName: '', board: '', year: '', result: '' }]);
  };

  const removeEduRow = (index) => {
    const updated = eduFormList.filter((_, i) => i !== index);
    setEduFormList(updated);
  };

  const updateExpField = (index, field, value) => {
    const updated = [...expFormList];
    updated[index][field] = value;
    setExpFormList(updated);
  };

  const updateExpHighlight = (expIndex, hIndex, value) => {
    const updated = [...expFormList];
    updated[expIndex].highlights[hIndex] = value;
    setExpFormList(updated);
  };

  const addExpHighlight = (expIndex) => {
    const updated = [...expFormList];
    updated[expIndex].highlights.push('');
    setExpFormList(updated);
  };

  const removeExpHighlight = (expIndex, hIndex) => {
    const updated = [...expFormList];
    updated[expIndex].highlights = updated[expIndex].highlights.filter((_, i) => i !== hIndex);
    setExpFormList(updated);
  };

  const addExpRow = () => {
    setExpFormList([...expFormList, { id: Date.now(), role: '', company: '', duration: '', highlights: [''] }]);
  };

  const removeExpRow = (index) => {
    const updated = expFormList.filter((_, i) => i !== index);
    setExpFormList(updated);
  };

  const updateSkillField = (index, field, value) => {
    const updated = [...skillsFormList];
    updated[index][field] = value;
    setSkillsFormList(updated);
  };

  const addSkillRow = () => {
    setSkillsFormList([...skillsFormList, { id: Date.now(), name: '', level: 'Intermediate' }]);
  };

  const removeSkillRow = (index) => {
    const updated = skillsFormList.filter((_, i) => i !== index);
    setSkillsFormList(updated);
  };

  const getBadgeStyle = (level) => {
    if (level === 'Beginner') return 'bg-slate-100 text-slate-600 border border-slate-200';
    if (level === 'Intermediate') return 'bg-amber-100 text-amber-800 border border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  };

  // Certificate Modal action handlers
  const handleCertImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCertValidationMsg('');
    if (!file.type.startsWith('image/')) {
      setCertValidationMsg('Certificate Image must be a valid image file.');
      return;
    }
    const maxImgSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxImgSize) {
      setCertValidationMsg('Image size cannot exceed 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCertImgData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCertPdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCertValidationMsg('');
    if (file.type !== 'application/pdf') {
      setCertValidationMsg('Certificate PDF must be a valid PDF file.');
      return;
    }
    const maxPdfSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxPdfSize) {
      setCertValidationMsg('PDF size cannot exceed 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCertPdfData(reader.result);
      setCertPdfName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const openAddCertModal = () => {
    setEditingCert(null);
    setCertName('');
    setCertPlatform('');
    setCertSkills('');
    setCertDate('');
    setCertImgData('');
    setCertPdfData('');
    setCertPdfName('');
    setCertValidationMsg('');
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (cert) => {
    setEditingCert(cert);
    setCertName(cert.name);
    setCertPlatform(cert.platform);
    setCertSkills(cert.skills);
    setCertDate(cert.date);
    setCertImgData(cert.imgData || '');
    setCertPdfData(cert.pdfData || '');
    setCertPdfName(cert.pdfName || '');
    setCertValidationMsg('');
    setIsCertModalOpen(true);
  };

  const handleCertSubmit = (e) => {
    e.preventDefault();
    setCertValidationMsg('');

    if (!certName.trim()) {
      setCertValidationMsg('Certificate Name is required.');
      return;
    }
    if (!certPlatform.trim()) {
      setCertValidationMsg('Platform / Issued By is required.');
      return;
    }
    if (!certImgData && !certPdfData) {
      setCertValidationMsg('At least one certificate file (Image or PDF) is required.');
      return;
    }

    let updatedCerts = [];
    if (editingCert) {
      updatedCerts = certifications.map((c) =>
        c.id === editingCert.id
          ? {
              ...c,
              name: certName,
              platform: certPlatform,
              skills: certSkills,
              date: certDate,
              imgData: certImgData,
              pdfData: certPdfData,
              pdfName: certPdfName
            }
          : c
      );
    } else {
      updatedCerts = [
        ...certifications,
        {
          id: Date.now(),
          name: certName,
          platform: certPlatform,
          skills: certSkills,
          date: certDate,
          imgData: certImgData,
          pdfData: certPdfData,
          pdfName: certPdfName
        }
      ];
    }

    setCertifications(updatedCerts);
    localStorage.setItem('certifications', JSON.stringify(updatedCerts));
    setIsCertModalOpen(false);
  };

  const handleDeleteCert = (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    localStorage.setItem('certifications', JSON.stringify(updated));
  };

  const downloadCertPdf = (pdfData, pdfName) => {
    if (!pdfData) return;
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = pdfName || 'Certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-2 sm:px-6 md:px-8 mt-4 flex-grow space-y-6 animate-in fade-in duration-300 select-none text-left font-sans w-full relative">
      {/* Toast Alert Popups */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#8CC63F] text-white font-extrabold px-5 py-3 rounded-2xl shadow-lg border border-white/20 flex items-center gap-2.5 animate-in slide-in-from-top-6 duration-200">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#84A43C] tracking-tight">Profile</h1>
        <p className="text-sm font-semibold text-slate-400 mt-1">Manage your personal and professional information</p>
      </div>

      {/* Top Profile Completion Widget */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xs p-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Personal info & Photo */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6 min-w-0">
          <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md shrink-0 cursor-pointer" onClick={triggerPhotoPicker}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
            </div>
            <input type="file" ref={photoInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>

          <div className="text-center sm:text-left space-y-1.5 min-w-0">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{personalInfo.fullName}</h2>
            <p className="text-sm font-extrabold text-slate-500">UI/UX Designer</p>
            <div className="space-y-1.5 pt-1.5 text-xs sm:text-sm font-semibold text-slate-500">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{personalInfo.city}, {personalInfo.state}, India</span>
              </div>
            </div>
            {photoError && <p className="text-xs font-bold text-rose-500 pt-1 animate-pulse">{photoError}</p>}
          </div>
        </div>

        {/* Center Column: Completion progress bar */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:border-r border-slate-100 px-0 lg:px-8 py-4 lg:py-0 text-left space-y-4">
          <div className="flex items-center justify-between font-extrabold">
            <span className="text-base text-slate-800">Profile Completion</span>
            <span className="text-base text-[#84A43C]">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#EF4444] via-[#E29D29] to-[#84A43C] rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }} 
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 leading-relaxed">
            Keep going! Complete your profile to increase your chances of getting hired.
          </p>
          <button 
            type="button" 
            onClick={handleImproveProfile}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#84A43C] hover:bg-[#73922f] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Improve Profile
          </button>
        </div>

        {/* Right Column: Dynamic Missing Items list */}
        <div className="lg:col-span-3 text-left space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Missing Items</h3>
          {missingItems.length === 0 ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-extrabold">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Your profile is complete.</span>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs sm:text-sm font-bold text-rose-600">
              {missingItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Single White Card containing Tab navigation & details grid */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xs overflow-visible w-full">
        
        {/* Tab navigation */}
        <div className="flex border-b border-slate-100 gap-8 text-sm sm:text-base font-bold select-none px-6 pt-5 overflow-x-auto scrollbar-none whitespace-nowrap">
          {['Personal Info', 'Education', 'Experience', 'Skills', 'Certifications'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-4 transition-all border-b-[3px] cursor-pointer focus:outline-none whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#4A7318] text-[#4A7318] font-extrabold'
                  : 'border-transparent text-slate-800 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Core details grid inside the card */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Personal Info Tab */}
            {activeTab === 'Personal Info' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#3562D6]">Personal Information</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setInfoForm({ ...personalInfo });
                      setIsEditingInfo(!isEditingInfo);
                    }}
                    className="px-5 py-1.5 border border-[#8CC63F] hover:bg-[#8CC63F]/5 text-[#8CC63F] font-bold text-sm rounded-xl transition-all cursor-pointer focus:outline-none"
                  >
                    {isEditingInfo ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingInfo ? (
                  <form onSubmit={handleInfoSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 font-semibold text-sm">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-extrabold">FULL NAME</label>
                      <input
                        type="text"
                        value={infoForm.fullName}
                        onChange={(e) => setInfoForm({ ...infoForm, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-[#84A43C]"
                        required
                      />
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-xs text-slate-400 font-extrabold">GENDER</label>
                      <CustomSelect
                        value={infoForm.gender}
                        onChange={(val) => setInfoForm({ ...infoForm, gender: val })}
                        options={['Male', 'Female', 'Others']}
                        placeholder="Select Gender"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-extrabold">EMAIL</label>
                      <input
                        type="email"
                        value={infoForm.email}
                        onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-[#84A43C]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-extrabold">ADDRESS</label>
                      <input
                        type="text"
                        value={infoForm.address}
                        onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-[#84A43C]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-extrabold">PHONE</label>
                      <input
                        type="text"
                        value={infoForm.phone}
                        onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-[#84A43C]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-extrabold">CITY</label>
                      <input
                        type="text"
                        value={infoForm.city}
                        onChange={(e) => setInfoForm({ ...infoForm, city: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-[#84A43C]"
                        required
                      />
                    </div>
                    <div className="space-y-1 relative" ref={dobRef}>
                      <label className="text-xs text-slate-400 font-extrabold">DATE OF BIRTH</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setIsDobOpen(!isDobOpen); setIsGenderOpen(false); setDobPickerMode('days'); }}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-[#84A43C] text-left flex items-center justify-between font-semibold text-slate-700 cursor-pointer h-[38px]"
                        >
                          <span>{infoForm.dob || 'DD-MM-YYYY'}</span>
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </button>
                        {isDobOpen && (
                          <div className="absolute left-0 bottom-full mb-2 w-[280px] sm:w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-100">

                            {dobPickerMode === 'years' ? (
                              <div className="max-h-48 overflow-y-auto grid grid-cols-4 gap-2 pt-1 scrollbar-none">
                                {Array.from({ length: 2026 - 1950 + 1 }).map((_, i) => {
                                  const y = 1950 + i;
                                  const isSelected = currentCalendarDate.getFullYear() === y;
                                  return (
                                    <button
                                      key={y}
                                      type="button"
                                      onClick={() => {
                                        const d = new Date(currentCalendarDate);
                                        d.setFullYear(y);
                                        setCurrentCalendarDate(d);
                                        setDobPickerMode('months');
                                      }}
                                      className={`py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center ${
                                        isSelected
                                          ? 'bg-[#84A43C] text-white font-extrabold'
                                          : 'hover:bg-slate-50 text-slate-600'
                                      }`}
                                    >
                                      {y}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : dobPickerMode === 'months' ? (
                              <div className="grid grid-cols-3 gap-2 pt-2">
                                {Array.from({ length: 12 }).map((_, m) => {
                                  const date = new Date(currentCalendarDate.getFullYear(), m, 1);
                                  const monthName = date.toLocaleString('default', { month: 'short' });
                                  const isSelected = currentCalendarDate.getMonth() === m;
                                  return (
                                    <button
                                      key={m}
                                      type="button"
                                      onClick={() => {
                                        const d = new Date(currentCalendarDate);
                                        d.setMonth(m);
                                        setCurrentCalendarDate(d);
                                        setDobPickerMode('days');
                                      }}
                                      className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center ${
                                        isSelected
                                          ? 'bg-[#84A43C] text-white font-extrabold'
                                          : 'hover:bg-slate-50 text-slate-600'
                                      }`}
                                    >
                                      {monthName}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <>
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const prev = new Date(currentCalendarDate);
                                      prev.setMonth(prev.getMonth() - 1);
                                      setCurrentCalendarDate(prev);
                                    }}
                                    className="p-1 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-500"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDobPickerMode('years')}
                                    className="text-xs font-extrabold text-slate-700 hover:text-[#84A43C] uppercase tracking-wider cursor-pointer"
                                    title="Click to select Year"
                                  >
                                    {currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = new Date(currentCalendarDate);
                                      next.setMonth(next.getMonth() + 1);
                                      setCurrentCalendarDate(next);
                                    }}
                                    className="p-1 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-500"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                {/* Weekday Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase mb-2">
                                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <span key={day}>{day}</span>
                                  ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-600">
                                  {Array.from({ length: new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1).getDay() }).map((_, i) => (
                                    <span key={`empty-${i}`} />
                                  ))}
                                  {Array.from({ length: new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const dateStr = formatDateString(dayNum, currentCalendarDate.getMonth(), currentCalendarDate.getFullYear());
                                    const isSelected = infoForm.dob === dateStr;
                                    const isToday = new Date().toDateString() === new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), dayNum).toDateString();
                                    return (
                                      <button
                                        key={dayNum}
                                        type="button"
                                        onClick={() => {
                                          setInfoForm({ ...infoForm, dob: dateStr });
                                          setIsDobOpen(false);
                                        }}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                          isSelected
                                            ? 'bg-[#84A43C] text-white'
                                            : isToday
                                            ? 'border border-[#84A43C] text-[#84A43C]'
                                            : 'hover:bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        {dayNum}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-extrabold">STATE</label>
                      <input
                        type="text"
                        value={infoForm.state}
                        onChange={(e) => setInfoForm({ ...infoForm, state: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-[#84A43C]"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <button type="submit" className="px-6 py-2.5 bg-[#84A43C] text-white font-bold rounded-xl shadow-xs cursor-pointer focus:outline-none">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-sm text-left">
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">Full Name</p>
                      <p className="text-slate-800 font-bold">{personalInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">Gender</p>
                      <p className="text-slate-800 font-bold">{personalInfo.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">Email</p>
                      <p className="text-slate-800 font-bold">{personalInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">Address</p>
                      <p className="text-slate-800 font-bold">{personalInfo.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-slate-800 font-bold">{personalInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">City</p>
                      <p className="text-slate-800 font-bold">{personalInfo.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">Date of Birth</p>
                      <p className="text-slate-800 font-bold">{personalInfo.dob}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#3562D6] font-bold uppercase tracking-wider mb-1">State</p>
                      <p className="text-slate-800 font-bold">{personalInfo.state}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'Education' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#3562D6]">Education</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEduFormList(JSON.parse(JSON.stringify(educationList)));
                      setIsEditingEdu(!isEditingEdu);
                    }}
                    className="px-5 py-1.5 border border-[#8CC63F] hover:bg-[#8CC63F]/5 text-[#8CC63F] font-bold text-sm rounded-xl transition-all cursor-pointer focus:outline-none"
                  >
                    {isEditingEdu ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingEdu ? (
                  <form onSubmit={handleEduSave} className="space-y-4 text-sm font-semibold text-slate-700">
                    {eduFormList.map((edu, idx) => (
                      <div key={edu.id || idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => removeEduRow(idx)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase">Exam Name</label>
                            <input
                              type="text"
                              value={edu.examName}
                              onChange={(e) => updateEduField(idx, 'examName', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase">Board / Uni</label>
                            <input
                              type="text"
                              value={edu.board}
                              onChange={(e) => updateEduField(idx, 'board', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase">Year</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => updateEduField(idx, 'year', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase">Result</label>
                            <input
                              type="text"
                              value={edu.result}
                              onChange={(e) => updateEduField(idx, 'result', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={addEduRow}
                        className="flex items-center gap-1.5 px-4 py-2 border border-[#84A43C] text-[#84A43C] font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Row</span>
                      </button>
                      <button type="submit" className="px-6 py-2 bg-[#84A43C] text-white font-bold rounded-xl cursor-pointer">
                        Save Education
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="overflow-x-auto w-full pt-2">
                    <table className="w-full border-collapse text-left text-sm font-semibold text-slate-700">
                      <thead>
                        <tr className="bg-[#F9FCF6] border-b border-[#84A43C]/20 text-slate-500 font-bold text-xs uppercase tracking-wider">
                          <th className="px-4 py-3">Exam Name</th>
                          <th className="px-4 py-3">Board / University</th>
                          <th className="px-4 py-3">Year</th>
                          <th className="px-4 py-3">Result</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#84A43C]/10">
                        {educationList.map((edu) => (
                          <tr key={edu.id} className="hover:bg-slate-50/40">
                            <td className="px-4 py-4 text-slate-800 font-bold">{edu.examName}</td>
                            <td className="px-4 py-4 text-slate-500">{edu.board}</td>
                            <td className="px-4 py-4 text-slate-500">{edu.year}</td>
                            <td className="px-4 py-4 text-slate-800 font-bold">{edu.result}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <button type="button" className="p-1 text-[#84A43C] hover:text-[#73922f] hover:scale-105 transition-all cursor-pointer" aria-label="View">
                                  <Eye className="w-4.5 h-4.5" />
                                </button>
                                <button type="button" className="p-1 text-[#84A43C] hover:text-[#73922f] hover:scale-105 transition-all cursor-pointer" aria-label="Edit">
                                  <Edit2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeTab === 'Experience' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#3562D6]">Experience</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setExpFormList(JSON.parse(JSON.stringify(experienceList)));
                      setIsEditingExp(!isEditingExp);
                    }}
                    className="px-5 py-1.5 border border-[#8CC63F] hover:bg-[#8CC63F]/5 text-[#8CC63F] font-bold text-sm rounded-xl transition-all cursor-pointer focus:outline-none"
                  >
                    {isEditingExp ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingExp ? (
                  <form onSubmit={handleExpSave} className="space-y-5 text-sm font-semibold text-slate-700">
                    {expFormList.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => removeExpRow(idx)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase">Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExpField(idx, 'role', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase">Company / Location</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExpField(idx, 'company', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase">Duration</label>
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => updateExpField(idx, 'duration', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase">Highlights</label>
                          {exp.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={h}
                                onChange={(e) => updateExpHighlight(idx, hIdx, e.target.value)}
                                className="flex-grow px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => removeExpHighlight(idx, hIdx)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addExpHighlight(idx)}
                            className="flex items-center gap-1 text-xs text-[#84A43C] font-bold hover:underline mt-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Highlight</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={addExpRow}
                        className="flex items-center gap-1.5 px-4 py-2 border border-[#84A43C] text-[#84A43C] font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Job</span>
                      </button>
                      <button type="submit" className="px-6 py-2 bg-[#84A43C] text-white font-bold rounded-xl cursor-pointer">
                        Save Experience
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6 pt-2">
                    {experienceList.length === 0 ? (
                      <p className="text-sm font-semibold text-slate-400">No experience history added yet.</p>
                    ) : (
                      experienceList.map((exp, idx) => (
                        <div key={exp.id} className={`flex gap-4 items-start ${idx > 0 ? 'pt-6 border-t border-slate-100' : ''}`}>
                          <div className="w-12 h-12 bg-[#F0F6EA] border border-[#84A43C]/20 text-[#4A7318] rounded-xl flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="text-left">
                                <h4 className="text-base font-extrabold text-[#3562D6] leading-snug">{exp.role}</h4>
                                <p className="text-sm font-semibold text-slate-500 mt-0.5">{exp.company}</p>
                              </div>
                              <span className="px-3 py-1 bg-[#F0F6EA] text-[#4A7318] text-xs font-bold rounded-lg self-start">
                                {exp.duration}
                              </span>
                            </div>
                            <ul className="mt-3.5 space-y-1.5 text-sm font-medium text-slate-600 list-disc pl-5">
                              {exp.highlights.map((highlight, hIdx) => (
                                <li key={hIdx} className="leading-relaxed">{highlight}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : activeTab === 'Skills' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#3562D6]">Skills</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSkillsFormList(JSON.parse(JSON.stringify(skillsList)));
                      setIsEditingSkills(!isEditingSkills);
                    }}
                    className="px-5 py-1.5 border border-[#8CC63F] hover:bg-[#8CC63F]/5 text-[#8CC63F] font-bold text-sm rounded-xl transition-all cursor-pointer focus:outline-none"
                  >
                    {isEditingSkills ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingSkills ? (
                  <form onSubmit={handleSkillsSave} className="space-y-4 text-sm font-semibold text-slate-700">
                    {skillsFormList.map((skill, idx) => (
                      <div key={skill.id || idx} className="flex gap-3 items-center p-3 bg-slate-50 border border-slate-100 rounded-xl relative">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkillField(idx, 'name', e.target.value)}
                          className="flex-grow px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                          placeholder="Skill Name (e.g. React)"
                          required
                        />
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkillField(idx, 'level', e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 bg-white rounded-xl outline-none focus:border-[#84A43C]"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSkillRow(idx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={addSkillRow}
                        className="flex items-center gap-1.5 px-4 py-2 border border-[#84A43C] text-[#84A43C] font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Skill</span>
                      </button>
                      <button type="submit" className="px-6 py-2 bg-[#84A43C] text-white font-bold rounded-xl cursor-pointer">
                        Save Skills
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 pt-2">
                    {skillsList.length === 0 ? (
                      <p className="text-sm font-semibold text-slate-400">No skills added yet.</p>
                    ) : (
                      skillsList.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                          <span className="font-bold text-slate-800 text-sm">{skill.name}</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold leading-normal ${getBadgeStyle(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Certifications Tab */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#3562D6]">Certifications</h3>
                  <button
                    type="button"
                    onClick={openAddCertModal}
                    className="flex items-center gap-1 px-4 py-1.5 border border-[#8CC63F] hover:bg-[#8CC63F]/5 text-[#8CC63F] font-bold text-sm rounded-xl transition-all cursor-pointer focus:outline-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Certificate</span>
                  </button>
                </div>

                {certifications.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <Award className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">No certifications added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-[20px] flex flex-col sm:flex-row gap-4 items-start relative hover:bg-slate-50/80 transition-all text-left">
                        {/* Image Thumbnail */}
                        {cert.imgData ? (
                          <div 
                            className="w-16 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 cursor-pointer flex items-center justify-center group/thumb relative"
                            onClick={() => setPreviewImgUrl(cert.imgData)}
                          >
                            <img src={cert.imgData} alt="Thumb" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                            <Award className="w-8 h-8" />
                          </div>
                        )}

                        {/* Details content */}
                        <div className="flex-grow min-w-0 space-y-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h4 className="text-base font-extrabold text-[#3562D6] leading-snug">{cert.name}</h4>
                              <p className="text-sm font-semibold text-slate-600 mt-0.5">{cert.platform}</p>
                            </div>
                            
                            {cert.date && (
                              <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold self-start">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{cert.date}</span>
                              </div>
                            )}
                          </div>

                          {cert.skills && (
                            <p className="text-xs text-slate-500 leading-relaxed pt-1.5">
                              <span className="font-bold text-slate-600 block mb-0.5">Lessons Learned:</span>
                              {cert.skills}
                            </p>
                          )}

                          {/* PDF download trigger */}
                          {cert.pdfData && (
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={() => downloadCertPdf(cert.pdfData, cert.pdfName)}
                                className="inline-flex items-center gap-1.5 text-xs text-[#84A43C] font-bold hover:underline cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Certificate PDF ({cert.pdfName || 'PDF'})</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1 items-center self-start sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditCertModal(cert)}
                            className="p-1.5 text-slate-400 hover:text-[#84A43C] rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(cert.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-6 w-full">
            {/* Resume Card wrapper */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Resume</h3>
              <div className="bg-white rounded-[24px] p-5 border border-slate-200/60 shadow-xs space-y-4">
                <input type="file" ref={resumeInputRef} onChange={handleResumeUpload} accept=".pdf,.doc,.docx" className="hidden" />
                
                {resumeData && resumeData !== 'dummy' ? (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-[#FDF2F2] rounded-2xl flex items-center gap-3 border border-red-50">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 text-left flex-grow">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs sm:text-sm font-extrabold text-slate-800 truncate pr-1">{resumeName}</p>
                          <span className="text-[10px] text-slate-400 font-bold shrink-0">({resumeSize})</span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Last updated: just now</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleDownloadResume}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                      <button
                        type="button"
                        onClick={triggerResumePicker}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Replace</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-400">No resume uploaded yet.</p>
                  </div>
                )}

                {resumeError && <p className="text-xs font-bold text-rose-500 pt-1 animate-pulse">{resumeError}</p>}

                <button
                  type="button"
                  onClick={triggerResumePicker}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#4A7318] hover:bg-[#3f6511] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New Resume</span>
                </button>
              </div>
            </div>

            {/* Portfolio Links wrapper */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Portfolio Links</h3>
              <div className="bg-white rounded-[24px] p-5 border border-slate-200/60 shadow-xs">
                <div className="grid grid-cols-3 gap-3 text-center">
                  
                  {/* LinkedIn */}
                  <a href="https://linkedin.com/in/riya" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-50 hover:border-blue-100 rounded-2xl transition-all">
                    <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="text-[10px] font-bold text-slate-700 tracking-wide mb-1">LinkedIn</span>
                    <span className="text-[9px] font-semibold text-[#84A43C] group-hover:underline truncate w-full">linkedin.com/in/riya</span>
                  </a>

                  {/* GitHub */}
                  <a href="https://github.com/riyadesign" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-50 hover:border-slate-200 rounded-2xl transition-all">
                    <svg className="w-5 h-5 text-slate-800 group-hover:scale-110 transition-transform mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    <span className="text-[10px] font-bold text-slate-700 tracking-wide mb-1">GitHub</span>
                    <span className="text-[9px] font-semibold text-[#84A43C] group-hover:underline truncate w-full">github.com/riyadesign</span>
                  </a>

                  {/* Portfolio */}
                  <a href="https://riyamohan.design" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-50 hover:border-emerald-100 rounded-2xl transition-all">
                    <Globe className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-700 tracking-wide mb-1">Portfolio</span>
                    <span className="text-[9px] font-semibold text-[#84A43C] group-hover:underline truncate w-full">riyamohan.design</span>
                  </a>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Add / Edit Certificate Modal Popup */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-800">
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCertSubmit} className="p-6 space-y-4 text-sm font-semibold text-slate-700 text-left">
              {certValidationMsg && (
                <div className="p-3 bg-red-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{certValidationMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-extrabold uppercase">Certificate Name *</label>
                <input
                  type="text"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C] bg-slate-50/50"
                  placeholder="e.g. UX Design Professional Certificate"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-extrabold uppercase">Platform / Issued By *</label>
                <input
                  type="text"
                  value={certPlatform}
                  onChange={(e) => setCertPlatform(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C] bg-slate-50/50"
                  placeholder="e.g. Coursera"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-extrabold uppercase">Issue Date</label>
                <input
                  type="text"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C] bg-slate-50/50"
                  placeholder="e.g. December 2023"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-extrabold uppercase">Gained Skills / Lessons Learned</label>
                <textarea
                  value={certSkills}
                  onChange={(e) => setCertSkills(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C] bg-slate-50/50 resize-none"
                  placeholder="Describe key learnings and outcomes..."
                />
              </div>

              {/* Upload controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-extrabold uppercase block">Certificate Image (Max 3MB)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCertImageChange}
                      className="hidden"
                      id="certImgInput"
                    />
                    <label
                      htmlFor="certImgInput"
                      className="flex items-center gap-1.5 justify-center px-3 py-2 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{certImgData ? 'Image Selected' : 'Choose Image'}</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-extrabold uppercase block">Certificate PDF (Max 5MB)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleCertPdfChange}
                      className="hidden"
                      id="certPdfInput"
                    />
                    <label
                      htmlFor="certPdfInput"
                      className="flex items-center gap-1.5 justify-center px-3 py-2 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{certPdfName ? 'PDF Selected' : 'Choose PDF'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#84A43C] hover:bg-[#73922f] text-white font-bold rounded-xl cursor-pointer"
                >
                  {editingCert ? 'Save Changes' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Large Image Preview Modal */}
      {previewImgUrl && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setPreviewImgUrl(null)}>
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white p-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImgUrl(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900/60 text-white hover:bg-slate-900/80 rounded-full cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImgUrl} alt="Certificate Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
