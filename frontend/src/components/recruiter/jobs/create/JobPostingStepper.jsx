import { Check } from 'lucide-react';

export default function JobPostingStepper({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: 'Job Details' },
    { number: 2, label: 'Select Plan' },
    { number: 3, label: 'Review & Payment' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex items-center gap-2 sm:gap-3">
              <div 
                aria-current={isActive ? "step" : undefined}
                className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs transition-colors shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.number}
              </div>
              <span className={`text-xs font-extrabold hidden sm:inline ${
                isActive ? 'text-indigo-950 font-black' : isCompleted ? 'text-emerald-700' : 'text-slate-450'
              }`}>
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div className="h-0.5 w-6 sm:w-12 bg-slate-200 mx-1 sm:mx-2 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
