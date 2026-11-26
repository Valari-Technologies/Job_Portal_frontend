import { AlertCircle } from 'lucide-react';
import CustomDropdown from '../../shared/CustomDropdown';
import CascadingLocationSelector from '../../shared/CascadingLocationSelector';

export default function CompanyInformationStep({ formState, setFormState, errors, setErrors, touched, setTouched }) {
  const industries = ["Education", "Technology", "Healthcare", "Finance", "Services", "Retail", "Manufacturing"];
  const companyTypes = ["Private", "Public", "Non-Profit", "Partnership", "Sole Proprietorship"];

  const validateField = (name, value) => {
    let err = null;
    if (!value || (typeof value === 'string' && !value.trim())) {
      err = `${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required.`;
    } else if (name === 'companyEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value).trim())) {
        err = "Invalid email format.";
      }
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formState[name]);
  };

  const handleChange = (name, val) => {
    setFormState(prev => ({ ...prev, [name]: val }));
    if (touched[name]) {
      validateField(name, val);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Grid of 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
        
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Company Name *</label>
          <input 
            type="text"
            value={formState.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            onBlur={() => handleBlur('companyName')}
            placeholder="Enter company name"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
              errors.companyName && touched.companyName ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
            }`}
          />
          {errors.companyName && touched.companyName && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.companyName}</span>
            </div>
          )}
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Industry *</label>
          <CustomDropdown
            value={formState.industry}
            placeholder="Select industry"
            onChange={(e) => handleChange('industry', e.target.value)}
            options={industries}
            error={errors.industry && touched.industry}
          />
          {errors.industry && touched.industry && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.industry}</span>
            </div>
          )}
        </div>

        {/* Company Type */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Company Type *</label>
          <CustomDropdown
            value={formState.companyType}
            placeholder="Select company type"
            onChange={(e) => handleChange('companyType', e.target.value)}
            options={companyTypes}
            error={errors.companyType && touched.companyType}
          />
          {errors.companyType && touched.companyType && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.companyType}</span>
            </div>
          )}
        </div>

        {/* Company Contact Email */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Company Contact Email *</label>
          <input 
            type="email"
            value={formState.companyEmail}
            onChange={(e) => handleChange('companyEmail', e.target.value)}
            onBlur={() => handleBlur('companyEmail')}
            placeholder="Enter contact email"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
              errors.companyEmail && touched.companyEmail ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
            }`}
          />
          {errors.companyEmail && touched.companyEmail && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.companyEmail}</span>
            </div>
          )}
        </div>

        {/* Company Phone */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[13px] font-semibold text-slate-700">Company Phone *</label>
          <div className="flex gap-2">
            <CustomDropdown
              value={formState.companyPhoneCountryCode}
              onChange={(e) => handleChange('companyPhoneCountryCode', e.target.value)}
              options={[
                { value: '+91', label: '🇮🇳 +91' },
                { value: '+1', label: '🇺🇸 +1' },
                { value: '+44', label: '🇬🇧 +44' }
              ]}
              className="w-28 shrink-0"
            />
            <input 
              type="tel"
              value={formState.companyPhone}
              onChange={(e) => handleChange('companyPhone', e.target.value)}
              onBlur={() => handleBlur('companyPhone')}
              placeholder="Enter company phone"
              className={`flex-1 rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
                errors.companyPhone && touched.companyPhone ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.companyPhone && touched.companyPhone && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.companyPhone}</span>
            </div>
          )}
        </div>

        {/* Website (Optional) */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Website (Optional)</label>
          <input
            type="url"
            value={formState.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://www.company.com"
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px]"
          />
        </div>

        {/* LinkedIn Profile Link (Optional) */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">LinkedIn Profile Link (Optional)</label>
          <input
            type="url"
            value={formState.linkedinUrl || ''}
            onChange={(e) => handleChange('linkedinUrl', e.target.value)}
            placeholder="https://www.linkedin.com/company/company-name"
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px]"
          />
        </div>

      </div>

      {/* Cascading Location Selectors (State, District, City, Locality) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div>
          <label className="text-[13px] font-semibold text-slate-700 block">Location *</label>
          <p className="text-[11px] text-slate-400 font-medium">Search or type a new State, District, City/Town, or Locality and press Enter to add it.</p>
        </div>
        <CascadingLocationSelector
          stateId={formState.stateId}
          districtId={formState.districtId}
          cityId={formState.cityId}
          localityId={formState.localityId}
          labelClassName="text-[11px] font-semibold text-slate-500 block mb-1"
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          onChange={({ stateId, districtId, cityId, localityId, locationId, locationAddress }) => {
            setFormState(prev => ({
              ...prev,
              stateId,
              districtId,
              cityId,
              localityId,
              location: locationAddress,
              location_id: locationId,
            }));
            if (locationAddress && errors.location) {
              setErrors(prev => ({ ...prev, location: null }));
            }
          }}
        />

        {errors.location && touched.location && (
          <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.location}</span>
          </div>
        )}
      </div>

    </div>
  );
}
