import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRecruiterStepper from '../../components/admin/createRecruiter/CreateRecruiterStepper';
import RecruiterInformationStep from '../../components/admin/createRecruiter/RecruiterInformationStep';
import CompanyInformationStep from '../../components/admin/createRecruiter/CompanyInformationStep';
import ReviewRecruiterStep from '../../components/admin/createRecruiter/ReviewRecruiterStep';
import { createEmployerService } from '../../services/superAdmin/superAdminService';

export default function AdminCreateRecruiter() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Unified single page wizard state
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneCountryCode: '+91',
    phone: '',
    profilePhoto: null,
    companyName: '',
    industry: '',
    companyType: '',
    stateId: '',
    districtId: '',
    cityId: '',
    localityId: '',
    location: '',
    location_id: null,
    companyEmail: '',
    companyPhoneCountryCode: '+91',
    companyPhone: '',
    website: '',
    linkedinUrl: ''
  });

  // Validation feedback lists tracking
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleCancel = () => {
    navigate('/admin/recruiters');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formState.fullName || !formState.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }
    if (!formState.email || !formState.email.trim()) {
      newErrors.email = "Email Address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.email.trim())) {
        newErrors.email = "Invalid email format.";
      }
    }
    if (!formState.password || !formState.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formState.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    if (!formState.confirmPassword || !formState.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formState.phone || !formState.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const requiredFields = ['companyName', 'industry', 'companyType', 'location', 'companyEmail', 'companyPhone'];
    
    requiredFields.forEach(f => {
      if (!formState[f] || (typeof formState[f] === 'string' && !formState[f].trim())) {
        newErrors[f] = `${f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required.`;
      }
    });

    if (formState.companyEmail && formState.companyEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.companyEmail.trim())) {
        newErrors.companyEmail = "Invalid email format.";
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    
    const touchedObj = {};
    requiredFields.forEach(f => { touchedObj[f] = true; });
    setTouched(prev => ({ ...prev, ...touchedObj }));

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleStepClick = (targetStep) => {
    if (targetStep === 1) {
      setStep(1);
    } else if (targetStep === 2) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (targetStep === 3) {
      if (validateStep1() && validateStep2()) {
        setStep(3);
      }
    }
  };

  const fileToDataUrl = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      if (typeof file === 'string') return resolve(file);
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleCreateRecruiter = async (e) => {
    if (e) e.preventDefault();
    if (step !== 3) return;
    if (isSubmitting) return;
    setSubmitMessage(null);
    setIsSubmitting(true);

    try {
      const photoDataUrl = formState.profilePhoto ? await fileToDataUrl(formState.profilePhoto) : null;
      const payload = {
        fullName: formState.fullName.trim(),
        email: formState.email.trim(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
        phone_number: `${formState.phoneCountryCode}${formState.phone}`.trim(),
        company_name: formState.companyName.trim(),
        industry: formState.industry.trim(),
        company_type: formState.companyType.trim(),
        locality: formState.location.trim(),
        location_id: formState.location_id || null,
        company_email: formState.companyEmail.trim(),
        company_phone: `${formState.companyPhoneCountryCode}${formState.companyPhone}`.trim(),
        website: formState.website.trim() || null,
        linkedin_url: formState.linkedinUrl.trim() || null,
        designation: 'HR Manager',
        status: 'ACTIVE',
        profile_photo: photoDataUrl,
        company_logo: photoDataUrl
      };

      const res = await createEmployerService(payload);
      if (res.success) {
        navigate('/admin/recruiters');
      } else {
        setSubmitMessage(res.message || "Failed to create Recruiter account.");
      }
    } catch {
      setSubmitMessage("An unexpected network error occurred while creating recruiter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Create Recruiter</h1>
      </div>

      {/* Stepper Status tracker */}
      <CreateRecruiterStepper currentStep={step} onStepClick={handleStepClick} />

      {/* Main Wizard Form Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 3) {
              handleCreateRecruiter(e);
            } else {
              handleNext();
            }
          }} 
          className="space-y-8"
        >
          
          <h2 className="text-[17px] font-semibold text-slate-905 border-b border-slate-100 pb-3">
            {step === 1 && "Recruiter Information"}
            {step === 2 && "Company Information"}
            {step === 3 && "Review Information"}
          </h2>

          {step === 3 && (
            <p className="text-[13px] font-normal text-slate-500 -mt-5">
              Please review the details before creating the recruiter.
            </p>
          )}

          {/* Form Step rendering layouts */}
          <div>
            {step === 1 && (
              <RecruiterInformationStep 
                formState={formState}
                setFormState={setFormState}
                errors={errors}
                setErrors={setErrors}
                touched={touched}
                setTouched={setTouched}
              />
            )}
            {step === 2 && (
              <CompanyInformationStep 
                formState={formState}
                setFormState={setFormState}
                errors={errors}
                setErrors={setErrors}
                touched={touched}
                setTouched={setTouched}
              />
            )}
            {step === 3 && (
              <ReviewRecruiterStep 
                formState={formState}
              />
            )}
          </div>

          {/* Backend Submit Alert message */}
          {submitMessage && (
            <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-150 text-[13px] font-medium text-[#4A1DDF]">
              {submitMessage}
            </div>
          )}

          {/* Bottom Action buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <div>
              {step === 1 && (
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-200 px-5.5 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
              )}
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="rounded-lg border border-slate-200 px-5.5 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
                >
                  Back
                </button>
              )}
            </div>

            <div>
              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] px-6.5 py-2.5 text-[14px] font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleCreateRecruiter}
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] disabled:bg-indigo-400 disabled:cursor-not-allowed px-6.5 py-2.5 text-[14px] font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                >
                  {isSubmitting ? "Creating..." : "Create Recruiter"}
                </button>
              )}
            </div>
          </div>

        </form>
      </div>

    </div>
  );
}
