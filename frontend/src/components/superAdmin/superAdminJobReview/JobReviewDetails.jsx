export default function JobReviewDetails({ job, onBack }) {
  if (!job) return null;

  return (
    <div className="space-y-6">
      {/* Back to queue link */}
      <button 
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-black text-teal-655 hover:text-teal-700 focus:outline-none"
      >
        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Job review queue</span>
      </button>

      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Review job post</h2>
        <p className="text-sm font-bold text-slate-500 mt-1">Review and take action on this job submission.</p>
      </div>

      {/* Details columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left main Details Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Summary */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-150 font-black text-slate-500 uppercase text-lg shrink-0">
                  {job.company ? job.company.slice(0, 2) : 'JO'}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 leading-snug">{job.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-450">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>Submitted on: {job.submitted_at || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <span className="rounded-full border border-amber-250 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 uppercase">
                {job.status || 'Pending Review'}
              </span>
            </div>

            {/* Workflow steps */}
            <div className="border-t border-slate-100 pt-6 mt-6 flex items-center gap-4 text-xs font-bold text-slate-500 overflow-x-auto whitespace-nowrap">
              <span>Draft</span>
              <span>→</span>
              <span>Submitted</span>
              <span>→</span>
              <span className="text-teal-600 font-extrabold">Pending review</span>
              <span>→</span>
              <span>Approved</span>
              <span>→</span>
              <span>Published / Active</span>
            </div>
          </div>

          {/* Job details */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Job details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Job title</span>
                <span className="font-bold text-slate-800">{job.title}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Employment type</span>
                <span className="font-bold text-slate-800">{job.employment_type || 'Full-time'}</span>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-xs font-black text-slate-450 uppercase block">Job description</span>
                <p className="font-bold text-slate-850 whitespace-pre-line leading-relaxed">{job.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side checks */}
        <div className="space-y-6">
          {/* Moderation checks */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Moderation checks</h3>
            <p className="text-xs font-bold text-slate-500 leading-normal">
              Specific review checks will load after security validation protocols are set.
            </p>
          </div>

          {/* Candidate preview insights */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Candidate preview</h3>
            <p className="text-xs font-bold text-slate-500 leading-normal">
              Candidate matching insights will appear after recommendation rules are configured.
            </p>
          </div>
        </div>
      </div>
      {/* Sticky Bottom review actions rendered only inside job detail context */}
      {job.status === 'PENDING_REVIEW' && (
        <div className="sticky bottom-0 bg-white border-t border-slate-150 p-4.5 flex items-center justify-end gap-3.5 shadow-md rounded-b-2xl mt-8">
          <button 
            className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Request changes
          </button>
          <button 
            className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            Reject
          </button>
          <button 
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 transition-colors"
          >
            Approve & publish
          </button>
        </div>
      )}
    </div>
  );
}
