import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getActiveIndustries, 
  getSpecializationsByIndustry, 
  getCandidateOnboardingSelection, 
  loadStoredOnboarding,
  saveCandidateIndustry, 
  saveCandidateSpecializations 
} from '../services/candidate/candidateOnboardingService';

const CandidateOnboardingContext = createContext(null);

export function CandidateOnboardingProvider({ children, initialStep = 1 }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current step dynamically from the active URL
  const currentStep = location.pathname.includes('specialization') 
    ? 2 
    : (location.pathname.includes('industry') ? 1 : initialStep);
  
  // Structured industry payload: synchronously initialized from storage to eliminate any blank frame
  const [industryPayload, setIndustryPayload] = useState(() => {
    try {
      const stored = loadStoredOnboarding();
      return stored?.industry || null;
    } catch {
      return null;
    }
  });

  // Structured multi-select specializations: synchronously initialized
  const [selectedSpecializations, setSelectedSpecializations] = useState(() => {
    try {
      const stored = loadStoredOnboarding();
      return stored?.specializations || (stored?.specialization ? [stored.specialization] : []);
    } catch {
      return [];
    }
  });

  const [industries, setIndustries] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Separate error states so Step 2 specialization errors never break Step 1 industry view
  const [industryError, setIndustryError] = useState(null);
  const [specializationError, setSpecializationError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [showExitModal, setShowExitModal] = useState(false);
  const [showCustomIndustryModal, setShowCustomIndustryModal] = useState(false);
  const [showCustomRoleModal, setShowCustomRoleModal] = useState(false);

  // Initial load of active industries catalog from backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingIndustries(true);
      setIndustryError(null);
      try {
        const [indsList, stored] = await Promise.all([
          getActiveIndustries(),
          getCandidateOnboardingSelection()
        ]);

        if (!isMounted) return;

        setIndustries(indsList || []);

        // Normalize stored industry and verify it exists in live indsList
        let loadedInd = null;
        if (stored?.industry && typeof stored.industry === 'object') {
          if (stored.industry.source === 'catalog') {
            const foundCat = (indsList || []).find(i => String(i.id) === String(stored.industry.id));
            if (foundCat) {
              loadedInd = {
                source: 'catalog',
                id: foundCat.id,
                title: foundCat.name
              };
            }
          } else {
            loadedInd = stored.industry;
          }
        } else if (stored?.industryId) {
          const foundCat = (indsList || []).find(i => String(i.id) === String(stored.industryId));
          if (foundCat) {
            loadedInd = {
              source: 'catalog',
              id: foundCat.id,
              title: foundCat.name
            };
          }
        }

        // Normalize stored specializations (array)
        let loadedSpecs = [];
        if (Array.isArray(stored?.specializations) && stored.specializations.length > 0) {
          loadedSpecs = stored.specializations.filter(s => s.source !== 'catalog' || !String(s.id).startsWith('spec_'));
        } else if (stored?.specialization && typeof stored.specialization === 'object') {
          if (stored.specialization.source !== 'catalog' || !String(stored.specialization.id).startsWith('spec_')) {
            loadedSpecs = [stored.specialization];
          }
        }

        if (loadedInd) {
          setIndustryPayload(loadedInd);
        }
        if (loadedSpecs.length > 0) {
          setSelectedSpecializations(loadedSpecs);
        }
      } catch (err) {
        console.error('Failed to load candidate onboarding data:', err);
        if (isMounted) {
          setIndustryError("We couldn't load your options. Please try again.");
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
  }, []);

  // Direct access rule: If step 2 is opened without valid industry selection, redirect to step 1
  useEffect(() => {
    if (currentStep === 2 && (!industryPayload || (!industryPayload.id && !industryPayload.title))) {
      navigate('/candidate/onboarding/industry', { replace: true });
    }
  }, [currentStep, industryPayload, navigate]);

  // Fetch / prefetch specializations when catalog industry is selected
  useEffect(() => {
    let isMounted = true;

    async function fetchSpecs() {
      if (!industryPayload || industryPayload.source !== 'catalog' || !industryPayload.id) {
        setSpecializations([]);
        setSpecializationError(null);
        return;
      }

      // If id is not numeric (legacy mock), skip
      if (isNaN(Number(industryPayload.id)) || String(industryPayload.id).startsWith('ind_')) {
        setSpecializations([]);
        setSpecializationError(null);
        return;
      }

      setIsLoadingSpecializations(true);
      setSpecializationError(null);
      try {
        const specList = await getSpecializationsByIndustry(industryPayload.id);
        if (isMounted) {
          setSpecializations(specList || []);
        }
      } catch (err) {
        console.error('Failed to fetch specializations:', err);
        if (isMounted) {
          setSpecializationError("We couldn't load specializations for this field.");
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
  }, [industryPayload?.id]);

  // Select a standard catalogue Industry (Single Select)
  const selectCatalogIndustry = (industryId) => {
    setValidationError(null);
    setIndustryError(null);
    const indObj = industries.find(i => String(i.id) === String(industryId));
    if (!indObj) return;

    const newPayload = {
      source: 'catalog',
      id: indObj.id,
      title: indObj.name
    };

    setIndustryPayload(newPayload);
    // Clear specializations if industry changed
    if (!industryPayload || String(industryPayload.id) !== String(industryId)) {
      setSelectedSpecializations([]);
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
    setSelectedSpecializations([]);
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

  // Toggle a standard catalogue Specialization (Multi-Select)
  const toggleCatalogSpecialization = (specId) => {
    setValidationError(null);
    const isAlreadySelected = selectedSpecializations.some(s => String(s.id) === String(specId));

    let updatedList = [];
    if (isAlreadySelected) {
      updatedList = selectedSpecializations.filter(s => String(s.id) !== String(specId));
    } else {
      const specObj = specializations.find(s => String(s.id) === String(specId));
      const title = specObj ? specObj.name : String(specId);
      const newItem = {
        source: 'catalog',
        id: specId,
        title
      };
      updatedList = [...selectedSpecializations, newItem];
    }

    setSelectedSpecializations(updatedList);
    saveCandidateSpecializations(updatedList);
  };

  // Add a custom Specialization role (Multi-Select friendly)
  const selectCustomSpecialization = (customTitle) => {
    setValidationError(null);
    const trimmedTitle = customTitle.trim();
    if (!trimmedTitle) return;

    const isAlreadySelected = selectedSpecializations.some(
      s => s.source === 'custom' && s.title.toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (isAlreadySelected) return;

    const newItem = {
      source: 'custom',
      id: null,
      title: trimmedTitle
    };

    const updatedList = [...selectedSpecializations, newItem];
    setSelectedSpecializations(updatedList);
    saveCandidateSpecializations(updatedList);
  };

  // Remove a specialization by id or custom title
  const removeSpecialization = (specIdentifier) => {
    setValidationError(null);
    const updatedList = selectedSpecializations.filter(s => {
      if (s.source === 'catalog') {
        return String(s.id) !== String(specIdentifier);
      }
      return s.title !== specIdentifier;
    });
    setSelectedSpecializations(updatedList);
    saveCandidateSpecializations(updatedList);
  };

  // Shared completion function for Step 2
  const completeSpecializationStep = async (targetPayload = null) => {
    setValidationError(null);
    const payloadToSave = targetPayload || selectedSpecializations;

    if (!payloadToSave || payloadToSave.length === 0) {
      setValidationError('Please select at least one specialization to continue.');
      return;
    }

    setIsSaving(true);
    try {
      await saveCandidateSpecializations(payloadToSave);
      setSelectedSpecializations(payloadToSave);
      setIsSaving(false);
      navigate('/candidate/dashboard', { replace: true });
    } catch (err) {
      console.error('Failed to complete specialization step:', err);
      setIsSaving(false);
      setValidationError("We couldn't save your specializations. Please try again.");
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
    return completeSpecializationStep(selectedSpecializations);
  };

  const selectedIndustryObj = industryPayload?.source === 'catalog' 
    ? industries.find(ind => String(ind.id) === String(industryPayload.id)) 
    : null;

  const value = {
    currentStep,
    industryPayload,
    selectedSpecializations,
    specializationPayload: selectedSpecializations[0] || null, // Backward compatibility
    selectedIndustryId: industryPayload?.id || null,
    selectedSpecializationId: selectedSpecializations[0]?.id || null,
    selectedIndustry: selectedIndustryObj,
    industries,
    specializations,
    isLoadingIndustries,
    isLoadingSpecializations,
    isSaving,
    error: industryError,
    industryError,
    specializationError,
    validationError,
    showExitModal,
    setShowExitModal,
    showCustomIndustryModal,
    setShowCustomIndustryModal,
    showCustomRoleModal,
    setShowCustomRoleModal,
    selectCatalogIndustry,
    selectCustomIndustry,
    toggleCatalogSpecialization,
    selectCatalogSpecialization: toggleCatalogSpecialization, // Alias
    selectCustomSpecialization,
    selectCustomSpecializationAndContinue: (title) => {
      selectCustomSpecialization(title);
    },
    removeSpecialization,
    completeSpecializationStep,
    proceedToNextStep,
    proceedToPreviousStep,
    completeOnboarding,
    refetchData: async () => {
      if (currentStep === 2 && industryPayload?.id) {
        setIsLoadingSpecializations(true);
        setSpecializationError(null);
        try {
          const specList = await getSpecializationsByIndustry(industryPayload.id);
          setSpecializations(specList || []);
        } catch {
          setSpecializationError("We couldn't load specializations for this field.");
        } finally {
          setIsLoadingSpecializations(false);
        }
      } else {
        setIsLoadingIndustries(true);
        setIndustryError(null);
        try {
          const indsList = await getActiveIndustries();
          setIndustries(indsList || []);
        } catch {
          setIndustryError("We couldn't load your options. Please try again.");
        } finally {
          setIsLoadingIndustries(false);
        }
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
