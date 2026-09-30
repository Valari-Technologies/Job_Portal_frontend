export default function ReviewRecruiterStep({ formState }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
      
      {/* Recruiter Information Panel */}
      <div className="bg-slate-50/50 rounded-lg border border-slate-200/60 p-[18px] space-y-4">
        <h4 className="text-[15px] font-semibold text-slate-805 border-b border-slate-100 pb-2">Recruiter Information</h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Full Name</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">{formState.fullName || 'Not provided'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Email Address</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2 break-all">{formState.email || 'Not provided'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Password</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">
              {formState.password ? '••••••••' : 'Not provided'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Phone Number</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">
              {formState.phone ? `${formState.phoneCountryCode} ${formState.phone}` : 'Not provided'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-[13px] font-medium text-slate-500">Profile Photo</span>
            <div className="col-span-2 flex items-center gap-2">
              {formState.profilePhoto ? (
                <>
                  <img 
                    src={typeof formState.profilePhoto === 'string' ? formState.profilePhoto : URL.createObjectURL(formState.profilePhoto)} 
                    alt="Preview Profile" 
                    className="h-8 w-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-[12px] font-semibold text-slate-705 truncate max-w-[120px]">
                    {formState.profilePhoto.name || 'Photo selected'}
                  </span>
                </>
              ) : (
                <span className="text-[13px] font-semibold text-slate-450 italic">Not provided</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Panel */}
      <div className="bg-slate-50/50 rounded-lg border border-slate-200/60 p-[18px] space-y-4">
        <h4 className="text-[15px] font-semibold text-slate-805 border-b border-slate-100 pb-2">Company Information</h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Company Name</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">{formState.companyName || 'Not provided'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Industry</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">{formState.industry || 'Not provided'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Company Type</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">{formState.companyType || 'Not provided'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Location</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">{formState.location || 'Not provided'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Company Email</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2 break-all">{formState.companyEmail || 'Not provided'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-[13px] font-medium text-slate-500">Company Phone</span>
            <span className="text-[13px] font-semibold text-slate-805 col-span-2">
              {formState.companyPhone ? `${formState.companyPhoneCountryCode} ${formState.companyPhone}` : 'Not provided'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
