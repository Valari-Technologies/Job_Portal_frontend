import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { fetchLocations } from '../../../services/superAdmin/locationService';

export default function CompanyInformationStep({ formState, setFormState, errors, setErrors, touched, setTouched }) {
  const industries = ["Education", "Technology", "Healthcare", "Finance", "Services", "Retail", "Manufacturing"];
  const companyTypes = ["Private", "Public", "Non-Profit", "Partnership", "Sole Proprietorship"];

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Fetch initial States from location catalog
  useEffect(() => {
    let active = true;
    async function loadStates() {
      try {
        const data = await fetchLocations({ location_type: 'STATE' });
        if (active) setStates(data);
      } catch (err) {
        console.error("Failed to load states:", err);
      } finally {
        if (active) setLoadingLocations(false);
      }
    }
    loadStates();
    return () => { active = false; };
  }, []);

  // Fetch Districts when State changes
  useEffect(() => {
    let active = true;
    if (!formState.stateId) {
      setDistricts([]);
      setCities([]);
      setLocalities([]);
      return;
    }
    async function loadDistricts() {
      const data = await fetchLocations({ location_type: 'DISTRICT', parent_id: formState.stateId });
      if (active) setDistricts(data);
    }
    loadDistricts();
    return () => { active = false; };
  }, [formState.stateId]);

  // Fetch Cities when District changes
  useEffect(() => {
    let active = true;
    if (!formState.districtId) {
      setCities([]);
      setLocalities([]);
      return;
    }
    async function loadCities() {
      const data = await fetchLocations({ location_type: 'CITY', parent_id: formState.districtId });
      if (active) setCities(data);
    }
    loadCities();
    return () => { active = false; };
  }, [formState.districtId]);

  // Fetch Localities when City changes
  useEffect(() => {
    let active = true;
    if (!formState.cityId) {
      setLocalities([]);
      return;
    }
    async function loadLocalities() {
      const data = await fetchLocations({ location_type: 'LOCALITY', parent_id: formState.cityId });
      if (active) setLocalities(data);
    }
    loadLocalities();
    return () => { active = false; };
  }, [formState.cityId]);

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

  const handleStateChange = (e) => {
    const sId = e.target.value;
    const selectedStateObj = states.find(s => String(s.id) === String(sId));
    const locName = selectedStateObj?.name || '';

    setFormState(prev => ({
      ...prev,
      stateId: sId,
      districtId: '',
      cityId: '',
      localityId: '',
      location: locName,
      location_id: sId ? Number(sId) : null
    }));

    if (touched.location) {
      validateField('location', locName);
    }
  };

  const handleDistrictChange = (e) => {
    const dId = e.target.value;
    const selectedStateObj = states.find(s => String(s.id) === String(formState.stateId));
    const selectedDistrictObj = districts.find(d => String(d.id) === String(dId));

    const parts = [selectedDistrictObj?.name, selectedStateObj?.name].filter(Boolean);
    const locName = parts.join(', ') || formState.location;
    const chosenId = dId || formState.stateId;

    setFormState(prev => ({
      ...prev,
      districtId: dId,
      cityId: '',
      localityId: '',
      location: locName,
      location_id: chosenId ? Number(chosenId) : null
    }));

    if (touched.location) {
      validateField('location', locName);
    }
  };

  const handleCityChange = (e) => {
    const cId = e.target.value;
    const selectedStateObj = states.find(s => String(s.id) === String(formState.stateId));
    const selectedDistrictObj = districts.find(d => String(d.id) === String(formState.districtId));
    const selectedCityObj = cities.find(c => String(c.id) === String(cId));

    const parts = [selectedCityObj?.name, selectedDistrictObj?.name, selectedStateObj?.name].filter(Boolean);
    const locName = parts.join(', ') || formState.location;
    const chosenId = cId || formState.districtId || formState.stateId;

    setFormState(prev => ({
      ...prev,
      cityId: cId,
      localityId: '',
      location: locName,
      location_id: chosenId ? Number(chosenId) : null
    }));

    if (touched.location) {
      validateField('location', locName);
    }
  };

  const handleLocalityChange = (e) => {
    const lId = e.target.value;
    const selectedStateObj = states.find(s => String(s.id) === String(formState.stateId));
    const selectedDistrictObj = districts.find(d => String(d.id) === String(formState.districtId));
    const selectedCityObj = cities.find(c => String(c.id) === String(formState.cityId));
    const selectedLocalityObj = localities.find(l => String(l.id) === String(lId));

    const parts = [selectedLocalityObj?.name, selectedCityObj?.name, selectedDistrictObj?.name, selectedStateObj?.name].filter(Boolean);
    const locName = parts.join(', ') || formState.location;
    const chosenId = lId || formState.cityId || formState.districtId || formState.stateId;

    setFormState(prev => ({
      ...prev,
      localityId: lId,
      location: locName,
      location_id: chosenId ? Number(chosenId) : null
    }));

    if (touched.location) {
      validateField('location', locName);
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

      {/* Cascading Location Selectors (State, District, City, Locality) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-[13px] font-semibold text-slate-700 block">Location *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* State */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 block">State</label>
            <div className="relative">
              <select
                value={formState.stateId || ''}
                onChange={handleStateChange}
                disabled={loadingLocations}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] font-medium text-slate-700 bg-white focus:outline-none min-h-[44px] appearance-none pr-7 cursor-pointer disabled:bg-slate-50"
              >
                <option value="">{loadingLocations ? "Loading states..." : "Select State"}</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 block">District</label>
            <div className="relative">
              <select
                value={formState.districtId || ''}
                onChange={handleDistrictChange}
                disabled={!formState.stateId}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] font-medium text-slate-700 bg-white focus:outline-none min-h-[44px] appearance-none pr-7 cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* City / Town */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 block">City / Town</label>
            <div className="relative">
              <select
                value={formState.cityId || ''}
                onChange={handleCityChange}
                disabled={!formState.districtId}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] font-medium text-slate-700 bg-white focus:outline-none min-h-[44px] appearance-none pr-7 cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Select City/Town</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Locality */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 block">Locality</label>
            <div className="relative">
              <select
                value={formState.localityId || ''}
                onChange={handleLocalityChange}
                disabled={!formState.cityId}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] font-medium text-slate-700 bg-white focus:outline-none min-h-[44px] appearance-none pr-7 cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Select Locality</option>
                {localities.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-[10px]">
                ▼
              </div>
            </div>
          </div>
        </div>

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
