import { Outlet } from 'react-router-dom';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import AddCustomIndustryModal from './AddCustomIndustryModal';
import AddCustomRoleModal from './AddCustomRoleModal';
import { ArrowRight } from 'lucide-react';

export default function CandidateOnboardingLayout({ children }) {
  const { 
    currentStep, 
    showCustomIndustryModal,
    setShowCustomIndustryModal,
    showCustomRoleModal,
    setShowCustomRoleModal,
    industryPayload,
    selectedSpecializations,
    specializationPayload,
    selectCustomIndustry,
    selectCustomSpecialization,
    proceedToNextStep,
    proceedToPreviousStep,
    completeOnboarding,
    isSaving
  } = useCandidateOnboarding();

  // Primary action button handler in bottom footer
  const handlePrimaryContinue = () => {
    if (currentStep === 1) {
      proceedToNextStep();
    } else {
      completeOnboarding();
    }
  };

  const isIndustrySelected = Boolean(industryPayload && (industryPayload.id || industryPayload.title));
  const isSpecializationSelected = Boolean(
    (Array.isArray(selectedSpecializations) && selectedSpecializations.length > 0) ||
    Boolean(specializationPayload && (specializationPayload.id || specializationPayload.title))
  );

  const isPrimaryDisabled = currentStep === 1 
    ? (!isIndustrySelected || isSaving)
    : (!isSpecializationSelected || isSaving);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans text-slate-800 antialiased flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Header Bar (Electric Blue / Purple #3B00FF) */}
      <header className="w-full bg-[#3B00FF] text-white shadow-xs">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/90 tracking-wider uppercase">
              STEP {currentStep}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Page Content Container */}
      <main className="flex-1 flex flex-col justify-start px-4 sm:px-8 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-6xl">
          {children || <Outlet />}
        </div>
      </main>

      {/* 3. Bottom Navigation Footer Bar */}
      <footer className="sticky bottom-0 z-30 w-full bg-white border-t border-slate-200 shadow-md py-4 px-6 sm:px-12">
        <div className={`mx-auto max-w-6xl flex items-center ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
          
          {/* Step 2 Back Action — Omitted completely on Step 1 */}
          {currentStep === 2 && (
            <button
              type="button"
              onClick={proceedToPreviousStep}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/30 rounded-lg px-3 py-2"
            >
              Back
            </button>
          )}

          {/* Continue Action */}
          <button
            type="button"
            onClick={handlePrimaryContinue}
            disabled={isPrimaryDisabled}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md min-h-[44px] ${
              !isPrimaryDisabled
                ? 'bg-[#3B00FF] hover:bg-[#3000E0] text-white cursor-pointer active:scale-98 shadow-[#3B00FF]/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>
              {isSaving ? 'Processing...' : (
                currentStep === 2 && selectedSpecializations?.length > 1
                  ? `Continue (${selectedSpecializations.length} selected)`
                  : 'Continue'
              )}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AddCustomIndustryModal
        isOpen={showCustomIndustryModal}
        onClose={() => setShowCustomIndustryModal(false)}
        onSubmitCustomIndustry={(title) => {
          selectCustomIndustry(title);
        }}
      />

      <AddCustomRoleModal
        isOpen={showCustomRoleModal}
        onClose={() => setShowCustomRoleModal(false)}
        onSubmitCustomRole={(title) => {
          selectCustomSpecialization(title);
        }}
      />
    </div>
  );
}

