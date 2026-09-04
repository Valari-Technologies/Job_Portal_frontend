import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { 
  Laptop, 
  Shield, 
  Landmark, 
  Palette, 
  GraduationCap, 
  ShoppingBag, 
  Wrench, 
  Utensils, 
  Plus, 
  AlertCircle, 
  RotateCcw,
  Check
} from 'lucide-react';

export default function IndustrySelection() {
  const {
    industries,
    industryPayload,
    selectCatalogIndustry,
    isLoadingIndustries,
    error,
    validationError,
    setShowCustomIndustryModal,
    refetchData
  } = useCandidateOnboarding();

  // Dynamic Icon Resolver matching Figma reference design
  const getIndustryIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="h-6 w-6" />;
      case 'ShieldCross':
        return <Shield className="h-6 w-6" />;
      case 'Bank':
        return <Landmark className="h-6 w-6" />;
      case 'Palette':
        return <Palette className="h-6 w-6" />;
      case 'GraduationCap':
        return <GraduationCap className="h-6 w-6" />;
      case 'Storefront':
        return <ShoppingBag className="h-6 w-6" />;
      case 'RoboticArm':
        return <Wrench className="h-6 w-6" />;
      case 'Utensils':
        return <Utensils className="h-6 w-6" />;
      default:
        return <Laptop className="h-6 w-6" />;
    }
  };

  const handleCardKeyDown = (e, industryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectCatalogIndustry(industryId);
    }
  };

  const isCustomSelected = industryPayload?.source === 'custom';
  const customTitle = isCustomSelected ? industryPayload.title : '';

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      {/* Title Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          What field are you exploring?
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-3xl">
          Select your primary industry to help us tailor your job recommendations.
        </p>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2.5 shadow-2xs animate-slideDown">
          <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Industry Options Grid (2-col mobile, 4-col desktop) */}
      {isLoadingIndustries ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-40 sm:h-44 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load your options</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={refetchData}
            className="px-4 py-2.5 rounded-xl bg-white border border-red-200 text-xs font-extrabold text-red-700 hover:bg-red-50 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div 
          role="radiogroup"
          aria-label="Select your primary field or industry"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {industries.map((ind) => {
            const isSelected = industryPayload?.source === 'catalog' && industryPayload?.id === ind.id;
            return (
              <div
                key={ind.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => selectCatalogIndustry(ind.id)}
                onKeyDown={(e) => handleCardKeyDown(e, ind.id)}
                className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center select-none min-h-[140px] sm:min-h-[160px] focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/20 ${
                  isSelected
                    ? 'bg-white border-2 border-[#3B00FF] shadow-md shadow-[#3B00FF]/10 ring-2 ring-[#3B00FF]/10'
                    : 'bg-white border border-slate-200 hover:border-[#3B00FF]/50 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Round Icon Container */}
                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center transition-colors mb-3 sm:mb-4 ${
                  isSelected ? 'bg-[#3B00FF] text-white' : 'bg-[#E0E7FF] text-[#3B00FF]'
                }`}>
                  {getIndustryIcon(ind.icon)}
                </div>

                {/* Industry Label */}
                <h3 className={`text-xs sm:text-sm font-extrabold leading-snug ${
                  isSelected ? 'text-[#3B00FF]' : 'text-slate-900'
                }`}>
                  {ind.name}
                </h3>
              </div>
            );
          })}

          {/* 9th Card: Add Custom Industry or Selected Custom Industry Card */}
          {isCustomSelected ? (
            <div
              role="radio"
              aria-checked={true}
              tabIndex={0}
              onClick={() => setShowCustomIndustryModal(true)}
              className="relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center select-none min-h-[140px] sm:min-h-[160px] bg-white border-2 border-[#3B00FF] shadow-md shadow-[#3B00FF]/10 ring-2 ring-[#3B00FF]/10 focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/20"
            >
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#3B00FF] text-white flex items-center justify-center mb-3 sm:mb-4 shadow-xs">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-[#3B00FF] tracking-wider mb-0.5">
                Custom Industry
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#3B00FF] line-clamp-1">
                {customTitle}
              </h3>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowCustomIndustryModal(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowCustomIndustryModal(true);
                }
              }}
              className="rounded-2xl border-2 border-dashed border-[#3B00FF]/60 bg-white p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center select-none min-h-[140px] sm:min-h-[160px] hover:border-[#3B00FF] hover:bg-indigo-50/20 focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/20"
            >
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#E0E7FF] text-[#3B00FF] flex items-center justify-center mb-3 sm:mb-4">
                <Plus className="h-6 w-6 stroke-[3]" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                Add Custom Industry
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

