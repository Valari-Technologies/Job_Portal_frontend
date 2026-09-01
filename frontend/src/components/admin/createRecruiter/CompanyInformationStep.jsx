import { AlertCircle } from 'lucide-react';

export default function CompanyInformationStep({ formState, setFormState, errors, setErrors, touched, setTouched }) {
  
  const industries = ["Education", "Technology", "Healthcare", "Finance", "Services", "Retail", "Manufacturing"];
  const companyTypes = ["Private", "Public", "Non-Profit", "Partnership", "Sole Proprietorship"];
  const locations = ["Chennai, India", "Bengaluru, India", "Mumbai, India", "New York, United States", "London, United Kingdom"];

  const validateField = (name, value) => {
    let err = null;
    if (!value || !value.trim()) {
      err = `${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required.`;
    } else if (name === 'companyEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
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
          <div className="relative">
            <select
              value={formState.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              onBlur={() => handleBlur('industry')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-700 bg-white focus:outline-none min-h-[46px] appearance-none pr-8 cursor-pointer ${
                errors.industry && touched.industry ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
              }`}
            >
              <option value="">Select industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              ▼
            </div>
          </div>
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
          <div className="relative">
            <select
              value={formState.companyType}
              onChange={(e) => handleChange('companyType', e.target.value)}
              onBlur={() => handleBlur('companyType')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-705 bg-white focus:outline-none min-h-[46px] appearance-none pr-8 cursor-pointer ${
                errors.companyType && touched.companyType ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
              }`}
            >
              <option value="">Select company type</option>
              {companyTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              ▼
            </div>
          </div>
          {errors.companyType && touched.companyType && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.companyType}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Location *</label>
          <div className="relative">
            <select
              value={formState.location}
              onChange={(e) => handleChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-705 bg-white focus:outline-none min-h-[46px] appearance-none pr-8 cursor-pointer ${
                errors.location && touched.location ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
              }`}
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              ▼
            </div>
          </div>
          {errors.location && touched.location && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.location}</span>
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
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Company Phone *</label>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={formState.companyPhoneCountryCode}
                onChange={(e) => handleChange('companyPhoneCountryCode', e.target.value)}
                className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] font-medium text-slate-700 bg-white focus:outline-none min-h-[46px] appearance-none pr-8 cursor-pointer"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                ▼
              </div>
            </div>
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

      </div>

    </div>
  );
}
