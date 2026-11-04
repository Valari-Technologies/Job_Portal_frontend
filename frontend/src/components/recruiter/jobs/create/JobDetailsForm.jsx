import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ArrowRight } from 'lucide-react';
import { JobWizardContext } from './JobWizardContext.js';
import { getActiveIndustries, getSpecializationsByIndustry } from '../../../../services/candidate/candidateOnboardingService';
import { fetchActivePublicSkills } from '../../../../services/superAdmin/categorySkillService';
import { INDIA_STATES, getDistrictsForState } from '../../../../data/indiaLocations';
import CustomDropdown from '../../../shared/CustomDropdown';

export default function JobDetailsForm() {
  const navigate = useNavigate();
  const { jobDetails, setJobDetails } = useContext(JobWizardContext);

  const [formState, setFormState] = useState(jobDetails);
  const [errors, setErrors] = useState({});
  const [newSkillInput, setNewSkillInput] = useState('');
  const [activeMasterSkills, setActiveMasterSkills] = useState([]);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  // Live Super Admin taxonomy state
  const [industriesList, setIndustriesList] = useState([]);
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);

  // Fetch live parent categories (Industries) from Super Admin
  useEffect(() => {
    let isMounted = true;
    async function fetchIndustries() {
      setIsLoadingIndustries(true);
      try {
        const list = await getActiveIndustries();
        if (isMounted) {
          setIndustriesList(list || []);
        }
      } catch (err) {
        console.error('Failed to load industries from Super Admin:', err);
      } finally {
        if (isMounted) {
          setIsLoadingIndustries(false);
        }
      }
    }
    fetchIndustries();
    return () => { isMounted = false; };
  }, []);

  // Fetch active Master Skills from Super Admin catalog
  useEffect(() => {
    let isMounted = true;
    fetchActivePublicSkills().then(list => {
      if (isMounted && Array.isArray(list)) {
        setActiveMasterSkills(list);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Fetch live subcategories (Job Categories / Specializations) when industry changes or on initial restore
  useEffect(() => {
    let isMounted = true;
    async function fetchSubcategories() {
      if (!formState.industry) {
        setSubcategoriesList([]);
        return;
      }

      // Find selected industry ID
      const selectedInd = industriesList.find(
        i => i.name === formState.industry || String(i.id) === String(formState.industryId) || String(i.id) === String(formState.industry)
      );

      if (!selectedInd?.id) {
        return;
      }

      setIsLoadingSubcategories(true);
      try {
        const subList = await getSpecializationsByIndustry(selectedInd.id);
        if (isMounted) {
          setSubcategoriesList(subList || []);
        }
      } catch (err) {
        console.error('Failed to load subcategories for industry:', err);
      } finally {
        if (isMounted) {
          setIsLoadingSubcategories(false);
        }
      }
    }

    if (industriesList.length > 0) {
      fetchSubcategories();
    }
    return () => { isMounted = false; };
  }, [formState.industry, formState.industryId, industriesList]);

  const availableDistricts = formState.state ? getDistrictsForState(formState.state) : [];

  const handleStateChange = (selectedState) => {
    const dists = getDistrictsForState(selectedState);
    const newDistrict = dists.includes(formState.district) ? formState.district : '';
    setFormState(prev => ({
      ...prev,
      state: selectedState,
      district: newDistrict,
      city: !prev.city || prev.city === prev.district ? '' : prev.city
    }));
    if (errors.state) {
      setErrors(prev => ({ ...prev, state: null }));
    }
  };

  const handleDistrictChange = (selectedDistrict) => {
    setFormState(prev => ({
      ...prev,
      district: selectedDistrict,
      city: !prev.city ? selectedDistrict : prev.city
    }));
    if (errors.district) {
      setErrors(prev => ({ ...prev, district: null }));
    }
  };

  const handleIndustryChange = (val) => {
    const selectedInd = industriesList.find(i => i.name === val || String(i.id) === String(val));
    setFormState(prev => ({
      ...prev,
      industry: selectedInd ? selectedInd.name : val,
      industryId: selectedInd?.id || null,
      category: '',
      categoryId: null,
      department: ''
    }));
  };

  const handleAddResponsibility = () => {
    setFormState(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const handleRemoveResponsibility = (index) => {
    setFormState(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const handleResponsibilityChange = (index, val) => {
    setFormState(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((r, i) => i === index ? val : r)
    }));
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!formState.skills.includes(newSkillInput.trim())) {
      setFormState(prev => ({
        ...prev,
        skills: [...prev.skills, newSkillInput.trim()]
      }));
    }
    setNewSkillInput('');
    setIsSkillDropdownOpen(false);
  };

  const handleSelectMasterSkill = (skillName) => {
    if (!skillName) return;
    if (!formState.skills.includes(skillName)) {
      setFormState(prev => ({
        ...prev,
        skills: [...prev.skills, skillName]
      }));
    }
    setNewSkillInput('');
    setIsSkillDropdownOpen(false);
  };

  const matchingMasterSkills = activeMasterSkills.filter(s => {
    const name = s.name || '';
    if (formState.skills.includes(name)) return false;
    if (!newSkillInput.trim()) return true;
    return name.toLowerCase().includes(newSkillInput.trim().toLowerCase());
  }).slice(0, 8);

  const handleRemoveSkill = (skillToRemove) => {
    setFormState(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleToggleBenefit = (benefit) => {
    setFormState(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formState.title.trim()) newErrors.title = 'Job Title is required.';
    if (!formState.industry) newErrors.industry = 'Industry is required.';
    if (!formState.category) newErrors.category = 'Job Category is required.';
    if (!formState.workMode) newErrors.workMode = 'Work Mode is required.';
    if (formState.workMode !== 'Remote') {
      if (!formState.state) newErrors.state = 'State is required.';
      if (!formState.district) newErrors.district = 'District is required.';
    }
    if (!formState.employmentType) newErrors.employmentType = 'Employment Type is required.';
    if (!formState.description.trim()) newErrors.description = 'Job Description is required.';

    if (formState.minExperience !== '' && Number(formState.minExperience) < 0) {
      newErrors.minExperience = 'Min experience cannot be negative.';
    }
    if (formState.maxExperience !== '' && Number(formState.maxExperience) < 0) {
      newErrors.maxExperience = 'Max experience cannot be negative.';
    }
    if (
      formState.minExperience !== '' &&
      formState.maxExperience !== '' &&
      Number(formState.minExperience) > Number(formState.maxExperience)
    ) {
      newErrors.maxExperience = 'Min experience cannot exceed Max experience.';
    }

    if (formState.minSalary !== '' && Number(formState.minSalary) < 0) {
      newErrors.minSalary = 'Min salary cannot be negative.';
    }
    if (formState.maxSalary !== '' && Number(formState.maxSalary) < 0) {
      newErrors.maxSalary = 'Max salary cannot be negative.';
    }
    if (
      formState.minSalary !== '' &&
      formState.maxSalary !== '' &&
      Number(formState.minSalary) > Number(formState.maxSalary)
    ) {
      newErrors.maxSalary = 'Min salary cannot exceed Max salary.';
    }

    if (formState.deadline) {
      const today = new Date().toISOString().split('T')[0];
      if (formState.deadline < today) {
        newErrors.deadline = 'Deadline cannot be before today.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] select, [data-error="true"] textarea');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    // Save validated state into Wizard context and proceed to Step 2
    setJobDetails(formState);
    navigate('/recruiter/jobs/create/plan');
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8 shadow-xs">
      
      {/* 1. JOB BASICS */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          JOB BASICS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Job Title */}
          <div className="space-y-1.5 md:col-span-2" data-error={!!errors.title}>
            <label htmlFor="title" className="text-[13px] font-bold text-slate-700">Job Title *</label>
            <input 
              id="title"
              type="text"
              value={formState.title}
              onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Senior Software Engineer"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                errors.title ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 font-semibold">{errors.title}</p>}
          </div>

          {/* Industry (Super Admin Parent Categories) */}
          <div className="space-y-1.5" data-error={!!errors.industry}>
            <label htmlFor="industry" className="text-[13px] font-bold text-slate-700">Industry *</label>
            <CustomDropdown
              id="industry"
              disabled={isLoadingIndustries}
              value={formState.industry}
              placeholder={isLoadingIndustries ? 'Loading industries...' : 'Select Industry'}
              onChange={(e) => handleIndustryChange(e.target.value)}
              options={industriesList.map((ind) => ({ value: ind.name, label: ind.name }))}
              error={!!errors.industry}
            />
            {errors.industry && <p className="text-xs text-red-500 font-semibold">{errors.industry}</p>}
          </div>

          {/* Job Category (Super Admin Subcategories / Specializations) */}
          <div className="space-y-1.5" data-error={!!errors.category}>
            <label htmlFor="category" className="text-[13px] font-bold text-slate-700">Job Category / Specialization *</label>
            <CustomDropdown
              id="category"
              disabled={!formState.industry || isLoadingSubcategories}
              value={formState.category}
              placeholder={
                !formState.industry 
                  ? 'Select Industry first' 
                  : (isLoadingSubcategories ? 'Loading specializations...' : (subcategoriesList.length === 0 ? 'No specializations under this industry' : 'Select Job Category'))
              }
              onChange={(e) => {
                const val = e.target.value;
                const matched = subcategoriesList.find(c => c.name === val || String(c.id) === String(val));
                setFormState(prev => ({
                  ...prev,
                  category: val,
                  categoryId: matched?.id || null
                }));
              }}
              options={subcategoriesList.map((cat) => ({ value: cat.name, label: cat.name }))}
              error={!!errors.category}
            />
            {errors.category && <p className="text-xs text-red-500 font-semibold">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* 2. LOCATION & WORK MODE */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          LOCATION & WORK MODE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Work Mode */}
          <div className="space-y-1.5" data-error={!!errors.workMode}>
            <label htmlFor="workMode" className="text-[13px] font-bold text-slate-700">Work Mode *</label>
            <CustomDropdown
              id="workMode"
              value={formState.workMode}
              placeholder="Select Work Mode"
              onChange={(e) => setFormState(prev => ({ ...prev, workMode: e.target.value }))}
              options={['On-site', 'Remote', 'Hybrid']}
              error={!!errors.workMode}
            />
            {errors.workMode && <p className="text-xs text-red-500 font-semibold">{errors.workMode}</p>}
          </div>

          {/* State */}
          <div className="space-y-1.5" data-error={!!errors.state}>
            <label htmlFor="state" className="text-[13px] font-bold text-slate-700">State *</label>
            <CustomDropdown 
              id="state"
              value={formState.state || ''}
              placeholder="Select State"
              searchable={true}
              onChange={(e) => handleStateChange(e.target.value)}
              options={INDIA_STATES}
              error={!!errors.state}
            />
            {errors.state && <p className="text-xs text-red-500 font-semibold">{errors.state}</p>}
          </div>

          {/* District */}
          <div className="space-y-1.5" data-error={!!errors.district}>
            <label htmlFor="district" className="text-[13px] font-bold text-slate-700">District *</label>
            <CustomDropdown 
              id="district"
              value={formState.district || ''}
              disabled={!formState.state || availableDistricts.length === 0}
              placeholder={formState.state ? 'Select District' : 'Select State first'}
              searchable={true}
              onChange={(e) => handleDistrictChange(e.target.value)}
              options={availableDistricts}
              error={!!errors.district}
            />
            {errors.district && <p className="text-xs text-red-500 font-semibold">{errors.district}</p>}
          </div>

          {/* City / Town */}
          <div className="space-y-1.5">
            <label htmlFor="city" className="text-[13px] font-bold text-slate-700">City / Town</label>
            <input 
              id="city"
              type="text"
              value={formState.city || ''}
              onChange={(e) => setFormState(prev => ({ ...prev, city: e.target.value }))}
              placeholder={formState.district ? `e.g. ${formState.district} City, North ${formState.district}` : "e.g. Chennai, Tambaram"}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* 3. EMPLOYMENT DETAILS */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          EMPLOYMENT DETAILS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Employment Type */}
          <div className="space-y-1.5" data-error={!!errors.employmentType}>
            <label htmlFor="employmentType" className="text-[13px] font-bold text-slate-700">Employment Type *</label>
            <CustomDropdown
              id="employmentType"
              value={formState.employmentType}
              placeholder="Select Employment Type"
              onChange={(e) => setFormState(prev => ({ ...prev, employmentType: e.target.value }))}
              options={['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']}
              error={!!errors.employmentType}
            />
            {errors.employmentType && <p className="text-xs text-red-500 font-semibold">{errors.employmentType}</p>}
          </div>

          {/* Min Experience */}
          <div className="space-y-1.5" data-error={!!errors.minExperience}>
            <label htmlFor="minExperience" className="text-[13px] font-bold text-slate-700">Min Experience (Yrs)</label>
            <input 
              id="minExperience"
              type="number"
              min="0"
              value={formState.minExperience}
              onChange={(e) => setFormState(prev => ({ ...prev, minExperience: e.target.value }))}
              placeholder="e.g. 2"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
            {errors.minExperience && <p className="text-xs text-red-500 font-semibold">{errors.minExperience}</p>}
          </div>

          {/* Max Experience */}
          <div className="space-y-1.5" data-error={!!errors.maxExperience}>
            <label htmlFor="maxExperience" className="text-[13px] font-bold text-slate-700">Max Experience (Yrs)</label>
            <input 
              id="maxExperience"
              type="number"
              min="0"
              value={formState.maxExperience}
              onChange={(e) => setFormState(prev => ({ ...prev, maxExperience: e.target.value }))}
              placeholder="e.g. 5"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
            {errors.maxExperience && <p className="text-xs text-red-500 font-semibold">{errors.maxExperience}</p>}
          </div>

          {/* Number of Openings */}
          <div className="space-y-1.5">
            <label htmlFor="numberOfOpenings" className="text-[13px] font-bold text-slate-700">Number of Openings *</label>
            <input 
              id="numberOfOpenings"
              type="number"
              min="1"
              value={formState.numberOfOpenings}
              onChange={(e) => setFormState(prev => ({ ...prev, numberOfOpenings: e.target.value }))}
              placeholder="e.g. 1"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
          </div>

          {/* Application Type */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="applicationType" className="text-[13px] font-bold text-slate-700">Application Type *</label>
            <CustomDropdown
              id="applicationType"
              value={formState.applicationType}
              onChange={(e) => setFormState(prev => ({ ...prev, applicationType: e.target.value }))}
              options={['Profile/Resume Application', 'Simple Apply']}
            />
          </div>
        </div>
      </div>

      {/* 4. COMPENSATION */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          COMPENSATION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Min Salary */}
          <div className="space-y-1.5" data-error={!!errors.minSalary}>
            <label htmlFor="minSalary" className="text-[13px] font-bold text-slate-700">Minimum Salary</label>
            <input 
              id="minSalary"
              type="number"
              min="0"
              value={formState.minSalary}
              onChange={(e) => setFormState(prev => ({ ...prev, minSalary: e.target.value }))}
              placeholder="e.g. 80000"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
            {errors.minSalary && <p className="text-xs text-red-500 font-semibold">{errors.minSalary}</p>}
          </div>

          {/* Max Salary */}
          <div className="space-y-1.5" data-error={!!errors.maxSalary}>
            <label htmlFor="maxSalary" className="text-[13px] font-bold text-slate-700">Maximum Salary</label>
            <input 
              id="maxSalary"
              type="number"
              min="0"
              value={formState.maxSalary}
              onChange={(e) => setFormState(prev => ({ ...prev, maxSalary: e.target.value }))}
              placeholder="e.g. 120000"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
            {errors.maxSalary && <p className="text-xs text-red-500 font-semibold">{errors.maxSalary}</p>}
          </div>

          {/* Salary Type */}
          <div className="space-y-1.5">
            <label htmlFor="salaryType" className="text-[13px] font-bold text-slate-700">Salary Type</label>
            <CustomDropdown
              id="salaryType"
              value={formState.salaryType}
              onChange={(e) => setFormState(prev => ({ ...prev, salaryType: e.target.value }))}
              options={[
                { value: 'PER_MONTH', label: 'Per Month' },
                { value: 'PER_YEAR', label: 'Per Year' },
                { value: 'PER_HOUR', label: 'Per Hour' }
              ]}
            />
          </div>

          {/* Currency */}
          <div className="space-y-1.5">
            <label htmlFor="currency" className="text-[13px] font-bold text-slate-700">Currency</label>
            <CustomDropdown
              id="currency"
              value={formState.currency}
              onChange={(e) => setFormState(prev => ({ ...prev, currency: e.target.value }))}
              options={[{ value: 'INR', label: 'INR (₹)' }]}
            />
          </div>
        </div>

        {/* Hide Salary Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input 
            id="hideSalary"
            type="checkbox"
            checked={formState.hideSalary}
            onChange={(e) => setFormState(prev => ({ ...prev, hideSalary: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="hideSalary" className="text-xs font-bold text-slate-650 cursor-pointer">
            Hide salary from candidates
          </label>
        </div>
      </div>

      {/* 5. JOB DESCRIPTION */}
      <div className="space-y-5" data-error={!!errors.description}>
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          JOB DESCRIPTION
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="description" className="text-[13px] font-bold text-slate-700">Job Description *</label>
          <textarea 
            id="description"
            rows={5}
            value={formState.description}
            onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter detailed job description here..."
            className={`w-full rounded-xl border p-3.5 text-sm font-medium text-slate-800 focus:outline-none ${
              errors.description ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'
            }`}
          />
          {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description}</p>}
        </div>
      </div>

      {/* 6. KEY RESPONSIBILITIES */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          KEY RESPONSIBILITIES
        </h2>

        <div className="space-y-3">
          {formState.responsibilities.map((resp, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input 
                type="text"
                value={resp}
                onChange={(e) => handleResponsibilityChange(idx, e.target.value)}
                placeholder="e.g. Lead the development of web applications..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
              />
              {formState.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveResponsibility(idx)}
                  className="p-2.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddResponsibility}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Responsibility</span>
          </button>
        </div>
      </div>

      {/* 7. REQUIRED SKILLS */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          REQUIRED SKILLS
        </h2>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {formState.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-indigo-900">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="relative max-w-sm">
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={newSkillInput}
                onChange={(e) => {
                  setNewSkillInput(e.target.value);
                  setIsSkillDropdownOpen(true);
                }}
                onFocus={() => setIsSkillDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsSkillDropdownOpen(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                    setIsSkillDropdownOpen(false);
                  }
                }}
                placeholder="e.g. React.js, Python"
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[40px]"
              />
              <button
                type="button"
                onClick={() => {
                  handleAddSkill();
                  setIsSkillDropdownOpen(false);
                }}
                className="px-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 font-extrabold text-xs hover:bg-indigo-100 transition-colors min-h-[40px]"
              >
                + Add Skill
              </button>
            </div>

            {isSkillDropdownOpen && matchingMasterSkills.length > 0 && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-52 overflow-y-auto p-1.5 space-y-0.5"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Select from Master Skills
                </div>
                {matchingMasterSkills.map(s => (
                  <button
                    key={s.id || s.name}
                    type="button"
                    onClick={() => handleSelectMasterSkill(s.name)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{s.name}</span>
                    {s.category_name && (
                      <span className="text-[10px] text-slate-400 font-medium">{s.category_name}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 8. QUALIFICATIONS */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          QUALIFICATIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="education" className="text-[13px] font-bold text-slate-700">Education</label>
            <input 
              id="education"
              type="text"
              value={formState.education}
              onChange={(e) => setFormState(prev => ({ ...prev, education: e.target.value }))}
              placeholder="e.g. Bachelor's Degree"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="degree" className="text-[13px] font-bold text-slate-700">Degree / Specialization</label>
            <input 
              id="degree"
              type="text"
              value={formState.degree}
              onChange={(e) => setFormState(prev => ({ ...prev, degree: e.target.value }))}
              placeholder="e.g. Computer Science"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* 9. BENEFITS & PERKS */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          BENEFITS & PERKS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Health Insurance', 'Work From Home', 'Paid Leave', 'Performance Bonus'].map((benefit) => (
            <label key={benefit} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input 
                type="checkbox"
                checked={formState.benefits.includes(benefit)}
                onChange={() => handleToggleBenefit(benefit)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-700">{benefit}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 10. APPLICATION DETAILS */}
      <div className="space-y-5">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2">
          APPLICATION DETAILS
        </h2>

        <div className="space-y-1.5 max-w-xs" data-error={!!errors.deadline}>
          <label htmlFor="deadline" className="text-[13px] font-bold text-slate-700">Application Deadline *</label>
          <input 
            id="deadline"
            type="date"
            value={formState.deadline}
            onChange={(e) => setFormState(prev => ({ ...prev, deadline: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
          />
          {errors.deadline && <p className="text-xs text-red-500 font-semibold">{errors.deadline}</p>}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate('/recruiter/jobs')}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          Save Draft
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer min-h-[44px]"
        >
          <span>Next: Select Plan</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </form>
  );
}
