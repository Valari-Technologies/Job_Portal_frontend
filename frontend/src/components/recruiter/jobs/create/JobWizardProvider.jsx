import { useState } from 'react';
import { JobWizardContext } from './JobWizardContext';

export function JobWizardProvider({ children }) {
  const [jobDetails, setJobDetails] = useState({
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
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <JobWizardContext.Provider 
      value={{
        jobDetails,
        setJobDetails,
        selectedPlan,
        setSelectedPlan,
        paymentMethod,
        setPaymentMethod
      }}
    >
      {children}
    </JobWizardContext.Provider>
  );
}
