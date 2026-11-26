import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createEmployerService } from '../../../services/superAdmin/superAdminService';
import CascadingLocationSelector from '../../shared/CascadingLocationSelector';


function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (typeof file === 'string') return resolve(file);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function AddEmployerForm() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    accountEmail: '',
    password: '',
    confirmPassword: '',
    countryCode: '+91',
    mobileNumber: '',
    primaryContactName: '',
    designation: '',
    companyName: '',
    companyDescription: '',
    companyLogo: null,
    companyPhone: '',
    companyEmail: '',
    website: '',
    linkedinUrl: '',
    stateId: '',
    districtId: '',
    cityId: '',
    localityId: '',
    locationId: null,
    locationAddress: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({ ...prev, companyLogo: 'Please select a JPG, PNG, or WebP image.' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, companyLogo: 'Logo size must be 2MB or less.' }));
        return;
      }
      setErrors(prev => ({ ...prev, companyLogo: null }));
      setFormState(prev => ({ ...prev, companyLogo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setFormState(prev => ({ ...prev, companyLogo: null }));
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const validate = () => {
    const newErrors = {};

    const trimmedAccountEmail = formState.accountEmail.trim();
    if (!trimmedAccountEmail) {
      newErrors.accountEmail = 'Account Email Address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedAccountEmail)) {
        newErrors.accountEmail = 'Enter a valid email address.';
      }
    }

    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!formState.password) {
      newErrors.password = 'Password is required.';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!passwordComplexityRegex.test(formState.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol (e.g. Abc@1234).';
    }

    if (!formState.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    const trimmedMobile = formState.mobileNumber.trim();
    if (!trimmedMobile) {
      newErrors.mobileNumber = 'Mobile Number is required.';
    } else {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(trimmedMobile.replace(/\s+/g, ''))) {
        newErrors.mobileNumber = 'Enter a valid 10-digit mobile number.';
      }
    }

    if (!formState.companyName.trim()) {
      newErrors.companyName = 'Company Name is required.';
    }

    if (!formState.companyPhone.trim()) {
      newErrors.companyPhone = 'Company Phone is required.';
    }

    const trimmedCompanyEmail = formState.companyEmail.trim();
    if (!trimmedCompanyEmail) {
      newErrors.companyEmail = 'Company Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedCompanyEmail)) {
        newErrors.companyEmail = 'Enter a valid company email address.';
      }
    }

    if (formState.website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i;
      if (!urlRegex.test(formState.website.trim())) {
        newErrors.website = 'Enter a valid website URL.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] textarea, [data-error="true"] select');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorEl.focus();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const locationAddressStr = formState.locationAddress || '';
      const selectedLocationId = formState.locationId || formState.localityId || formState.cityId || formState.districtId || formState.stateId || null;
      const logoDataUrl = formState.companyLogo ? await fileToDataUrl(formState.companyLogo) : null;

      const payload = {
        company_logo: logoDataUrl,
        account_email: formState.accountEmail.trim(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
        mobile_number: `${formState.countryCode}${formState.mobileNumber.trim()}`,
        primary_contact_name: formState.primaryContactName.trim() || null,
        designation: formState.designation.trim() || null,
        company_name: formState.companyName.trim(),
        company_description: formState.companyDescription.trim() || null,
        company_phone: formState.companyPhone.trim(),
        company_email: formState.companyEmail.trim(),
        website: formState.website.trim() || null,
        linkedin_url: formState.linkedinUrl.trim() || null,
        company_address: locationAddressStr || null,
        location_id: selectedLocationId ? Number(selectedLocationId) : null,
        verification_status: 'PENDING',
        trust_level: 'NEW'
      };

      const res = await createEmployerService(payload);
      if (res.success) {
        navigate('/super-admin/employers');
      } else {
        const errorMsg = res.message || 'Failed to create employer account.';
        setApiError(errorMsg);
        if (res.errors) {
          const fieldErrors = {};
          if (res.errors.email) fieldErrors.accountEmail = Array.isArray(res.errors.email) ? res.errors.email.join(' ') : res.errors.email;
          if (res.errors.account_email) fieldErrors.accountEmail = Array.isArray(res.errors.account_email) ? res.errors.account_email.join(' ') : res.errors.account_email;
          if (res.errors.password) fieldErrors.password = Array.isArray(res.errors.password) ? res.errors.password.join(' ') : res.errors.password;
          if (res.errors.confirmPassword || res.errors.confirm_password) {
            const confErr = res.errors.confirmPassword || res.errors.confirm_password;
            fieldErrors.confirmPassword = Array.isArray(confErr) ? confErr.join(' ') : confErr;
          }
          if (res.errors.company_name) fieldErrors.companyName = Array.isArray(res.errors.company_name) ? res.errors.company_name.join(' ') : res.errors.company_name;
          if (res.errors.company_email) fieldErrors.companyEmail = Array.isArray(res.errors.company_email) ? res.errors.company_email.join(' ') : res.errors.company_email;
          if (res.errors.company_phone) fieldErrors.companyPhone = Array.isArray(res.errors.company_phone) ? res.errors.company_phone.join(' ') : res.errors.company_phone;
          if (res.errors.mobile_number || res.errors.phone_number) {
            const phoneErr = res.errors.mobile_number || res.errors.phone_number;
            fieldErrors.mobileNumber = Array.isArray(phoneErr) ? phoneErr.join(' ') : phoneErr;
          }
          if (res.errors.website || res.errors.company_website) {
            const webErr = res.errors.website || res.errors.company_website;
            fieldErrors.website = Array.isArray(webErr) ? webErr.join(' ') : webErr;
          }
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        }

        setTimeout(() => {
          const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] textarea, [data-error="true"] select');
          if (firstErrorEl) {
            firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorEl.focus();
          } else {
            const bottomBanner = document.getElementById('api-error-banner-bottom') || document.getElementById('api-error-banner-top');
            if (bottomBanner) {
              bottomBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }, 100);
      }
    } catch (err) {
      console.error("Failed to create employer", err);
      setApiError('An unexpected error occurred. Please check network connection.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add employer</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Create an employer company profile and system authentication credentials.
        </p>
      </div>

      {apiError && (
        <div id="api-error-banner-top" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-extrabold text-red-800 text-sm">Failed to create employer</p>
            <p className="mt-1 text-red-700 font-semibold text-xs leading-relaxed">{apiError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
        {/* Section 1: User Account Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Contact Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="primaryContactName" className="text-[13px] font-bold text-slate-700">Full Name / Primary Contact</label>
              <input 
                id="primaryContactName"
                type="text"
                value={formState.primaryContactName}
                onChange={(e) => setFormState(prev => ({ ...prev, primaryContactName: e.target.value }))}
                placeholder="e.g. John Doe"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              />
            </div>

            {/* Account Email */}
            <div className="space-y-1.5 md:col-span-2" data-error={!!errors.accountEmail}>
              <label htmlFor="accountEmail" className="text-[13px] font-bold text-slate-700">Account Email Address *</label>
              <input 
                id="accountEmail"
                type="email"
                value={formState.accountEmail}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, accountEmail: e.target.value }));
                  if (errors.accountEmail) setErrors(prev => ({ ...prev, accountEmail: null }));
                }}
                placeholder="employer@example.com"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.accountEmail 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.accountEmail && <p className="text-xs text-red-500 font-semibold">{errors.accountEmail}</p>}
              <p className="text-[11px] text-slate-400 font-medium">Unique email used by this employer to log into the portal.</p>
            </div>

            {/* Password */}
            <div className="space-y-1.5" data-error={!!errors.password}>
              <label htmlFor="password" className="text-[13px] font-bold text-slate-700">Password *</label>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formState.password}
                  onChange={(e) => {
                    setFormState(prev => ({ ...prev, password: e.target.value }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  placeholder="e.g. Pass@1234"
                  className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password}</p>}
              <p className="text-[11px] text-slate-400 font-medium">Must contain min 8 characters with uppercase, lowercase, number, and special character (e.g. Abc@1234).</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5" data-error={!!errors.confirmPassword}>
              <label htmlFor="confirmPassword" className="text-[13px] font-bold text-slate-700">Confirm Password *</label>
              <div className="relative">
                <input 
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formState.confirmPassword}
                  onChange={(e) => {
                    setFormState(prev => ({ ...prev, confirmPassword: e.target.value }));
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                  }}
                  placeholder="Re-enter password"
                  className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 font-semibold">{errors.confirmPassword}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5" data-error={!!errors.mobileNumber}>
              <label htmlFor="mobileNumber" className="text-[13px] font-bold text-slate-700">Mobile Number *</label>
              <div className="flex gap-2">
                <select
                  value={formState.countryCode}
                  onChange={(e) => setFormState(prev => ({ ...prev, countryCode: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  <option value="+91">+91 (IN)</option>
                </select>
                <input 
                  id="mobileNumber"
                  type="tel"
                  value={formState.mobileNumber}
                  onChange={(e) => {
                    setFormState(prev => ({ ...prev, mobileNumber: e.target.value }));
                    if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: null }));
                  }}
                  placeholder="10-digit mobile number"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                    errors.mobileNumber 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                />
              </div>
              {errors.mobileNumber && <p className="text-xs text-red-500 font-semibold">{errors.mobileNumber}</p>}
            </div>

            {/* Designation */}
            <div className="space-y-1.5">
              <label htmlFor="designation" className="text-[13px] font-bold text-slate-700">Designation / Role in Company</label>
              <input 
                id="designation"
                type="text"
                value={formState.designation}
                onChange={(e) => setFormState(prev => ({ ...prev, designation: e.target.value }))}
                placeholder="e.g. HR Manager / Talent Recruiter"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Company Profile Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Company Profile
          </h2>

          {/* Company Logo Upload */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 block">Company Logo (Optional)</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-1" />
                ) : (
                  <Upload className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="space-y-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{logoPreview ? 'Change Logo' : 'Choose Logo'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} className="hidden" />
                </label>
                {logoPreview && (
                  <button type="button" onClick={removeLogo} className="ml-2 text-xs font-bold text-red-500 hover:underline">
                    Remove
                  </button>
                )}
                <p className="text-[11px] text-slate-400 font-semibold">JPG, PNG, or WebP up to 2MB.</p>
              </div>
            </div>
            {errors.companyLogo && <p className="text-xs text-red-500 font-semibold mt-1">{errors.companyLogo}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-1.5 md:col-span-2" data-error={!!errors.companyName}>
              <label htmlFor="companyName" className="text-[13px] font-bold text-slate-700">Company Name *</label>
              <input 
                id="companyName"
                type="text"
                value={formState.companyName}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, companyName: e.target.value }));
                  if (errors.companyName) setErrors(prev => ({ ...prev, companyName: null }));
                }}
                placeholder="e.g. Acme Technologies Pvt Ltd"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.companyName 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.companyName && <p className="text-xs text-red-500 font-semibold">{errors.companyName}</p>}
            </div>

            {/* Company Phone */}
            <div className="space-y-1.5" data-error={!!errors.companyPhone}>
              <label htmlFor="companyPhone" className="text-[13px] font-bold text-slate-700">Company Phone *</label>
              <input 
                id="companyPhone"
                type="tel"
                value={formState.companyPhone}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, companyPhone: e.target.value }));
                  if (errors.companyPhone) setErrors(prev => ({ ...prev, companyPhone: null }));
                }}
                placeholder="+91 44 1234 5678"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.companyPhone 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.companyPhone && <p className="text-xs text-red-500 font-semibold">{errors.companyPhone}</p>}
            </div>

            {/* Company Email */}
            <div className="space-y-1.5" data-error={!!errors.companyEmail}>
              <label htmlFor="companyEmail" className="text-[13px] font-bold text-slate-700">Company Email *</label>
              <input 
                id="companyEmail"
                type="email"
                value={formState.companyEmail}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, companyEmail: e.target.value }));
                  if (errors.companyEmail) setErrors(prev => ({ ...prev, companyEmail: null }));
                }}
                placeholder="contact@company.com"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.companyEmail 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.companyEmail && <p className="text-xs text-red-500 font-semibold">{errors.companyEmail}</p>}
              <p className="text-[11px] text-slate-400 font-medium">Official company contact email shown on public company details.</p>
            </div>

            {/* Website */}
            <div className="space-y-1.5" data-error={!!errors.website}>
              <label htmlFor="website" className="text-[13px] font-bold text-slate-700">Website (Optional)</label>
              <input 
                id="website"
                type="url"
                value={formState.website}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, website: e.target.value }));
                  if (errors.website) setErrors(prev => ({ ...prev, website: null }));
                }}
                placeholder="https://www.company.com"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.website 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.website && <p className="text-xs text-red-500 font-semibold">{errors.website}</p>}
            </div>

            {/* LinkedIn Profile Link */}
            <div className="space-y-1.5">
              <label htmlFor="linkedinUrl" className="text-[13px] font-bold text-slate-700">LinkedIn Profile Link (Optional)</label>
              <input 
                id="linkedinUrl"
                type="url"
                value={formState.linkedinUrl}
                onChange={(e) => setFormState(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                placeholder="https://www.linkedin.com/company/company-name"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 min-h-[44px]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="companyDescription" className="text-[13px] font-bold text-slate-700">Company Description</label>
              <textarea 
                id="companyDescription"
                rows={3}
                value={formState.companyDescription}
                onChange={(e) => setFormState(prev => ({ ...prev, companyDescription: e.target.value }))}
                placeholder="Brief summary of company business and services..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Cascading Searchable Location Selectors */}
          <div className="space-y-3">
            <div>
              <label className="text-[13px] font-bold text-slate-700 block">Company Location</label>
              <p className="text-[11px] text-slate-400 font-medium">Search or type a new State, District, City/Town, or Locality and press Enter to add it.</p>
            </div>
            <CascadingLocationSelector
              stateId={formState.stateId}
              districtId={formState.districtId}
              cityId={formState.cityId}
              localityId={formState.localityId}
              onChange={({ stateId, districtId, cityId, localityId, locationId, locationAddress }) =>
                setFormState(prev => ({
                  ...prev,
                  stateId,
                  districtId,
                  cityId,
                  localityId,
                  locationId,
                  locationAddress,
                }))
              }
            />
          </div>

          {/* System Default Badges */}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span>Workflow Defaults:</span>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-amber-700 font-bold uppercase text-[10px]">
              Verification: Pending
            </span>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-600 font-bold uppercase text-[10px]">
              Trust Level: New
            </span>
          </div>
        </div>

        {/* Bottom Error Notification if API returned error */}
        {apiError && (
          <div id="api-error-banner-bottom" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-extrabold text-red-800 text-sm">Failed to create employer</p>
              <p className="mt-1 text-red-700 font-semibold text-xs leading-relaxed">{apiError}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => navigate('/super-admin/employers')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/10 hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 min-h-[44px] cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create employer"}
          </button>
        </div>

      </form>
    </div>
  );
}
