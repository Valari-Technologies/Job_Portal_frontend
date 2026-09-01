export default function EmployerVerificationReview({ request, onBack }) {
  if (!request) return null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-black text-teal-650 hover:text-teal-700 focus:outline-none"
      >
        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Verification queue</span>
      </button>

      {/* Page Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Review employer verification</h2>
        <p className="text-sm font-bold text-slate-500 mt-1">Review documents, verify details and decide on employer verification.</p>
      </div>

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (Employer Identity & Company Profile) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employer Summary Card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-150 font-black text-slate-500 uppercase text-lg shrink-0">
                {request.company_name ? request.company_name.slice(0, 2) : 'CO'}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800 leading-snug">{request.company_name}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-450">
                  <span>Registration ID: {request.registration_id || 'N/A'}</span>
                  <span>•</span>
                  <span>Applied on: {request.submitted_at || 'N/A'}</span>
                </div>
              </div>
            </div>
            <span className="rounded-full border border-amber-250 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 uppercase">
              {request.verification_status || 'Pending'}
            </span>
          </div>

          {/* Company Profile Details Card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Company profile</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Company name</span>
                <span className="font-bold text-slate-800">{request.company_name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Business category</span>
                <span className="font-bold text-slate-800">{request.business_category || 'N/A'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Contact verified</span>
                <span className="font-bold text-slate-800">{request.contact_number || 'N/A'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Registered address</span>
                <span className="font-bold text-slate-800">{request.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Checklist, Documents & History) */}
        <div className="space-y-6">
          {/* Verification Checklist */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Verification checklist</h3>
            <p className="text-xs font-bold text-slate-500 leading-normal">
              Checklist parameters will load dynamically from configuration specs.
            </p>
          </div>

          {/* Submitted Documents */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Submitted documents</h3>
            <p className="text-xs font-bold text-slate-500 leading-normal">
              Thumbnails and file links will activate after document store schemas are completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
