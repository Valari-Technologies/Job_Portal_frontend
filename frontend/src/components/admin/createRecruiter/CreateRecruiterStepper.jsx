import { Check } from 'lucide-react';

export default function CreateRecruiterStepper({ currentStep }) {
  const steps = [
    { id: 1, label: 'Recruiter Information' },
    { id: 2, label: 'Company Information' },
    { id: 3, label: 'Review & Create' }
  ];

  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto px-4 py-6 font-sans">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-initial">
            <div className="flex items-center gap-3">
              {/* Stepper Circle */}
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors duration-150 shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                    ? 'bg-[#4A1DDF] text-white shadow-md shadow-[#4A1DDF]/10' 
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : step.id}
              </div>

              {/* Step Label */}
              <span 
                className={`text-[13px] whitespace-nowrap hidden sm:inline ${
                  isCurrent 
                    ? 'font-bold text-[#4A1DDF]' 
                    : 'font-medium text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Stepper Line Connectors */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 min-w-[30px] sm:min-w-[60px] bg-slate-100 relative">
                <div 
                  className="absolute inset-y-0 left-0 bg-[#4A1DDF] transition-all duration-300"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
