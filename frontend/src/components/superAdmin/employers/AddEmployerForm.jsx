import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { createEmployerService } from '../../../services/superAdmin/superAdminService';

export default function AddEmployerForm() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    accountEmail: '',
    countryCode: '+91',
    mobileNumber: '',
    primaryContactName: '',
    companyName: '',
    companyDescription: '',
    companyLogo: null,
    companyPhone: '',
    companyEmail: '',
    website: '',
    state: '',
    district: '',
    city: '',
    locality: ''
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
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
    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] textarea');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        account_email: formState.accountEmail.trim(),
        mobile_number: `${formState.countryCode}${formState.mobileNumber.trim()}`,
        primary_contact_name: formState.primaryContactName.trim() || null,
        company_name: formState.companyName.trim(),
        company_description: formState.companyDescription.trim() || null,
        company_phone: formState.companyPhone.trim(),
        company_email: formState.companyEmail.trim(),
        website: formState.website.trim() || null,
        state: formState.state || null,
        district: formState.district || null,
        city: formState.city || null,
        locality: formState.locality || null,
        verification_status: 'PENDING',
        trust_level: 'NEW'
      };

      const res = await createEmployerService(payload);
      if (res.success) {
        navigate('/super-admin/employers');
      }
    } catch (err) {
      console.error("Failed to create employer", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add employer</h1>
        <p className="text-sm font-medium text-slate-450 mt-1">
          Register a new employer account and company profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8">
        
        {/* Section 1: Account and Primary Contact */}
        <div className="space-y-5">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Account & Primary Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Account Email */}
            <div className="space-y-1.5" data-error={!!errors.accountEmail}>
              <label htmlFor="accountEmail" className="text-[13px] font-bold text-slate-700">Account Email Address *</label>
              <input 
                id="accountEmail"
                type="email"
                value={formState.accountEmail}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, accountEmail: e.target.value }));
                  if (errors.accountEmail) setErrors(prev => ({ ...prev, accountEmail: null }));
                }}
                placeholder="employer@company.com"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.accountEmail 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.accountEmail && <p className="text-xs text-red-500 font-semibold">{errors.accountEmail}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5" data-error={!!errors.mobileNumber}>
              <label htmlFor="mobileNumber" className="text-[13px] font-bold text-slate-700">Mobile Number *</label>
              <div className="flex gap-2">
                <select
                  value={formState.countryCode}
                  onChange={(e) => setFormState(prev => ({ ...prev, countryCode: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:border-teal-500 min-h-[44px]"
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

            {/* Primary Contact Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="primaryContactName" className="text-[13px] font-bold text-slate-700">Primary Contact Name</label>
              <input 
                id="primaryContactName"
                type="text"
                value={formState.primaryContactName}
                onChange={(e) => setFormState(prev => ({ ...prev, primaryContactName: e.target.value }))}
                placeholder="Enter contact person name"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Company Information */}
        <div className="space-y-5">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Company Information</h2>

          {/* Company Logo */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 block">Company Logo (Optional)</label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200">
                  <img src={logoPreview} alt="Company Logo Preview" className="h-full w-full object-contain p-1" />
                  <button 
                    type="button" 
                    onClick={removeLogo} 
                    className="absolute inset-0 bg-slate-900/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    aria-label="Remove logo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} className="hidden" />
                </label>
              )}
              <span className="text-xs text-slate-450 font-medium">JPG, PNG, or WebP up to 2MB.</span>
            </div>
            {errors.companyLogo && <p className="text-xs text-red-500 font-semibold">{errors.companyLogo}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                placeholder="Enter official company name"
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
                placeholder="Enter company phone number"
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
            </div>

            {/* Website */}
            <div className="space-y-1.5 md:col-span-2" data-error={!!errors.website}>
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

          {/* Cascading Location Selectors */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-slate-700 block">Company Location *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label htmlFor="state" className="text-xs font-semibold text-slate-500 block mb-1">State</label>
                <select
                  id="state"
                  value={formState.state}
                  onChange={(e) => setFormState(prev => ({ ...prev, state: e.target.value, district: '', city: '', locality: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  <option value="">Select State</option>
                </select>
              </div>

              <div>
                <label htmlFor="district" className="text-xs font-semibold text-slate-500 block mb-1">District</label>
                <select
                  id="district"
                  disabled={!formState.state}
                  value={formState.district}
                  onChange={(e) => setFormState(prev => ({ ...prev, district: e.target.value, city: '', locality: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select District</option>
                </select>
              </div>

              <div>
                <label htmlFor="city" className="text-xs font-semibold text-slate-500 block mb-1">City / Town</label>
                <select
                  id="city"
                  disabled={!formState.district}
                  value={formState.city}
                  onChange={(e) => setFormState(prev => ({ ...prev, city: e.target.value, locality: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select City/Town</option>
                </select>
              </div>

              <div>
                <label htmlFor="locality" className="text-xs font-semibold text-slate-500 block mb-1">Locality</label>
                <select
                  id="locality"
                  disabled={!formState.city}
                  value={formState.locality}
                  onChange={(e) => setFormState(prev => ({ ...prev, locality: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select Locality</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-450 italic">Location data will load from taxonomy after backend connection.</p>
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
