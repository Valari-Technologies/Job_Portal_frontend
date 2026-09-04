import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getActiveIndustries, 
  getSpecializationsByIndustry, 
  getCandidateOnboardingSelection, 
  saveCandidateIndustry, 
  saveCandidateSpecialization 
} from '../services/candidate/candidateOnboardingService';

const CandidateOnboardingContext = createContext(null);

export function CandidateOnboardingProvider({ children, initialStep = 1 }) {
  const navigate = useNavigate();

  const currentStep = initialStep;
  
  // Structured payloads: { source: "catalog" | "custom", id: string | null, title: string }
  const [industryPayload, setIndustryPayload] = useState(null);
  const [specializationPayload, setSpecializationPayload] = useState(null);

  const [industries, setIndustries] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [showExitModal, setShowExitModal] = useState(false);
  const [showCustomIndustryModal, setShowCustomIndustryModal] = useState(false);
  const [showCustomRoleModal, setShowCustomRoleModal] = useState(false);

  // Initial load of stored selection & active industries catalog
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingIndustries(true);
      setError(null);
      try {
        const [indsList, stored] = await Promise.all([
          getActiveIndustries(),
          getCandidateOnboardingSelection()
        ]);

        if (!isMounted) return;

        setIndustries(indsList);

        // Normalize stored selection
        let loadedInd = null;
        if (stored?.industry && typeof stored.industry === 'object') {
          loadedInd = stored.industry;
        } else if (stored?.industryId) {
          const cat = indsList.find(i => i.id === stored.industryId);
          loadedInd = {
            source: 'catalog',
            id: stored.industryId,
            title: cat ? cat.name : stored.industryId
          };
        }

        let loadedSpec = null;
        if (stored?.specialization && typeof stored.specialization === 'object') {
          loadedSpec = stored.specialization;
        } else if (stored?.specializationId) {
          loadedSpec = {
            source: 'catalog',
            id: stored.specializationId,
            title: stored.specializationId
          };
        }

        setIndustryPayload(loadedInd);
        setSpecializationPayload(loadedSpec);

        // Direct access rule: If step 2 is opened without valid industry selection, redirect to step 1
        if (initialStep === 2 && (!loadedInd || (!loadedInd.id && !loadedInd.title))) {
          navigate('/candidate/onboarding/industry', { replace: true });
        }
      } catch (err) {
        console.error('Failed to load candidate onboarding data:', err);
        if (isMounted) {
          setError("We couldn't load your options. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingIndustries(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [initialStep, navigate]);

  // Fetch specializations when catalog industry is selected
  useEffect(() => {
    let isMounted = true;

    async function fetchSpecs() {
      if (!industryPayload || industryPayload.source !== 'catalog' || !industryPayload.id) {
        setSpecializations([]);
        return;
      }

      setIsLoadingSpecializations(true);
      try {
        const specList = await getSpecializationsByIndustry(industryPayload.id);
        if (isMounted) {
          setSpecializations(specList);
        }
      } catch (err) {
        console.error('Failed to fetch specializations:', err);
        if (isMounted) {
          setError("We couldn't load specializations for this field.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingSpecializations(false);
        }
      }
    }

    fetchSpecs();

    return () => {
      isMounted = false;
    };
  }, [industryPayload]);

  // Select a standard catalogue Industry
  const selectCatalogIndustry = (industryId) => {
    setValidationError(null);
    const indObj = industries.find(i => i.id === industryId);
    if (!indObj) return;

    const newPayload = {
      source: 'catalog',
      id: indObj.id,
      title: indObj.name
    };

    setIndustryPayload(newPayload);
    // Clear specialization if industry changed
    if (!specializationPayload || specializationPayload.id !== industryId) {
      setSpecializationPayload(null);
    }
    saveCandidateIndustry(newPayload);
  };

  // Select a custom Industry & directly navigate to Step 2
  const selectCustomIndustry = async (customTitle) => {
    setValidationError(null);
    const trimmedTitle = customTitle.trim();
    const newPayload = {
      source: 'custom',
      id: null,
      title: trimmedTitle
    };

    setIndustryPayload(newPayload);
    setSpecializationPayload(null);
    setIsSaving(true);

    try {
      await saveCandidateIndustry(newPayload);
      setIsSaving(false);
      navigate('/candidate/onboarding/specialization');
    } catch (err) {
      console.error('Failed to save custom industry:', err);
      setIsSaving(false);
      setValidationError('Failed to save custom industry. Please try again.');
    }
  };

  // Select a standard catalogue Specialization
  const selectCatalogSpecialization = (specId) => {
    setValidationError(null);
    const specObj = specializations.find(s => s.id === specId);
    const title = specObj ? specObj.name : specId;

    const newPayload = {
      source: 'catalog',
      id: specId,
      title
    };

    setSpecializationPayload(newPayload);
    saveCandidateSpecialization(newPayload);
  };

  // Select a custom Specialization role & automatically complete step
  const selectCustomSpecializationAndContinue = async (customTitle) => {
    setValidationError(null);
    const trimmedTitle = customTitle.trim();
    const newPayload = {
      source: 'custom',
      id: null,
      title: trimmedTitle
    };

    return completeSpecializationStep(newPayload);
  };

  // Shared completion function for Step 2 (both standard & custom flow)
  const completeSpecializationStep = async (targetPayload = null) => {
    setValidationError(null);
    const payloadToSave = targetPayload || specializationPayload;

    if (!payloadToSave || (!payloadToSave.id && !payloadToSave.title)) {
      setValidationError('Please select a specialization to continue.');
      return;
    }

    setIsSaving(true);
    try {
      await saveCandidateSpecialization(payloadToSave);
      setSpecializationPayload(payloadToSave);
      setIsSaving(false);
      navigate('/candidate/dashboard', { replace: true });
    } catch (err) {
      console.error('Failed to complete specialization step:', err);
      setIsSaving(false);
      setValidationError("We couldn't save your specialization. Please try again.");
      throw err;
    }
  };

  // Step 1 -> Step 2 transition via Continue button
  const proceedToNextStep = async () => {
    setValidationError(null);
    if (!industryPayload || (!industryPayload.id && !industryPayload.title)) {
      setValidationError('Please select a field to continue.');
      return;
    }

    setIsSaving(true);
    try {
      await saveCandidateIndustry(industryPayload);
      setIsSaving(false);
      navigate('/candidate/onboarding/specialization');
    } catch (err) {
      console.error('Failed to save industry selection:', err);
      setValidationError('Failed to save selection. Please try again.');
      setIsSaving(false);
    }
  };

  // Step 2 -> Step 1 navigation via Back button
  const proceedToPreviousStep = () => {
    setValidationError(null);
    navigate('/candidate/onboarding/industry');
  };

  // Step 2 finish action
  const completeOnboarding = async () => {
    return completeSpecializationStep(specializationPayload);
  };

  const selectedIndustryObj = industryPayload?.source === 'catalog' 
    ? industries.find(ind => ind.id === industryPayload.id) 
    : null;

  const value = {
    currentStep,
    industryPayload,
    specializationPayload,
    selectedIndustryId: industryPayload?.id || null,
    selectedSpecializationId: specializationPayload?.id || null,
    selectedIndustry: selectedIndustryObj,
    industries,
    specializations,
    isLoadingIndustries,
    isLoadingSpecializations,
    isSaving,
    error,
    validationError,
    showExitModal,
    setShowExitModal,
    showCustomIndustryModal,
    setShowCustomIndustryModal,
    showCustomRoleModal,
    setShowCustomRoleModal,
    selectCatalogIndustry,
    selectCustomIndustry,
    selectCatalogSpecialization,
    selectCustomSpecialization: selectCustomSpecializationAndContinue,
    selectCustomSpecializationAndContinue,
    completeSpecializationStep,
    proceedToNextStep,
    proceedToPreviousStep,
    completeOnboarding,
    refetchData: async () => {
      if (industryPayload?.id) {
        setIsLoadingSpecializations(true);
        const specList = await getSpecializationsByIndustry(industryPayload.id);
        setSpecializations(specList);
        setIsLoadingSpecializations(false);
      }
    }
  };

  return (
    <CandidateOnboardingContext.Provider value={value}>
      {children}
    </CandidateOnboardingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCandidateOnboarding() {
  const ctx = useContext(CandidateOnboardingContext);
  if (!ctx) {
    throw new Error('useCandidateOnboarding must be used within a CandidateOnboardingProvider');
  }
  return ctx;
}

