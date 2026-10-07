import { useState } from 'react';
import { JobWizardContext } from './JobWizardContext';

const STORAGE_WIZARD_DETAILS_KEY = 'tnjobz_wizard_job_details';
const STORAGE_WIZARD_PLAN_KEY = 'tnjobz_wizard_selected_plan';

export function JobWizardProvider({ children }) {
  const [jobDetails, setJobDetailsState] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_WIZARD_DETAILS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      title: '',
      industry: '',
      department: '',
      category: '',
      workMode: '',
      state: '',
      district: '',
      city: '',
      locality: '',
      employmentType: '',
      minExperience: '',
      maxExperience: '',
      numberOfOpenings: '1',
      applicationType: 'Profile/Resume Application',
      minSalary: '',
      maxSalary: '',
      salaryType: 'PER_MONTH',
      currency: 'INR',
      hideSalary: false,
      description: '',
      responsibilities: [''],
      skills: [],
      education: '',
      degree: '',
      benefits: [],
      deadline: ''
    };
  });

  const setJobDetails = (details) => {
    const nextVal = typeof details === 'function' ? details(jobDetails) : details;
    setJobDetailsState(nextVal);
    try {
      sessionStorage.setItem(STORAGE_WIZARD_DETAILS_KEY, JSON.stringify(nextVal));
    } catch {}
  };

  const [selectedPlan, setSelectedPlanState] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_WIZARD_PLAN_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const setSelectedPlan = (plan) => {
    setSelectedPlanState(plan);
    try {
      sessionStorage.setItem(STORAGE_WIZARD_PLAN_KEY, JSON.stringify(plan));
    } catch {}
  };

  const [paymentMethod, setPaymentMethod] = useState('card');

  const clearWizard = () => {
    try {
      sessionStorage.removeItem(STORAGE_WIZARD_DETAILS_KEY);
      sessionStorage.removeItem(STORAGE_WIZARD_PLAN_KEY);
    } catch {}
  };

  return (
    <JobWizardContext.Provider 
      value={{
        jobDetails,
        setJobDetails,
        selectedPlan,
        setSelectedPlan,
        paymentMethod,
        setPaymentMethod,
        clearWizard
      }}
    >
      {children}
    </JobWizardContext.Provider>
  );
}
