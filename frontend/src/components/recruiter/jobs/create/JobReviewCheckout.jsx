import { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CreditCard, QrCode, Building2, Wallet, ArrowLeft, ShieldCheck, Check, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { JobWizardContext } from './JobWizardContext.js';
import { createJobDraftService } from '../../../../services/recruiter/recruiterJobsService';
import { checkRecruiterPlanStatus, deductJobCreditService, subscribePlanService } from '../../../../services/recruiter/recruiterCommerceService';

export default function JobReviewCheckout() {
  const navigate = useNavigate();
  const { jobDetails, selectedPlan, paymentMethod, setPaymentMethod, clearWizard } = useContext(JobWizardContext);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(null);

  const planStatus = useMemo(() => checkRecruiterPlanStatus(), []);

  // Determine if this is a credit-deducting flow from active plan OR a plan purchase flow
  const isUsingActiveCredits = planStatus.canPostJob && !selectedPlan;

  // Active or selected plan
  const plan = isUsingActiveCredits 
    ? { 
        name: planStatus.planName, 
        price: 0, 
        formatted_price: 'Included with plan', 
        duration_days: planStatus.daysRemaining, 
        is_free: true 
      }
    : (selectedPlan || { name: 'Basic', price: 0, formatted_price: 'Free', duration_days: 30, is_free: true });

  const subtotal = isUsingActiveCredits ? 0 : (plan.price || 0);
  const gst = plan.is_free ? 0 : Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + gst;

  const paymentMethods = [
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: QrCode },
    { id: 'netbanking', label: 'Net Banking', icon: Building2 },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  const handlePublishJob = async () => {
    setIsPublishing(true);
    try {
      // 1. If user chose a new plan from the wizard, activate that plan first
      if (!isUsingActiveCredits && selectedPlan) {
        await subscribePlanService({ planId: selectedPlan.id, paymentMethod });
      }

      // 2. Create the job record in database/storage
      const jobRes = await createJobDraftService(jobDetails);

      // 3. Deduct 1 credit from active balance and log transaction & notifications
      const creditRes = await deductJobCreditService({
        jobId: jobRes?.job?.id,
        jobTitle: jobDetails?.title || 'Job Position',
        listingDays: plan.duration_days || 30
      });

      if (creditRes?.success) {
        setRemainingCredits(creditRes.remainingCredits);
      }

      if (clearWizard) clearWizard();
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to publish job:', err);
      alert('Failed to publish job posting. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-indigo-950 tracking-tight">Review & Publish Job</h2>
        <p className="text-xs md:text-sm font-bold text-slate-450 mt-1">
          {isUsingActiveCredits 
            ? 'Review your position details and confirm to publish using 1 credit from your active plan.' 
            : 'Please review your job posting details and complete plan selection to publish.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job Details Summary Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{jobDetails.title || 'Untitled Job Position'}</h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {jobDetails.category || 'General'} • {jobDetails.workMode || 'On-site'} • {jobDetails.minExperience ? `${jobDetails.minExperience}-${jobDetails.maxExperience} Yrs` : 'Fresher/Experienced'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs/create')}
                className="text-xs font-extrabold text-indigo-600 hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Active Plan / Selected Plan Banner Card */}
          {isUsingActiveCredits ? (
            <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-indigo-50/60 rounded-2xl border border-emerald-200 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                      Active Plan Applied
                    </span>
                    <h4 className="text-sm font-black text-slate-900">
                      {planStatus.planName}
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-white/80 border border-emerald-200 px-3 py-1 rounded-xl">
                  {planStatus.availableCredits} Credits Available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-700 border-t border-emerald-100/80">
                <div>
                  <span className="text-slate-400 block text-[11px]">Cost for this job:</span>
                  <span className="font-extrabold text-slate-900">1 Credit</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Balance After Post:</span>
                  <span className="font-extrabold text-emerald-700">{Math.max(0, planStatus.availableCredits - 1)} Credits</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Plan Valid Until:</span>
                  <span className="font-extrabold text-slate-900">{planStatus.validUntil}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-200 p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Selected Posting Plan</span>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  {plan.name} ({plan.duration_days} Days)
                  {plan.is_free && <span className="text-xs text-emerald-600 font-extrabold">(Free)</span>}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs/create/plan')}
                className="text-xs font-extrabold text-indigo-600 hover:underline"
              >
                Change Plan
              </button>
            </div>
          )}

          {/* Payment Method Selector (Only shown if buying a paid plan) */}
          {!isUsingActiveCredits && !plan.is_free && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Payment Method</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Posting Summary</h3>

            {isUsingActiveCredits ? (
              <div className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Current Subscription</span>
                  <span className="font-bold text-slate-900">{planStatus.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Balance</span>
                  <span className="font-bold text-slate-900">{planStatus.availableCredits} Credits</span>
                </div>
                <div className="flex justify-between text-indigo-600 font-extrabold">
                  <span>Credit Deduction</span>
                  <span>-1 Credit</span>
                </div>

                <div className="h-px bg-slate-150 my-2" />

                <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                  <span>Remaining Balance</span>
                  <span className="text-base font-black text-emerald-600">{Math.max(0, planStatus.availableCredits - 1)} Credits</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  No payment needed. 1 credit will be deducted from your active subscription.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Selected Plan</span>
                  <span className="font-bold text-slate-900">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Job Posting Plan</span>
                  <span className="font-bold text-slate-900">{plan.formatted_price}</span>
                </div>
                {!plan.is_free && (
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-bold text-slate-900">₹ {gst.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-px bg-slate-150 my-2" />

                <div className="flex justify-between text-sm font-black text-indigo-950 pt-1">
                  <span>Total Amount</span>
                  <span className="text-base text-indigo-600">₹ {total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2 text-[11px] font-bold text-slate-500 border border-slate-150">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Verified Employer & Instant Moderation Routing</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate(isUsingActiveCredits ? '/recruiter/jobs/create' : '/recruiter/jobs/create/plan')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {isUsingActiveCredits ? 'Job Details' : 'Plans'}</span>
        </button>

        <button
          type="button"
          disabled={isPublishing}
          onClick={handlePublishJob}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 min-h-[44px] cursor-pointer disabled:opacity-50"
        >
          {isPublishing ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isUsingActiveCredits ? (
            <Zap className="h-4 w-4 text-amber-300" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span>
            {isPublishing 
              ? 'Publishing...' 
              : isUsingActiveCredits 
                ? 'Use 1 Credit & Publish Job' 
                : plan.is_free 
                  ? 'Activate & Publish Job' 
                  : 'Pay & Publish Job'}
          </span>
        </button>
      </div>

      {/* Centered Success Modal Dialog */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5 border border-slate-150 relative">
            <div className="h-16 w-16 bg-emerald-100 rounded-full text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Job Published Successfully!</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-xs mx-auto">
                Your job posting has been submitted and is active in your dashboard.
              </p>
              {remainingCredits !== null && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs font-bold text-emerald-900">
                  ⚡ 1 Credit Deducted • <span className="font-extrabold text-emerald-700">{remainingCredits} Job Credits</span> remaining on {planStatus.planName}
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs')}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Go to My Jobs Dashboard →
              </button>
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs/create')}
                className="w-full py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                + Post Another Job
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
