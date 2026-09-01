import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRecruiterStepper from '../../components/admin/createRecruiter/CreateRecruiterStepper';
import RecruiterInformationStep from '../../components/admin/createRecruiter/RecruiterInformationStep';
import CompanyInformationStep from '../../components/admin/createRecruiter/CompanyInformationStep';
import ReviewRecruiterStep from '../../components/admin/createRecruiter/ReviewRecruiterStep';

export default function AdminCreateRecruiter() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Unified single page wizard state
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phoneCountryCode: '+91',
    phone: '',
    profilePhoto: null,
    companyName: '',
    industry: '',
    companyType: '',
    location: '',
    companyEmail: '',
    companyPhoneCountryCode: '+91',
    companyPhone: ''
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
    if (!formState.phone || !formState.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    setTouched({
      fullName: true,
      email: true,
      phone: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const requiredFields = ['companyName', 'industry', 'companyType', 'location', 'companyEmail', 'companyPhone'];
    
    requiredFields.forEach(f => {
      if (!formState[f] || !formState[f].trim()) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Future Django integration:
    // Submit to the actual Admin-created Employer endpoint.
    // The backend must create an EMPLOYER account and associate it
    // with the authenticated Admin.
    // The backend—not the frontend—must set role, owner/created_by,
    // activation status, and invitation state.

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage("Backend integration not yet available. Database submission is bypassed currently.");
    }, 1200);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Create Recruiter</h1>
      </div>

      {/* Stepper Status tracker */}
      <CreateRecruiterStepper currentStep={step} />

      {/* Main Wizard Form Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          
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
                  type="submit" 
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
