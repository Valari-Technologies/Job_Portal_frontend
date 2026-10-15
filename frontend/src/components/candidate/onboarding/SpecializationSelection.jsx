import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { 
  Code, 
  BarChart, 
  Shield, 
  Cloud, 
  Layers, 
  Headphones, 
  Plus, 
  Check, 
  AlertCircle, 
  RotateCcw,
  Briefcase,
  HeartPulse,
  FlaskConical,
  Building2,
  Activity,
  Landmark,
  Calculator,
  TrendingUp,
  FileCheck,
  Palette,
  Film,
  PenTool,
  GraduationCap,
  BookOpen,
  ShoppingBag,
  Wrench,
  Utensils,
  Coffee,
  X
} from 'lucide-react';

export default function SpecializationSelection() {
  const {
    industryPayload,
    selectedSpecializations,
    specializations,
    toggleCatalogSpecialization,
    removeSpecialization,
    isLoadingSpecializations,
    specializationError,
    error,
    validationError,
    setShowCustomRoleModal,
    refetchData
  } = useCandidateOnboarding();

  // Dynamic Icon Resolver for Specializations
  const getSpecializationIcon = (iconName) => {
    switch (iconName) {
      case 'Code': return <Code className="h-5 w-5" />;
      case 'BarChart': return <BarChart className="h-5 w-5" />;
      case 'Shield': return <Shield className="h-5 w-5" />;
      case 'Cloud': return <Cloud className="h-5 w-5" />;
      case 'Layers': return <Layers className="h-5 w-5" />;
      case 'Headphones': return <Headphones className="h-5 w-5" />;
      case 'HeartPulse': return <HeartPulse className="h-5 w-5" />;
      case 'FlaskConical': return <FlaskConical className="h-5 w-5" />;
      case 'Building2': return <Building2 className="h-5 w-5" />;
      case 'Activity': return <Activity className="h-5 w-5" />;
      case 'Landmark': return <Landmark className="h-5 w-5" />;
      case 'Calculator': return <Calculator className="h-5 w-5" />;
      case 'TrendingUp': return <TrendingUp className="h-5 w-5" />;
      case 'FileCheck': return <FileCheck className="h-5 w-5" />;
      case 'Palette': return <Palette className="h-5 w-5" />;
      case 'Film': return <Film className="h-5 w-5" />;
      case 'PenTool': return <PenTool className="h-5 w-5" />;
      case 'GraduationCap': return <GraduationCap className="h-5 w-5" />;
      case 'BookOpen': return <BookOpen className="h-5 w-5" />;
      case 'Storefront': return <ShoppingBag className="h-5 w-5" />;
      case 'Briefcase': return <Briefcase className="h-5 w-5" />;
      case 'Wrench': return <Wrench className="h-5 w-5" />;
      case 'Utensils': return <Utensils className="h-5 w-5" />;
      case 'Coffee': return <Coffee className="h-5 w-5" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  const handleCardKeyDown = (e, specId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCatalogSpecialization(specId);
    }
  };

  const industryTitle = industryPayload?.title || 'Selected Industry';
  const customSpecs = selectedSpecializations.filter(s => s.source === 'custom');

  const isActuallyLoading = isLoadingSpecializations || (industryPayload?.source === 'catalog' && specializations.length === 0 && !specializationError && !error);

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      {/* Title Header with Selected Industry Chip */}
      <div className="space-y-3 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0E7FF] text-[#3B00FF] text-xs font-black">
            <span className="opacity-70">Industry:</span>
            <span>{industryTitle}</span>
          </div>

          {selectedSpecializations.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3B00FF] text-white text-xs font-extrabold shadow-xs">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>{selectedSpecializations.length} selected</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Choose your specializations
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-3xl">
          Select one or more specializations that match your career direction. You can pick multiple.
        </p>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2.5 shadow-2xs animate-slideDown">
          <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Specialization Cards Grid */}
      {isActuallyLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (specializationError || error) ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load specializations</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{specializationError || error}</p>
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
          role="group"
          aria-label="Select your specializations"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {specializations.length === 0 && customSpecs.length === 0 && (
            <div className="col-span-full py-8 px-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
              <p className="text-sm font-extrabold text-slate-800">
                No subcategories created under "{industryTitle}" yet.
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                You can add your desired specialization role using the button below.
              </p>
            </div>
          )}

          {/* Catalog Specializations from Backend */}
          {specializations.map((spec) => {
            const isSelected = selectedSpecializations.some(s => String(s.id) === String(spec.id));
            return (
              <div
                key={spec.id}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => toggleCatalogSpecialization(spec.id)}
                onKeyDown={(e) => handleCardKeyDown(e, spec.id)}
                className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none min-h-[160px] focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/20 ${
                  isSelected
                    ? 'bg-white border-2 border-[#3B00FF] shadow-md shadow-[#3B00FF]/10 ring-2 ring-[#3B00FF]/10'
                    : 'bg-white border border-slate-200 hover:border-[#3B00FF]/50 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Top Row: Icon container on left, Checkmark badge on right if selected */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#3B00FF] text-white' : 'bg-[#E0E7FF] text-[#3B00FF]'
                  }`}>
                    {getSpecializationIcon(spec.icon)}
                  </div>

                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'border-[#3B00FF] bg-[#3B00FF] text-white shadow-2xs' 
                      : 'border-slate-300 bg-white text-transparent'
                  }`}>
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1">
                  <h3 className={`text-sm font-extrabold leading-snug line-clamp-2 ${
                    isSelected ? 'text-[#3B00FF]' : 'text-slate-900'
                  }`}>
                    {spec.name}
                  </h3>
                  {spec.description && (
                    <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">
                      {spec.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Selected Custom Specializations */}
          {customSpecs.map((cs) => (
            <div
              key={cs.title}
              role="checkbox"
              aria-checked={true}
              tabIndex={0}
              className="relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none min-h-[160px] bg-white border-2 border-[#3B00FF] shadow-md shadow-[#3B00FF]/10 ring-2 ring-[#3B00FF]/10 focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/20"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#3B00FF] text-white flex items-center justify-center">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <button
                  type="button"
                  title="Remove custom specialization"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSpecialization(cs.title);
                  }}
                  className="h-6 w-6 rounded-full border-2 border-[#3B00FF] bg-[#3B00FF] text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 stroke-[3]" />
                </button>
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-extrabold uppercase text-[#3B00FF] tracking-wider">
                  Custom Specialization
                </span>
                <h3 className="text-sm font-extrabold text-[#3B00FF] line-clamp-2">
                  {cs.title}
                </h3>
              </div>
            </div>
          ))}

          {/* Add Custom Role Card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowCustomRoleModal(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowCustomRoleModal(true);
              }
            }}
            className="rounded-2xl border-2 border-dashed border-[#3B00FF]/60 bg-white p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center select-none min-h-[160px] hover:border-[#3B00FF] hover:bg-indigo-50/20 focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/20"
          >
            <div className="h-10 w-10 rounded-xl bg-[#E0E7FF] text-[#3B00FF] flex items-center justify-center mb-3">
              <Plus className="h-5 w-5 stroke-[3]" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Add Custom Role
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              Can't find your specialty? Add it here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
