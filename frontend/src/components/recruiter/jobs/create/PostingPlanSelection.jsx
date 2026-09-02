import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { JobWizardContext } from './JobWizardContext.js';
import { getPostingPlans } from '../../../../services/recruiter/recruiterPricingService';

export default function PostingPlanSelection() {
  const navigate = useNavigate();
  const { selectedPlan, setSelectedPlan } = useContext(JobWizardContext);
  const [plans] = useState(() => getPostingPlans());

  const handleNext = () => {
    if (!selectedPlan) return;
    navigate('/recruiter/jobs/create/payment');
  };

  return (
    <div className="space-y-8 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-indigo-950 tracking-tight">Select Posting Plan</h2>
        <p className="text-xs md:text-sm font-bold text-slate-450 mt-1">
          Choose the visibility that matches your hiring urgency.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative pt-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all cursor-pointer border ${
                isSelected
                  ? 'border-2 border-indigo-600 bg-indigo-50/20 shadow-md ring-4 ring-indigo-100'
                  : 'border-slate-200 bg-white hover:border-indigo-300 shadow-xs'
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
                  Recommended
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-805">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${plan.is_free ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {plan.formatted_price}
                    </span>
                    {!plan.is_free && <span className="text-xs font-bold text-slate-450">/post</span>}
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Feature list */}
                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                      <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Select Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {isSelected ? `Selected (${plan.name})` : `Select ${plan.name}`}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate('/recruiter/jobs/create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!selectedPlan}
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 min-h-[44px] cursor-pointer"
        >
          <span>Next: Review & Payment</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
