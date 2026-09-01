import { Building2, AlertCircle, CheckSquare } from 'lucide-react';

export default function ProfileInfoCards() {
  return (
    <>
      {/* Info modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Company Information Setup Card */}
        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 block font-sans">Company information</h3>
          
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3.5 font-sans">
            <div className="h-11 w-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400">
              <Building2 className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-800">No company information added yet</h4>
              <p className="text-xs font-bold text-slate-450 max-w-xs leading-normal">
                Complete your company profile to add company details and contact information.
              </p>
            </div>
          </div>
        </div>

        {/* Verification & Trust Inactive Card */}
        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 block font-sans">Verification & trust</h3>
          
          <div className="space-y-4 font-sans">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-slate-400 uppercase leading-none block">Status</span>
                <span className="text-sm font-extrabold text-slate-850 block mt-1">Profile not submitted</span>
                <p className="text-xs font-bold text-slate-455 leading-normal">
                  Complete your profile and submit it for Admin verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400 shrink-0">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-slate-400 uppercase leading-none block">Trust label</span>
                <span className="text-sm font-extrabold text-slate-850 block mt-1">Not available</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Job posting preferences Card */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-5">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 block font-sans">Job posting preferences</h3>
        
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 font-sans">
          <div className="h-11 w-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400">
            <Building2 className="h-5.5 w-5.5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-slate-800">No job posting preferences set</h4>
            <p className="text-xs font-bold text-slate-455 max-w-xs leading-normal">
              Set your default hiring locations and preferences after completing your company profile.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
